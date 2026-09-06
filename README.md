# 애니 MBTI

24개의 질문으로 알아보는 나의 MBTI. 16가지 애니메이션 스타일 캐릭터 중 나와 닮은 유형을 찾고 친구에게 공유하는 웹앱입니다.

## 주요 기능

- 24문항(4축 각 6문항) 리커트 5점 설문 → 4축(E/I, S/N, T/F, J/P) 점수 집계 → 16유형 판정
- 유형별 캐릭터 결과 페이지: 성격 설명, 강점·약점, 궁합 유형, 추천 직업
- 소셜 공유: 카카오톡, X(트위터), Web Share API, 링크 복사
- 결과 카드 이미지 저장(다운로드)
- 페이지 전환·문항 슬라이드·캐릭터 등장 애니메이션 (Framer Motion)
- 다크모드(light/dark/system), 반응형, 진행 상황 자동 저장/복원
- `prefers-reduced-motion` 존중, 키보드 조작 지원

## 기술 스택

- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion, React Router
- Vitest (점수 집계 로직 단위 테스트)

## 로컬 개발

```bash
npm install
cp .env.example .env        # 필요한 값 채우기 (선택)
npm run dev                 # 개발 서버
npm run test                # 단위 테스트
npm run lint                # 린트
npm run typecheck           # 타입 검사
npm run build               # 프로덕션 빌드
npm run preview             # 빌드 결과 미리보기
```

## 환경 변수

| 변수 | 설명 | 필수 |
| --- | --- | --- |
| `VITE_KAKAO_JS_KEY` | 카카오 JavaScript 키. 없으면 카카오 공유 버튼만 숨겨짐 | 선택 |
| `VITE_SITE_URL` | 공유 링크·OG 태그에 쓰이는 정식 URL | 선택 |
| `VITE_BASE` | 하위 경로 배포 시 base 경로 (예: `/anime-mbti/`) | 선택 |

## 소셜 공유

결과 페이지에서 4가지 방법으로 공유할 수 있습니다.

- **카카오톡**: `VITE_KAKAO_JS_KEY` 설정 시에만 버튼이 보입니다. 카카오 SDK 는 필요할 때
  동적으로 로드됩니다. [카카오 개발자 콘솔](https://developers.kakao.com)에서 앱을 만들고
  **플랫폼 > Web** 에 배포 도메인을 등록해야 합니다. 키가 없거나 도메인 미등록이면
  앱은 정상 동작하고 나머지 공유 수단으로 대체됩니다.
- **X(트위터)**: 별도 설정 없이 인텐트 URL 로 동작합니다.
- **기본 공유(Web Share API)**: `navigator.share` 지원 환경(주로 모바일)에서만 노출됩니다.
- **링크 복사**: 클립보드에 결과 URL 을 복사합니다.
- **이미지 저장**: 결과 카드를 PNG 로 내려받습니다(`html-to-image`, 동적 로드).

### OG(Open Graph) 이미지

SPA 특성상 크롤러가 런타임에서 바꾼 메타태그를 읽지 못할 수 있습니다. 유형별 미리보기 이미지는
정적 파일 규칙을 따릅니다.

- 기본: `public/og/default.png` (1200×630)
- 유형별: `public/og/<CODE>.png` — 예 `public/og/INTJ.png`

`src/lib/share.ts` 의 `buildSharePayload()` 가 `${origin}${BASE_URL}og/<CODE>.png` 로 URL 을
생성합니다. 파일이 없으면 미리보기 이미지만 비고 공유 자체는 정상입니다. 정확한 유형별
미리보기가 필요하면 배포 파이프라인에서 라우트별 프리렌더링을 추가하세요.

## 배포

정적 SPA 이므로 어떤 정적 호스팅에도 배포할 수 있습니다. 빌드 산출물은 `dist/` 입니다.

### Vercel

- Framework Preset: **Vite**, Build Command `npm run build`, Output `dist`
- SPA 라우팅 폴백은 Vercel 이 자동 처리합니다. 필요 시 `vercel.json`:

  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### Netlify

- Build Command `npm run build`, Publish directory `dist`
- `public/_redirects` 파일에 한 줄 추가: `/*  /index.html  200`

### GitHub Pages

- `VITE_BASE=/<레포지토리명>/ npm run build` 로 빌드 (하위 경로 대응)
- `dist` 를 `gh-pages` 브랜치에 배포하고, `dist/index.html` 을 `dist/404.html` 로 복사해
  새로고침·딥링크에서도 SPA 가 뜨도록 합니다.

## 알려진 한계

- **크롤러 OG 미리보기**: SPA 라 런타임에서 바꾼 메타태그를 일부 크롤러가 못 읽습니다.
  유형별 정확한 미리보기는 `public/og/<CODE>.png` 정적 이미지 + (선택) 프리렌더링으로 보완하세요.
- **카카오 공유**: `VITE_KAKAO_JS_KEY` 와 도메인 등록이 있어야 동작합니다. 없으면 버튼이 숨겨집니다.
- **결과 정확도**: 24문항 간이 검사이며 정식 MBTI 진단을 대체하지 않습니다.

## 프로젝트 구조

```
src/
  routes/       # 페이지 (home, quiz, result, types-gallery, not-found)
  components/   # ui, quiz, result, layout 컴포넌트
  data/         # 질문·16유형 콘텐츠 데이터
  lib/          # scoring, storage, share, seo, download-image (순수/부수효과 함수)
  hooks/        # use-theme, use-quiz, use-toast 등
  types/        # 전역 타입
  styles/       # Tailwind 진입 및 테마 토큰
  test/         # Vitest 설정 및 테스트
```
