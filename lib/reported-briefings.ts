import saved from '../data/reported-briefings.json';
import type {ImportanceInput} from './importance';

export type ReportedBriefing={key:string;headline:string;application:string;effect:string;label:'호재'|'악재'|'미지수';reason:string;stars:number;sectors:string[];articles:{id:string;title:string;url:string;published:string}[];sources:{title:string;url:string;kind:string}[]};
const reviews=saved as ReportedBriefing[];
export const reportedArticleIds=[...new Set(reviews.flatMap(review=>review.articles.map(a=>a.id)))];
const normalize=(title:string)=>title.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
/** Bind editorial content to its original evidence, never to a company or a broad topic alone. */
export function reportedBriefing(item:ImportanceInput&{published?:string}):ReportedBriefing|undefined{
 const urls=[item.url,...(item.sources||[]).map(s=>s.url)].filter(Boolean);
 // Stored titles still include the publisher suffix; list titles have it removed.
 // Compare both forms without stripping a meaningful subtitle from the review.
 const titles=[item.title,item.title.replace(/\s[-|]\s[^-|]{2,60}$/,'')].map(normalize);
 return reviews.find(review=>review.articles.some(a=>titles.includes(normalize(a.title))&&(urls.includes(a.url)||item.published===a.published)));
}
export function canonicalArticleUrl(url:string){
 try{const u=new URL(url);const target=u.searchParams.get('url');if(/(?:^|\.)bing\.com$/.test(u.hostname)&&u.pathname.includes('apiclick')&&target)return canonicalArticleUrl(target);
 for(const key of [...u.searchParams.keys()])if(/^(?:utm_|oc$|ref$|fbclid$|gclid$)/i.test(key))u.searchParams.delete(key);
 u.hash='';return u.href.replace(/\/$/,'');}catch{return url;}
}
