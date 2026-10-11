import {type IndustryUpdate} from "./industry-update";

// Intel comparison pilot, verified against the linked official announcements on 2026-10-10.
// Same announcement IDs only; future updates and supplied historical comparisons remain authoritative.
const comparisons:Record<string, Pick<IndustryUpdate,"before"|"after"|"sources"|"limitations">> = {
  "intel-20261009-tdx-strategy": {
    "before": "SGX로 애플리케이션의 보호 영역을 지원하고, TDX로 가상머신 격리를 지원해 왔습니다. TDX는 이번에 처음 등장한 기술이 아닙니다.",
    "after": "향후 기밀 컴퓨팅 개발을 TDX에 집중합니다. Diamond Rapids가 SGX를 포함하는 마지막 Xeon 플랫폼이며, 기존 SGX 플랫폼의 지원·보안 업데이트는 2030년대 초반까지 이어갈 계획입니다.",
    "sources": [
      {
        "title": "Confidential Computing - Growing Momentum, Sharpened Focus",
        "url": "https://www.intel.com/content/www/us/en/newsroom/opinion/confidential-computing-growing-momentum-sharpened-focus.html",
        "published": "2026-10-09",
        "kind": "기업 공식 발표"
      }
    ],
    "limitations": [
      "발표일은 Intel 공식 뉴스룸의 10월 9일 표시를 따릅니다.",
      "TDX가 모든 보안 위협을 해결하거나 기존 SGX 서비스가 즉시 중단된다는 의미가 아닙니다.",
      "이전 상태는 이번 공식 발표가 설명하는 기존 SGX·TDX 제공 상태입니다. 과거 특정 시점의 투자 비중을 비교한 자료는 아닙니다."
    ]
  },
  "intel-amat-20261006-epic-strategy": {
    "before": "Intel과 Applied Materials는 이미 반도체 소자 미세화와 공정 개발에서 장기간 협력해 왔습니다.",
    "after": "기존 협력을 EPIC Center와 Intel 오리건 연구시설을 연계하는 방식으로 확대합니다. 차세대 트랜지스터·배선과 Foveros 3D 적층 패키징을 함께 개발할 계획입니다.",
    "sources": [
      {
        "title": "Applied Materials·Intel의 EPIC 공동개발 확대 발표",
        "url": "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-and-intel-collaborate-accelerate-chipmaking",
        "published": "2026-10-06",
        "kind": "기업 공식 발표"
      }
    ],
    "limitations": [
      "신규 투자 금액과 물량은 이 발표에서 제시되지 않았다.",
      "개발 협력을 양산 성과나 수율 향상으로 간주할 수 없다.",
      "이전 상태는 이번 발표문에 명시된 기존 협력 관계입니다. 개발기간 단축이나 성능 향상이 실제로 달성됐다는 뜻은 아닙니다."
    ]
  }
};

export function withIntelComparison(update:IndustryUpdate):IndustryUpdate {
 const comparison=comparisons[update.id];
 if(update.company!=="Intel"||update.before||!comparison)return update;
 return {...update,...comparison};
}
