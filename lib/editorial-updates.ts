import corrections from '../data/editorial-update-corrections.json';
import type {IndustryUpdate} from './industry-update';

/** Source-matched editorial corrections survive refreshes of the stored report. */
export function applyEditorialCorrection<T extends {id:string;sources?:{url:string}[]}>(item:T):T {
 const correction=(corrections as Record<string,Partial<IndustryUpdate>&{sourceUrl:string}>)[item.id];
 if(!correction||!item.sources?.some(s=>s.url===correction.sourceUrl))return item;
 const {sourceUrl,...copy}=correction;
 return {...item,...copy};
}
