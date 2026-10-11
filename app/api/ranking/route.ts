export const runtime='nodejs';
export const maxDuration=60;
import {classifyTechnology} from '@/lib/technology-classifier';
import {validPeriod} from '@/lib/search-period';
import {technologies,industries,technologyGroups} from '@/lib/radar-data';
import {isVisibleImportance} from '@/lib/importance';
import {topicQueries} from '@/lib/search-topics';
import {newsArchive} from '@/lib/external-search';
import {groupNews} from '@/lib/news-groups';
import {rangeFor} from '@/lib/search-period';
const cache=new Map<string,{expires:number;data:unknown}>();
export async function GET(request:Request){
 const p=new URL(request.url).searchParams,industry=p.get('industry')||'all',group=p.get('group')||'all',period=p.get('period')||'30',start=Number(p.get('start')||0);
 if(!['all',...industries].includes(industry)||(group!=='all'&&!technologyGroups.some(g=>g.id===group))||!validPeriod(period)||!Number.isInteger(start)||start<0||start>100)return Response.json({error:'집계 조건을 확인해 주세요.'},{status:400});
 const pool=technologies.filter(t=>(industry==='all'||t.industries.includes(industry))&&(group==='all'||t.group===group)),batch=pool.slice(start,start+(period==='since'?3:6)),key=JSON.stringify([industry,group,period,start,rangeFor(period).today]);
 const hit=cache.get(key);if(hit&&hit.expires>Date.now())return Response.json(hit.data,{headers:{'Cache-Control':'no-store'}});
 const rows=[];for(let i=0;i<batch.length;i+=3){const slice=await Promise.all(batch.slice(i,i+3).map(async t=>{try{const r=await newsArchive(topicQueries[t.id]||t.name,period);const relevant=r.items.filter(isVisibleImportance).filter(x=>classifyTechnology(x).technologies.some(h=>h.id===t.id)),groups=groupNews(relevant);return {id:t.id,name:t.name,category:t.category,articles:relevant.length,stories:groups.length,media:new Set(relevant.map(x=>x.source)).size,status:r.failed?'partial':'ok',evidence:relevant.slice(0,3).map(x=>({title:x.title,url:x.url,source:x.source,published:x.published}))};}catch{return {id:t.id,name:t.name,category:t.category,articles:null,stories:null,media:null,status:'failed',evidence:[]};}}));rows.push(...slice);}
 const data={rows,total:pool.length,checked:start+batch.length,next:start+batch.length<pool.length?start+batch.length:null,range:rangeFor(period),fetchedAt:new Date().toISOString()};
 if(cache.size>=80)cache.delete(cache.keys().next().value!);cache.set(key,{expires:Date.now()+(rows.some(r=>r.status!=='ok')?30000:3600000),data});return Response.json(data,{headers:{'Cache-Control':'no-store'}});
}
