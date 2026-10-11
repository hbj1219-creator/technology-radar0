import type {IndustryUpdate} from './industry-update';
import {type RecordItem,technologies} from './radar-data';
import {selectIndustryNews,type IndustryNewsItem} from './industry-news';
import {buildCompanyEvents,eventPoint,eventImportance,type TrendEvent} from './industry-briefing';
import {evaluateImportance,isVisibleImportance,type Importance,type ImportanceInput} from './importance';
import {compactKorean,plainKorean} from './korean-briefing';
import {validDay} from './search-period';
import {reportedBriefing,canonicalArticleUrl} from './reported-briefings';
import {sameStory} from './news-groups';
import {shortExplanation,readableHeadline} from './short-explanation';
export type DailyStory={id:string;title:string;sectors:string[];companies:string[];paragraphs:{company:string;text:string;next?:string}[];events:TrendEvent[];papers:RecordItem[];importance?:Importance;explanation:ImportanceInput;sources:{title:string;url:string;kind:string}[]};
export function dailyReportDates(updates:IndustryUpdate[],records:RecordItem[],today:string,reports:IndustryNewsItem[]=[],industry='all'){
 const candidates=[...new Set([...updates.map(u=>u.published),...records.map(r=>r.published),...reports.map(r=>r.item.published)])].filter(d=>validDay(d)&&d<=today&&d>='2026-07-01');
 return candidates.filter(date=>buildDailyReport({updates,records,reports,date,industry,watched:new Set()}).topics.length>0).sort().reverse();
}
export function reportDateNavigation(dates:string[],selected:string,today:string){
 const available=[...new Set(dates)].filter(d=>validDay(d)&&d<=today&&d>='2026-07-01').sort().reverse();
 const date=available.includes(selected)?selected:available.find(d=>d<=selected)||available[0]||'';
 const index=available.indexOf(date);
 return {date,previous:index>=0?available[index+1]||'':'',next:index>0?available[index-1]:'',latest:available[0]||''};
}
const uniqueSources=(sources:DailyStory['sources'])=>sources.filter((s,i,a)=>a.findIndex(x=>canonicalArticleUrl(x.url)===canonicalArticleUrl(s.url))===i);
function sameEvent(a:TrendEvent,b:TrendEvent){
 const reviewA=a.reports.map(reportedBriefing).find(Boolean),reviewB=b.reports.map(reportedBriefing).find(Boolean);
 if(reviewA&&reviewB)return reviewA.key===reviewB.key;
 const urls=(e:TrendEvent)=>[...e.updates.flatMap(u=>u.sources.map(s=>s.url)),...e.reports.map(r=>r.url)].map(canonicalArticleUrl);
 if(urls(a).some(url=>urls(b).includes(url)))return true;
 return a.reports.some(x=>b.reports.some(y=>sameStory(x,y)));
}
export function buildDailyReport({updates,records,reports,date,industry,watched,onlyWatched=false}:{updates:IndustryUpdate[];records:RecordItem[];reports:IndustryNewsItem[];date:string;industry:string;watched:ReadonlySet<string>;onlyWatched?:boolean}){
 if(!validDay(date))throw Error('유효한 날짜를 선택해 주세요.');
 const rows=updates.filter(isVisibleImportance).filter(u=>u.published===date&&(industry==='all'||u.industry===industry)&&(!onlyWatched||watched.has(u.company)));
 const media=reports.filter(r=>r.item.published===date&&isVisibleImportance(r.item)&&(industry==='all'||selectIndustryNews(r.item,industry,r.company).length>0)&&(!onlyWatched||watched.has(r.company)));
 const papers=records.filter(isVisibleImportance).filter(r=>r.kind==='논문'&&r.research?.sourceUrl===r.url&&r.published===date&&(industry==='all'||technologies.find(t=>t.id===r.technology)?.industries.includes(industry))&&(!onlyWatched||watched.has(r.company)));
 const stories:DailyStory[]=[];
 // Reviewed updates and collected articles enter the same grouping pass and the same list.
 for(const company of new Set([...rows.map(u=>u.company),...media.map(r=>r.company)])){
  for(const event of buildCompanyEvents(company,rows,media)){
   const explanation=event.updates[0]||event.reports.find(r=>reportedBriefing(r))||event.reports[0];
   const reviewed=event.reports.map(reportedBriefing).find(Boolean),title=eventPoint(event).text;
   // A raw headline without a usable Korean explanation is evidence, not a reader-facing topic.
   if(!event.updates.length&&!reviewed&&(!/[가-힣]/.test(title)||shortExplanation(explanation).effect==='자료에 성능·사용 결과가 나와 있지 않습니다.'))continue;
   const sources=uniqueSources([...event.updates.flatMap(u=>u.sources.map(s=>({title:s.title,url:s.url,kind:s.kind}))),...(reviewed?.sources||[]),...event.reports.map(r=>({title:r.title,url:r.url,kind:r.source}))]);
   const sectors=[...new Set([...event.updates.map(u=>u.industry),...(reviewed?.sectors||event.reports.flatMap(r=>r.classification?.industries||[]))])];
   const paragraphs=event.updates.map(u=>({company:u.company,text:plainKorean(u.briefing?.narrative||u.after),next:plainKorean(u.next)}));
   const story:DailyStory={id:reviewed?.key||event.id,title,sectors,companies:[company],paragraphs,events:[event],papers:[],importance:eventImportance(event),explanation,sources};
   const same=stories.find(s=>s.events.some(other=>sameEvent(other,event)));
   if(same){
    same.companies=[...new Set([...same.companies,company])];same.sectors=[...new Set([...same.sectors,...sectors])];same.events.push(event);same.paragraphs.push(...paragraphs);same.sources=uniqueSources([...same.sources,...sources]);
    if(event.updates.length&&!same.events.slice(0,-1).some(e=>e.updates.length)){same.title=title;same.explanation=explanation;}
    if((story.importance?.stars||0)>(same.importance?.stars||0))same.importance=story.importance;
   }else stories.push(story);
  }
 }
 for(const p of papers){
  const source={title:p.research!.originalTitle,url:p.url,kind:'논문'},importance=evaluateImportance(p);
  const same=stories.find(s=>s.sources.some(x=>canonicalArticleUrl(x.url)===canonicalArticleUrl(p.url)));
  if(same){same.papers.push(p);if((importance?.stars||0)>(same.importance?.stars||0))same.importance=importance;continue;}
  stories.push({id:p.id,title:compactKorean(readableHeadline(p)),sectors:technologies.find(t=>t.id===p.technology)?.industries||[],companies:[p.company||'연구팀'],paragraphs:[{company:p.company||'연구팀',text:p.research!.possibility,next:p.research!.remaining}],events:[],papers:[p],importance,explanation:p,sources:[source]});
 }
 stories.sort((a,b)=>(b.importance?.stars||0)-(a.importance?.stars||0)||Number(b.companies.some(c=>watched.has(c)))-Number(a.companies.some(c=>watched.has(c)))||a.id.localeCompare(b.id));
 const topics=stories.filter(s=>(s.importance?.stars||0)>=1);
 const lead=topics.length?topics.slice(0,3).map(s=>s.title).join(' · '):'이 날짜에 핵심으로 선정할 소식이 없습니다.';
 const chars=topics.flatMap(s=>s.paragraphs.map(p=>p.text)).join('').length;
 return {stories,topics,lead,readMinutes:Math.max(1,Math.ceil(chars/500)),sourceCount:new Set(stories.flatMap(s=>s.sources.map(x=>canonicalArticleUrl(x.url)))).size};
}
