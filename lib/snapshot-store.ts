import snapshot from '@/data/site-snapshot.json';
import news from '@/data/news-snapshot.json';
import {applyEditorialCorrection} from './editorial-updates';
import {applyEventAssessment} from './event-assessments';
import {evaluateImportance,isVisibleImportance,type ImportanceInput} from './importance';
import {selectIndustryNews} from './industry-news';
import {industries,type RecordItem} from './radar-data';
import type {IndustryUpdate} from './industry-update';
import {rangeFor} from './search-period';
import {searchAliases,type SearchItem,type SearchResult} from './search-topics';
import {classifyTechnology} from './technology-classifier';

export const snapshotDate=snapshot.snapshotDate;
function assess<T extends ImportanceInput & {id:string}>(item:T):T {
 const corrected=applyEventAssessment(applyEditorialCorrection(item));
 return {...corrected,importance:evaluateImportance(corrected)};
}
export const records=(snapshot.records as unknown as RecordItem[]).map(assess);
export const updates=(snapshot.industryUpdates as unknown as IndustryUpdate[]).map(assess);
export const articles=(news as SearchItem[]).map(item=>({...item,importance:evaluateImportance(item)})).filter(isVisibleImportance);
export function reportsFor(industry:string,company='all',period='since') {
 const {from,today}=rangeFor(period);
 return articles.filter(item=>item.published>=from&&item.published<=today).flatMap(item=>selectIndustryNews(item,industry,company));
}
export function sharedData(){
 return {records,industryUpdates:updates,preferences:[],views:[],signedIn:false,
  newsStats:[...industries,'all'].map(industry=>({industry,count:industry==='all'?articles.length:articles.filter(a=>classifyTechnology(a).industries.includes(industry)).length,updated:snapshotDate+'T00:00:00Z'})),
  lastRun:{completed:snapshotDate+'T00:00:00Z',status:'snapshot',checked:0,added:0,note:'배포에 포함된 공개 자료입니다. 자동 수집·갱신은 연결되어 있지 않습니다.'}};
}
export async function readNewsCorpus(q:string,page:number,period:string,cursor='*'):Promise<SearchResult>{
 const {from,today}=rangeFor(period),industry=industries.find(i=>i.replace(/[·\s]/g,'').toLowerCase()===q.replace(/[·\s]/g,'').toLowerCase());
 const terms=[q,searchAliases(q).q].map(t=>t.toLowerCase());
 const matching=articles.filter(a=>a.published>=from&&a.published<=today).filter(a=>q==='전체 산업'||(industry?classifyTechnology(a).industries.includes(industry):terms.some(t=>(a.title+' '+a.abstract+' '+a.authors).toLowerCase().includes(t)))).sort((a,b)=>b.published.localeCompare(a.published)||a.id.localeCompare(b.id));
 let offset=page*40;
 if(cursor!=='*'){
  const anchor=JSON.parse(cursor) as {id:string;published:string};
  const index=matching.findIndex(a=>a.id===anchor.id&&a.published===anchor.published);
  if(index<0)throw Error('기사 페이지 조건을 확인해 주세요.');
  offset=index+1;
 }
 const items=matching.slice(offset,offset+40),next=offset+items.length<matching.length?page+1:null,last=items.at(-1);
 return {items,available:matching.length,next,nextCursor:next!==null&&last?JSON.stringify({id:last.id,published:last.published}):undefined,query:q,provider:'corpus',fetchedAt:new Date().toISOString(),note:snapshotDate+' 기준 배포에 포함된 검토 보도입니다. 원래 사이트의 전체 수집 기사 저장소는 포함하지 않습니다.'};
}
