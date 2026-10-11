import {reportsFor} from '@/lib/snapshot-store';
import {industries} from '@/lib/radar-data';
import {companyWatchlist} from '@/lib/industry-update';
import {validPeriod} from '@/lib/search-period';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const p=new URL(request.url).searchParams,industry=p.get('industry')||'반도체',company=p.get('company')||'all',period=p.get('period')||'since';
 const companies=(industry==='all'?Object.values(companyWatchlist).flat():companyWatchlist[industry]||[]).map(c=>c.name);
 if(!['all',...industries].includes(industry)||!validPeriod(period)||(company!=='all'&&!companies.includes(company)))return Response.json({error:'동향 조건을 확인해 주세요.'},{status:400});
 const items=reportsFor(industry,company,period);
 return Response.json({items,scanned:items.length,available:items.length,nextCursor:null},{headers:{'Cache-Control':'no-store'}});
}
