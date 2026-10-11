"use client";
import {useEffect,useState} from 'react';
import ImportanceBadge from './importance-badge';
import CompanyTags from './company-tags';
import {ExternalLink} from 'lucide-react';
import {summarizeCompany,periodNarrative,eventImportance,type TrendEvent,type BriefingPoint,type EventAssessment} from '@/lib/industry-briefing';
import {plainKorean} from '@/lib/korean-briefing';
import {prettyDate} from '@/lib/technology-calendar';
import type {IndustryNewsItem,IndustryNewsPage} from '@/lib/industry-news';
import {reportedBriefing,canonicalArticleUrl} from '@/lib/reported-briefings';

export function useIndustryNews(industry:string,company:string,period:string,enabled:boolean){
 const key=industry+'|'+company+'|'+period,[retry,setRetry]=useState(0);
 const [state,setState]=useState({key:'',items:[] as IndustryNewsItem[],scanned:0,available:0,loading:false,error:''});
 useEffect(()=>{
  if(!enabled)return;
  const abort=new AbortController();let active=true;
  setState({key,items:[],scanned:0,available:0,loading:true,error:''});
  (async()=>{
   let cursor:string|null=null,scanned=0;const collected=new Map<string,IndustryNewsItem>();
   do{
    const params=new URLSearchParams({industry,company,period});if(cursor)params.set('cursor',cursor);
    const response=await fetch('/api/industry-news?'+params,{signal:abort.signal});
    const page=await response.json() as IndustryNewsPage&{error?:string};
    if(!response.ok)throw Error(page.error||'보도를 불러오지 못했습니다.');
    for(const row of page.items)collected.set(row.company+'|'+row.item.id,row);
    scanned+=page.scanned;cursor=page.nextCursor;
    if(active)setState({key,items:[...collected.values()],scanned,available:page.available,loading:!!cursor,error:''});
   }while(cursor&&active);
  })().catch(e=>{if(active)setState(s=>({...s,loading:false,error:e instanceof Error?e.message:'보도를 불러오지 못했습니다.'}));});
  return ()=>{active=false;abort.abort();};
 },[industry,company,period,enabled,retry,key]);
 const current=state.key===key?state:{key,items:[],scanned:0,available:0,loading:enabled,error:''};
 return {...current,refresh:()=>setRetry(r=>r+1)};
}
export function ReportDetail({event}:{event:TrendEvent}){
 const report={items:event.reports};
 const reviewed=event.reports.map(reportedBriefing).find(Boolean);
 const links=[...(reviewed?.sources||[]).map(s=>({...s,source:s.kind,published:''})),...report.items].filter((s,i,a)=>a.findIndex(x=>canonicalArticleUrl(x.url)===canonicalArticleUrl(s.url))===i);
 return <article className="report-detail"><p className="report-status">{reviewed?.sources.length?'공식 자료 확인':'기사 제목·짧은 소개만 확인'}</p>{!reviewed?.sources.length&&<p>계획과 실제 완료를 구분해 설명합니다. 이 기사의 본문 전체는 아직 확인하지 못했습니다.</p>}
 {report.items[0]?.abstract&&<p className="report-snippet">{report.items[0].abstract}</p>}
 <div className="analysis-sources">{links.map(item=><a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.title}<ExternalLink size={14}/><small>{item.source}{item.published?' · '+item.published:''}</small></a>)}</div>
 {report.items.length>1&&<p className="analysis-meta">제품·상대 기업·내용·발표 단계를 비교해 묶었습니다. 제목·발췌문 기반이므로 일부 중복이나 잘못된 묶음이 남을 수 있습니다.</p>}
 </article>;
}

