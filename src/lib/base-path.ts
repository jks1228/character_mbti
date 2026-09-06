/**
 * Vite 의 BASE_URL 을 React Router 의 basename 으로 안전하게 변환한다.
 * '/', './', '/./', '' 처럼 루트 배포를 뜻하는 값은 모두 '/' 로 정규화하고,
 * '/foo/' 같은 하위 경로 배포일 때만 '/foo' 를 반환한다.
 */
export function resolveBasename(rawBase: string): string {
  return /^\/[^./]/.test(rawBase) ? rawBase.replace(/\/$/, '') : '/'
}
