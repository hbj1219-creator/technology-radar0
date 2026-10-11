import {records,updates,reportsFor} from '@/lib/snapshot-store';
import {industries} from '@/lib/radar-data';
import {dailyReportDates} from '@/lib/daily-report';
import {koreaDay} from '@/lib/search-period';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const industry=new URL(request.url).searchParams.get('industry')||'all';
 if(!['all',...industries].includes(industry))return Response.json({error:'산업을 확인해 주세요.'},{status:400});
 return Response.json({dates:dailyReportDates(updates,records,koreaDay(),reportsFor(industry),industry)},{headers:{'Cache-Control':'no-store'}});
}
