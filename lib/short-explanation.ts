import effects from '../data/short-explanations.json';
import type {ImportanceInput} from './importance';
import {reportedBriefing} from './reported-briefings';

export type BriefExplanation={terms:{name:string;meaning:string;sourceUrl?:string}[];application?:string;effect:string};
const intelSecurity='https://www.intel.com/content/www/us/en/support/articles/000097227/processors/intel-xeon-processors.html';
const samsung3d='https://semiconductor.samsung.com/news-events/tech-blog/samsung-presents-its-vision-for-next-generation-ai-infrastructure-with-3d-memory-architecture-at-fms-2026/';
const electrolysis='https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis';
const bmwBattery='https://www.press.bmwgroup.com/global/article/detail/T0461032EN/series-production-gets-underway:-bmw-group-officially-opens-plant-irlbach-strasskirchen';
type SavedExplanation={effect:string;application?:string;headline?:string;termNames?:string[];sourceUrls:string[]};
function savedExplanation(item:ImportanceInput){
 const saved=(effects as Record<string,SavedExplanation>)[item.id||''];
 const urls=[item.url,...(item.sources||[]).map(s=>s.url)].filter(Boolean);
 return saved&&saved.sourceUrls.some(url=>urls.includes(url))?saved:undefined;
}
export function readableHeadline(item:ImportanceInput&{briefing?:{headline?:string}}){return savedExplanation(item)?.headline||item.briefing?.headline||item.title;}
const glossary:{name:string;match:RegExp;meaning:string;sourceUrl?:string}[]=[
 {name:'PEM',match:/\bPEM\b/i,meaning:'양전하를 띤 수소 입자가 지나는 막을 써서 물을 전기로 수소·산소로 나누는 방식.',sourceUrl:electrolysis},
 {name:'AEM',match:/\bAEM\b/i,meaning:'음전하를 띤 입자가 지나는 막을 써서 물을 전기로 수소·산소로 나누는 방식.',sourceUrl:'https://enapter.com/en/aem-by-enapter-electrolysis/'},
 {name:'SOEC',match:/\bSOEC\b/i,meaning:'고온의 수증기를 전기와 세라믹 막으로 수소·산소로 나누는 장치.',sourceUrl:electrolysis},
 {name:'수전해',match:/수전해|electrolysis|electroly[sz]/i,meaning:'물에 전기를 가해 수소와 산소로 나누는 과정.',sourceUrl:electrolysis},
 {name:'스택',match:/(?:PEM|AEM|수전해|연료전지).{0,15}스택|electroly[sz]er stacks?/i,meaning:'수소·산소를 만드는 작은 반응 장치를 여러 장 겹쳐 놓은 묶음.',sourceUrl:electrolysis},
 {name:'Gen6',match:/\bGen6\b/i,meaning:'BMW의 6세대 전기차 구동 기술. 이 소식은 그 배터리 생산에 관한 내용.',sourceUrl:bmwBattery},
 {name:'셀투팩',match:/셀투팩|cell.to.pack/i,meaning:'작은 배터리를 중간 묶음 없이 큰 배터리 팩에 바로 넣는 설계.',sourceUrl:bmwBattery},
 {name:'포토마스크',match:/포토마스크|photomask|(?:12인치|대형|6인치)\s*마스크/i,meaning:'반도체에 새길 회로 모양이 담긴 원판. 빛으로 이 모양을 옮겨 새김.',sourceUrl:'https://pr.cld.tsmc.com/english/news/3338'},
 {name:'패키징',match:/패키징|packaging/i,meaning:'반도체 칩을 보호하고 다른 부품과 연결해 쓸 수 있게 만드는 조립 과정.',sourceUrl:'https://www.intel.com/content/www/us/en/newsroom/tech101/explaining-common-chip-terms.html'},
 {name:'GLYTHERMIN DC PG25',match:/GLYTHERMIN|\bPG25\b/i,meaning:'BASF의 서버 냉각액. 칩에 닿은 금속판 안으로 흘러 열을 옮김.',sourceUrl:'https://www.basf.com/global/en/media/news-releases/2026/10/p-26-162'},
 {name:'단상 액체냉각',match:/단상\s*액체|single.phase/i,meaning:'액체가 끓어 기체로 바뀌지 않고 흐르면서 열을 옮기는 냉각 방식.',sourceUrl:'https://www.basf.com/global/en/media/news-releases/2026/10/p-26-162'},
 {name:'BC-MPC',match:/BC[\s-]*MPC/i,meaning:'위성과 교신이 안 된 결과도 반영해 안테나의 다음 탐색 방향을 고르는 방법.',sourceUrl:'https://arxiv.org/abs/2610.07300'},
 {name:'RAG',match:/\bRAG\b|AutoRAG/i,meaning:'AI가 관련 문서를 먼저 찾아 읽고 그 내용을 바탕으로 답하는 방식.',sourceUrl:'https://arxiv.org/abs/2610.08452'},
 {name:'온프레미스',match:/온프레미스|on.premises?/i,meaning:'외부 서비스 대신 회사 안의 서버에 직접 설치해 운영하는 방식.'},
 {name:'양자컴퓨팅',match:/양자\s*컴퓨팅|quantum computing/i,meaning:'아주 작은 입자의 양자 성질을 이용해 정보를 처리하는 계산 방식.',sourceUrl:'https://www.ibm.com/kr-ko/think/topics/quantum-computing'},
 {name:'MHz',match:/\bMHz\b/i,meaning:'전파의 진동수나 주파수 범위의 폭을 나타내는 단위. 1MHz는 초당 100만 번.'},
 {name:'리뷰 논문',match:/리뷰|systematic review|literature review/i,meaning:'여러 기존 연구를 모아 결과와 한계를 비교한 논문. 새 실험과는 다름.'},
 {name:'Atlas',match:/\bAtlas\b/i,meaning:'Boston Dynamics가 산업 작업용으로 만드는 사람형 로봇.'},
 {name:'VLA',match:/\bVLA\b/i,meaning:'카메라 영상과 말로 된 지시를 읽고 로봇의 동작을 만드는 AI 모델.'},
 {name:'촉매',match:/촉매|catalyst/i,meaning:'화학 반응이 더 잘 일어나도록 돕는 재료.'},
 {name:'CeO₂–IrO₂',match:/CeO[₂2].{0,3}IrO[₂2]/i,meaning:'세륨 산화물과 이리듐 산화물을 조합한 재료. 이 연구는 물 분해 반응에 사용.'},
 {name:'블랙매스',match:/블랙매스|black mass/i,meaning:'폐배터리를 처리해 얻은 검은 가루. 유용한 금속을 다시 꺼내는 원료.',sourceUrl:'https://www.basf.com/global/en/media/news-releases/2026/04/p-26-056'},
 {name:'양극재',match:/양극재/i,meaning:'배터리의 양극에 쓰는 재료. 저장할 수 있는 전기량과 전압에 영향을 줌.'},
 {name:'저전도 냉각수',match:/저전도\s*냉각수/i,meaning:'열을 옮기면서 전기는 잘 통하지 않도록 만든 냉각액.'},
 {name:'열관리',match:/열관리|온도 제어/i,meaning:'냉각과 가열로 장치의 온도를 알맞은 범위에 유지하는 기술.'},
 {name:'페로브스카이트·탠덤',match:/페로브스카이트|탠덤|perovskite|tandem/i,meaning:'빛을 전기로 바꾸는 페로브스카이트 재료와 실리콘을 겹쳐 빛을 더 활용하는 태양전지.',sourceUrl:'https://www.energy.gov/cmei/systems/perovskite-solar-cells'},
 {name:'3차원 세계 모델',match:/3차원\s*세계|3D world|world model/i,meaning:'행동한 뒤 주변 공간과 물체가 어떻게 달라질지 예측하는 AI 모델.'},
 {name:'트랜지스터',match:/트랜지스터|transistor/i,meaning:'전류를 켜고 끄거나 조절하는 아주 작은 반도체 부품.'},
 {name:'DDR4',match:/\bDDR4\b/i,meaning:'PC가 작업 중 데이터를 임시로 저장하는 램의 4세대 규격.',sourceUrl:'https://semiconductor.samsung.com/dram/ddr/ddr4/'},
 {name:'DDR5',match:/\bDDR5\b/i,meaning:'DDR4 다음 세대의 램 규격. DDR4용 슬롯과 호환되지 않음.'},
 {name:'LPDDR',match:/\bLPDDR[4-6][xX]?\b/i,meaning:'휴대 기기의 전력 소비를 줄이도록 만든 램 규격.'},
 {name:'GDDR',match:/\bGDDR[5-7][xX]?\b/i,meaning:'그래픽·병렬 연산용 칩에 데이터를 공급하는 메모리 규격.'},
 {name:'AI 에이전트',match:/AI\s*에이전트|(?:AI\s*)?agent(?:ic)?\b/i,meaning:'목표에 맞춰 도구를 실행하며 여러 단계의 일을 처리하는 AI.'},
 {name:'Gemini',match:/Gemini|제미나이/i,meaning:'Google의 AI 모델·서비스 이름.'},
 {name:'Haiku',match:/Haiku|하이쿠/i,meaning:'Anthropic의 빠르고 비용이 낮은 소형 AI 모델 계열.'},
 {name:'RTX Spark',match:/RTX\s*(?:Spark|스파크)/i,meaning:'NVIDIA가 Windows PC의 AI 실행용으로 만든 연산 칩.',sourceUrl:'https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/'},
 {name:'DGX Station',match:/DGX\s*(?:Station|스테이션)/i,meaning:'큰 AI 모델을 책상 옆에서 실행하는 NVIDIA 컴퓨터.'},
 {name:'ISAC',match:/\bISAC\b|Integrated Sensing and Communications?/i,meaning:'통신용 전파로 데이터를 보내면서 주변 물체도 감지하는 기술.'},
 {name:'6G',match:/\b6G\b/i,meaning:'5G 다음 세대의 이동통신. 아직 상용화된 표준은 아님.'},
 {name:'BIOS',match:/\bBIOS\b/i,meaning:'PC 시작 때 부품을 초기화하고 운영체제를 실행하는 기본 프로그램.'},
 {name:'CNC',match:/\bCNC\b/i,meaning:'컴퓨터 명령으로 공작기계의 움직임을 제어하는 방식.'},
 {name:'AMD Ross',match:/AMD\s*Ross|\bRoss\b/i,meaning:'AMD의 설계 도구를 다루고 오류 분석을 돕는 개발 보조 AI.'},
 {name:'Direct-to-Cell',match:/direct.to.cell|위성\s*직접\s*통신/i,meaning:'위성이 별도 안테나 없이 일반 휴대전화와 직접 통신하는 방식.'},
 {name:'휴머노이드',match:/휴머노이드|humanoid/i,meaning:'사람과 비슷한 몸 구조로 움직이는 로봇.'},
 {name:'전고체 배터리',match:/전고체|solid.state batter/i,meaning:'액체 대신 고체로 이온을 전달하는 배터리.'},
 {name:'클라우드',match:/클라우드|\bcloud\b/i,meaning:'인터넷으로 연결된 외부 서버의 저장 공간·계산 기능을 사용.'},
 {name:'기밀 컴퓨팅',match:/기밀\s*컴퓨팅|confidential computing/i,meaning:'사용 중인 민감 데이터를 다른 운영 프로그램과 분리해 보호.'},
 {name:'Xeon',match:/\bXeon\b|제온/i,meaning:'Intel의 서버·작업용 컴퓨터 프로세서 계열.'},
 {name:'ASIC',match:/\bASIC\b/i,meaning:'특정 작업에 맞춰 설계한 전용 반도체.'},
 {name:'NPU',match:/\bNPU\b/i,meaning:'AI 계산을 전용으로 처리하는 반도체.'},
 {name:'칩렛',match:/칩렛|chiplet/i,meaning:'작은 기능별 칩을 조합해 하나의 반도체 제품을 구성.'},
 {name:'GAA',match:/\bGAA\b|나노시트/i,meaning:'전류가 흐르는 통로를 제어 부분이 사방에서 감싸는 반도체 구조.'},
 {name:'CXL',match:/\bCXL\b/i,meaning:'프로세서·가속기·메모리 장치가 데이터를 공유하도록 연결하는 규격.'},
 {name:'GPT',match:/GPT[\s-]*\d/i,meaning:'OpenAI의 글·코드 등 입력을 이해하고 답을 만드는 AI 모델 계열.'},
 {name:'UI',match:/\bUI\b/i,meaning:'버튼·메뉴·화면처럼 사용자가 프로그램과 상호작용하는 부분.'},
 {name:'Mistral AI',match:/Mistral\s*AI/i,meaning:'AI 모델과 개발 도구를 만드는 프랑스 기업.'},
 {name:'FMS',match:/\bFMS\b/i,meaning:'메모리·저장 기술을 소개하는 업계 행사 이름.'},
 {name:'BV-NAND',match:/BV[\s-]*NAND/i,meaning:'따로 만든 데이터 저장층과 제어 회로층을 붙이는 메모리 제조 방식.',sourceUrl:samsung3d},
 {name:'zHBM',match:/\bzHBM\b/i,meaning:'계산 칩과 고속 메모리를 입체적으로 붙여 데이터 이동 거리를 줄이려는 삼성의 구상.',sourceUrl:samsung3d},
 {name:'zNAND-O',match:/zNAND[\s-]*O/i,meaning:'저장용 메모리 칩 4개 또는 8개를 쌓아 데이터 처리를 높이려는 삼성의 구상.',sourceUrl:samsung3d},
 {name:'Vera Rubin',match:/Vera\s*Rubin|베라\s*루빈/i,meaning:'NVIDIA의 CPU·GPU·연결망을 묶은 AI 컴퓨팅 플랫폼.'},
 {name:'랙',match:/서버\s*랙|\brack\b|파트너\s*랙/i,meaning:'여러 서버·전원·통신 장비를 한데 설치하는 선반형 구조.'},
 {name:'SGX',match:/\bSGX\b/i,meaning:'앱의 민감한 코드·데이터를 운영체제 관리자와 분리해 보호하는 Intel 기술.',sourceUrl:intelSecurity},
 {name:'TDX',match:/\bTDX\b/i,meaning:'한 컴퓨터 안에 나눠 만든 가상 서버 전체를 관리 프로그램과 분리해 보호하는 Intel 기술.',sourceUrl:intelSecurity},
 {name:'HBF',match:/\bHBF\b/i,meaning:'전원이 꺼져도 저장되는 메모리를 쌓아 용량과 데이터 전송을 늘리려는 구상.'},
 {name:'HBM',match:/\bHBM[\dEe-]*\b/i,meaning:'메모리 칩을 쌓아 AI 계산 칩 등에 많은 데이터를 빠르게 전달하는 메모리.'},
 {name:'High-NA EUV',match:/High[\s-]*NA(?:\s*EUV)?/i,meaning:'아주 짧은 파장의 빛을 더 넓게 모아 더 작은 반도체 회로를 새기는 기술.'},
 {name:'EUV',match:/\bEUV\b/i,meaning:'아주 짧은 파장의 빛으로 반도체의 작은 회로를 새기는 기술.'},
 {name:'DUV',match:/\bDUV\b/i,meaning:'자외선으로 반도체 회로를 새기는 기술. EUV보다 긴 파장의 빛을 사용.'},
 {name:'Hyper NA',match:/Hyper[\s-]*NA/i,meaning:'빛을 더 넓게 모아 지금보다 작은 회로를 새기려는 차세대 장비 구상.'},
 {name:'Foveros',match:/\bFoveros\b/i,meaning:'Intel의 여러 칩을 위아래로 쌓고 서로 연결하는 조립 기술.',sourceUrl:'https://www.intel.com/content/www/us/en/newsroom/tech101/explaining-common-chip-terms.html'},
 {name:'하이브리드 본딩',match:/하이브리드\s*본딩|hybrid bonding/i,meaning:'절연층과 금속 연결부를 함께 맞붙여 칩을 연결.'},
 {name:'NAND',match:/\bNAND\b/i,meaning:'전원이 꺼져도 파일을 지우지 않고 보관하는 저장용 메모리.'},
 {name:'DRAM',match:/\bDRAM\b|D램|디램/i,meaning:'작업 중인 데이터를 빠르게 읽고 쓰는 메모리.'},
 {name:'KV 캐시',match:/KV\s*(?:캐시|cache)/i,meaning:'AI가 앞서 계산한 정보를 저장해 반복 계산을 줄임.'},
 {name:'SSD',match:/\bSSD\b/i,meaning:'움직이는 디스크 없이 반도체에 파일을 저장하는 장치.'},
 {name:'PCIe',match:/\bPCIe\b/i,meaning:'CPU와 SSD·GPU 같은 부품 사이의 데이터 연결 규격.'},
 {name:'USB4',match:/\bUSB4\b/i,meaning:'외부 장치와 데이터를 주고받는 USB 연결 규격.'},
 {name:'CIP Safety',match:/CIP\s*Safety/i,meaning:'제어망으로 장비의 안전 신호를 전달하는 통신 규격.'},
 {name:'NSO',match:/\bNSO\b/i,meaning:'모터의 안전 신호를 제어망으로 전달하는 카드.'},
 {name:'보호 VM',match:/보호\s*VM|보호\s*가상머신/i,meaning:'민감 정보를 다른 시스템과 분리해 처리하는 가상 서버.'},
 {name:'온디바이스 AI',match:/온디바이스|on.device/i,meaning:'서버로 보내지 않고 기기 안에서 AI를 실행.'},
 {name:'샌드박스',match:/샌드박스|sandbox/i,meaning:'다른 프로그램에 영향을 덜 주도록 분리한 실행 공간.'},
 {name:'추론',match:/추론|inference/i,meaning:'학습한 AI가 새 입력에 대한 답을 계산하는 과정.'},
 {name:'Physical AI',match:/Physical\s*AI|피지컬\s*AI/i,meaning:'로봇처럼 현실에서 보고 판단하고 행동하는 AI.'},
 {name:'협동 로봇',match:/협동\s*로봇/i,meaning:'사람과 같은 작업 공간에서 협업하도록 설계한 로봇.'},
 {name:'ESS',match:/\bESS\b/i,meaning:'전기를 저장했다가 필요한 때 공급하는 시스템.'},
 {name:'BMS',match:/\bBMS\b/i,meaning:'배터리의 상태·충전·안전을 관리하는 시스템.'},
 {name:'저궤도 위성',match:/저궤도|\bLEO\b/i,meaning:'지구와 비교적 가까운 궤도를 도는 위성.'},
 {name:'ROCm',match:/\bROCm\b/i,meaning:'AMD GPU로 AI·계산 작업을 실행하는 소프트웨어 기반.'},
 {name:'GPU',match:/\bGPU\b/i,meaning:'많은 계산을 병렬로 처리하는 칩.'},
 {name:'CPU',match:/\bCPUs?\b|프로세서|processors?/i,meaning:'프로그램의 명령과 전반적인 작업을 처리하는 칩.'},
 {name:'2nm 공정',match:/2\s*nm|2\s*나노/i,meaning:'반도체 제조 공정 세대의 이름. 실제 회로 폭이 모두 2nm라는 뜻은 아님.'},
 {name:'양산',match:/양산/i,meaning:'시험 제작을 넘어 제품을 대량으로 생산하는 단계.'},
 {name:'파운드리',match:/파운드리|foundry/i,meaning:'다른 회사가 설계한 반도체를 대신 제조하는 사업.'},
 {name:'클린룸',match:/클린룸|cleanroom/i,meaning:'먼지와 오염을 엄격하게 관리하는 제조·연구 공간.'},
];
export function briefSentence(text:string,max=82){
 const value=text.replace(/\s+/g,' ').trim();
 if(value.length<=max)return value;
 const first=value.match(/^.{5,82}?[.!?。](?:\s|$)/)?.[0]?.trim();
 return first&&first.length<=max?first:value.slice(0,max-1).replace(/\s+\S*$/,'')+'…';
}
export function shortExplanation(item:ImportanceInput,fallbackEffect=''):BriefExplanation{
 const reviewed=reportedBriefing(item);
 const edited=savedExplanation(item);
 const text=[reviewed?.headline||item.title,item.technologyName].filter(Boolean).join(' ');
 const broad=new Set(['기밀 컴퓨팅','클라우드','AI 에이전트','파운드리','양산','FMS','추론']);
 const titleMatches=glossary.filter(term=>term.match.test(text)).sort((a,b)=>Number(broad.has(a.name))-Number(broad.has(b.name))||text.search(a.match)-text.search(b.match));
 const extra=[item.abstract,item.summary,item.after,item.change].filter(Boolean).join(' ');
 const matches=[...titleMatches,...glossary.filter(term=>!titleMatches.includes(term)&&term.match.test(extra))];
 // Explain every term selected for this story. A fixed two-term cap hid essential terms.
 const selected=edited?.termNames?edited.termNames.flatMap(name=>glossary.filter(t=>t.name===name)):
  [...titleMatches,...matches.filter(t=>!titleMatches.includes(t)).slice(0,2)].filter(t=>!(t.name==='EUV'&&matches.some(m=>m.name==='High-NA EUV')));
 const terms=selected.map(({name,meaning,sourceUrl})=>({name,meaning,...(sourceUrl?{sourceUrl}:{})}));
 const effect=reviewed?.effect||edited?.effect||briefSentence(item.research?.possibility||item.why||item.change||item.after||item.summary||item.abstract||fallbackEffect||'자료에 성능·사용 결과가 나와 있지 않습니다.');
 const application=reviewed?.application||edited?.application;
 return {terms,...(application?{application}:{}),effect};
}
