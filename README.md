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

## 배포

정적 SPA 이므로 어떤 정적 호스팅에도 배포할 수 있습니다.

- **Vercel / Netlify**: 프레임워크 프리셋 자동 감지. SPA fallback(모든 경로 → `index.html`) 설정 필요.
- **GitHub Pages**: `VITE_BASE=/<레포지토리명>/` 로 빌드하고 `dist` 를 배포. 404 처리를 위해 `index.html` 을 `404.html` 로도 복사.

> OG 이미지 규칙과 SPA 크롤러 한계는 `public/og/README.md` 참고.

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
