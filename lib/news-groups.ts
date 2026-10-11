import type {SearchItem} from './search-topics';
export type NewsGroup={id:string;title:string;items:SearchItem[];sources:number;additional:{item:SearchItem;text:string}[]};
function normalized(title:string){return title.toLowerCase().replace(/\s[-|]\s[^-|]{2,28}$/,'').replace(/삼성전자/g,'삼성').replace(/엔비디아/g,'nvidia').replace(/구글/g,'google').replace(/현대자동차/g,'현대차').replace(/[“”‘’"'()[\]<>]/g,' ').replace(/[^\p{L}\p{N}\s.-]/gu,' ').replace(/\s+/g,' ').trim();}
function tokens(title:string){return new Set(normalized(title).split(/[\s.-]+/).filter(w=>w.length>1&&!['the','and','for','with','from','new','says','announces','news','최초','세계','공개','출시','발표','한다','위한','대한','새로운'].includes(w)));}
function productIds(title:string){return [...normalized(title).matchAll(/\b[a-z]+[ -]?\d+[a-z\d.-]*\b/g)].map(x=>x[0].replace(/[ -]/g,''));}
export function sameStory(a:SearchItem,b:SearchItem){
 if(!a.published||!b.published||Math.abs(Date.parse(a.published)-Date.parse(b.published))>3*86400000)return false;
 if(normalized(a.title)===normalized(b.title))return true;
 const ap=productIds(a.title),bp=productIds(b.title);if(ap.length&&bp.length&&!ap.some(x=>bp.includes(x)))return false;
 const an=normalized(a.title).replaceAll(' ',''),bn=normalized(b.title).replaceAll(' ','');const companies=['삼성','nvidia','google','현대차','bmw','sk하이닉스','openai'];const events=[['양산','massproduction','production'],['출시','launch'],['협력','partnership','협약'],['인수','acquire','acquisition'],['실적','earnings']];if(ap.some(x=>bp.includes(x))&&companies.some(x=>an.includes(x)&&bn.includes(x))&&events.some(words=>words.some(x=>an.includes(x))&&words.some(x=>bn.includes(x))))return true;
 const x=tokens(a.title),y=tokens(b.title),overlap=[...x].filter(w=>y.has(w)).length;
 return overlap>=3&&overlap/Math.min(x.size,y.size)>=0.72&&overlap/(x.size+y.size-overlap)>=0.44;
}
export function groupNews(items:SearchItem[]):NewsGroup[]{
 const groups:NewsGroup[]=[];
 for(const item of items){let group=groups.find(g=>g.items.every(other=>sameStory(item,other)));if(!group){group={id:item.id,title:item.title,items:[],sources:0,additional:[]};groups.push(group);}group.items.push(item);}
 for(const group of groups){group.sources=new Set(group.items.map(i=>i.source)).size;const seen:string[]=[];group.additional=group.items.flatMap(item=>{const sentences=(item.abstract||'').split(/(?<=[.!?。])\s+/).map(s=>s.trim()).filter(s=>s.length>35&&s.length<700);const unique=sentences.filter(s=>{const n=normalized(s);if(seen.some(x=>x===n))return false;seen.push(n);return true;});return unique.slice(0,2).map(text=>({item,text}));});}
 return groups;
}
