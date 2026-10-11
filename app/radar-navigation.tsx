"use client";
import {useState} from "react";
import {Radar,Search,Bookmark,BarChart3,Sparkles,CalendarDays,Building2,MoreHorizontal,ChevronRight,FileText,Star} from "lucide-react";
import {Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription} from "@/components/ui/sheet";

export const radarNavigation=[
 {id:"report",name:"핵심 리포트",icon:FileText},
 {id:"watchlist",name:"내 관심 동향",icon:Star},
 {id:"overview",name:"기업별 동향",icon:Building2},
 {id:"calendar",name:"달력",icon:CalendarDays},
 {id:"progress",name:"기술·논문",icon:Sparkles},
 {id:"external",name:"자료 검색",icon:Search},
 {id:"ranking",name:"보도량 순위",icon:BarChart3},
 {id:"following",name:"관심 기술",icon:Radar},
 {id:"saved",name:"저장한 자료",icon:Bookmark},
];
export default function RadarNavigation({selected,onSelect,following,saved}:{selected:string;onSelect:(id:string)=>void;following:number;saved:number}){
 const [more,setMore]=useState(false);
 const primaryIds=["report","watchlist","overview","calendar","progress"];
 const primary=radarNavigation.filter(n=>primaryIds.includes(n.id)),secondary=radarNavigation.filter(n=>!primaryIds.includes(n.id));
 const count=(id:string)=>id==="following"?following:id==="saved"?saved:0;
 const choose=(id:string)=>{onSelect(id);setMore(false);window.scrollTo({top:0,behavior:"instant"});};
 return <>
 <nav className="site-nav" aria-label="주 메뉴">{primary.map(n=><button key={n.id} aria-current={selected===n.id?"page":undefined} onClick={()=>choose(n.id)}><n.icon size={20}/>{n.name}</button>)}<button className="nav-more" aria-expanded={more} aria-current={secondary.some(n=>n.id===selected)?"page":undefined} onClick={()=>setMore(true)}><MoreHorizontal size={20}/>{secondary.find(n=>n.id===selected)?.name||"더 보기"}</button></nav>
 <nav className="mobile-nav" aria-label="모바일 주 메뉴">{primary.map(n=><button key={n.id} aria-current={selected===n.id?"page":undefined} onClick={()=>choose(n.id)}><n.icon size={22}/><span>{n.name}</span></button>)}<button aria-expanded={more} aria-current={secondary.some(n=>n.id===selected)?"page":undefined} onClick={()=>setMore(true)}><MoreHorizontal size={22}/><span>더 보기</span></button></nav>
 <Sheet open={more} onOpenChange={setMore}><SheetContent side="bottom" className="radar-menu-sheet"><SheetHeader><SheetTitle>검색과 내 자료</SheetTitle><SheetDescription>원문을 찾고 관심 자료를 모아보세요.</SheetDescription></SheetHeader><div className="radar-menu-links">{secondary.map(n=><button key={n.id} aria-current={selected===n.id?"page":undefined} onClick={()=>choose(n.id)}><n.icon size={21}/><span>{n.name}</span>{count(n.id)>0&&<small>{count(n.id)}</small>}<ChevronRight size={17}/></button>)}</div></SheetContent></Sheet>
 </>;
}
