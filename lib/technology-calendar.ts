import type {IndustryUpdate} from './industry-update';
import {type RecordItem,technologies} from './radar-data';
import {isVisibleImportance} from './importance';
import {evaluateImportance} from './importance';
import {buildDailyReport} from './daily-report';
import type {IndustryNewsItem} from './industry-news';
import plans from '../data/calendar-plans.json';
import reviewedReports from '../data/reported-briefings.json';
import {validDay,koreaDay} from './search-period';
export type CalendarEntry={id:string;date:string;endDate?:string;precision:'day'|'month'|'quarter'|'year';title:string;company:string;industries:string[];kind:'일정'|'동향'|'논문';status:string;sourceUrl:string;importance:number;published:string;note?:string};
export function datePrecision(date:string):CalendarEntry['precision']|null{
 if(validDay(date))return 'day';
 if(/^20[2-9]\d-(0[1-9]|1[0-2])$/.test(date))return 'month';
 if(/^20[2-9]\d-Q[1-4]$/.test(date))return 'quarter';
 if(/^20[2-9]\d$/.test(date))return 'year';return null;
}
const https=(url:string)=>{try{return new URL(url).protocol==='https:';}catch{return false;}};
export function calendarEntries(updates:IndustryUpdate[],records:RecordItem[],reports:IndustryNewsItem[]=[]):CalendarEntry[]{
 const entries:CalendarEntry[]=[];
 for(const u of updates.filter(isVisibleImportance)){
  for(const [index,m] of (u.milestones||[]).entries()){
   const precision=datePrecision(m.date);
   if(precision&&https(m.sourceUrl)&&u.sources.some(s=>s.url===m.sourceUrl))entries.push({id:u.id+'-goal-'+index,date:m.date,precision,title:m.title,company:u.company,industries:[u.industry],kind:'일정',status:m.status,sourceUrl:m.sourceUrl,importance:evaluateImportance(u)?.stars||0,published:u.published});
  }
 }
 // Reuse the report's event grouping so partners and duplicate articles occupy one calendar item.
 const today=koreaDay(),dates=[...new Set([...updates.map(u=>u.published),...records.map(r=>r.published),...reports.map(r=>r.item.published)])].filter(d=>validDay(d)&&d<=today);
 for(const date of dates){
  const report=buildDailyReport({updates,records,reports,date,industry:'all',watched:new Set()});
  for(const story of report.topics){
   const source=story.sources.find(s=>https(s.url));if(!source)continue;
   entries.push({id:story.id,date,precision:'day',title:story.title,company:story.companies.join(' · '),industries:story.sectors,kind:story.papers.length?'논문':'동향',status:'공개',sourceUrl:source.url,importance:story.importance?.stars||0,published:date});
  }
 }
 for(const plan of plans){
  const precision=datePrecision(plan.date);if(!precision||!https(plan.sourceUrl))continue;
  if('itemId' in plan){
   const item=[...updates,...records].find(i=>i.id===plan.itemId);
   if(!item||!isVisibleImportance(item))continue;
   const urls='sources' in item?item.sources.map(s=>s.url):[item.url];if(!urls.includes(plan.sourceUrl))continue;
   const sectors='industry' in item?[item.industry]:technologies.find(t=>t.id===item.technology)?.industries||[];
   entries.push({...plan,id:plan.itemId+'-planned',precision,company:item.company,industries:sectors,kind:'일정',importance:evaluateImportance(item)?.stars||0,published:item.published});
  }else if('reportedKey' in plan){
   const review=reviewedReports.find(r=>r.key===plan.reportedKey);
   if(!review||review.stars<1||![...review.sources,...review.articles].some(s=>s.url===plan.sourceUrl))continue;
   const company=plan.reportedKey==='intel-ddr4-cpu-2027'?'Intel':'ABB';
   entries.push({...plan,id:review.key+'-planned',precision,company,industries:review.sectors,kind:'일정',importance:review.stars,published:review.articles[0].published});
  }
 }
 return entries.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id)).filter((e,i,a)=>a.findIndex(x=>x.kind===e.kind&&x.id===e.id)===i);
}
/** Limits only calendar presentation, independently for each date/period and industry. */
export function calendarTopEntries(entries:CalendarEntry[],limit=5):CalendarEntry[]{
 const buckets=new Map<string,{entry:CalendarEntry;sector:string}[]>();
 for(const entry of entries)for(const sector of entry.industries.length?entry.industries:['기술·연구']){
  const key=entry.date+'|'+(entry.endDate||'')+'|'+sector;
  buckets.set(key,[...(buckets.get(key)||[]),{entry,sector}]);
 }
 const selected=new Map<string,{entry:CalendarEntry;sectors:Set<string>}>();
 for(const bucket of buckets.values()){
  bucket.sort((a,b)=>b.entry.importance-a.entry.importance||Number(b.entry.kind==='일정')-Number(a.entry.kind==='일정')||b.entry.published.localeCompare(a.entry.published)||a.entry.id.localeCompare(b.entry.id));
  for(const {entry,sector} of bucket.slice(0,limit)){
   const key=entry.id+'|'+entry.date,row=selected.get(key)||{entry,sectors:new Set<string>()};row.sectors.add(sector);selected.set(key,row);
  }
 }
 return [...selected.values()].map(({entry,sectors})=>({...entry,industries:[...sectors]})).sort((a,b)=>calendarBounds(a).from.localeCompare(calendarBounds(b).from)||b.importance-a.importance||a.id.localeCompare(b.id));
}
export function calendarBounds(entry:Pick<CalendarEntry,'date'|'endDate'>){
 function bound(date:string,end:boolean){
  const precision=datePrecision(date);
  if(precision==='day')return date;
  if(precision==='year')return date+(end?'-12-31':'-01-01');
  const month=precision==='quarter'?date.slice(0,4)+'-'+String((Number(date.at(-1))-1)*3+(end?3:1)).padStart(2,'0'):date;
  return month+(end?'-'+String(monthDays(month).days.length).padStart(2,'0'):'-01');
 }
 return {from:bound(entry.date,false),until:bound(entry.endDate||entry.date,true)};
}
export function calendarDateLabel(entry:CalendarEntry){return entry.endDate?entry.date+'~'+entry.endDate+'년':prettyDate(entry.date);}
export function isWatchedEntry(entry:CalendarEntry,watched:ReadonlySet<string>){return entry.company.split(' · ').some(company=>watched.has(company));}
export function monthDays(month:string){
 if(!/^20[2-9]\d-(0[1-9]|1[0-2])$/.test(month))throw Error('유효한 월을 선택해 주세요.');
 const [y,m]=month.split('-').map(Number),first=new Date(Date.UTC(y,m-1,1)),count=new Date(Date.UTC(y,m,0)).getUTCDate();
 return {offset:first.getUTCDay(),days:Array.from({length:count},(_,i)=>month+'-'+String(i+1).padStart(2,'0'))};
}
export function shiftMonth(month:string,offset:number){monthDays(month);const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+offset,1)).toISOString().slice(0,7);}
export function prettyDate(date:string){return /-Q[1-4]$/.test(date)?date.slice(0,4)+'년 '+date.at(-1)+'분기':date.length===4?date+'년':date.length===7?date.slice(0,4)+'년 '+Number(date.slice(5))+'월':date.slice(0,4)+'년 '+Number(date.slice(5,7))+'월 '+Number(date.slice(8))+'일';}