export function AssessmentBadge({assessment,company}:{assessment:EventAssessment;company:string}){
 const color=assessment.label==='호재'?'positive':assessment.label==='악재'?'negative':'uncertain';
 return <small className={'assessment-badge '+color} title={assessment.reason} aria-label={company+' 사업 영향: '+assessment.label+'. '+assessment.reason}>{assessment.label}{assessment.basis==='metadata'&&<span> · 잠정</span>}</small>;
}
export function AssessmentReason({assessment}:{assessment:EventAssessment}){
 return <p className="briefing-assessment"><small>{assessment.label==='미지수'?'아직 모르는 점':'예상 영향'}{assessment.basis==='metadata'?' · 기사 제목·짧은 소개 기준':''}</small><span>{assessment.reason}</span></p>;
}
function SummaryPoint({point}:{point:BriefingPoint}){
 const event=point.event,links=[...event.updates.flatMap(u=>u.sources.map(s=>({url:s.url,title:s.title,source:s.kind,published:s.published}))),...event.reports.map(i=>({url:i.url,title:i.title,source:i.source,published:i.published}))].filter((s,i,all)=>all.findIndex(x=>x.url===s.url)===i);
 return <li className="briefing-point"><time className="briefing-point-date" dateTime={event.published}>{prettyDate(event.published)}</time><div><CompanyTags companies={[event.company]}/><small className={"briefing-basis "+point.basis}>{point.basis==='analysis'?'원문 검토':'보도 내용'}</small><ImportanceBadge importance={eventImportance(event)} context={event.updates[0]||event.reports[0]||{title:event.title}}/><AssessmentBadge assessment={point.assessment} company={event.company}/><span>{point.text}</span></div>
 {point.impact&&<p className="briefing-impact"><small>영향 · {point.impact.label}</small><span>{point.impact.text}</span></p>}
 {point.assessment.reviewed&&<AssessmentReason assessment={point.assessment}/>}
 <details className="briefing-evidence"><summary>근거 {links.length}건 · {event.published}{event.lastPublished!==event.published?' ~ '+event.lastPublished:''}</summary><div>{!point.assessment.reviewed&&<AssessmentReason assessment={point.assessment}/>}<small className="assessment-scope">호재·악재는 {event.company}에 예상되는 영향을 평가한 것입니다.</small>{links.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.url===point.impact?.sourceUrl&&<b className="impact-source">효과를 설명한 자료</b>}{point.assessment.sourceUrls.includes(s.url)&&<b className="impact-source">사업 영향 평가에 쓴 자료</b>}{s.title}<ExternalLink size={12}/><small>{s.source} · {s.published}</small></a>)}</div></details></li>;
}
export function CompanyPeriodSummary({events,from,until,partial,evidenceOnly=false}:{events:TrendEvent[];from:string;until:string;partial:boolean;evidenceOnly?:boolean}){
 const summary=summarizeCompany(events,from,until);
 const paragraphs=periodNarrative(summary.points);
 const days=[...new Set(paragraphs.map(p=>p.point.event.published))];
 return <section className="company-period-summary" aria-label="기업 기간 요약"><div className="period-summary-heading"><h3>{evidenceOnly?'영향과 출처':'기간 요약'}</h3><small>{from} ~ {until}{partial?' · 불러온 자료 기준':''}</small></div><p className="period-summary-lead">{summary.lead}</p>{evidenceOnly?<ul>{summary.points.map(point=><SummaryPoint key={point.event.id} point={point}/>)}</ul>:<div className="period-editorial">{days.map(day=><section className="period-day-group" key={day} aria-label={prettyDate(day)+' 동향'}><h4><time dateTime={day}>{prettyDate(day)}</time></h4><div className="period-day-events">{paragraphs.filter(p=>p.point.event.published===day).map(p=><article className="period-event-card" key={p.id}><header><span>{p.point.event.category}</span><CompanyTags companies={[p.point.event.company]}/><AssessmentBadge assessment={p.point.assessment} company={p.point.event.company}/><ImportanceBadge importance={eventImportance(p.point.event)} context={p.point.event.updates[0]||p.point.event.reports[0]||{title:p.point.event.title}}/></header><h5>{p.point.text}</h5>{p.text&&<p className="period-event-narrative">{p.text}</p>}{p.point.impact&&<p className="briefing-impact"><small>영향 · {p.point.impact.label}</small><span>{p.point.impact.text}</span></p>}{p.point.event.updates[0]?.next&&<p className="period-event-next"><b>앞으로 확인할 점</b> {plainKorean(p.point.event.updates[0].next)}</p>}</article>)}</div></section>)}{!!paragraphs.length&&<small className="assessment-scope">호재·악재는 소식이 나온 당시 예상되는 영향입니다. 자세한 설명에는 확인한 자료와 아직 모르는 점을 함께 적습니다.</small>}</div>}

 {summary.months.length>1&&<details className="monthly-briefing"><summary>월별로 나눠 보기</summary><div>{summary.months.map(row=><section key={row.month}><h4>{row.month} <small>{row.events}개 항목</small></h4>{row.points.length?<ul>{row.points.map(point=><SummaryPoint key={point.event.id} point={point}/>)}</ul>:<p>이 달에 수집·정리된 항목이 없습니다. 변화가 없다는 뜻은 아닙니다.</p>}</section>)}</div></details>}
 </section>;
}
