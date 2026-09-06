# OG 이미지 규칙

결과 페이지 공유 시 사용하는 Open Graph 이미지를 이 폴더에 둡니다.

- 기본 이미지: `public/og/default.png` (1200×630 권장)
- 유형별 이미지: `public/og/<CODE>.png` — 예: `public/og/INTJ.png`

`src/lib/share.ts` 의 `buildSharePayload()` 가 `${origin}${BASE_URL}og/<CODE>.png` 규칙으로 URL 을 생성합니다.
이미지 파일이 없으면 SNS 미리보기에서 이미지가 비어 보일 뿐 공유 자체는 정상 동작합니다.

> SPA 특성상 크롤러가 런타임에서 갱신한 메타태그를 읽지 못할 수 있습니다.
> 정확한 유형별 미리보기가 필요하면 배포 파이프라인에서 라우트별 프리렌더링을 추가하세요.
