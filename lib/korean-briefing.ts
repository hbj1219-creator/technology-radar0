// Small source-metadata vocabulary, not a full-article translation service.
export function plainKorean(text:string){
 return text.replace(/(?<!\()\bhigh[ -]na\s+euv\b/gi,'차세대 미세회로 노광 기술(High NA EUV)')
  .replace(/(?<!\()\bfoundry\b|(?<!\()파운드리(?!\()/gi,'반도체 위탁생산(파운드리)')
  .replace(/\bon[ -]premises?\b|온프레미스/gi,'사내 서버용')
  .replace(/\bphysical ai\b/gi,'현실에서 움직이고 작업하는 AI')
  .replace(/\bhybrid bonding\b|하이브리드\s*본딩/gi,'칩을 직접 붙이는 접합 기술')
  .replace(/\bdram\b/gi,'D램').replace(/\bnand\b/gi,'저장용 메모리(NAND)')
  .replace(/(?<!\()\bhbm([3-9]e?)?\b(?!\()/gi,v=>'AI용 고속 메모리('+v.toUpperCase()+')')
  .replace(/(?<!\()\bssd\b(?!\()/gi,'저장장치(SSD)').replace(/\bmou\b/gi,'협력 양해각서')
  .replace(/\b\d+(?:\.\d+)?nm\b/gi,v=>v.slice(0,-2)+'나노 공정')
  .replace(/\s+/g,' ').trim();
}

export function compactKorean(text:string){
 return plainKorean(text).replace(/(?: 관련 (?:내용|소식)(?:이|은)?| 내용이)?\s*보도(?:됐습니다|되었습니다|됐다|되었다)[.!。]?$/,'')
  .replace(/(?:을|를)\s*발표(?:했습니다|했다)[.!。]?$/,' 발표')
  .replace(/\s*(?:발표했습니다|발표했다|발표한다고 밝혔다|발표한다고 밝혔습니다)[.!。]?$/,' 발표')
  .replace(/\s*(?:추진한다고 밝혔습니다|추진한다고 밝혔다|추진합니다|추진한다)[.!。]?$/,' 추진')
  .replace(/\s*(?:계획했습니다|계획했다|계획합니다|계획한다)[.!。]?$/,' 계획')
  .replace(/\s*(?:공개했습니다|공개했다)[.!。]?$/,' 공개')
  .replace(/[.。]$/,'').trim();
}

export function headlineAmount(title:string){
 const kr=title.match(/(?:약\s*)?\d[\d,.]*\s*(?:조|억|만)\s*(?:달러|원)/)?.[0];if(kr)return kr.replace(/\s+/g,'');
 const us=title.match(/(?:US\$|USD\s*|\$)(\d[\d,.]*)\s*(trillion|billion|million)\b/i);
 if(!us)return '';
 const n=Number(us[1].replaceAll(',',''));if(!Number.isFinite(n))return '';
 const unit=us[2].toLowerCase();return unit==='trillion'?`${n}조 달러`:unit==='billion'?`${Number((n*10).toFixed(3))}억 달러`:n>=100?`${Number((n/100).toFixed(3))}억 달러`:`${Number((n*100).toFixed(3))}만 달러`;
}
