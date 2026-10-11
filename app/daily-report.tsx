"use client";
import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,ChevronDown,ExternalLink,FileText,Building2,Sparkles} from 'lucide-react';
import {industries,type RecordItem} from '@/lib/radar-data';
import type {IndustryUpdate} from '@/lib/industry-update';
import {buildDailyReport,dailyReportDates,reportDateNavigation} from '@/lib/daily-report';
import {koreaDay} from '@/lib/search-period';
import {prettyDate} from '@/lib/technology-calendar';
import {eventAssessment} from '@/lib/industry-briefing';
import {useIndustryNews,AssessmentBadge,AssessmentReason} from './industry-news';
import ImportanceBadge from './importance-badge';
import PaperOutlook from './paper-outlook';
import CompanyTags from './company-tags';
import CompanyName from './company-name';
import BriefExplanation from './brief-explanation';
import {useReportDates} from './report-dates';
export default function DailyReport({updates,records,industry,onIndustry,watched,loading,onOverview,onProgress}:{updates:IndustryUpdate[];records:RecordItem[];industry:string;onIndustry:(industry:string)=>void;watched:ReadonlySet<string>;loading:boolean;onOverview:()=>void;onProgress:()=>void}){
 const today=koreaDay(),[selected,setSelected]=useState('');
 const index=useReportDates(industry,!loading);
 const localDates=useMemo(()=>dailyReportDates(updates,records,today,[],industry),[updates,records,today,industry]);
 const dates=index.error?localDates:index.dates;
 const {date,previous,next,latest}=reportDateNavigation(dates,selected||today,today);
 const waiting=loading&&!updates.length&&!records.length||index.loading;
 const news=useIndustryNews(industry,'all',date,!!date&&!waiting);
 const report=buildDailyReport({updates,records,reports:news.items,date:date||today,industry,watched});
 function choose(value:string){if(!waiting&&dates.includes(value))setSelected(value);}
 const weekday=date?new Intl.DateTimeFormat('ko-KR',{weekday:'long',timeZone:'Asia/Seoul'}).format(new Date(date+'T00:00:00Z')):'';
 return <section className="daily-report">
 <div className="report-day-navigation" aria-label="소식이 있는 날짜로 이동"><button className="report-day-arrow" aria-label="이전 소식 있는 날" disabled={waiting||!previous} onClick={()=>choose(previous)}><ChevronLeft size={20}/></button><div className="report-current-day"><span className={date===today?'day-status today':'day-status'}>{waiting?'날짜 확인 중':date===today?'오늘':date===latest&&date?'최근 소식':'지난 리포트'}</span>{date&&<time dateTime={date}>{Number(date.slice(5,7))}월 {Number(date.slice(8))}일 <small>{weekday}</small></time>}<label><span className="sr-only">소식이 있는 날짜 선택</span><select aria-label="소식이 있는 날짜 선택" disabled={waiting||!dates.length} value={date} onChange={e=>choose(e.target.value)}>{!dates.length&&<option value="">{waiting?'날짜를 확인하고 있습니다':'선택할 날짜 없음'}</option>}{dates.map(d=><option key={d} value={d}>{Number(d.slice(5,7))}월 {Number(d.slice(8))}일{d===today?' · 오늘':''}</option>)}</select></label></div><button className="report-day-arrow" aria-label="다음 소식 있는 날" disabled={waiting||!next} onClick={()=>choose(next)}><ChevronRight size={20}/></button></div>
 <div className="report-day-shortcuts" aria-label="리포트 범위와 날짜 선택"><label className="report-industry-select"><span>현재:</span><select aria-label="리포트 산업 선택" value={industry} onChange={e=>{setSelected('');onIndustry(e.target.value);}}>{['all',...industries].map(i=><option key={i} value={i}>{i==='all'?'전체 산업':i}</option>)}</select></label>{date&&date!==latest&&<button className="report-latest" disabled={waiting} onClick={()=>choose(latest)}>최근 소식으로</button>}<small className="report-date-note">소식이 있는 날만 이동합니다.{!waiting&&!index.error&&latest&&latest<today?' 오늘 소식이 없어 최근 리포트를 보여드립니다.':''}</small></div>
 {index.error&&<p className="daily-news-status" role="alert">{index.error} 저장된 주요 소식이 있는 날짜만 표시합니다. <button onClick={index.refresh}>다시 확인</button></p>}
 <article className="daily-report-paper" aria-label={date+' 일간 리포트'}>
 {(waiting||report.topics.length>0)&&<header className="daily-report-masthead"><h2>{waiting?'자료 불러오는 중':date===today?"Today's Topic":`${Number(date.slice(5,7))}월 ${Number(date.slice(8))}일 Topic`}</h2>{!waiting&&<div className="daily-report-meta"><span>핵심 {report.topics.length}건</span><span>원문 {report.sourceCount}건</span><span>{news.loading?'보도 확인 중':'제목을 눌러 해설 보기'}</span></div>}</header>}
 {waiting||news.loading&&!report.topics.length?<p className="report-empty" role="status">소식이 있는 날짜와 리포트를 불러오는 중입니다.</p>:report.topics.length?<>
 <section className="daily-topic-list" aria-label="핵심 주제 목록" key={date+'-'+industry}>{report.topics.map((s,i)=><details className="daily-topic" name={'daily-topics-'+date+'-'+industry} id={'daily-story-'+i} key={s.id}>
 <summary><span className="topic-heading"><span className="topic-context"><span className="headline-sector">{s.sectors.join(' · ')||'기술·연구'}</span><CompanyTags companies={s.companies}/>{s.papers.length>0&&<span className="topic-source-kind">{s.papers.every(p=>p.research?.stage==='연구 흐름·리뷰')?'리뷰 논문':'논문'}</span>}<ImportanceBadge importance={s.importance} showToggle={false}/>{s.events.filter((e,i,a)=>a.findIndex(x=>eventAssessment(x).label===eventAssessment(e).label)===i).map(e=><AssessmentBadge key={e.company+e.id} assessment={eventAssessment(e)} company={e.company}/>)}</span><span className="topic-title">{s.title}</span></span><span className="topic-chevron"><ChevronDown size={18} aria-hidden="true"/></span></summary>
 <div className="topic-body"><BriefExplanation item={s.explanation}/>
 <div className="topic-actions">{s.sources[0]&&<a href={s.sources[0].url} target="_blank" rel="noopener noreferrer">원문 보기 <ExternalLink size={12}/></a>}</div>
 <details className="topic-more"><summary>자세한 설명과 출처 {s.sources.length}건</summary><div className="daily-story">
 {s.paragraphs.map((p,index)=><p key={index}>{s.companies.length>1&&<b><CompanyName name={p.company}/> · </b>}{p.text}</p>)}
 {s.papers.map(p=><p className="daily-paper-result" key={p.id}><b>연구가 확인한 범위</b>{p.research!.demonstrated}</p>)}
 {s.events.map(e=><div className="daily-story-impact" key={e.company+e.id}><small><CompanyTags companies={[e.company]}/> 이 사건의 예상 영향</small><AssessmentBadge assessment={eventAssessment(e)} company={e.company}/><AssessmentReason assessment={eventAssessment(e)}/></div>)}
 {s.paragraphs.filter(p=>p.next).map((p,index)=><p key={'next-'+index}><b>{s.papers.length?'실제로 쓰려면':'앞으로 확인할 점'}{s.companies.length>1?' · '+p.company:''}</b> {p.next}</p>)}
 {s.papers.map(p=><PaperOutlook key={p.id} item={{id:p.id,title:p.title,url:p.url,published:p.published,abstract:'',source:p.source,provider:'reviewed',kind:'논문',dateLabel:'공개일',authors:p.company,research:p.research}}/>)}
 {s.events.flatMap(e=>e.updates).map(u=><p key={u.id}><b>확인한 범위 · <CompanyName name={u.company}/></b> {u.limitations.join(' ')}</p>)}
 <div className="analysis-sources">{s.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={12}/><small>{source.kind}</small></a>)}</div>
 </div></details></div></details>)}</section></>:<div className="report-empty"><FileText size={25}/><h3>{news.error?'이 날짜의 소식을 불러오지 못했습니다':'이 산업에 정리된 주요 소식이 없습니다'}</h3><p>{news.error?'아래에서 다시 확인을 눌러 주세요.':'다른 산업을 선택해 주세요.'}</p></div>}
 {news.loading&&<p className="daily-news-status" role="status">해당 날짜의 보도를 확인하고 있습니다.</p>}{news.error&&<p className="daily-news-status" role="alert">{news.error} <button onClick={news.refresh}>다시 확인</button></p>}
 <footer className="daily-report-footer"><details><summary>리포트 안내</summary><p>공개일 기준으로 그날의 자료를 묶은 리포트입니다. 뒤늦게 수집·검토한 자료가 추가되면 과거 리포트도 보완됩니다. 전체 산업을 빠짐없이 다룬 보고서는 아닙니다.</p></details><button onClick={onOverview}>기업별 동향 더 읽기 <ChevronRight size={14}/></button></footer>
 </article><section className="report-next-routes" aria-label="더 알아보기"><h2>더 궁금한 내용이 있나요?</h2><div><button onClick={onOverview}><Building2 size={22}/><span><b>관심 기업은 어떻게 달라졌나?</b><small>기업별 소식과 최근 변화</small></span><ChevronRight size={20}/></button><button onClick={onProgress}><Sparkles size={22}/><span><b>앞으로 어떤 기술이 가능해지나?</b><small>기술·논문의 뜻과 실제 사용 가능성</small></span><ChevronRight size={20}/></button></div></section>
 {dates.length>0&&<section className="report-archive"><h3>지난 소식</h3><div>{dates.slice(0,14).map(d=><button key={d} disabled={waiting} aria-pressed={date===d} onClick={()=>choose(d)}>{Number(d.slice(5,7))}월 {Number(d.slice(8))}일</button>)}</div></section>}
 </section>;
}
