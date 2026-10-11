import {companyWatchlist,type IndustryUpdate} from './industry-update';
import {companyTerms,cleanNewsTitle,type IndustryNewsItem} from './industry-news';
import {sameStory} from './news-groups';
import type {SearchItem} from './search-topics';
import {evaluateImportance,isVisibleImportance} from './importance';
import {compactKorean,plainKorean,headlineAmount} from './korean-briefing';
import {applyEventAssessment,assessReportedEvent} from './event-assessments';
import {reportedBriefing,canonicalArticleUrl} from './reported-briefings';
import {readableHeadline} from './short-explanation';

type Phase='plan'|'done'|'negative'|'unknown';
type Signal={normal:string;topic:string;action:string;label:string;phase:Phase;models:string[];partners:string[];scope:string;strong:boolean};
type Evidence={item:SearchItem;update?:IndustryUpdate;report?:IndustryNewsItem;signal:Signal};
export type TrendEvent={id:string;company:string;title:string;published:string;lastPublished:string;category:string;updates:IndustryUpdate[];reports:SearchItem[];sources:number;topic:string;action:string;label:string;signal:Signal};
export type EventAssessment={label:'호재'|'악재'|'미지수';reason:string;sourceUrls:string[];reviewed:boolean;basis?:'editorial'|'metadata'};
export type BriefingPoint={event:TrendEvent;text:string;basis:'analysis'|'report';assessment:EventAssessment;impact?:{text:string;label:string;sourceUrl:string}};
export type CompanyBriefing={lead:string;points:BriefingPoint[];months:{month:string;events:number;points:BriefingPoint[]}[]};
const names=[...new Set(Object.values(companyWatchlist).flatMap(cs=>cs.map(c=>c.name)))];
const esc=(v:string)=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const companyMatchers=names.map(name=>({name,terms:companyTerms(name).map(term=>new RegExp((/^[a-z]/i.test(term)?'(?<![a-z0-9])':'')+esc(term).replace(/\s+/g,'\\s*')+(/[a-z0-9]$/i.test(term)?'(?![a-z0-9])':''),'iu'))}));
const normal=(title:string)=>cleanNewsTitle(title).normalize('NFKC').toLowerCase().replace(/\[(?:단독|종합|뉴스|exclusive|news)\]/gi,'').replace(/samsung electronics|samsung|삼성전자/g,'삼성').replace(/sk\s*hynix|sk\s*하이닉스/g,'하이닉스').replace(/nvidia|엔비디아/g,'엔비디아').replace(/lisa su|리사\s*수/g,'리사수').replace(/[‘’“”'"….,!?()[\]–—:-]/g,' ').replace(/\s+/g,' ').trim();
const equal=(a:string[],b:string[])=>a.length===b.length&&a.every(x=>b.includes(x));

// Bilingual event signals: these describe metadata, never inferred facts from full articles.
export function eventSignal(item:Pick<SearchItem,'title'|'abstract'>,company:string):Signal{
 const t=cleanNewsTitle(item.title),n=normal(t);
 const models=[...new Set([...t.matchAll(/\b(?:hbm[3-9]e?|g?ddr[3-9]|lpddr[3-9]|exynos\s*\d+|(?:intel\s*)?\d{1,2}[a-z]?nm)\b|\d+(?:\.\d+)?\s*나노/gi)].map(m=>m[0].toLowerCase().replace(/\s/g,'').replace('나노','nm')))].sort();
 const partners=companyMatchers.filter(c=>c.name!==company&&c.terms.some(r=>r.test(t))).map(c=>c.name).sort();
 const phase:Phase=/실패|무산|불합격|부인|취소|fail|denies|cancel|reject/i.test(t)?'negative':/통과|성공|완료|출하|양산\s*(?:시작|돌입)|계약\s*체결|정식\s*출시|passes|passed|wins.*nod|begins|starts|launched|signed|ships|shipping|delivered|completed/i.test(t)?'done':/논의|검토|계획|예정|목표|추진|협상|예고|aim|plan|target|explor|seek|may\b|could\b|will\b|hopes|to (?:embed|build|meet|begin)/i.test(t)?'plan':'unknown';
 let topic='',action='',label='',strong=false;
 const blackbox=/블랙\s*박스|black\s*box/i.test(t)&&/HBM|메모리|memory/i.test(t);
 const amdTalk=(/\bAMD\b|리사\s*수|Lisa Su/i.test(t))&&/협력|동맹|파트너|회동|만난|만남|방한|협의|논의|partnership|partner|visits?|meet|team sport|discuss|ties|explore/i.test(t)&&!/계약\s*체결|signed|ships|출하|가속기\s*출시/i.test(t);
 const site=/용인|yongin/i.test(t)?'용인':/베트남|vietnam/i.test(t)?'베트남':/텍사스|테일러|texas|taylor/i.test(t)?'텍사스':null;
 if(blackbox){topic='hbm-blackbox';action='feature';label='HBM 블랙박스 도입';strong=true;}
 else if(amdTalk&&(company==='삼성전자'||company==='SK하이닉스'||company==='AMD')){topic='amd-discussion';action='discussion';label='AMD 회동·반도체 협력 논의';strong=true;}
 else if(site&&/반도체|칩|메모리|fab\b|semiconductor|chip|memory|foundry/i.test(t)&&/산단|공장|팹|생산기지|청사진|시설|라인|기지|구축|fab\b|factory|complex|facility|plant|build/i.test(t)){
  topic='site-'+site;strong=true;
  action=/청사진|과학축제|미래상|blueprint/i.test(t)?'blueprint':/착공|breaks? ground|groundbreaking/i.test(t)?'construction':/가동|operations|production/i.test(t)?'operation':'investment';
  label=site+' 반도체 시설 '+({blueprint:'청사진 공개',construction:'착공',operation:'가동',investment:'투자·구축'}[action]);
 }
 else if(/hybrid bonding|하이브리드\s*본딩|접합/i.test(t)&&/hbm|메모리|memory/i.test(t)){topic='hbm-bonding';action='sample';label='HBM 접합 기술·샘플';strong=true;}
 else{
  topic=models[0]||(/\bhbm\b/i.test(t)?'HBM':/dram|d램|디램/i.test(t)?'DRAM':/메모리|memory/i.test(t)?'메모리':/파운드리|foundry/i.test(t)?'파운드리':'');
  if(!topic)topic=item.title.match(/NAND|CoWoS|GAA|EUV|6G|로봇|배터리|클라우드|위성|반도체|semiconductor|chips?/i)?.[0]?.replace(/semiconductor|chips?/i,'반도체')||'';
  if(/소송|제소|lawsuit|sued/i.test(t)){action='lawsuit';label=topic+' 소송';}
  else if(/가격|공급가|판가|가격 인상|pricing|prices?|per gb/i.test(t)){action='price';label=topic+' 가격 전망·협상';}
  else if(/품질\s*테스트|인증|승인|qualification|quality test|approval|wins.*nod|문턱/i.test(t)){action='qualification';label=topic+' 고객사 품질 테스트';}
  else if(/샘플|sample/i.test(t)){action='sample';label=topic+' 샘플·평가';}
  else if(/양산|mass production|ramping.*production/i.test(t)){action='production';label=topic+' 양산';}
  else if(/장기계약|long.term|LTA\b/i.test(t)){action='long-contract';label=topic+' 장기 공급계약';}
  else if(/공급|출하|shipment|supply|shipping/i.test(t)){action='supply';label=topic+' 공급·출하';}
  else if(/협력|협약|파트너|동맹|partnership|collaborat/i.test(t)){action='partnership';label=topic+' 협력';}
  else if(/투자|증설|인수|매각|invest|capex|expan|acqui/i.test(t)){action='investment';label=topic+' 투자·사업';}
  else if(/출시|공개|launch|unveil/i.test(t)){action='launch';label=topic+' 공개·출시';}
  else if(/개발|develop/i.test(t)){action='development';label=topic+' 개발';}
 }
 let scope='';
 if(action==='price')scope=/3\s*배|threefold|triple/i.test(t)?'3x':/2\s*배|double|100%/i.test(t)?'2x':'';
 if(action==='price')scope+='|'+(/인상|상승|급등|increase|surge|double|triple|rise|threefold/i.test(t)?'up':/하락|인하|급락|fall|drop|declin|lower/i.test(t)?'down':'');
 const years=[...new Set(t.match(/202[7-9]|203\d/g)||[])].sort().join(',');
 if(years)scope+='|'+years;
 const layers=[...t.matchAll(/(\d+)[\s-]*(?:단|층|layers?)/gi)].map(m=>m[1]).sort().join(',');if(layers)scope+='|layers:'+layers;
 return {normal:n,topic,action,label:label.trim().replace(/\b(?:hbm[3-9]e?|g?ddr[3-9]|lpddr[3-9])\b/gi,v=>v.toUpperCase()),phase,models,partners,scope,strong};
}

function matches(a:Evidence,b:Evidence){
 const x=a.signal,y=b.signal;
 const urls=(e:Evidence)=>e.update?e.update.sources.filter(s=>s.published===e.update!.published).map(s=>canonicalArticleUrl(s.url)):[canonicalArticleUrl(e.item.url)];
 // A source or a reviewed event identifies the story before wording-dependent phase detection.
 if(urls(a).some(u=>u&&urls(b).includes(u)))return true;
 const ar=reportedBriefing(a.item),br=reportedBriefing(b.item);
 if(ar&&br)return ar.key===br.key;
 if(x.normal===y.normal)return true;
 if(x.phase!==y.phase&&x.phase!=='unknown'&&y.phase!=='unknown'&&(x.action!=='discussion'||x.phase==='negative'||y.phase==='negative'))return false;
 if(x.action!=='discussion'&&x.models.length&&y.models.length&&!equal(x.models,y.models))return false;
 if(x.scope&&y.scope&&x.scope!==y.scope)return false;
 // A shared original can identify a paraphrase, but cannot override conflicting products or stages.
 const days=Math.abs(Date.parse(a.item.published)-Date.parse(b.item.published))/86400000;
 if(days>7)return false;
 if(x.topic&&x.topic===y.topic&&x.action&&x.action===y.action){
  if(x.strong&&y.strong)return true;
  if(!equal(x.partners,y.partners))return false;
  // A product + a specific milestone has enough anchors. Broad product/category alone does not.
  if(x.models.length&&y.models.length&&['qualification','sample','production','long-contract','price'].includes(x.action))return true;
  if(['long-contract','lawsuit','price'].includes(x.action)&&x.scope&&x.scope===y.scope)return true;
 }
 if(x.action&&y.action&&x.action!==y.action)return false;
 if((x.strong||y.strong)&&x.topic!==y.topic)return false;
 if(x.partners.length&&y.partners.length&&!equal(x.partners,y.partners))return false;
 return sameStory(a.item,b.item);
}

export function buildCompanyEvents(company:string,updates:IndustryUpdate[],reports:IndustryNewsItem[]):TrendEvent[]{
 const evidence:Evidence[]=[...updates.filter(isVisibleImportance).filter(u=>u.company===company).map(update=>{
  const item:SearchItem={id:update.id,title:update.title,url:update.sources[0]?.url||'',published:update.published,abstract:'',source:update.sources[0]?.kind||'원문',provider:'analysis',kind:'분석',dateLabel:'공개일',authors:''};
  return {item,update,signal:eventSignal(item,company)};
 }),...reports.filter(r=>r.company===company&&isVisibleImportance(r.item)).map(report=>({item:report.item,report,signal:eventSignal(report.item,company)}))].sort((a,b)=>a.item.published.localeCompare(b.item.published)||a.item.id.localeCompare(b.item.id));
 const groups:Evidence[][]=[];
 const seen=new Set<string>();
 for(const e of evidence){const key=e.update?'analysis:'+e.item.id:'report:'+canonicalArticleUrl(e.item.url);if(seen.has(key))continue;seen.add(key);
  // Complete-link avoids joining unrelated events through an ambiguous intermediate headline.
  const group=groups.find(g=>g.every(other=>matches(e,other)));if(group)group.push(e);else groups.push([e]);
 }
 return groups.map(group=>{
  const analysed=group.filter(e=>e.update).map(e=>e.update!),media=group.filter(e=>e.report).map(e=>e.item);
  const representative=group.find(e=>e.update)||group.find(e=>/[가-힣]/.test(e.item.title))||group[0];
  const latest=group.at(-1)!,signal=representative.signal;
  const sources=new Set([...analysed.flatMap(u=>u.sources.map(s=>new URL(s.url).hostname.replace(/^www\./,''))),...media.map(i=>i.source)]).size;
  return {id:group[0].item.id,company,title:representative.item.title,published:group[0].item.published,lastPublished:latest.item.published,category:analysed.length?(analysed[0].type==='technology'?'기술 변화':'기업 방향'):group.find(e=>e.report)?.report?.category||'기술 변화',updates:analysed,reports:media,sources,topic:signal.topic,action:signal.action,label:signal.label,signal};
 }).sort((a,b)=>b.published.localeCompare(a.published)||b.lastPublished.localeCompare(a.lastPublished)||a.id.localeCompare(b.id));
}

export function sortCompanyTrends<T extends {name:string;entries:TrendEvent[]}>(groups:T[],watched:ReadonlySet<string>){
 return [...groups].sort((a,b)=>(b.entries[0]?.published||'').localeCompare(a.entries[0]?.published||'')||Number(watched.has(b.name))-Number(watched.has(a.name))||a.name.localeCompare(b.name,'ko'));
}

function excerpt(text:string,max=160){const t=text.replace(/\s+/g,' ').trim();if(t.length<=max)return t;const sentence=t.match(/^.{30,160}?[.!?。](?:\s|$)/)?.[0];return sentence?.trim()||t.slice(0,max-1)+'…';}
export function eventImportance(event:TrendEvent){const ratings=[...event.updates,...event.reports].flatMap(item=>{const rating=evaluateImportance(item);return rating?[rating]:[];});return ratings.sort((a,b)=>b.stars-a.stars)[0];}
export function eventOriginalUrl(event:TrendEvent){return event.updates[0]?.sources[0]?.url||event.reports.map(reportedBriefing).find(Boolean)?.sources[0]?.url||event.reports[0]?.url;}
export function eventAssessment(event:TrendEvent):EventAssessment{
 const assessed=event.updates.map(applyEventAssessment).flatMap(u=>u.assessment&&u.assessment.sourceUrls.length&&u.assessment.sourceUrls.every(url=>u.sources.some(s=>s.url===url))?[u.assessment]:[]);
 if(assessed.length){
  const labels=new Set(assessed.map(a=>a.label as string==='아직 불확실'?'미지수':a.label)),sourceUrls=[...new Set(assessed.flatMap(a=>a.sourceUrls))];
  if(labels.size>1)return {label:'미지수',reason:'같은 사건에 서로 다른 평가가 있어 실제 사업 효과가 어느 쪽으로 나타날지 아직 불확실합니다.',sourceUrls,reviewed:true};
  return {label:assessed[0].label as string==='아직 불확실'?'미지수':assessed[0].label,reason:plainKorean(assessed[0].reason),sourceUrls,reviewed:true,basis:'editorial'};
 }
 return assessReportedEvent(event.company,event.reports.length?event.reports:event.updates.map(u=>({id:u.id,title:u.title,abstract:u.after,url:u.sources[0]?.url||'',published:u.published,source:u.sources[0]?.kind||'',provider:'analysis',kind:'분석',dateLabel:'공개일',authors:''})));
}
export function eventPoint(event:TrendEvent):BriefingPoint{
 const assessment=eventAssessment(event);
 if(event.updates.length){
  const update=event.updates.find(u=>u.briefing)||event.updates[0];
  const impactUpdate=event.updates.find(u=>u.briefing?.impact&&u.sources.some(s=>s.url===u.briefing!.impact!.sourceUrl));
  const impact=impactUpdate?.briefing?.impact,source=impactUpdate?.sources.find(s=>s.url===impact?.sourceUrl);
  return {event,basis:'analysis',assessment,text:excerpt(compactKorean(readableHeadline(update))),...(impact&&source?{impact:{text:plainKorean(impact.text),label:(source.kind==='기업 공식 발표'?'기업':source.kind==='언론 보도'?'기사':'원문')+' '+(impact.status==='결과'?'설명':impact.status),sourceUrl:source.url}}:{})};
 }
 const reviewed=event.reports.map(reportedBriefing).find(Boolean);
 // Preserve the actor, actual product and timing. Topic + verb labels lose those relationships.
 return {event,basis:'report',assessment,text:excerpt(reviewed?.headline||cleanNewsTitle(event.title))};
}
function highlights(events:TrendEvent[],limit:number){
 // Publisher breadth is a coverage signal, never a count of independent confirmations.
 const ordered=[...events].sort((a,b)=>b.published.localeCompare(a.published)||b.lastPublished.localeCompare(a.lastPublished)||Number(!!b.updates.length)-Number(!!a.updates.length));
 const chosen:TrendEvent[]=[];
 const eligible=ordered.filter(e=>!!eventPoint(e).text);
 for(const e of eligible){if(chosen.some(x=>x.topic&&x.topic===e.topic&&x.action===e.action))continue;chosen.push(e);if(chosen.length===limit)break;}
 return chosen.map(eventPoint);
}
export function periodNarrative(points:BriefingPoint[]){
 const chronological=[...points].sort((a,b)=>b.event.published.localeCompare(a.event.published));
 return chronological.map((point,index)=>{
  const update=point.event.updates.find(u=>u.briefing?.narrative)||point.event.updates[0];
  const date=Number(point.event.published.slice(5,7))+'월 '+Number(point.event.published.slice(8))+'일';
  const context=date+'에는';
  if(update){const body=plainKorean(update.briefing?.narrative||update.after);return {id:point.event.id,text:context+' '+body,point};}
  const snippet=point.event.reports.find(r=>/[가-힣]/.test(r.abstract))?.abstract;
  return {id:point.event.id,text:snippet?excerpt(plainKorean(snippet),220):'',point};
 });
}
export function summarizeCompany(events:TrendEvent[],from:string,until:string):CompanyBriefing{
 const scoped=events.filter(e=>e.published>=from&&e.published<=until);
 const points=highlights(scoped,3);
 const lead=points.length?'주요 발표와 기술 변화로 읽는 이번 기간의 흐름':scoped.length?'한국어 요약을 아직 정리하지 못했습니다. 사건별 목록의 근거에서 원문을 확인할 수 있습니다.':'이 기간에 수집·정리된 내용이 없습니다.';
 const months:string[]=[];let month=from.slice(0,7);while(month<=until.slice(0,7)){months.push(month);const d=new Date(month+'-01T00:00:00Z');d.setUTCMonth(d.getUTCMonth()+1);month=d.toISOString().slice(0,7);}
 return {lead,points,months:months.reverse().map(month=>{const rows=scoped.filter(e=>e.published.startsWith(month));return {month,events:rows.length,points:highlights(rows,2)};})};
}
