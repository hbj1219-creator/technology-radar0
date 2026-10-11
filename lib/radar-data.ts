import type {Importance} from './importance';
import type {ResearchOutlook} from './research-outlook';
export type RecordItem = {id:string;technology:string;title:string;summary:string;change:string;limitation:string;company:string;stage:string;kind:string;source:string;url:string;published:string;eventDate:string|null;metric:string;patent?:string;priority?:string;research?:ResearchOutlook;importance?:Importance};
export type Technology = {id:string;name:string;group:string;category:string;industries:string[];description:string;focus:string[]};
export type TechnologyGroup = {id:string;name:string;industries:string[]};
export const industries: string[] = ["반도체", "AI·소프트웨어", "자동차·모빌리티", "에너지", "로봇·제조", "바이오·의료", "소재·화학", "우주·통신"];
export const technologyGroups: TechnologyGroup[] = [
  {
    "id": "memory",
    "name": "메모리",
    "industries": [
      "반도체"
    ]
  },
  {
    "id": "process",
    "name": "반도체 공정",
    "industries": [
      "반도체"
    ]
  },
  {
    "id": "packaging",
    "name": "첨단 패키징",
    "industries": [
      "반도체"
    ]
  },
  {
    "id": "power-chip",
    "name": "전력 반도체",
    "industries": [
      "반도체",
      "자동차·모빌리티",
      "에너지"
    ]
  },
  {
    "id": "models",
    "name": "AI 모델",
    "industries": [
      "AI·소프트웨어"
    ]
  },
  {
    "id": "ai-systems",
    "name": "AI 시스템",
    "industries": [
      "AI·소프트웨어",
      "반도체"
    ]
  },
  {
    "id": "software",
    "name": "소프트웨어 인프라",
    "industries": [
      "AI·소프트웨어"
    ]
  },
  {
    "id": "battery",
    "name": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ]
  },
  {
    "id": "battery-system",
    "name": "배터리 시스템",
    "industries": [
      "자동차·모빌리티",
      "에너지"
    ]
  },
  {
    "id": "charging",
    "name": "충전·전동 구동",
    "industries": [
      "자동차·모빌리티"
    ]
  },
  {
    "id": "autonomy",
    "name": "자율주행",
    "industries": [
      "자동차·모빌리티",
      "AI·소프트웨어"
    ]
  },
  {
    "id": "solar",
    "name": "태양광",
    "industries": [
      "에너지",
      "소재·화학"
    ]
  },
  {
    "id": "electrolysis",
    "name": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ]
  },
  {
    "id": "hydrogen-use",
    "name": "수소 저장·활용",
    "industries": [
      "에너지",
      "자동차·모빌리티",
      "소재·화학"
    ]
  },
  {
    "id": "grid",
    "name": "전력망·저장",
    "industries": [
      "에너지"
    ]
  },
  {
    "id": "robot",
    "name": "로봇",
    "industries": [
      "로봇·제조",
      "자동차·모빌리티"
    ]
  },
  {
    "id": "robot-ai",
    "name": "로봇 지능",
    "industries": [
      "로봇·제조",
      "AI·소프트웨어"
    ]
  },
  {
    "id": "manufacturing",
    "name": "제조 공정",
    "industries": [
      "로봇·제조",
      "소재·화학"
    ]
  },
  {
    "id": "therapy",
    "name": "차세대 치료",
    "industries": [
      "바이오·의료"
    ]
  },
  {
    "id": "drug-discovery",
    "name": "신약 개발",
    "industries": [
      "바이오·의료",
      "AI·소프트웨어"
    ]
  },
  {
    "id": "medical-device",
    "name": "의료 기기",
    "industries": [
      "바이오·의료",
      "로봇·제조"
    ]
  },
  {
    "id": "circular",
    "name": "자원 순환",
    "industries": [
      "소재·화학",
      "에너지",
      "자동차·모빌리티"
    ]
  },
  {
    "id": "materials",
    "name": "첨단 소재",
    "industries": [
      "소재·화학",
      "반도체"
    ]
  },
  {
    "id": "space",
    "name": "우주 시스템",
    "industries": [
      "우주·통신"
    ]
  },
  {
    "id": "connectivity",
    "name": "차세대 통신",
    "industries": [
      "우주·통신",
      "반도체"
    ]
  }
];
export const technologies: Technology[] = [
  {
    "id": "hbm",
    "name": "HBM",
    "group": "memory",
    "category": "메모리",
    "industries": [
      "반도체"
    ],
    "description": "메모리 분야의 HBM 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "dram",
    "name": "DRAM",
    "group": "memory",
    "category": "메모리",
    "industries": [
      "반도체"
    ],
    "description": "메모리 분야의 DRAM 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "nand",
    "name": "NAND",
    "group": "memory",
    "category": "메모리",
    "industries": [
      "반도체"
    ],
    "description": "메모리 분야의 NAND 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "gaa",
    "name": "GAA·나노시트",
    "group": "process",
    "category": "반도체 공정",
    "industries": [
      "반도체"
    ],
    "description": "반도체 공정 분야의 GAA·나노시트 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "backside",
    "name": "후면 전력 공급",
    "group": "process",
    "category": "반도체 공정",
    "industries": [
      "반도체"
    ],
    "description": "반도체 공정 분야의 후면 전력 공급 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "euv",
    "name": "EUV·High-NA EUV",
    "group": "process",
    "category": "반도체 공정",
    "industries": [
      "반도체"
    ],
    "description": "반도체 공정 분야의 EUV·High-NA EUV 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "etch",
    "name": "식각·증착",
    "group": "process",
    "category": "반도체 공정",
    "industries": [
      "반도체"
    ],
    "description": "반도체 공정 분야의 식각·증착 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "chiplet",
    "name": "칩렛",
    "group": "packaging",
    "category": "첨단 패키징",
    "industries": [
      "반도체"
    ],
    "description": "첨단 패키징 분야의 칩렛 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "hybrid-bond",
    "name": "하이브리드 본딩",
    "group": "packaging",
    "category": "첨단 패키징",
    "industries": [
      "반도체"
    ],
    "description": "첨단 패키징 분야의 하이브리드 본딩 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "cowos",
    "name": "2.5D·3D 패키징",
    "group": "packaging",
    "category": "첨단 패키징",
    "industries": [
      "반도체"
    ],
    "description": "첨단 패키징 분야의 2.5D·3D 패키징 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "sic",
    "name": "SiC",
    "group": "power-chip",
    "category": "전력 반도체",
    "industries": [
      "반도체",
      "자동차·모빌리티",
      "에너지"
    ],
    "description": "전력 반도체 분야의 SiC 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "gan",
    "name": "GaN",
    "group": "power-chip",
    "category": "전력 반도체",
    "industries": [
      "반도체",
      "자동차·모빌리티",
      "에너지"
    ],
    "description": "전력 반도체 분야의 GaN 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "multimodal",
    "name": "멀티모달",
    "group": "models",
    "category": "AI 모델",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "AI 모델 분야의 멀티모달 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "reasoning",
    "name": "추론 모델",
    "group": "models",
    "category": "AI 모델",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "AI 모델 분야의 추론 모델 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "small-model",
    "name": "소형·온디바이스 모델",
    "group": "models",
    "category": "AI 모델",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "AI 모델 분야의 소형·온디바이스 모델 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "accelerator",
    "name": "AI 가속기",
    "group": "ai-systems",
    "category": "AI 시스템",
    "industries": [
      "AI·소프트웨어",
      "반도체"
    ],
    "description": "AI 시스템 분야의 AI 가속기 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "inference",
    "name": "추론 최적화",
    "group": "ai-systems",
    "category": "AI 시스템",
    "industries": [
      "AI·소프트웨어",
      "반도체"
    ],
    "description": "AI 시스템 분야의 추론 최적화 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "rag",
    "name": "RAG·검색 증강",
    "group": "ai-systems",
    "category": "AI 시스템",
    "industries": [
      "AI·소프트웨어",
      "반도체"
    ],
    "description": "AI 시스템 분야의 RAG·검색 증강 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "agent",
    "name": "AI 에이전트",
    "group": "ai-systems",
    "category": "AI 시스템",
    "industries": [
      "AI·소프트웨어",
      "반도체"
    ],
    "description": "AI 시스템 분야의 AI 에이전트 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "cloud",
    "name": "클라우드·분산 시스템",
    "group": "software",
    "category": "소프트웨어 인프라",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "소프트웨어 인프라 분야의 클라우드·분산 시스템 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "confidential",
    "name": "기밀 컴퓨팅",
    "group": "software",
    "category": "소프트웨어 인프라",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "소프트웨어 인프라 분야의 기밀 컴퓨팅 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "post-quantum",
    "name": "양자 내성 암호",
    "group": "software",
    "category": "소프트웨어 인프라",
    "industries": [
      "AI·소프트웨어"
    ],
    "description": "소프트웨어 인프라 분야의 양자 내성 암호 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "solid",
    "name": "전고체",
    "group": "battery",
    "category": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ],
    "description": "배터리 분야의 전고체 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "lfp",
    "name": "LFP·LMFP",
    "group": "battery",
    "category": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ],
    "description": "배터리 분야의 LFP·LMFP 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "sodium",
    "name": "나트륨 이온",
    "group": "battery",
    "category": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ],
    "description": "배터리 분야의 나트륨 이온 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "silicon-anode",
    "name": "실리콘 음극",
    "group": "battery",
    "category": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ],
    "description": "배터리 분야의 실리콘 음극 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "lithium-metal",
    "name": "리튬 금속",
    "group": "battery",
    "category": "배터리",
    "industries": [
      "자동차·모빌리티",
      "에너지",
      "소재·화학"
    ],
    "description": "배터리 분야의 리튬 금속 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "thermal",
    "name": "열관리",
    "group": "battery-system",
    "category": "배터리 시스템",
    "industries": [
      "자동차·모빌리티",
      "에너지"
    ],
    "description": "배터리 시스템 분야의 열관리 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "bms",
    "name": "BMS·상태 진단",
    "group": "battery-system",
    "category": "배터리 시스템",
    "industries": [
      "자동차·모빌리티",
      "에너지"
    ],
    "description": "배터리 시스템 분야의 BMS·상태 진단 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "ctc",
    "name": "셀투팩·셀투차체",
    "group": "battery-system",
    "category": "배터리 시스템",
    "industries": [
      "자동차·모빌리티",
      "에너지"
    ],
    "description": "배터리 시스템 분야의 셀투팩·셀투차체 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "fast-charge",
    "name": "급속 충전",
    "group": "charging",
    "category": "충전·전동 구동",
    "industries": [
      "자동차·모빌리티"
    ],
    "description": "충전·전동 구동 분야의 급속 충전 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "wireless-charge",
    "name": "무선 충전",
    "group": "charging",
    "category": "충전·전동 구동",
    "industries": [
      "자동차·모빌리티"
    ],
    "description": "충전·전동 구동 분야의 무선 충전 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "v2g",
    "name": "V2G",
    "group": "charging",
    "category": "충전·전동 구동",
    "industries": [
      "자동차·모빌리티"
    ],
    "description": "충전·전동 구동 분야의 V2G 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "motor",
    "name": "전기 모터·인버터",
    "group": "charging",
    "category": "충전·전동 구동",
    "industries": [
      "자동차·모빌리티"
    ],
    "description": "충전·전동 구동 분야의 전기 모터·인버터 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "lidar",
    "name": "LiDAR",
    "group": "autonomy",
    "category": "자율주행",
    "industries": [
      "자동차·모빌리티",
      "AI·소프트웨어"
    ],
    "description": "자율주행 분야의 LiDAR 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "e2e-driving",
    "name": "종단간 주행 모델",
    "group": "autonomy",
    "category": "자율주행",
    "industries": [
      "자동차·모빌리티",
      "AI·소프트웨어"
    ],
    "description": "자율주행 분야의 종단간 주행 모델 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "sdv",
    "name": "소프트웨어 정의 차량",
    "group": "autonomy",
    "category": "자율주행",
    "industries": [
      "자동차·모빌리티",
      "AI·소프트웨어"
    ],
    "description": "자율주행 분야의 소프트웨어 정의 차량 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "perovskite",
    "name": "페로브스카이트·탠덤",
    "group": "solar",
    "category": "태양광",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "태양광 분야의 페로브스카이트·탠덤 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "topcon",
    "name": "TOPCon",
    "group": "solar",
    "category": "태양광",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "태양광 분야의 TOPCon 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "hjt",
    "name": "HJT",
    "group": "solar",
    "category": "태양광",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "태양광 분야의 HJT 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "pem",
    "name": "PEM",
    "group": "electrolysis",
    "category": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "수전해 분야의 PEM 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "aem",
    "name": "AEM",
    "group": "electrolysis",
    "category": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "수전해 분야의 AEM 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "alkaline",
    "name": "알칼라인",
    "group": "electrolysis",
    "category": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "수전해 분야의 알칼라인 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "soec",
    "name": "SOEC",
    "group": "electrolysis",
    "category": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "수전해 분야의 SOEC 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "stack",
    "name": "스택 제어",
    "group": "electrolysis",
    "category": "수전해",
    "industries": [
      "에너지",
      "소재·화학"
    ],
    "description": "수전해 분야의 스택 제어 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "fuel-cell",
    "name": "연료전지",
    "group": "hydrogen-use",
    "category": "수소 저장·활용",
    "industries": [
      "에너지",
      "자동차·모빌리티",
      "소재·화학"
    ],
    "description": "수소 저장·활용 분야의 연료전지 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "liquid-hydrogen",
    "name": "액화 수소",
    "group": "hydrogen-use",
    "category": "수소 저장·활용",
    "industries": [
      "에너지",
      "자동차·모빌리티",
      "소재·화학"
    ],
    "description": "수소 저장·활용 분야의 액화 수소 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "ammonia",
    "name": "암모니아 운반·분해",
    "group": "hydrogen-use",
    "category": "수소 저장·활용",
    "industries": [
      "에너지",
      "자동차·모빌리티",
      "소재·화학"
    ],
    "description": "수소 저장·활용 분야의 암모니아 운반·분해 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "long-storage",
    "name": "장주기 ESS",
    "group": "grid",
    "category": "전력망·저장",
    "industries": [
      "에너지"
    ],
    "description": "전력망·저장 분야의 장주기 ESS 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "grid-forming",
    "name": "그리드포밍 인버터",
    "group": "grid",
    "category": "전력망·저장",
    "industries": [
      "에너지"
    ],
    "description": "전력망·저장 분야의 그리드포밍 인버터 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "smr",
    "name": "소형 모듈 원자로",
    "group": "grid",
    "category": "전력망·저장",
    "industries": [
      "에너지"
    ],
    "description": "전력망·저장 분야의 소형 모듈 원자로 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "humanoid",
    "name": "휴머노이드",
    "group": "robot",
    "category": "로봇",
    "industries": [
      "로봇·제조",
      "자동차·모빌리티"
    ],
    "description": "로봇 분야의 휴머노이드 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "cobot",
    "name": "협동 로봇",
    "group": "robot",
    "category": "로봇",
    "industries": [
      "로봇·제조",
      "자동차·모빌리티"
    ],
    "description": "로봇 분야의 협동 로봇 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "amr",
    "name": "자율 이동 로봇",
    "group": "robot",
    "category": "로봇",
    "industries": [
      "로봇·제조",
      "자동차·모빌리티"
    ],
    "description": "로봇 분야의 자율 이동 로봇 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "robot-actuator",
    "name": "액추에이터·핸드",
    "group": "robot",
    "category": "로봇",
    "industries": [
      "로봇·제조",
      "자동차·모빌리티"
    ],
    "description": "로봇 분야의 액추에이터·핸드 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "vla",
    "name": "시각·언어·행동 모델",
    "group": "robot-ai",
    "category": "로봇 지능",
    "industries": [
      "로봇·제조",
      "AI·소프트웨어"
    ],
    "description": "로봇 지능 분야의 시각·언어·행동 모델 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "sim2real",
    "name": "시뮬레이션·현실 전이",
    "group": "robot-ai",
    "category": "로봇 지능",
    "industries": [
      "로봇·제조",
      "AI·소프트웨어"
    ],
    "description": "로봇 지능 분야의 시뮬레이션·현실 전이 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "grasp",
    "name": "비전·파지",
    "group": "robot-ai",
    "category": "로봇 지능",
    "industries": [
      "로봇·제조",
      "AI·소프트웨어"
    ],
    "description": "로봇 지능 분야의 비전·파지 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "digital-twin",
    "name": "디지털 트윈",
    "group": "manufacturing",
    "category": "제조 공정",
    "industries": [
      "로봇·제조",
      "소재·화학"
    ],
    "description": "제조 공정 분야의 디지털 트윈 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "additive",
    "name": "적층 제조",
    "group": "manufacturing",
    "category": "제조 공정",
    "industries": [
      "로봇·제조",
      "소재·화학"
    ],
    "description": "제조 공정 분야의 적층 제조 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "inspection",
    "name": "AI 검사·예지보전",
    "group": "manufacturing",
    "category": "제조 공정",
    "industries": [
      "로봇·제조",
      "소재·화학"
    ],
    "description": "제조 공정 분야의 AI 검사·예지보전 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "car-t",
    "name": "CAR-T·세포치료",
    "group": "therapy",
    "category": "차세대 치료",
    "industries": [
      "바이오·의료"
    ],
    "description": "차세대 치료 분야의 CAR-T·세포치료 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "gene-edit",
    "name": "유전자 편집",
    "group": "therapy",
    "category": "차세대 치료",
    "industries": [
      "바이오·의료"
    ],
    "description": "차세대 치료 분야의 유전자 편집 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "rna",
    "name": "RNA 치료",
    "group": "therapy",
    "category": "차세대 치료",
    "industries": [
      "바이오·의료"
    ],
    "description": "차세대 치료 분야의 RNA 치료 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "adc",
    "name": "항체 약물 접합체",
    "group": "therapy",
    "category": "차세대 치료",
    "industries": [
      "바이오·의료"
    ],
    "description": "차세대 치료 분야의 항체 약물 접합체 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "protein",
    "name": "단백질 설계",
    "group": "drug-discovery",
    "category": "신약 개발",
    "industries": [
      "바이오·의료",
      "AI·소프트웨어"
    ],
    "description": "신약 개발 분야의 단백질 설계 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "ai-drug",
    "name": "AI 신약 탐색",
    "group": "drug-discovery",
    "category": "신약 개발",
    "industries": [
      "바이오·의료",
      "AI·소프트웨어"
    ],
    "description": "신약 개발 분야의 AI 신약 탐색 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "organoid",
    "name": "오가노이드",
    "group": "drug-discovery",
    "category": "신약 개발",
    "industries": [
      "바이오·의료",
      "AI·소프트웨어"
    ],
    "description": "신약 개발 분야의 오가노이드 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "medical-imaging",
    "name": "의료 영상 AI",
    "group": "medical-device",
    "category": "의료 기기",
    "industries": [
      "바이오·의료",
      "로봇·제조"
    ],
    "description": "의료 기기 분야의 의료 영상 AI 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "surgical-robot",
    "name": "수술 로봇",
    "group": "medical-device",
    "category": "의료 기기",
    "industries": [
      "바이오·의료",
      "로봇·제조"
    ],
    "description": "의료 기기 분야의 수술 로봇 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "bci",
    "name": "뇌·컴퓨터 인터페이스",
    "group": "medical-device",
    "category": "의료 기기",
    "industries": [
      "바이오·의료",
      "로봇·제조"
    ],
    "description": "의료 기기 분야의 뇌·컴퓨터 인터페이스 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "recycling",
    "name": "배터리 재활용",
    "group": "circular",
    "category": "자원 순환",
    "industries": [
      "소재·화학",
      "에너지",
      "자동차·모빌리티"
    ],
    "description": "자원 순환 분야의 배터리 재활용 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "plastic-recycle",
    "name": "플라스틱 화학 재활용",
    "group": "circular",
    "category": "자원 순환",
    "industries": [
      "소재·화학",
      "에너지",
      "자동차·모빌리티"
    ],
    "description": "자원 순환 분야의 플라스틱 화학 재활용 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "ccus",
    "name": "탄소 포집·활용",
    "group": "circular",
    "category": "자원 순환",
    "industries": [
      "소재·화학",
      "에너지",
      "자동차·모빌리티"
    ],
    "description": "자원 순환 분야의 탄소 포집·활용 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "composite",
    "name": "복합재",
    "group": "materials",
    "category": "첨단 소재",
    "industries": [
      "소재·화학",
      "반도체"
    ],
    "description": "첨단 소재 분야의 복합재 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "catalyst",
    "name": "촉매",
    "group": "materials",
    "category": "첨단 소재",
    "industries": [
      "소재·화학",
      "반도체"
    ],
    "description": "첨단 소재 분야의 촉매 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "membrane",
    "name": "분리막",
    "group": "materials",
    "category": "첨단 소재",
    "industries": [
      "소재·화학",
      "반도체"
    ],
    "description": "첨단 소재 분야의 분리막 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "conductive",
    "name": "전도성 소재",
    "group": "materials",
    "category": "첨단 소재",
    "industries": [
      "소재·화학",
      "반도체"
    ],
    "description": "첨단 소재 분야의 전도성 소재 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "reusable",
    "name": "재사용 발사체",
    "group": "space",
    "category": "우주 시스템",
    "industries": [
      "우주·통신"
    ],
    "description": "우주 시스템 분야의 재사용 발사체 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "satellite",
    "name": "위성체·탑재체",
    "group": "space",
    "category": "우주 시스템",
    "industries": [
      "우주·통신"
    ],
    "description": "우주 시스템 분야의 위성체·탑재체 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "space-propulsion",
    "name": "우주 추진",
    "group": "space",
    "category": "우주 시스템",
    "industries": [
      "우주·통신"
    ],
    "description": "우주 시스템 분야의 우주 추진 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "ntn",
    "name": "위성 직접 통신·NTN",
    "group": "connectivity",
    "category": "차세대 통신",
    "industries": [
      "우주·통신",
      "반도체"
    ],
    "description": "차세대 통신 분야의 위성 직접 통신·NTN 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "6g",
    "name": "6G",
    "group": "connectivity",
    "category": "차세대 통신",
    "industries": [
      "우주·통신",
      "반도체"
    ],
    "description": "차세대 통신 분야의 6G 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  },
  {
    "id": "photonics",
    "name": "실리콘 포토닉스",
    "group": "connectivity",
    "category": "차세대 통신",
    "industries": [
      "우주·통신",
      "반도체"
    ],
    "description": "차세대 통신 분야의 실리콘 포토닉스 기술 개발, 적용 사례와 특허·논문을 살펴봅니다.",
    "focus": [
      "개발 단계",
      "적용 사례",
      "성능 비교 조건"
    ]
  }
];
export function technologyLabel(id:string){const t=technologies.find(t=>t.id===id);return t?`${t.category} · ${t.name}`:id;}
export const seedRecords:RecordItem[] = [
{id:"nel-submarine-20260930",technology:"pem",title:"Nel, 잠수함 생명유지용 PEM 스택 추가 수주",summary:"Collins Aerospace로부터 약 700만 달러의 추가 주문을 받았습니다. PEM 수전해를 잠수함의 산소 생성에 사용하는 사례입니다.",change:"수소 생산 외에 산소 공급이라는 적용 사례가 확인됐습니다. 납품은 2027~2028년 예정입니다.",limitation:"수주는 운전 완료나 성능 개선의 증거가 아닙니다. 수명·전력 소비의 비교 수치는 공개되지 않았습니다.",company:"Nel · Collins Aerospace",stage:"수주 · 납품 예정",kind:"기업 적용",source:"Nel 공식 발표",url:"https://nelhydrogen.com/press-release/nel-asa-secures-additional-orders-for-submarine-pem-electrolyser-stacks/",published:"2026-09-30",eventDate:"2026-09-30",metric:"추가 주문 약 700만 USD"},
{id:"nel-hydrasun-20260910",technology:"pem",title:"Nel·Hydrasun, 유럽 PEM 시스템 조립·통합 협력",summary:"Hydrasun은 MC Series의 주변설비 조립·통합 역량을 구축하고, Nel은 미국에서 스택 생산을 이어가는 협력을 발표했습니다.",change:"성능 개선보다 모듈형 시스템의 공급·통합 역량 확대에 해당합니다.",limitation:"협약 단계입니다. 납품 실적·생산성 개선 수치는 별도로 확인해야 합니다.",company:"Nel · Hydrasun",stage:"협약 · 역량 구축",kind:"기업 적용",source:"Nel 공식 발표",url:"https://nelhydrogen.com/press-release/nel-asa-enters-framework-agreement-with-hydrasun-as-a-european-integration-partner-for-pem-electrolyser-solutions/",published:"2026-09-10",eventDate:"2026-09-10",metric:"MC Series 시스템 통합"},
{id:"basf-pem-20260521",technology:"pem",title:"BASF, 화학단지에 54 MW PEM 수전해 통합",summary:"Siemens Energy는 BASF Ludwigshafen 현장의 72개 스택으로 구성된 54 MW 설비 운전 사례를 소개했습니다.",change:"개별 스택 기술에서 기존 화학단지 수소 공급망에 통합된 산업 사례로 연결됩니다.",limitation:"기업의 현장 소개입니다. 독립 검증된 시스템 효율·수명 비교 자료는 이 자료에 없습니다.",company:"BASF · Siemens Energy",stage:"현장 운전",kind:"기업 적용",source:"Siemens Energy 현장 소개",url:"https://www.siemens-energy.com/global/en/home/stories/chemical-industry-electrolyzer.html",published:"2026-05-21",eventDate:null,metric:"설비 54 MW · 스택 72개"},
{id:"gphilos-wo2026010322",technology:"stack",title:"다중 수전해 스택의 저부하 운전 제어 특허 공개",summary:"부하와 스택별 최대 운전 전력, 운전 전압을 바탕으로 운전 대상과 우선순위를 정하는 방법을 설명합니다.",change:"스택을 개별 제어해 저부하 운전 품질을 개선하려는 설계 접근입니다.",limitation:"출원 공개입니다. 등록·제품 적용·개선 효과의 독립 검증은 확인하지 않았습니다.",company:"G PhilosCo",stage:"출원 공개",kind:"특허",source:"특허 원문 · Google Patents",url:"https://patents.google.com/patent/WO2026010322A1/en",published:"2026-01-08",eventDate:null,metric:"모듈별 운전 우선순위",patent:"WO2026010322A1",priority:"2024-07-02"},
{id:"toyota-sumitomo-20251008",technology:"solid",title:"Toyota·Sumitomo, 전고체용 양극재 양산 협력",summary:"전고체 배터리에 사용할 양극재의 양산을 위한 공동개발 계약을 발표했습니다.",change:"셀 성능 연구에 더해 소재 공급과 양산 준비를 추적하는 사례입니다.",limitation:"공동개발 계약을 양산 완료로 해석할 수 없습니다. 상용 차량 적용은 별도 확인이 필요합니다.",company:"Toyota · Sumitomo Metal Mining",stage:"공동개발",kind:"기업 적용",source:"Toyota 공식 발표",url:"https://global.toyota/en/newsroom/corporate/43380876.html",published:"2025-10-08",eventDate:"2025-10-08",metric:"양극재 양산 공동개발"},
{id:"basf-coolant-20250910",technology:"thermal",title:"BASF, 전기차용 저전도 냉각수 출시",summary:"배터리 안전성과 안정성을 위한 GLYSANTIN ELECTRIFIED 저전도 냉각수를 출시하고 중국 Pudong 생산을 소개했습니다.",change:"냉각 구조 외에 냉각수 전기전도도와 소재 적합성을 추적하는 사례입니다.",limitation:"제품 출시 자료입니다. 다른 제품과 같은 조건에서 비교한 성능은 별도 확인해야 합니다.",company:"BASF",stage:"제품 출시 · 생산",kind:"제품 출시",source:"BASF 공식 발표",url:"https://www.basf.com/global/en/media/news-releases/2025/09/p-25-179",published:"2025-09-10",eventDate:"2025-09-10",metric:"저전도 냉각수"},
{id:"bmw-thermal-20250221",technology:"thermal",title:"BMW, 800 V 구동계의 배터리 온도 제어 설명",summary:"Neue Klasse 소개에서 급속 충전 중 배터리 온도를 일정 범위로 유지하고 냉각과 가열을 함께 관리한다고 설명했습니다.",change:"열관리가 충전 속도·전비·주행거리와 연결되는 적용 맥락을 보여줍니다.",limitation:"열관리만의 개선 효과를 분리한 비교 수치가 아닙니다. 구동계 전체 성능을 열관리 효과로 단정하지 않습니다.",company:"BMW",stage:"기술 발표",kind:"기술 개발",source:"BMW 공식 발표",url:"https://www.press.bmwgroup.com/global/article/detail/T0448099EN/charge-faster-drive-further:-bmw-group-reveals-revolutionary-electric-drive-concept-with-800v-technology-for-the-neue-klasse?language=en",published:"2025-02-21",eventDate:"2025-02-21",metric:"800 V 구동계 · 온도 제어"}

,{id:"bmw-production-20261001",technology:"thermal",title:"BMW, 냉각 구조가 통합된 Gen6 배터리 양산 개시",summary:"BMW는 Irlbach-Straßkirchen 공장의 양산 개시를 발표했습니다. 배터리 조립 과정에서 셀을 냉각기에 연결하는 공정을 설명합니다.",change:"2025년 구동계 소개에 이어 2026년에는 냉각 구조를 포함한 배터리 생산 적용 사례가 확인됩니다.",limitation:"배터리 양산 사례이며 냉각 기술 자체의 성능 향상을 분리해 검증한 자료는 아닙니다.",company:"BMW",stage:"양산 개시",kind:"기업 적용",source:"BMW 공식 발표",url:"https://www.press.bmwgroup.com/global/article/detail/T0461032EN/series-production-gets-underway:-bmw-group-officially-opens-plant-irlbach-strasskirchen",published:"2026-10-01",eventDate:"2026-10-01",metric:"셀·냉각기 연결 공정"}
,{id:"enapter-drone-20260903",technology:"aem",title:"Enapter, 수소 드론용 이동식 AEM 수전해 파일럿 수주",summary:"미국 드론 제조사에 공급할 약 50만 유로 규모의 AEM 4.1 시리즈 주문을 발표했습니다. 태양광 기반 현장 수소 생산이 목적입니다.",change:"중앙 생산·운송 방식과 다른 현장 생산·이동식 보급 적용 사례입니다.",limitation:"파일럿 주문이며 납품은 2026년 4분기 예정입니다. 실제 운전과 성능 비교는 아직 확인하지 않았습니다.",company:"Enapter",stage:"파일럿 수주",kind:"기업 적용",source:"Enapter 공식 발표",url:"https://enapterag.de/wp-content/uploads/2026/09/Enapter-receives-pilot-order-from-a-US-drone-manufacturer.pdf",published:"2026-09-03",eventDate:"2026-09-03",metric:"주문 약 50만 EUR"}
,{id:"topsoe-soec-20260518",technology:"soec",title:"Topsoe, SOEC 상용화·생산 확대 계획 조정",summary:"파트너십과 실증을 중심으로 SOEC 상용화 경로를 조정하고 미국 제2공장 계획을 진행하지 않겠다고 발표했습니다.",change:"기술 개발뿐 아니라 수요와 생산 확대 속도를 함께 봐야 한다는 사례입니다. 덴마크 공장은 상업 규모 생산 역량 입증 후 수요가 회복될 때까지 휴면 전환할 계획입니다.",limitation:"당시 발표한 계획입니다. 이후 실행 여부와 변경 사항은 후속 자료로 확인해야 합니다. 기술적 실패로 단정할 수 없습니다.",company:"Topsoe",stage:"사업·생산 계획 조정",kind:"기술 개발",source:"Topsoe 공식 공시",url:"https://www.topsoe.com/investors/financial-releases/topsoe-adjusts-soec-commercialization-pathway-to-match-market-outlook-financial-guidance-updated",published:"2026-05-18",eventDate:"2026-05-18",metric:"미국 제2공장 계획 중단"}
];
