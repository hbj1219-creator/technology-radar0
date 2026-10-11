import type {ImportanceInput} from '@/lib/importance';
import {shortExplanation} from '@/lib/short-explanation';

export default function BriefExplanation({item,fallbackEffect='',id}:{item:ImportanceInput;fallbackEffect?:string;id?:string}){
 const explanation=shortExplanation(item,fallbackEffect);
 return <span className="brief-explanation" id={id}>{explanation.terms.map(term=><span className="explanation-term" key={term.name}><b>{term.name}</b><span>{term.meaning}</span></span>)}{explanation.application&&<span className="explanation-effect"><b>쓰임</b><span>{explanation.application}</span></span>}<span className="explanation-effect"><b>변화</b><span>{explanation.effect}</span></span></span>;
}
