import {companyWatchlist} from './industry-update';
import {classifyTechnology} from './technology-classifier';
import type {SearchItem} from './search-topics';
import {isVisibleImportance} from './importance';
import {isNonTechnologyNews,hasTechnicalContent} from './technology-relevance';

const aliases:Record<string,string[]>={
 '삼성전자':['삼성전자','Samsung Electronics','Samsung','삼성'], 'SK하이닉스':['SK하이닉스','SK 하이닉스','하이닉스','SK hynix'],
 TSMC:['TSMC','台積電'],NVIDIA:['NVIDIA','엔비디아'],AMD:['AMD','어드밴스드 마이크로'],Intel:['Intel','인텔'],Micron:['Micron','마이크론'],ASML:['ASML'],
 'Applied Materials':['Applied Materials','어플라이드 머티어리얼즈'], 'Lam Research':['Lam Research','램리서치','램 리서치'],
 Microsoft:['Microsoft','마이크로소프트'],Google:['Google','구글'],OpenAI:['OpenAI','오픈AI','오픈에이아이'],Anthropic:['Anthropic','앤트로픽'],Meta:['Meta','메타'],
 Toyota:['Toyota','도요타','토요타'],Volkswagen:['Volkswagen','폭스바겐'],'현대자동차':['현대자동차','현대차','Hyundai'],Tesla:['Tesla','테슬라'],BYD:['BYD','비야디'],BMW:['BMW'],
 CATL:['CATL','닝더스다이'],'LG에너지솔루션':['LG에너지솔루션','LG Energy Solution'],'First Solar':['First Solar','퍼스트솔라'],Vestas:['Vestas','베스타스'],'GE Vernova':['GE Vernova','GE버노바','GE 버노바'],'Siemens Energy':['Siemens Energy','지멘스에너지','지멘스 에너지'],
 ABB:['ABB'],FANUC:['FANUC','화낙','파낙'],Yaskawa:['Yaskawa','야스카와'],Siemens:['Siemens','지멘스'],'Boston Dynamics':['Boston Dynamics','보스턴다이내믹스','보스턴 다이내믹스'],'Figure AI':['Figure AI','피규어 AI','피규어AI'],
 Roche:['Roche','로슈'],Novartis:['Novartis','노바티스'],'Eli Lilly':['Eli Lilly','일라이릴리','일라이 릴리'],'Novo Nordisk':['Novo Nordisk','노보노디스크','노보 노디스크'],Merck:['Merck','머크'],'삼성바이오로직스':['삼성바이오로직스','Samsung Biologics'],
 BASF:['BASF','바스프'],Dow:['Dow','다우케미칼'],'LG화학':['LG화학','LG Chem'],DuPont:['DuPont','듀폰'],Toray:['Toray','도레이'],'포스코퓨처엠':['포스코퓨처엠','POSCO Future M'],
 SpaceX:['SpaceX','스페이스X','스페이스엑스'],'Blue Origin':['Blue Origin','블루오리진','블루 오리진'],Airbus:['Airbus','에어버스'],Ericsson:['Ericsson','에릭슨'],Nokia:['Nokia','노키아'],Qualcomm:['Qualcomm','퀄컴']
};
export const companyTerms=(name:string)=>aliases[name]||[name];
export const cleanNewsTitle=(title:string)=>title.replace(/\s[-|]\s[^-|]{2,60}$/,'').trim();
function mentions(title:string,term:string){const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s*');return new RegExp((/^[a-z]/i.test(term)?'(?<![a-z0-9])':'')+escaped+(/[a-z0-9]$/i.test(term)?'(?![a-z0-9])':''),'iu').test(title);}
const finance=/주가|목표가|목표주가|투자의견|상한가|하한가|급등주|급락주|주식시장|종목|증시|매수\s*추천|매도\s*추천|stock price|price target|stock market|shares (?:rise|fall|surge)|stocks?\b|investors|investing|deep money talk|코스피|코스닥|시총|차익실현/i;
const earnings=/경제시평|사설|성과급|임직원.*보너스|special (?:bonus|performance pay)|employees.*(?:pay|bonus)|performance pay|실적|영업이익|영업익|순이익|성과급|earnings|profit|pay,? threatens|record figures/i;
const promotion=/할인|경품|사은품|쿠폰|특가|프로모션|구매\s*혜택|할인행사|cashback|giveaway|discount|coupon/i;
const production=/양산|생산|수율|공급|출하|공장|라인\s*가동|production|manufactur|shipment|supply|yield|factory|fab\b/i;
const investment=/투자|증설|시설|설비|인수|매각|철수|사업\s*축소|investment|invests?\b|capex|expan|acqui|divest/i;
const cooperation=/협력|협약|계약|수주|파트너|동맹|partnership|collaborat|agreement|contract|deal\b/i;
const technology=/개발|기술|공정|출시|공개|샘플|칩|메모리|파운드리|HBM|DRAM|NAND|DDR|GDDR|LPDDR|노드|나노|트랜지스터|techno|develop|launch|unveil|chip|memory|foundry|semiconductor|processor|nanomet|transistor/i;
export type IndustryNewsItem={company:string;category:string;item:SearchItem};
export type IndustryNewsPage={items:IndustryNewsItem[];scanned:number;available:number;nextCursor:string|null};
// Attribution and relevance use article metadata, never its collection/search query.
export function selectIndustryNews(item:SearchItem,industry:string,company='all'):IndustryNewsItem[]{
 if(isNonTechnologyNews(item.title)||!hasTechnicalContent(item)||!isVisibleImportance(item))return [];
 const title=cleanNewsTitle(item.title);if(finance.test(title)||promotion.test(title))return [];
 if(earnings.test(title)&&!production.test(title)&&!investment.test(title)&&!cooperation.test(title))return [];
 const classification=classifyTechnology({...item,title});
 const selected=industry==='all'?Object.entries(companyWatchlist):Object.entries(companyWatchlist).filter(([key])=>key===industry);
 const category=cooperation.test(title)?'협력·계약':investment.test(title)?'투자·사업':production.test(title)?'생산·공급':'기술 변화';
 if(!cooperation.test(title)&&!investment.test(title)&&!production.test(title)&&!technology.test(title)&&classification.status==='unclassified')return [];
 return [...new Set(selected.flatMap(([sector,companies])=>{
  if(!classification.industries.includes(sector)&&!(sector==='반도체'&&technology.test(title)&&/반도체|칩|메모리|파운드리|HBM|DRAM|NAND|DDR|GDDR|LPDDR|나노|semiconductor|chip|memory|foundry|processor|transistor/i.test(title)))return [];
  return companies.filter(c=>(company==='all'||c.name===company)&&companyTerms(c.name).some(term=>mentions(title,term))).filter(c=>{
   if(c.name==='삼성전자'&&!/삼성전자|Samsung Electronics/i.test(title)&&/삼성\s*(?:바이오|전기|디스플레이|SDI|SDS|물산|중공업|생명|증권)|Samsung (?:Biologics|Electro.Mechanics|Display|SDI|SDS|Heavy)/i.test(title))return false;
   if(c.name==='Siemens'&&/Siemens Energy|지멘스\s*에너지/i.test(title)&&!/제조|자동화|manufactur|automation/i.test(title))return false;
   return true;
  }).map(c=>c.name);
 }))].map(name=>({company:name,category,item:{...item,title,classification}}));
}
