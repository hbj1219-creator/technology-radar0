export const DATA_START='2026-07-01';
export function koreaDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date());}
export function validDay(day:string){return /^\d{4}-\d{2}-\d{2}$/.test(day)&&!Number.isNaN(Date.parse(day))&&new Date(day).toISOString().slice(0,10)===day;}
export function validPeriod(period:string){return ['1','7','30','since'].includes(period)||(validDay(period)&&period>=DATA_START&&period<=koreaDay())||(/^2026-(0[7-9]|1[0-2])$/.test(period)&&period<=koreaDay().slice(0,7));}
export function searchMonths(){const last=Number(koreaDay().slice(5,7));return Array.from({length:last-6},(_,i)=>'2026-'+String(i+7).padStart(2,'0'));}
export function rangeFor(period:string){const now=koreaDay();if(validDay(period))return {from:period,today:period};if(/^2026-\d{2}$/.test(period)){const [year,month]=period.split('-').map(Number),end=new Date(Date.UTC(year,month,0)).toISOString().slice(0,10);return {from:period+'-01',today:end<now?end:now};}const today=now;const start=period==='since'?DATA_START:new Date(Date.parse(today+'T00:00:00Z')-(Number(period)-1)*86400000).toISOString().slice(0,10);return {from:start<DATA_START?DATA_START:start,today};}
export function inSearchRange(date:string,period:string){const {from,today}=rangeFor(period);return /^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=from&&date<=today;}
