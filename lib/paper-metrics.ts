import type {SearchItem} from './search-topics';
export function isPaper(item:SearchItem){return !['기업 발표','기관 발표','보도'].includes(item.kind);}
export function citationCount(item:SearchItem):number|null{
 const count=item.citations?.count;
 return typeof count==='number'&&Number.isSafeInteger(count)&&count>=0?count:null;
}
export function meetsCitationMinimum(item:SearchItem,minimum:number){const count=citationCount(item);return minimum===0||!isPaper(item)||(count!==null&&count>=minimum);}
export function compareCitations(a:SearchItem,b:SearchItem){
 const ac=citationCount(a),bc=citationCount(b);
 if(ac===null&&bc!==null)return 1;if(bc===null&&ac!==null)return -1;
 return (bc??0)-(ac??0)||b.published.localeCompare(a.published)||a.id.localeCompare(b.id);
}
