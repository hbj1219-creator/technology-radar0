import type {SearchItem} from '@/lib/search-topics';
function Comparison({item}:{item:SearchItem}){
 const c=item.research?.comparison;if(!c)return null;const max=Math.max(c.before.value,c.after.value,1);
 return <figure className="research-comparison"><figcaption>{c.metric} <small>단위: {c.unit}</small></figcaption>{[c.before,c.after].map((row,i)=><div className="comparison-row" key={i}><span>{row.label}</span><div className="comparison-track"><div style={{width:(row.value/max*100)+'%'}}/></div><b>{row.value.toLocaleString('ko-KR')}</b></div>)}<p>{c.context}</p></figure>;
}
export default function PaperOutlook({item,expanded=false}:{item:SearchItem;expanded?:boolean}){
 const r=item.research;if(!r)return null;
 return <div className="paper-outlook"><div className="research-stage"><span>{r.stage}</span><small>원문 {r.readScope} 확인 · {r.checkedAt}</small></div><h3>무엇이 가능해지나</h3><p className="research-possibility">{r.possibility}</p><h4>이번 연구에서 확인한 것</h4><p>{r.demonstrated}</p><Comparison item={item}/>{expanded?<><h4>실제로 쓰려면</h4><p>{r.remaining}</p></>:<details><summary>실제로 쓰려면 무엇이 남았나</summary><p>{r.remaining}</p></details>}<p className="research-timing"><b>적용 시점</b> {r.timing?.text||'미지수 · 원문에서 적용 일정을 확인하지 못했습니다.'}</p><details className="research-original" open={expanded}><summary>논문 근거 · 원제와 원문</summary><a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.originalTitle}</a>{r.doi&&<small>DOI · {r.doi}</small>}{item.abstract&&<p>{item.abstract}</p>}<small>가능성은 연구 결과에 근거한 해설입니다. 연구팀의 검증 범위와 실제 적용은 구분해 읽으세요.</small></details></div>;
}
