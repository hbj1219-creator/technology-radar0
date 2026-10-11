# 기술 레이더 · Vercel 버전

Next.js App Router + React + TypeScript + Tailwind CSS.

## 실행

Node.js 24.x와 package.json에 지정된 pnpm 버전을 사용합니다.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## 빌드

```sh
pnpm build
pnpm start
```

Vercel에서는 이 폴더를 프로젝트 루트로 선택하고 Next.js 프레임워크를 사용합니다. 환경 변수 없이 실행할 수 있습니다.

## 데이터와 계정

- `data/site-snapshot.json`: 공유 기술 자료와 기업 동향만 포함합니다.
- `data/news-snapshot.json`: 검토된 공개 보도 메타데이터 일부를 포함합니다.
- `lib/snapshot-store.ts`: 위 데이터를 API로 읽고 평가·필터링합니다.
- `app/api/search`: 저장된 보도 검색과 외부 학술·뉴스 출처 검색입니다.
- `app/api/ranking`: 외부 보도를 조회해 기술별 보도량을 집계합니다.

뉴스의 자동 수집·저장과 서버 계정 로그인은 연결하지 않았습니다. 관심 기업·관심 기술·자료 저장은 localStorage를 사용합니다. 관리 API와 인증 토큰을 넣지 않았으며 원래 사이트에 요청을 전달하지 않습니다. 서버가 꺼져도 배포에 포함된 소식은 계속 읽을 수 있습니다.

배포 자료 기준일: 2026-10-11. 고정된 원문 날짜를 오늘 날짜로 바꾸어 표시하지 않습니다. 중요도 0은 제외하고 소식이 없는 날은 리포트 선택에서 제외합니다. 달력 TOP5 제한은 달력에만 적용합니다.

배포 전 확인: Next.js 프로덕션 빌드 및 로컬 API·리포트 검증. 외부 검색의 실제 응답과 Vercel 배포 결과, 브라우저 화면·클릭 동작은 배포 후 직접 확인해야 합니다.

상위 README.md에 GitHub와 Vercel 배포 순서가 있습니다.
