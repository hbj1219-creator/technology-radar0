"use client";
import {useEffect,useState} from 'react';
import {validDay} from '@/lib/search-period';

export function useReportDates(industry:string,enabled:boolean){
 const [retry,setRetry]=useState(0),[state,setState]=useState({industry:'',dates:[] as string[],loading:true,error:''});
 useEffect(()=>{
  if(!enabled)return;
  const abort=new AbortController();
  setState(previous=>({industry,dates:previous.industry===industry?previous.dates:[],loading:previous.industry!==industry||!previous.dates.length,error:''}));
  (async()=>{
   const response=await fetch('/api/report-dates?'+new URLSearchParams({industry}),{signal:abort.signal,cache:'no-store'});
   const result=await response.json() as {dates?:string[];error?:string};
   if(!response.ok||!Array.isArray(result.dates))throw Error(result.error||'소식이 있는 날짜를 불러오지 못했습니다.');
   if(!abort.signal.aborted)setState({industry,dates:result.dates.filter(validDay),loading:false,error:''});
  })().catch(e=>{if(!abort.signal.aborted)setState({industry,dates:[],loading:false,error:e instanceof Error?e.message:'날짜를 불러오지 못했습니다.'});});
  return ()=>abort.abort();
 },[industry,enabled,retry]);
 const current=state.industry===industry?state:{industry,dates:[],loading:true,error:''};
 return {...current,refresh:()=>setRetry(r=>r+1)};
}
