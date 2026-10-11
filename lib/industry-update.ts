import {z} from "zod";
import {industries, technologies} from "./radar-data";
import {importanceSchema} from "./importance";
import {koreaDay} from "./search-period";

const text=z.string().trim().min(1).max(1600);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v&&v<=koreaDay());
const source=z.object({title:text,url:z.string().url().refine(v=>new URL(v).protocol==="https:"),published:date.refine(v=>v>="2026-07-01"),kind:z.enum(["기업 공식 발표","언론 보도","논문","특허 원문","공시"])});
const koreanBrief=z.string().trim().min(1).max(240).refine(v=>/[가-힣]/.test(v),"요약과 영향 설명은 한국어로 작성해 주세요.");
export const industryUpdateSchema=z.object({
 id:z.string().min(1).max(150),industry:z.string().refine(v=>industries.includes(v)),company:text,
 type:z.enum(["strategy","technology"]),title:text,
 technologyName:text.nullable(),technologyIds:z.array(z.string().refine(v=>technologies.some(t=>t.id===v))).max(10),
 published:date.refine(v=>v>="2026-07-01"),checkedAt:date,
 direction:z.enum(["투자 확대","사업 축소","방향 전환","제품 집중","판단 보류"]),
 stage:text,before:text.nullable(),after:text,facts:z.array(text).min(1).max(6),
 interpretation:text,why:text,next:text,limitations:z.array(text).min(1).max(5),sources:z.array(source).min(1).max(6),
 // Optional source-reviewed Korean copy. Older analyses remain valid. No inferred impact fallback.
 briefing:z.object({headline:koreanBrief,narrative:z.string().trim().min(1).max(600).refine(v=>/[가-힣]/.test(v)).optional(),impact:z.object({text:koreanBrief,status:z.enum(["목표","전망","결과"]),sourceUrl:z.string().url()}).optional()}).optional(),
 // Editorial interpretation of this company's business impact, separate from source statements.
 milestones:z.array(z.object({date:z.string().regex(/^20[2-9]\d(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/).refine(v=>v.length<10||!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v),title:koreanBrief,status:z.enum(["목표","예정","확정"]),sourceUrl:z.string().url()})).max(5).optional(),
 importance:importanceSchema.optional(),
 assessment:z.object({label:z.enum(["호재","악재","미지수","아직 불확실"]).transform(v=>v==="아직 불확실"?"미지수" as const:v),reason:koreanBrief,sourceUrls:z.array(z.string().url()).min(1).max(6)}).optional()
}).superRefine((v,ctx)=>{
 if(v.checkedAt<v.published)ctx.addIssue({code:z.ZodIssueCode.custom,message:"확인일은 공개일 이후여야 합니다.",path:["checkedAt"]});
 if(!v.sources.some(s=>s.published===v.published))ctx.addIssue({code:z.ZodIssueCode.custom,message:"공개일을 뒷받침하는 원문이 필요합니다.",path:["sources"]});
 if(v.type==="technology"&&!v.technologyName)ctx.addIssue({code:z.ZodIssueCode.custom,message:"기술명이 필요합니다.",path:["technologyName"]});
 if(v.briefing?.impact&&!v.sources.some(s=>s.url===v.briefing!.impact!.sourceUrl))ctx.addIssue({code:z.ZodIssueCode.custom,message:"영향 설명을 뒷받침하는 출처를 sources에 포함해 주세요.",path:["briefing","impact","sourceUrl"]});
 if(v.milestones?.some(m=>!v.sources.some(s=>s.url===m.sourceUrl)))ctx.addIssue({code:z.ZodIssueCode.custom,message:"일정 근거를 sources에 포함해 주세요.",path:["milestones"]});
 if(v.importance?.sourceUrls.some(url=>!v.sources.some(s=>s.url===url)))ctx.addIssue({code:z.ZodIssueCode.custom,message:"산업 중요도 근거를 sources에 포함해 주세요.",path:["importance","sourceUrls"]});
 if(v.assessment?.sourceUrls.some(url=>!v.sources.some(s=>s.url===url)))ctx.addIssue({code:z.ZodIssueCode.custom,message:"사업 영향 판단을 뒷받침하는 출처를 sources에 포함해 주세요.",path:["assessment","sourceUrls"]});
});
export type IndustryUpdate=z.infer<typeof industryUpdateSchema>;

// Representative companies by value-chain role, never a market-share ranking.
export const companyWatchlist:Record<string,{name:string;role:string}[]>={
 "반도체":[["삼성전자","메모리·파운드리"],["SK하이닉스","메모리"],["TSMC","파운드리"],["NVIDIA","AI 반도체 설계"],["AMD","CPU·GPU 설계"],["Intel","설계·제조"],["Micron","메모리"],["ASML","노광 장비"],["Applied Materials","공정 장비"],["Lam Research","식각·증착 장비"]].map(([name,role])=>({name,role})),
 "AI·소프트웨어":[["NVIDIA","AI 인프라"],["Microsoft","클라우드·AI"],["Google","AI·클라우드"],["OpenAI","AI 모델"],["Anthropic","AI 모델"],["Meta","AI 모델"]].map(([name,role])=>({name,role})),
 "자동차·모빌리티":[["Toyota","완성차"],["Volkswagen","완성차"],["현대자동차","완성차"],["Tesla","전기차"],["BYD","전기차·배터리"],["BMW","완성차"]].map(([name,role])=>({name,role})),
 "에너지":[["CATL","배터리"],["LG에너지솔루션","배터리"],["First Solar","태양광"],["Vestas","풍력"],["GE Vernova","전력 장비"],["Siemens Energy","전력 장비"]].map(([name,role])=>({name,role})),
 "로봇·제조":[["ABB","산업 자동화"],["FANUC","산업 로봇"],["Yaskawa","산업 로봇"],["Siemens","산업 자동화"],["Boston Dynamics","로봇"],["Figure AI","휴머노이드"]].map(([name,role])=>({name,role})),
 "바이오·의료":[["Roche","의약·진단"],["Novartis","의약"],["Eli Lilly","의약"],["Novo Nordisk","의약"],["Merck","의약"],["삼성바이오로직스","위탁생산"]].map(([name,role])=>({name,role})),
 "소재·화학":[["BASF","화학·소재"],["Dow","화학·소재"],["LG화학","화학·소재"],["DuPont","첨단 소재"],["Toray","복합 소재"],["포스코퓨처엠","배터리 소재"]].map(([name,role])=>({name,role})),
 "우주·통신":[["SpaceX","발사·위성"],["Blue Origin","우주"],["Airbus","우주·항공"],["Ericsson","통신 장비"],["Nokia","통신 장비"],["Qualcomm","무선 반도체"]].map(([name,role])=>({name,role}))
};
