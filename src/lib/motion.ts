import { type HTMLMotionProps } from 'framer-motion'

type Tag = keyof HTMLElementTagNameMap

/**
 * '동작 줄이기'가 켜져 있으면 빈 객체를, 아니면 전달한 motion props 를 반환한다.
 * exactOptionalPropertyTypes 환경에서 `prop={undefined}` 전달을 피하기 위한 헬퍼.
 */
export function motionProps<T extends Tag>(
  reduced: boolean,
  props: HTMLMotionProps<T>,
): HTMLMotionProps<T> {
  return reduced ? {} : props
}
