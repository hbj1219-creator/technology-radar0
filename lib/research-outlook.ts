import {z} from 'zod';
import {technologies,technologyGroups,type RecordItem} from './radar-data';
import type {SearchItem} from './search-topics';
import {searchAliases,topicQueries} from './search-topics';
import {evaluateImportance} from './importance';
import {inSearchRange} from './search-period';
const korean=z.string().trim().min(1).max(600).refine(v=>/[가-힣]/.test(v),'연구 해설은 한국어로 작성해 주세요.');
const https=z.string().url().refine(v=>new URL(v).protocol==='https:');
export const researchOutlookSchema=z.object({originalTitle:z.string().min(1).max(600),doi:z.string().max(160).optional(),possibility:korean,demonstrated:korean,remaining:korean,stage:z.enum(['설계·시뮬레이션','실험실 검증','시제품 검증','현장 검증','임상 연구','연구 흐름·리뷰']),readScope:z.enum(['초록','본문']),sourceUrl:https,checkedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),timing:z.object({text:korean,sourceUrl:https}).optional(),comparison:z.object({metric:korean,unit:z.string().min(1).max(30),before:z.object({label:korean,value:z.number().finite().min(0).max(1e15)}),after:z.object({label:korean,value:z.number().finite().min(0).max(1e15)}),context:korean}).optional()});
export type ResearchOutlook=z.infer<typeof researchOutlookSchema>;
export function paperKey(item:Pick<SearchItem,'url'|'doi'>){
 const doi=item.doi||item.url.match(/doi\.org\/(.+)/i)?.[1]||item.url.match(/nature\.com\/articles\/(.+?)(?:\?|$)/)?.[1]&&'10.1038/'+item.url.match(/nature\.com\/articles\/(.+?)(?:\?|$)/)![1];
 if(doi){try{return decodeURIComponent(doi).toLowerCase();}catch{return doi.toLowerCase();}}
 const arxiv=item.url.match(/arxiv\.org\/(?:abs|html)\/([\d.]+)(?:v\d+)?/i)?.[1];
 return arxiv?'10.48550/arxiv.'+arxiv:item.url.replace(/\/$/,'').toLowerCase();
}
export function reviewedPapers(records:RecordItem[],scope:{industry:string;group:string;technology:string;query:string;period:string}):SearchItem[]{
 const query=scope.query.trim().toLowerCase(),defaultQuery=technologies.find(t=>t.id===scope.technology)?.name||technologyGroups.find(g=>g.id===scope.group)?.name||(scope.industry==='all'?'전체 산업':scope.industry);
 return records.filter(r=>{
  const t=technologies.find(t=>t.id===r.technology);
  if(r.kind!=='논문'||!r.research||!t||!inSearchRange(r.published,scope.period))return false;
  if(scope.industry!=='all'&&!t.industries.includes(scope.industry)||scope.group!=='all'&&t.group!==scope.group||scope.technology!=='all'&&r.technology!==scope.technology)return false;
  if(query===defaultQuery.toLowerCase())return true;
  const hay=[r.title,r.summary,r.company,r.research.originalTitle,r.research.possibility,r.research.demonstrated,t.name,topicQueries[t.id]].join(' ').toLowerCase();
  const aliases=searchAliases(query).news;
  return aliases.some(q=>q.toLowerCase().split(/\s+/).filter(Boolean).every(word=>hay.includes(word)));
 }).map(r=>({id:r.id,title:r.research!.originalTitle,url:r.url,source:r.source,provider:'reviewed',kind:r.stage.includes('프리프린트')?'프리프린트':'학술논문',published:r.published,dateLabel:'공개일',abstract:'',authors:r.company,doi:r.research!.doi,research:r.research,importance:evaluateImportance(r),classification:{status:'specific',method:'source-review',industries:technologies.find(t=>t.id===r.technology)!.industries,technologies:[{id:r.technology,name:technologies.find(t=>t.id===r.technology)!.name,group:technologies.find(t=>t.id===r.technology)!.group,groupName:technologyGroups.find(g=>g.id===technologies.find(t=>t.id===r.technology)!.group)!.name,basis:'review',terms:['해당 논문 원문 확인']}],groups:[{id:technologies.find(t=>t.id===r.technology)!.group,name:technologyGroups.find(g=>g.id===technologies.find(t=>t.id===r.technology)!.group)!.name}]}} as SearchItem));
}
export function mergeReviewedPapers(items:SearchItem[],reviewed:SearchItem[]){
 const map=new Map(items.map(item=>[paperKey(item),item]));
 for(const item of reviewed){const key=paperKey(item),original=map.get(key);map.set(key,original?{...original,research:item.research,importance:item.importance,classification:item.classification}:item);}
 return [...map.values()];
}
