import { useReducedMotion } from 'framer-motion'

/**
 * 사용자가 '동작 줄이기'를 켰는지 여부.
 * framer-motion 의 훅을 감싸 null 을 false 로 정규화한다.
 */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false
}
