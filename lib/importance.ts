import {z} from 'zod';
import editorialAssessments from '../data/importance-assessments.json';
import sourceAssessments from '../data/importance-source-assessments.json';
import itemSources from '../data/importance-item-sources.json';
import {isNonTechnologyNews,hasTechnicalContent} from './technology-relevance';
import {reportedBriefing} from './reported-briefings';
export const IMPORTANCE_REVISION=3;
export const importanceSchema=z.object({stars:z.number().int().min(0).max(3),reason:z.string().trim().min(1).max(360).refine(v=>/[가-힣]/.test(v)),sourceUrls:z.array(z.string().url().refine(v=>new URL(v).protocol==='https:')).max(6),basis:z.enum(['editorial-content','automatic-content']).optional(),revision:z.literal(3).optional()}).refine(v=>v.stars===0||v.sourceUrls.length>0,'1점 이상 평가는 원문 근거가 필요합니다.');
export type Importance=z.infer<typeof importanceSchema>;
export function linkedImportance(importance:Importance|undefined,urls:string[]):Importance|undefined{return importance&&importance.sourceUrls.length&&importance.sourceUrls.every(url=>urls.includes(url))?importance:undefined;}
export type ImportanceInput={id?:string;title:string;url?:string;published?:string;abstract?:string;summary?:string;after?:string;change?:string;why?:string;interpretation?:string;technologyName?:string|null;stage?:string;kind?:string;facts?:string[];sources?:{url:string}[];importance?:Importance;research?:{possibility:string;demonstrated:string;stage:string}};
/** Revised editorial review wins over old ratings. New metadata is evaluated conservatively. */
export function evaluateImportance(item:ImportanceInput):Importance|undefined {
 const urls=[...new Set([...(item.sources||[]).map(s=>s.url),...(item.url?[item.url]:[])])].filter(url=>{try{return new URL(url).protocol==='https:';}catch{return false;}});
 if(isNonTechnologyNews(item.title))return {stars:0,reason:'기술 개발·제품·공정·실제 적용의 변화와 직접 연결되지 않는 소식입니다. 기업명이 등장해도 기술 동향에서는 제외합니다.',sourceUrls:urls.slice(0,6),basis:'automatic-content',revision:IMPORTANCE_REVISION};
 const reviewed=reportedBriefing(item);
 if(reviewed&&urls.length)return {stars:reviewed.stars,reason:reviewed.reason,sourceUrls:urls.slice(0,6),basis:'editorial-content',revision:IMPORTANCE_REVISION};
 const editorial=(editorialAssessments as Record<string,(string|number)[]>);
 const mappedId=(sourceAssessments as Record<string,string>)[item.url||''];
 const directId=item.id||'',sourceIds=(itemSources as Record<string,string[]>)[directId]||[];
 const manual=(urls.some(url=>sourceIds.includes(url))?editorial[directId]:undefined)||editorial[mappedId||''];
 if(manual&&urls.length)return {stars:Number(manual[0]),reason:String(manual[1]),sourceUrls:urls.slice(0,6),basis:'editorial-content',revision:IMPORTANCE_REVISION};
 if(!hasTechnicalContent(item))return {stars:0,reason:'제공된 자료에서 구체적인 기술 개발·제품·공정·실제 적용과의 연결을 확인하지 못했습니다. 기업 이름만으로 기술 동향에 포함하지 않습니다.',sourceUrls:urls.slice(0,6),basis:'automatic-content',revision:IMPORTANCE_REVISION};
 const existing=importanceSchema.safeParse(item.importance);
 if(existing.success&&existing.data.revision===IMPORTANCE_REVISION&&existing.data.sourceUrls.every(url=>urls.includes(url)))return existing.data;
 if(!urls.length)return {stars:0,reason:'유효한 원문 주소가 없어 확인할 근거가 부족합니다. 기본 소식에서 제외합니다.',sourceUrls:[],basis:'automatic-content',revision:IMPORTANCE_REVISION};
 const title=item.title,body=[item.abstract,item.summary,item.after,item.change,item.research?.possibility,item.research?.demonstrated,...(item.facts||[])].filter(Boolean).join(' ');
 const text=title+' '+body,stage=item.stage||item.research?.stage||'';
 let stars=0,reason='제공된 제목·발췌문에서 읽을 가치가 있는 구체적인 새 변화나 결과를 확인하지 못했습니다. 기본 소식에서 제외합니다.';
 const paper=/논문|학술|프리프린트|paper|preprint/i.test(item.kind||'');
 const review=/systematic review|literature review|meta.analysis|리뷰|문헌 고찰/i.test(title+' '+stage);
 const routine=/초기 (?:논의|협의)|협력 (?:논의|가능성)|양해각서|\bMOU\b|발표.{0,8}예고|성과급|주가|목표가|할인|쿠폰|경품|\bearnings\b|stock price|price target|memorandum|(?:early|preliminary) (?:talks|discussions)|in talks|explor(?:e|es|ing) .{0,40}(?:partnership|investment)|appoints? .{0,30}(?:CEO|chief)|CEO (?:선임|교체|방문|회동)|(?:CEO|임원).{0,10}(?:회동|방문)|plans? to (?:announce|present)/i.test(title+' '+stage);
 const vaguePlan=/늘리겠|확대 의지|사업 방향|투자 범위 확대|협력 구상|기업 운영 주장/i.test(title+' '+stage)&&!/\d+(?:[.,]\d+)?\s*(?:조|억|만|%|MW|GW)|양산 개시|고객 출하|상업운전/i.test(body);
 const genericBusiness=/투자|인수|협력|협약|investment|acquir|partnership|agreement/i.test(title)&&!hasTechnicalContent({title})&&!/\d+(?:[.,]\d+)?\s*(?:조|억|만|MW|GW|billion|million)|양산|착공|가동|클린룸|데이터센터|factory|fab\b|plant|data.cent/i.test(body);

 const platform=/HBM|HBF|EUV|노광|반도체 공정|파운드리|GPU|AI 추론|기밀 컴퓨팅|보호 VM|위성망|위성 통신|수전해|전력망|전신 제어|휴머노이드|3D 적층|첨단 패키징|메모리 계층|semiconductor|foundry|quantum|humanoid|memory tier|chiplet|inference|satellite|electroly/i.test(text);
 const concrete=/양산|출하|생산능력|고객 적용|현장 검증|상업운전|규격|승인|시제품|전환|플랫폼|공동개발|공정|구조|production|shipment|capacity|approval|prototype|deploy|platform|architecture|process/i.test(text);
 const researchAdvance=/실험|검증|개선|효율|설계|새로운|시뮬레이션|experiment|demonstrat|improv|efficien|novel|simulation/i.test(text);
 if(review){stars=1;reason='기존 연구를 종합한 판단 자료로 활용 가치는 있지만 새로운 기술 성능이나 현장 적용을 입증한 결과와는 다릅니다. 기술 진전의 중요도는 1점으로 평가합니다.';}
 else if(routine||vaguePlan||genericBusiness){reason='초기 협의·단순 예고·의사 표명으로 구체적 실행이나 새 결과가 확인되지 않았습니다. 기본 소식에서 제외합니다.';}
 else if(paper&&platform&&researchAdvance){stars=2;reason='산업의 핵심 기술과 연결되는 설계·실험·개선 방향을 다뤄 후속 개발에서 주목할 연구로 평가합니다. 제공된 초록·해설만으로 상용 적용과 산업 전반의 효과를 확정할 수 없어 2점입니다.';}
 else if(platform&&concrete){stars=2;reason='핵심 기술의 생산·적용·설계 방향에 영향을 줄 수 있는 변화로 평가합니다. 관련 공급망과 후속 개발에서 주목할 내용이지만 원문 전체와 비교 조건을 검증한 평가는 아니므로 2점입니다.';}
 else if(/공장|생산기지|설비|데이터센터|전력|위성|factory|fab\b|plant|data.cent(?:er|re)|grid/i.test(text)&&/증설|투자|확대|건설|investment|expand|construction|capacity/i.test(text)){stars=2;reason='생산·서비스 기반의 확대는 관련 산업의 공급 여건에 영향을 줄 수 있어 2점으로 평가합니다. 투자 계획·착공·실제 가동은 서로 다른 단계이며 기술 성능의 획기적인 진전을 뜻하지는 않습니다.';}
 else if(/생산 중단|대규모 리콜|수출 제한|수출 규제|공급 중단|mass recall|export ban|export restrict|production halt|supply disruption/i.test(title)){stars=2;reason='생산·공급·규제의 변화가 관련 산업의 조달과 적용에 영향을 줄 수 있어 2점으로 평가합니다. 피해 규모와 실제 적용 범위는 제공된 자료의 범위에서 확인해야 합니다.';}
 else if(paper){stars=1;reason='제공된 연구 제목·초록에서는 특정 조건이나 개별 응용의 연구로 평가합니다. 산업 여러 분야로 이어질 검증 결과가 충분히 제시되지 않아 현재 기술 중요도는 1점입니다.';}
 else if(/개발|출시|공개|발표|샘플|시제품|납품|수주|적용|실험|검증|설계|develop|launch|release|unveil|sample|prototype|deliver|contract|experiment|demonstrat|design/i.test(title)){stars=1;reason='구체적인 제품·개발·계약·연구의 변화를 다루지만 적용 범위와 검증은 제한적입니다. 제공된 제목·발췌문 기준으로 1점입니다.';}
 // Metadata cannot establish a transformative, broadly validated breakthrough. That requires editorial review.
 return {stars,reason,sourceUrls:urls.slice(0,6),basis:'automatic-content',revision:IMPORTANCE_REVISION};
}
export function prioritizeCompanies<T extends {name:string}>(companies:T[],watched:ReadonlySet<string>){return [...companies].sort((a,b)=>Number(watched.has(b.name))-Number(watched.has(a.name)));}

export function isVisibleImportance(item:ImportanceInput){return (evaluateImportance(item)?.stars||0)>=1;}
