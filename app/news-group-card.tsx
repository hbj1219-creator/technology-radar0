"use client";
import {useState} from 'react';
import {ExternalLink,ChevronDown,Layers3,Bookmark} from 'lucide-react';
import type {NewsGroup} from '@/lib/news-groups';
import type {SearchItem} from '@/lib/search-topics';
import ClassificationTags from './classification-tags';
import ImportanceBadge from './importance-badge';
import {evaluateImportance} from '@/lib/importance';
export default function NewsGroupCard({group,onOpen,onClassify,onSave,isSaved}:{group:NewsGroup;onOpen:(i:SearchItem)=>void;onClassify:(id:string)=>void;onSave:(i:SearchItem)=>void;isSaved:(i:SearchItem)=>boolean}){
 const [expanded,setExpanded]=useState(false),first=group.items[0];
 const importance=group.items.flatMap(item=>{const rating=evaluateImportance(item);return rating?[rating]:[];}).sort((a,b)=>b.stars-a.stars)[0];
 return <article className="news-cluster"><div className="record-top"><span className="tag blue">기사</span><ImportanceBadge importance={importance} context={first}/><span className="meta">{first.source} · {first.published}</span>{group.items.length>1&&<span className="story-count"><Layers3 size={13}/>{group.items.length}개 보도 묶음</span>}<button className={'save '+(isSaved(first)?'active':'')} aria-label={isSaved(first)?'외부 자료 저장 취소':'외부 자료 저장'} onClick={()=>onSave(first)}><Bookmark size={18} fill={isSaved(first)?'currentColor':'none'}/></button></div><a className="record-title original-title" href={first.url} target="_blank" rel="noopener noreferrer">{group.title}<ExternalLink size={15}/></a><div className="record-bottom"><ClassificationTags item={first} onSelect={onClassify} compact/><button className="detail-link" onClick={()=>onOpen(first)}>자료 정보</button>{group.items.length>1&&<button className="detail-link" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>{expanded?'다른 보도 접기':'다른 보도'}<ChevronDown size={15}/></button>}</div>{expanded&&<div className="story-expanded"><p className="source-note">제목·제품명·보도일이 비슷한 자료를 묶었습니다. 같은 사건인지 원문을 확인해 주세요.</p>{group.items.slice(1).map(item=><div className="story-source" key={item.id}><span className="meta">{item.source} · {item.published}</span><h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title} <ExternalLink size={14}/></a></h3><ClassificationTags item={item} onSelect={onClassify}/><div><button className="detail-link" onClick={()=>onOpen(item)}>자료 정보</button><button className="detail-link" onClick={()=>onSave(item)}>{isSaved(item)?'저장 취소':'저장'}</button></div></div>)}</div>}</article>;
}
