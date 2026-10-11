export const runtime='nodejs';
export const maxDuration=60;
import {validPeriod} from '@/lib/search-period';
import {getSearch} from '@/lib/search-service';
import {evaluateImportance,isVisibleImportance} from '@/lib/importance';
export async function GET(request:Request){
 const params=new URL(request.url).searchParams,q=(params.get('q')||'').trim(),provider=params.get('provider')||'all',page=Number(params.get('page')||0),period=params.get('period')||'since',sort=params.get('sort')||'relevance',cursor=params.get('cursor')||'*',minCitations=Number(params.get('minCitations')||0);
 if(cursor.length>4096||q.length<2||q.length>160||!['all','papers','corpus','crossref','arxiv','europepmc','news','company'].includes(provider)||!Number.isInteger(page)||page<0||page>1000||!validPeriod(period)||!['relevance','date','citations'].includes(sort)||!Number.isSafeInteger(minCitations)||minCitations<0||minCitations>100000)return Response.json({error:'검색 조건을 확인해 주세요.'},{status:400});
 try{const result=await getSearch(provider,q,page,period,sort,cursor,minCitations);return Response.json({...result,items:result.items.map(item=>({...item,importance:evaluateImportance(item)})).filter(isVisibleImportance)},{headers:{'Cache-Control':'no-store'}});}catch(e){console.error('External search failed:',provider,e instanceof Error?e.message:'unknown');return Response.json({error:e instanceof Error?e.message:'외부 검색에 실패했습니다. 다른 출처로 검색해 주세요.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
