import editorial from '../data/event-assessments.json';
import {companyTerms,cleanNewsTitle} from './industry-news';
import type {IndustryUpdate} from './industry-update';
import type {SearchItem} from './search-topics';
import {reportedBriefing} from './reported-briefings';

type Assessment=NonNullable<IndustryUpdate['assessment']>;
export function applyEventAssessment<T extends {id:string;sources?:{url:string}[];assessment?:Assessment}>(item:T):T {
 const saved=(editorial as Record<string,{assessment:Assessment;sourceUrls:string[]}>)[item.id];
 if(!saved||!saved.assessment.sourceUrls.every(url=>item.sources?.some(s=>s.url===url)))return item;
 return {...item,assessment:saved.assessment};
}

/** Assess reported milestones, with explicit metadata scope and company attribution. */
export function assessReportedEvent(company:string,reports:SearchItem[]){
 const sourceUrls=[...new Set(reports.map(r=>r.url).filter(Boolean))].slice(0,6);
 const result=(label:Assessment['label'],reason:string)=>({label,reason,sourceUrls,reviewed:true,basis:'metadata' as const});
 const reviewed=reports.map(reportedBriefing).find(Boolean);
 if(reviewed)return {...result(reviewed.label,reviewed.reason),basis:'editorial' as const};
 const findings=reports.map(item=>{
  const title=cleanNewsTitle(item.title),opening=title.split(/[,，:：]|\s[—–]\s/)[0];
  // A shared headline can describe a supplier and its customer. Do not assign the same benefit to both.
  const attributed=companyTerms(company).some(term=>opening.toLowerCase().includes(term.toLowerCase()));
  if(!attributed)return result('미지수',`${company}가 제목에 언급되지만 변화의 주체·공급자·고객 역할을 구분할 정보가 부족합니다. 해당 기업에 유리한 사건인지 제목·발췌문만으로 단정하기 어렵습니다.`);
  const negative=/실패|불합격|취소|무산|지연|리콜|중단|결함|fail(?:s|ed|ure)?\b|recall|delay(?:s|ed)?\b|cancel(?:led|ed)?\b/i;
  const milestone=/양산|출하|공급|생산|제품|개발|인증|시험|공장|가동|chip|product|production|shipment|qualification|launch|factory|test/i;
  if(negative.test(title)&&milestone.test(title)&&!/실패\s*(?:방지|예방|관측|데이터)|지연\s*(?:시간|감소|줄)|중단\s*없|without.*fail|reduce.*latency/i.test(title))return result('악재',`${company}의 기술·제품 일정에 실패·지연 또는 중단이 보도돼 공급·현장 적용에 불리한 변화로 봅니다. 제목·발췌문 기반의 잠정 평가이며 원인·영향 물량은 확인이 필요합니다.`);
  const plan=/계획|예정|목표|검토|논의|전망|추진|예고|가능성|aims?\b|plans?\b|targets?\b|may\b|could\b|will\b|expected|to (?:launch|build|start|ship)/i.test(title);
  const done=/양산\s*(?:시작|개시|돌입)|출하\s*(?:시작|개시)|인도|납품|상업\s*운전|가동\s*(?:시작|개시)|통과|인증\s*(?:획득|취득)|승인\s*(?:획득|받)|begins? .*production|starts? .*production|ships?\b|shipping|delivers?\b|passed?\b|approved\b|certified\b/i.test(title);
  if(done&&!plan)return result('호재',`${company}의 생산·납품·운영 또는 검증 단계가 진전됐다는 보도입니다. 실제 적용에 가까워진 변화로 보되 물량·수율·성능은 원문과 후속 자료에서 확인해야 합니다.`);
  const launch=/출시|공개|launch(?:es|ed)?\b|unveil(?:s|ed)?\b|releases?\b/i.test(title)&&/제품|칩|모델|로봇|배터리|SSD|HBM|GPU|CPU|AI|플랫폼|소프트웨어|processor|robot|battery|model|platform|software/i.test(title);
  if(launch&&!plan)return result('호재',`${company}가 기술·제품을 공개하거나 출시해 제공 범위가 넓어졌다는 보도입니다. 기술·제품 전개의 진전으로 평가하며 고객 채택과 성능 우위까지 확인된 것은 아닙니다.`);
  if(plan&&/출시|양산|생산|공장|출하|공급|개발|launch|production|factory|build|ship|develop/i.test(title))return result('호재',`${company}의 제품 전개·개발 또는 생산 기반 확대는 활용·공급 여력을 늘리는 방향으로 평가합니다. 계획 단계이므로 실제 완료와 성능·규모는 구분해야 합니다.`);
  if(plan)return result('미지수',`${company}의 논의·검토 내용만으로는 적용 대상과 유리하거나 불리한 변화의 방향을 특정하기 어렵습니다.`);
  if(/샘플|시제품|prototype|samples?\b/i.test(title))return result('호재',`${company}의 샘플·시제품 공개는 개발에서 검증 단계로 나아갈 근거입니다. 고객 인증·양산성과 최종 성능은 확인되지 않았습니다.`);
  if(/협력|협약|공동개발|partnership|collaborat|agreement/i.test(title))return result('미지수',`${company}의 협력 범위는 확인되지만 개발 결과·납품·현장 적용이 제시되지 않았습니다. 협약 자체로 기술 성과나 사업 효과를 확정할 수 없습니다.`);
  return result('미지수',`${company}와 관련된 기술 소식이지만 제목·발췌문에서 성능 변화·검증 결과·고객 적용을 특정하기 어렵습니다. 이 항목의 효과를 판단하려면 해당 결과나 적용 근거가 필요합니다.`);
 });
 const definite=findings.filter(a=>a.label!=='미지수');
 if(new Set(definite.map(a=>a.label)).size>1)return result('미지수','같은 사건의 보도에 기술 진전과 실패·지연 신호가 함께 있어 평가가 엇갈립니다. 최신 원문에서 완료 여부와 남은 문제를 구분해야 합니다.');
 return definite[0]||findings[0]||result('미지수','판단할 출처가 없어 기술의 성능·검증·적용 결과를 확인할 수 없습니다.');
}
