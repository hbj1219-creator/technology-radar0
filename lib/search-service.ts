import {compareCitations} from './paper-metrics';
import {externalSearch,dedupe} from './external-search';
import type {SearchResult} from './search-topics';
import {koreaDay} from './search-period';
import {readNewsCorpus} from './snapshot-store';
const recent=new Map<string,{expires:number;value:SearchResult}>(),pending=new Map<string,Promise<SearchResult>>();
const sources=['corpus','crossref','arxiv','europepmc','news','company'];
type Continuation=Record<string,{page:number;cursor:string}>;
function continuation(cursor:string,selected:string[]):Continuation{
 if(cursor==='*')return Object.fromEntries(selected.map(p=>[p,{page:0,cursor:'*'}]));
 const value=JSON.parse(cursor) as Continuation;
 if(!value||typeof value!=='object'||Object.entries(value).some(([p,v])=>!selected.includes(p)||!v||!Number.isInteger(v.page)||v.page<0||v.page>(p==='corpus'?1000:100)||typeof v.cursor!=='string'||v.cursor.length>2000))throw Error('검색 조건을 확인해 주세요.');
 return value;
}
async function combined(provider:string,q:string,page:number,period:string,sort:string,cursor:string,minCitations:number){
 const active=continuation(cursor,provider==='papers'?['crossref','arxiv','europepmc']:sources),nextState:Continuation={};
 const fetched=await Promise.allSettled(Object.entries(active).map(async([provider,state])=>({provider,result:await getSearch(provider,q,state.page,period,sort,state.cursor,minCitations)})));
 const successes=fetched.filter((r):r is PromiseFulfilledResult<{provider:string;result:SearchResult}>=>r.status==='fulfilled');
 if(!successes.length)throw Error('외부 출처에 연결하지 못했습니다. 잠시 후 다시 검색해 주세요.');
 const status=fetched.map((r,i)=>r.status==='fulfilled'?{provider:r.value.provider,count:r.value.result.items.length,available:r.value.result.available,status:'ok',note:r.value.result.note}:{provider:Object.keys(active)[i],count:0,status:'failed',note:'이번 검색에서 출처 연결에 실패했습니다.'});
 for(const {value:{provider,result}} of successes)if(result.next!==null)nextState[provider]={page:result.next,cursor:result.nextCursor||'*'};
 let items=dedupe(successes.flatMap(r=>r.value.result.items));
 if(sort==='citations')items.sort(compareCitations);else if(sort==='date')items.sort((a,b)=>b.published.localeCompare(a.published));else{
  // Round-robin keeps news and company releases visible beside papers.
  const rows=successes.map(r=>r.value.result.items),interleaved=[];for(let i=0;i<Math.max(...rows.map(x=>x.length));i++)for(const row of rows)if(row[i])interleaved.push(row[i]);items=dedupe(interleaved);
 }
 return {items,next:Object.keys(nextState).length?page+1:null,nextCursor:Object.keys(nextState).length?JSON.stringify(nextState):undefined,query:q,provider,sourceStatus:status,fetchedAt:new Date().toISOString(),note:(provider==='papers'?'논문·학술 자료만 조회합니다. 인용 수는 각 출처의 집계이며 총인용 수나 연구 품질의 확정 평가가 아닙니다. 인용 순위는 불러온 결과 기준입니다. ':'')+'2026년 7월 1일 이후 공개일이 확인된 자료만 표시합니다. DOI·원문 링크 중복을 제거합니다. 출처별 검색 범위는 다릅니다.'} satisfies SearchResult;
}
export async function getSearch(provider:string,q:string,page:number,period:string,sort:string,cursor='*',minCitations=0):Promise<SearchResult>{
 if(provider==='corpus')return readNewsCorpus(q,page,period,cursor);
 const key=JSON.stringify([koreaDay(),provider,q,page,period,sort,cursor,minCitations]);
 for(const [k,v] of recent)if(v.expires<Date.now())recent.delete(k);
 const hit=recent.get(key);if(hit)return {...hit.value,cached:true};
 let task=pending.get(key);
 if(!task){if(pending.size>=16)throw Error('외부 출처 요청이 많습니다. 잠시 후 다시 검색해 주세요.');task=['all','papers'].includes(provider)?combined(provider,q,page,period,sort,cursor,minCitations):externalSearch(provider,q,page,period,sort,cursor,minCitations);pending.set(key,task);}
 try{const result=await task;if(!recent.has(key)){if(recent.size>=24)recent.delete(recent.keys().next().value!);recent.set(key,{expires:Date.now()+(['all','papers'].includes(provider)?30000:600000),value:result});}return result;}finally{pending.delete(key);}
}
