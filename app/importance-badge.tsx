"use client";
import {useId,useState} from 'react';
import {importanceSchema,evaluateImportance,type Importance,type ImportanceInput} from '@/lib/importance';
import BriefExplanation from './brief-explanation';
export default function ImportanceBadge({importance,item,context,expanded=false,showToggle=true}:{importance?:Importance;item?:ImportanceInput;context?:ImportanceInput;expanded?:boolean;showToggle?:boolean}){
 const [showExplanation,setShowExplanation]=useState(false),id=useId();
 const parsed=importanceSchema.safeParse(item?evaluateImportance({...item,importance:importance||item.importance}):importance);if(!parsed.success||parsed.data.stars===0)return null;importance=parsed.data;
 return <span className="importance"><span className="importance-label">중요도</span><span className="importance-stars" aria-label={'산업 중요도 '+importance.stars+'점, 3점 만점. '+importance.reason} title={importance.reason}>{'★'.repeat(importance.stars)}<span className="importance-empty" aria-hidden="true">{'☆'.repeat(3-importance.stars)}</span></span>{importance.basis==='automatic-content'&&<small className="importance-basis">내용 자동평가</small>}{!expanded&&showToggle&&<button type="button" className="explanation-toggle" aria-label="용어와 효과 해설 보기" aria-controls={id} aria-expanded={showExplanation} onClick={e=>{e.preventDefault();e.stopPropagation();setShowExplanation(v=>!v);}}>해설</button>}{(expanded||showToggle&&showExplanation)&&<BriefExplanation item={context||item||{title:importance.reason}} fallbackEffect={importance.reason} id={id}/>}</span>;
}
