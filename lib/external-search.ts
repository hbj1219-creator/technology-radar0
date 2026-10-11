import {compareCitations,meetsCitationMinimum} from './paper-metrics';
import {withClassification} from './technology-classifier';
import {searchAliases,type SearchItem,type SearchResult} from './search-topics';
import {rangeFor,inSearchRange} from './search-period';
const size=40;
export function plain(value:unknown):string{return String(value??'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,' ').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return code>0&&code<=0x10ffff?String.fromCodePoint(code):'';}).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/\s+/g,' ').trim();}
const xml=(s:string,key:string)=>{const m=s.match(new RegExp(`<${key}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${key}>`));return m?plain(m[1]):'';};
async function remote(url:URL){const r=await fetch(url,{headers:{'User-Agent':'TechnologyRadar/1.0'},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(`외부 출처 응답 실패 (${r.status})`);return r;}
function day(parts:number[]|undefined){return parts?.length?parts.slice(0,3).map((n,i)=>i?String(n).padStart(2,'0'):String(n)).join('-'):'';}
export function dedupe(items:SearchItem[]){
 const unique=new Map<string,SearchItem>();
 for(const item of items){const key=item.doi?.toLowerCase()||item.url.replace(/\/$/,''),old=unique.get(key);if(!old)unique.set(key,item);else if(old.citations?.count==null&&item.citations?.count!=null)unique.set(key,{...old,citations:item.citations});}
 return [...unique.values()];
}
function allowed(items:SearchItem[],period:string){return dedupe(items.filter(i=>i.title&&i.url.startsWith('https://')&&inSearchRange(i.published,period)));}
export function rssItems(text:string,source:string,provider:string,kind:string):SearchItem[]{
 if(!/<rss[\s>]/.test(text))throw Error('출처에서 RSS를 제공하지 않았습니다.');
 return [...text.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/g)].map(([_,s])=>{const date=new Date(xml(s,'pubDate'));return {id:xml(s,'guid')||xml(s,'link'),title:xml(s,'title'),url:xml(s,'link').replace(/^http:/,'https:'),source:source||xml(s,'source')||xml(s,'News:Source')||'뉴스 매체',provider,kind,published:isNaN(date.getTime())?'':new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(date),dateLabel:kind==='보도'?'보도일':'발표일',abstract:provider==='Google News RSS'?'':xml(s,'description').slice(0,3500),authors:''};});
}
const newsCache=new Map<string,{expires:number;items:SearchItem[]}>(),newsPending=new Map<string,Promise<SearchItem[]>>();
async function cachedNews(url:URL,provider:string){
 const key=url.toString(),hit=newsCache.get(key);if(hit&&hit.expires>Date.now())return hit.items;
 let task=newsPending.get(key);if(!task){task=remote(url).then(r=>r.text()).then(text=>rssItems(text,'',provider,'보도'));newsPending.set(key,task);}
 try{const items=await task;if(newsCache.size>=100)newsCache.delete(newsCache.keys().next().value!);newsCache.set(key,{expires:Date.now()+600000,items});return items;}finally{newsPending.delete(key);}
}
// Collection uses explicit bounded windows, splitting saturated monthly feeds.
export async function fetchNewsWindow(query:string,from:string,until:string){
 const korean=/[가-힣]/.test(query);
 const google=(start:string,end:string)=>{const url=new URL('https://news.google.com/rss/search');url.search=new URLSearchParams({q:`${query} after:${new Date(Date.parse(start+'T00:00:00Z')-86400000).toISOString().slice(0,10)} before:${end}`,hl:korean?'ko':'en-US',gl:korean?'KR':'US',ceid:korean?'KR:ko':'US:en'}).toString();return cachedNews(url,'Google News RSS');};
 const bing=new URL('https://www.bing.com/news/search');bing.search=new URLSearchParams({q:query,format:'rss',count:'100'}).toString();
 const results=await Promise.allSettled([google(from,until),cachedNews(bing,'Bing News RSS')]);
 const items=results.flatMap(r=>r.status==='fulfilled'?r.value:[]);
 let failed=results.filter(r=>r.status==='rejected').length,requests=2;
 if(results[0].status==='fulfilled'&&results[0].value.length>=95&&Date.parse(until)-Date.parse(from)>86400000){
  const windows:{from:string;until:string}[]=[];let start=from;
  const days=Date.parse(until)-Date.parse(from)>7*86400000?7:1;
  while(start<until){const end=new Date(Date.parse(start+'T00:00:00Z')+days*86400000).toISOString().slice(0,10);windows.push({from:start,until:end<until?end:until});start=end;}
  const extra=await Promise.allSettled(windows.map(w=>google(w.from,w.until)));
  items.push(...extra.flatMap(r=>r.status==='fulfilled'?r.value:[]));failed+=extra.filter(r=>r.status==='rejected').length;requests+=extra.length;
  if(days===7){
   const daily=windows.filter((_,i)=>extra[i].status==='fulfilled'&&(extra[i] as PromiseFulfilledResult<SearchItem[]>).value.length>=95).flatMap(w=>{const out:{from:string;until:string}[]=[];for(let day=w.from;day<w.until;day=new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString().slice(0,10))out.push({from:day,until:new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString().slice(0,10)});return out;});
   // Bounded groups avoid flooding a single source when many days saturate.
   for(let start=0;start<daily.length;start+=7){const result=await Promise.allSettled(daily.slice(start,start+7).map(w=>google(w.from,w.until)));items.push(...result.flatMap(r=>r.status==='fulfilled'?r.value:[]));failed+=result.filter(r=>r.status==='rejected').length;requests+=result.length;}
  }
 }
 if(failed===requests)throw Error('뉴스 출처 연결 실패');
 return {items:dedupe(items.filter(i=>i.title&&i.url.startsWith('https://')&&i.published>=from&&i.published<until)),failed,requests,primaryFailed:results[0].status==='rejected'};
}
export async function newsArchive(rawQ:string,period:string){
 const {from,today}=rangeFor(period),{news}=searchAliases(rawQ),until=new Date(Date.parse(today+'T00:00:00Z')+86400000).toISOString().slice(0,10),requests:{url:URL;provider:string;from?:string;until?:string}[]=[];
 // Query calendar-month windows on demand, including archived news, rather than a latest-headlines feed.
 const windows:{from:string;until:string}[]=[];let month=from.slice(0,7)+'-01';
 while(month<=today){const d=new Date(month+'T00:00:00Z');d.setUTCMonth(d.getUTCMonth()+1);const end=d.toISOString().slice(0,10);windows.push({from:month<from?from:month,until:end<until?end:until});month=end;}
 for(const alias of news){for(const w of [...windows].reverse()){
  const url=new URL('https://news.google.com/rss/search');url.search=new URLSearchParams({q:`${alias} after:${new Date(Date.parse(w.from+'T00:00:00Z')-86400000).toISOString().slice(0,10)} before:${w.until}`,hl:/[가-힣]/.test(alias)?'ko':'en-US',gl:/[가-힣]/.test(alias)?'KR':'US',ceid:/[가-힣]/.test(alias)?'KR:ko':'US:en'}).toString();requests.push({url,provider:'Google News RSS',from:w.from,until:w.until});
 }const url=new URL('https://www.bing.com/news/search');url.search=new URLSearchParams({q:alias,format:'rss',count:'100'}).toString();requests.push({url,provider:'Bing News RSS'});}
 const results=await Promise.allSettled(requests.map(async r=>(await cachedNews(r.url,r.provider)).filter(i=>!r.from||i.published>=r.from&&i.published<r.until!)));
 if(results.every(r=>r.status==='rejected'))throw Error('뉴스 검색 출처에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
 const failed=results.filter(r=>r.status==='rejected').length;
 const distinct=[...new Map(results.flatMap(r=>r.status==='fulfilled'?r.value:[]).map(i=>[(i.title.toLowerCase().replace(/\s+/g,' ').trim()+'|'+i.source+'|'+i.published),i])).values()];
 return {items:allowed(distinct,period).sort((a,b)=>b.published.localeCompare(a.published)),failed,requests:requests.length};
}
export async function externalSearch(provider:string,rawQ:string,page:number,period:string,sort:string,cursor='*',minCitations=0):Promise<SearchResult>{
 const {from,today}=rangeFor(period),{q}=searchAliases(rawQ),offset=page*size;
 let items:SearchItem[]=[],next:number|null=null,nextCursor:string|undefined,note='',available:number|undefined;
 if(provider==='arxiv'&&minCitations>0)return {items:[],next:null,query:rawQ,provider,fetchedAt:new Date().toISOString(),note:'arXiv 검색은 인용 수를 제공하지 않아 최소 인용 수 필터를 적용한 결과에서 제외합니다.'};
 if(provider==='crossref'){
  const url=new URL('https://api.crossref.org/works');url.search=new URLSearchParams({'query.bibliographic':q,rows:String(size),offset:String(offset),sort:sort==='citations'?'is-referenced-by-count':sort==='date'?'published':'score',order:'desc',filter:`until-pub-date:${today},from-pub-date:${from}`,select:'DOI,title,publisher,container-title,published,abstract,author,type,is-referenced-by-count'}).toString();
  const d=await (await remote(url)).json() as {message:{items:Array<{DOI:string;title?:string[];publisher?:string;'container-title'?:string[];published?:{'date-parts':number[][]};abstract?:string;author?:{given?:string;family?:string}[];type?:string;'is-referenced-by-count'?:number}>;'total-results':number}};
  items=d.message.items.map(i=>({id:'doi:'+i.DOI,doi:i.DOI,title:plain(i.title?.[0]),url:'https://doi.org/'+encodeURIComponent(i.DOI),source:plain(i['container-title']?.[0]||i.publisher||'Crossref'),provider:'Crossref',kind:i.type==='posted-content'?'프리프린트':i.type==='journal-article'?'학술 논문':'학술 자료',published:day(i.published?.['date-parts']?.[0]),dateLabel:'출처 공개일',abstract:plain(i.abstract).slice(0,6000),citations:{count:Number.isSafeInteger(i['is-referenced-by-count'])&&i['is-referenced-by-count']!>=0?i['is-referenced-by-count']!:null,source:'Crossref',checkedAt:new Date().toISOString()},authors:(i.author||[]).slice(0,5).map(a=>plain(`${a.given||''} ${a.family||''}`)).join(', ')}));
  next=d.message.items.length===size&&offset+size<Math.min(d.message['total-results'],10000)?page+1:null;
  available=d.message['total-results'];note='출판사 등록 메타데이터입니다. 검색어 일부만 일치하는 자료도 포함될 수 있습니다. 정확한 공개일이 없는 자료는 기간을 확인할 수 없어 제외합니다.';
 }else if(provider==='arxiv'){
  const clean=q.replace(/["\\():]/g,' '),words=clean.trim().split(/\s+/).filter(Boolean);
  const query=words.length>1?words.map(w=>`all:"${w}"`).join(' AND '):`all:"${clean}"`;
  const url=new URL('https://export.arxiv.org/api/query');url.search=new URLSearchParams({search_query:`(${query}) AND submittedDate:[${from.replaceAll('-','')}0000 TO ${today.replaceAll('-','')}2359]`,start:String(offset),max_results:String(size),sortBy:sort==='date'?'submittedDate':'relevance',sortOrder:'descending'}).toString();
  const text=await (await remote(url)).text(),entries=[...text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  if(entries.some(x=>xml(x[1],'id').includes('/api/errors')))throw Error('arXiv 검색 조건을 확인해 주세요.');
  items=entries.map(([_,s])=>{const url=xml(s,'id').replace(/^http:/,'https:');return {id:url,title:xml(s,'title'),url,source:'arXiv',provider:'arXiv',kind:'프리프린트',published:xml(s,'published').slice(0,10),dateLabel:'최초 제출일',abstract:xml(s,'summary').slice(0,6000),authors:[...s.matchAll(/<author>([\s\S]*?)<\/author>/g)].slice(0,5).map(x=>xml(x[1],'name')).join(', ')};});
  next=entries.length===size&&offset+size<Number(xml(text,'opensearch:totalResults'))?page+1:null;note='프리프린트입니다. 날짜는 최초 제출일이며 동료 심사 여부는 별도로 확인해야 합니다.';
 }else if(provider==='europepmc'){
  const url=new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search');url.search=new URLSearchParams({query:`(${q.replace(/[():\[\]"]/g,' ').trim().split(/\s+/).filter(Boolean).join(' AND ')}) AND FIRST_PDATE:[${from} TO ${today}]${sort==='citations'?' sort_cited:y':sort==='date'?' sort_date:y':''}`,format:'json',resultType:'core',pageSize:String(size),cursorMark:cursor}).toString();
  const d=await (await remote(url)).json() as {hitCount:number;nextCursorMark?:string;resultList:{result:Array<{id:string;source:string;doi?:string;title:string;journalTitle?:string;journalInfo?:{journal?:{title?:string}};firstPublicationDate?:string;abstractText?:string;authorString?:string;citedByCount?:number|string}>}};
  items=d.resultList.result.map(i=>({id:'epmc:'+i.source+':'+i.id,doi:i.doi,title:plain(i.title),url:i.doi?'https://doi.org/'+encodeURIComponent(i.doi):'https://europepmc.org/article/'+encodeURIComponent(i.source)+'/'+encodeURIComponent(i.id),source:plain(i.journalInfo?.journal?.title||i.journalTitle||'Europe PMC'),provider:'Europe PMC',kind:i.source==='PPR'?'프리프린트':'학술 자료',published:i.firstPublicationDate||'',dateLabel:'출처 공개일',abstract:plain(i.abstractText).slice(0,6000),authors:plain(i.authorString),citations:{count:i.citedByCount!==undefined&&i.citedByCount!==null&&String(i.citedByCount).trim()!==''&&Number.isSafeInteger(Number(i.citedByCount))&&Number(i.citedByCount)>=0?Number(i.citedByCount):null,source:'Europe PMC',checkedAt:new Date().toISOString()}}));
  available=d.hitCount;next=d.resultList.result.length===size&&d.nextCursorMark&&d.nextCursorMark!==cursor&&offset+size<d.hitCount?page+1:null;nextCursor=next!==null?d.nextCursorMark:undefined;note='생명과학·의료 자료입니다. 연구 결과는 임상 승인이나 상용 적용을 의미하지 않습니다.';
 }else if(provider==='company'){
  const samsung=new URL('https://news.samsung.com/global/feed/');samsung.searchParams.set('s',q);
  const feeds=[['Samsung 공식 뉴스룸',samsung.toString()],['NVIDIA 공식 뉴스룸','https://nvidianews.nvidia.com/releases.xml'],['Google 공식 블로그','https://blog.google/rss/'],['BMW 공식 뉴스룸','https://www.press.bmwgroup.com/global/rss'],['NASA 공식 발표','https://www.nasa.gov/feed/'],['Google DeepMind 공식 블로그','https://deepmind.google/blog/rss.xml']];
  const results=await Promise.allSettled(feeds.map(async([source,feed])=>rssItems(await (await remote(new URL(feed))).text(),source,'공식 RSS',source.startsWith('NASA')?'기관 발표':'기업 발표')));
  const words=q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>1&&!['the','and','for','with','of','to','in'].includes(w));
  const matches=(i:SearchItem)=>{const text=(i.title+' '+i.abstract+' '+i.source).toLowerCase();return words.filter(w=>w.length<=3?new RegExp('\\b'+w+'\\b','u').test(text):text.includes(w)).length>=Math.max(1,Math.ceil(words.length/2));};
  const all=allowed(results.flatMap(r=>r.status==='fulfilled'?r.value:[]),period).filter(matches).sort((a,b)=>b.published.localeCompare(a.published));
  if(results.every(r=>r.status==='rejected'))throw Error('공식 출처에 연결하지 못했습니다.');items=all.slice(offset,offset+size);next=offset+size<all.length?page+1:null;
  const failed=feeds.filter((_,i)=>results[i].status==='rejected').map(x=>x[0]);note='공식 RSS 6곳을 검색합니다. Samsung은 검색어로 발표 이력도 조회하며, 나머지는 현재 피드 범위입니다. 실제 적용·성능 검증과 발표 내용을 구분하세요.'+(failed.length?' 연결 실패: '+failed.join(', '):'');
 }else if(provider==='news'){
  const result=await newsArchive(rawQ,period),all=result.items;
  available=all.length;items=all.slice(offset,offset+size);next=offset+size<all.length?page+1:null;
  note='선택한 기간을 월별로 나눠 국문·영문 뉴스 검색 색인을 조회합니다. 최신 기사 목록만 사용하지 않습니다. 검색 색인의 제공 범위에 한정되며 소개문은 기사 본문 전체가 아닙니다.'+(result.failed?` ${result.requests}개 검색 요청 중 ${result.failed}개 연결 실패로 일부 자료가 누락될 수 있습니다.`:'');
 }else throw Error('지원하지 않는 출처입니다.');
 const visible=allowed(items,period).filter(i=>meetsCitationMinimum(i,minCitations));
 if(sort==='citations')visible.sort(compareCitations);
 if(minCitations>0)note+=` 최소 인용 ${minCitations}회 조건을 조회한 결과에 적용했습니다. 인용 수 미제공 자료는 제외합니다. 다음 페이지에 조건을 만족하는 자료가 더 있을 수 있습니다.`;
 return {items:visible.map(withClassification),available,next,nextCursor,query:rawQ,provider,fetchedAt:new Date().toISOString(),note};
}
