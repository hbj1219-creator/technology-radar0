"use client";
import CompanyName from './company-name';
import {useMemo,useState} from "react";
import {ExternalLink,ChevronDown,SlidersHorizontal,Star,Search,FileText} from "lucide-react";
import {industries,type RecordItem} from "@/lib/radar-data";
import {companyWatchlist,type IndustryUpdate} from "@/lib/industry-update";
import {withIntelComparison} from "@/lib/intel-comparisons";
import {koreaDay,rangeFor,searchMonths} from "@/lib/search-period";
import {Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription} from "@/components/ui/sheet";
import LiveSearch from "./live-search";
import ImportanceBadge from "./importance-badge";
import BriefExplanation from "./brief-explanation";
import {isVisibleImportance} from "@/lib/importance";
import ReadingTabs from "./reading-tabs";
import {buildCompanyEvents,sortCompanyTrends,eventPoint,eventAssessment,eventImportance,eventOriginalUrl} from "@/lib/industry-briefing";
import {plainKorean} from "@/lib/korean-briefing";
import {useIndustryNews,ReportDetail,CompanyPeriodSummary,AssessmentBadge,AssessmentReason} from "./industry-news";

function Evidence({update}:{update:IndustryUpdate}){
 return <details className="analysis-evidence"><summary>자세한 설명 <ChevronDown size={14}/></summary><div>
 <h4>확인된 내용</h4><ul>{update.facts.map(f=><li key={f}>{f}</li>)}</ul>
 <h4>어떤 의미인가</h4><p>{update.interpretation}</p><h4>앞으로 확인할 점</h4><p>{update.next}</p>
 <h4>아직 모르는 점</h4><ul>{update.limitations.map(f=><li key={f}>{f}</li>)}</ul>
 <div className="analysis-sources">{update.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ExternalLink size={14}/><small>{s.kind} · {s.published}</small></a>)}</div>
 <p className="analysis-meta">원문 확인 {update.checkedAt} · 기업 발표의 주장과 독립 검증은 다릅니다.</p>
 </div></details>;
}
function UpdateDetail({update,onSearch}:{update:IndustryUpdate;onSearch:(technology?:string)=>void}){
 const compare=update.company==="Intel"&&!!update.before;
 return <article className="company-update"><div className="company-update-meta"><span>진행 상황 · {update.stage}</span></div>
 {compare?<div className="change-comparison"><div><span>이전 상태</span><p>{update.before}</p></div><div><span>이번 변화</span><p>{update.after}</p></div></div>:<p className="company-update-after">{update.after}</p>}
 {update.briefing?.impact&&<p className="change-meaning"><b>자료에 나온 효과 · {update.briefing.impact.status}</b> {plainKorean(update.briefing.impact.text)}</p>}
 <p className="change-meaning"><b>왜 중요한가</b> {plainKorean(update.why)}</p><Evidence update={update}/>
 {update.technologyIds.length>0&&<button className="technology-research" onClick={()=>onSearch(update.technologyIds[0])}>관련 기사·논문 찾기</button>}
 </article>;
}
export default function IndustryOverview({industry,onIndustry,updates,loading,onSearch,newsStats,watchedCompanies=new Set<string>(),watchedOnly=false,onWatch,watchPending,signedIn}:{watchedCompanies?:ReadonlySet<string>;watchedOnly?:boolean;onWatch?:(name:string,active:boolean)=>void;watchPending?:string;signedIn?:boolean;industry:string;onIndustry:(v:string)=>void;newsStats:{industry:string;count:number;updated:string|null}[];updates:IndustryUpdate[];records:RecordItem[];loading:boolean;onSearch:(technology?:string)=>void}){
 const [period,setPeriod]=useState(watchedOnly?"30":"since"),[company,setCompany]=useState("all"),[newsCompany,setNewsCompany]=useState<string|null>(null);
 const [watchOpen,setWatchOpen]=useState(false),[watchQuery,setWatchQuery]=useState("");
 const [onlyWatched,setOnlyWatched]=useState(false),[visible,setVisible]=useState<Record<string,number>>({});
 const filterWatched=watchedOnly||onlyWatched;
 const reports=useIndustryNews(industry,company,period,!watchedOnly||watchedCompanies.size>0);
 const today=koreaDay(),range=rangeFor(period);
 const all=updates.filter(isVisibleImportance).filter(u=>(industry==="all"||u.industry===industry)&&u.published>="2026-07-01"&&u.published<=today).sort((a,b)=>b.published.localeCompare(a.published)||a.id.localeCompare(b.id));
 const periodRows=all.filter(u=>u.published>=range.from&&u.published<=range.today&&(company==="all"||u.company===company));
 const list=industry==="all"?Object.values(companyWatchlist).flat().filter((v,i,a)=>a.findIndex(x=>x.name===v.name)===i):(companyWatchlist[industry]||[]);
 const companies=[...new Set([...list.map(c=>c.name),...all.map(u=>u.company)])].filter(name=>!watchedOnly||watchedCompanies.has(name)).sort((a,b)=>a.localeCompare(b,"ko"));
 const grouped=useMemo(()=>sortCompanyTrends(companies.map(name=>{
 const rows=periodRows.filter(u=>u.company===name),media=reports.items.filter(r=>r.company===name);
 const entries=buildCompanyEvents(name,rows,media);
 return {name,rows,media,entries};
 }).filter(g=>(company==="all"||company===g.name)&&(!filterWatched||watchedCompanies.has(g.name))&&g.entries.length),watchedCompanies),[industry,company,updates,reports.items,range.from,range.today,filterWatched,watchedCompanies]);
 const eventCount=grouped.reduce((n,g)=>n+g.entries.length,0);
 const missing=companies.filter(c=>(company==="all"||c===company)&&(!filterWatched||watchedCompanies.has(c))&&!grouped.some(g=>g.name===c));
 const chooseIndustry=(v:string)=>{onIndustry(v);setCompany("all");};
 return <div className="industry-overview">
 <div className="overview-primary-tabs" aria-label="관심 기업 보기">{watchedOnly?<span className="watch-view-scope"><Star size={14} fill="currentColor"/>관심 기업 {watchedCompanies.size}개만 표시</span>:<button className="interest-filter" aria-pressed={onlyWatched} onClick={()=>setOnlyWatched(v=>!v)}><Star size={14} fill={onlyWatched?"currentColor":"none"}/>관심 기업만</button>}</div>
 <div className="overview-industry-strip" aria-label="산업 선택">{["all",...industries].map(v=><button key={v} aria-pressed={industry===v} onClick={()=>chooseIndustry(v)}>{v==="all"?"전체 산업":v}</button>)}</div>
 <div className="briefing-toolbar"><div className="period-shortcuts" aria-label="동향 공개 기간">{[["1","오늘"],["7","1주"],["30","1개월"],["since","전체 기간"]].map(([id,label])=><button key={id} aria-pressed={period===id} onClick={()=>setPeriod(id)}>{label}</button>)}</div><label className="period-select"><span className="sr-only">기간 또는 월 선택</span><select aria-label="동향 기간 또는 월" value={period} onChange={e=>setPeriod(e.target.value)}><option value="since">2026년 7월 이후</option><option value="1">오늘</option><option value="7">최근 7일</option><option value="30">최근 30일</option>{searchMonths().reverse().map(m=><option key={m} value={m}>{m.slice(0,4)}년 {Number(m.slice(5))}월</option>)}</select></label><button className="watch-settings" onClick={()=>setWatchOpen(true)}><SlidersHorizontal size={16}/>관심 설정{watchedCompanies.size>0&&<small>{watchedCompanies.size}</small>}</button></div>
 {watchedCompanies.size>0&&<div className="watched-company-chips" aria-label="관심 기업">{[...watchedCompanies].map(name=><button key={name} aria-pressed={company===name} onClick={()=>{onIndustry("all");setCompany(company===name?"all":name);}}><Star size={11} fill="currentColor"/><CompanyName name={name}/></button>)}</div>}
 <details className="overview-filter-options"><summary><SlidersHorizontal size={14}/>기업 필터{company!=="all"&&<small><CompanyName name={company}/></small>}<ChevronDown size={14}/></summary><div className="overview-controls"><label>기업<select aria-label="동향 기업" value={company} onChange={e=>setCompany(e.target.value)}><option value="all">전체 기업</option>{companies.map(c=><option key={c}>{c}</option>)}</select></label><button className="overview-search" onClick={()=>onSearch()}><Search size={15}/>자료 검색</button></div></details>
 <Sheet open={watchOpen} onOpenChange={setWatchOpen}><SheetContent className="watch-settings-sheet"><SheetHeader><SheetTitle>관심 기업</SheetTitle><SheetDescription>선택한 기업을 필터로 모아 볼 수 있습니다. {signedIn?'계정에 저장됩니다.':'이 브라우저에 저장됩니다.'}</SheetDescription></SheetHeader><label className="watch-company-search"><Search size={17}/><input aria-label="관심 기업 찾기" placeholder="기업 이름으로 찾기" value={watchQuery} onChange={e=>setWatchQuery(e.target.value)}/></label><div className="watch-selection-count">선택한 기업 <b>{watchedCompanies.size}</b></div><div className="company-watch-grid">{[...new Set(Object.values(companyWatchlist).flat().map(c=>c.name))].filter(name=>name.toLowerCase().includes(watchQuery.trim().toLowerCase())).sort((a,b)=>Number(watchedCompanies.has(b))-Number(watchedCompanies.has(a))||a.localeCompare(b,"ko")).map(name=><label key={name}><input type="checkbox" checked={watchedCompanies.has(name)} disabled={watchPending===name} onChange={e=>onWatch?.(name,e.target.checked)}/><span><CompanyName name={name}/></span></label>)}</div><button className="watch-settings-done" onClick={()=>setWatchOpen(false)}>선택 완료</button></SheetContent></Sheet>
 <div className="overview-coverage"><span>{range.from} ~ {range.today}</span><span>{grouped.length}개 기업 · 소식 {eventCount}건</span></div>
 {(!watchedOnly||watchedCompanies.size>0)&&(reports.loading||reports.error)&&<div className="overview-news-progress" aria-live="polite">{reports.loading&&"소식을 불러오는 중입니다."}{reports.error&&<span role="alert"> {reports.error} <button onClick={reports.refresh}>다시 불러오기</button></span>}</div>}
 <section className="company-trends" aria-label="기업별 산업 동향" key={`${industry}-${period}-${company}`}>
 {(loading||reports.loading)&&!grouped.length?<p className="analysis-empty" role="status">산업 동향을 불러오는 중입니다.</p>:grouped.length?grouped.map(g=><section className="company-group" key={g.name} aria-label={`${g.name} 동향`}>
 <div className="company-group-heading"><div className="company-heading-copy"><h2 className="company-heading-tag"><CompanyName name={g.name}/></h2><span>최근 {g.entries[0]?.published} · {g.entries.length}개 변화</span></div>{onWatch&&<button className="company-watch-button" aria-pressed={watchedCompanies.has(g.name)} disabled={watchPending===g.name} onClick={()=>onWatch(g.name,!watchedCompanies.has(g.name))}>{watchedCompanies.has(g.name)?"✓ 관심 기업":"+ 관심 기업"}</button>}<button className="company-news-button" onClick={()=>setNewsCompany(g.name)}><FileText size={14}/><span>관련 기사</span></button></div>
 <ReadingTabs key={`${period}-${g.name}`} label={g.name+" 동향 보기"} defaultId="events" tabs={[{id:"summary",label:"기간 요약",content:<CompanyPeriodSummary events={g.entries} from={range.from} until={range.today} partial={reports.loading||!!reports.error}/>},{id:"events",label:`날짜별 소식 · ${g.entries.length}`,content:(<section className="company-events" aria-label="날짜별 소식">
 <div className="company-change-list">{g.entries.slice(0,visible[`${industry}-${period}-${company}-${g.name}`]||12).map(entry=><details className="company-change" name={"company-events-"+g.name} key={entry.id}>
 <summary><div className="company-change-lines"><div className="company-change-info"><time dateTime={entry.published}>{entry.published}</time><ImportanceBadge importance={eventImportance(entry)} showToggle={false}/><AssessmentBadge assessment={eventAssessment(entry)} company={g.name}/><small className={"change-category "+(entry.updates[0]?.type||"technology")}>{entry.category}</small><small className="change-source">출처 {entry.sources}곳</small></div><span className="company-change-title">{eventPoint(entry).text||"요약을 아직 준비하지 못했습니다."}</span></div><ChevronDown size={17} aria-hidden="true"/></summary>
 <div className="company-change-body"><BriefExplanation item={entry.updates[0]||entry.reports[0]||{title:entry.title}}/>{eventOriginalUrl(entry)&&<div className="topic-actions"><a href={eventOriginalUrl(entry)} target="_blank" rel="noopener noreferrer">원문 보기 <ExternalLink size={12}/></a></div>}<details className="topic-more"><summary>자세한 설명과 출처</summary><AssessmentReason assessment={eventAssessment(entry)}/><small className="assessment-scope">{g.name}의 발표 당시 예상되는 영향입니다.</small>{entry.updates.map(update=><UpdateDetail key={update.id} update={withIntelComparison(update)} onSearch={onSearch}/>)}{entry.reports.length>0&&<ReportDetail event={entry}/>}</details></div>
 </details>)}</div>
 {g.entries.length>(visible[`${industry}-${period}-${company}-${g.name}`]||12)&&<button className="company-more" onClick={()=>{const key=`${industry}-${period}-${company}-${g.name}`;setVisible(v=>({...v,[key]:(v[key]||12)+24}));}}>이전 동향 더 보기 · {g.entries.length-(visible[`${industry}-${period}-${company}-${g.name}`]||12)}건 남음</button>}
 </section>)},{id:"evidence",label:"영향과 출처",content:<CompanyPeriodSummary events={g.entries} from={range.from} until={range.today} partial={reports.loading||!!reports.error} evidenceOnly/>}]}/>
 </section>):<div className="analysis-empty"><b>{filterWatched&&!watchedCompanies.size?"관심 기업을 먼저 선택하세요.":"이 조건에서 표시할 동향을 아직 찾지 못했습니다."}</b><p>{filterWatched&&!watchedCompanies.size?"관심 기업을 체크하면 해당 기업의 소식만 모아볼 수 있습니다.":"변화가 없다는 뜻은 아닙니다. 다른 기간이나 기업을 선택해 보세요."}</p>{filterWatched&&!watchedCompanies.size?<button onClick={()=>setWatchOpen(true)}>관심 기업 선택</button>:<button onClick={()=>onSearch()}>관련 자료 검색</button>}</div>}
 </section>
 {missing.length>0&&<details className="overview-support"><summary>이 조건에서 표시할 동향이 없는 기업 {missing.length}개</summary><div className="missing-company-news">{missing.map(name=><button key={name} onClick={()=>setNewsCompany(name)}><CompanyName name={name}/> 기사 보기</button>)}</div><p>변화가 없다는 뜻이 아닙니다. 아직 소식을 확인하지 못했거나 이 기간에 해당하는 기술 소식이 없을 수 있습니다.</p></details>}

 <details className="overview-support overview-method"><summary>소식 정리 기준</summary><p className="overview-footnote">기업 발표·논문·기사를 함께 읽고 같은 사건은 한 소식으로 합칩니다. 최신순으로 보여주며 날짜는 첫 자료가 공개된 날입니다. 제목과 짧은 소개만 확인한 기사는 자세한 설명에 그 범위를 표시합니다. 여러 기업에 관련된 소식은 각 기업에서 볼 수 있습니다.</p></details>
 <Sheet open={!!newsCompany} onOpenChange={open=>!open&&setNewsCompany(null)}><SheetContent className="company-news-sheet"><SheetHeader><SheetTitle>{newsCompany&&<CompanyName name={newsCompany}/>} 관련 기사</SheetTitle><SheetDescription>{range.from} ~ {range.today} · 다른 관련 기사도 볼 수 있습니다. 기술 관련 기사만 표시하며 다른 기업의 언급이 섞일 수 있습니다.</SheetDescription></SheetHeader>{newsCompany&&<LiveSearch key={newsCompany+period} industry={industry} group="all" technology="all" initialQuery={newsCompany} initialBundle fixedPeriod={period} onView={()=>{}}/>}</SheetContent></Sheet>
 </div>;
}
