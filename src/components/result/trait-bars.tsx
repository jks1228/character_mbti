import { motion, type HTMLMotionProps } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { motionProps } from '@/lib/motion'
import {
  AXIS_ORDER,
  AXIS_POLES,
  type AxisResult,
  type MbtiCode,
  type Pole,
} from '@/types'

const POLE_LABEL: Record<Pole, string> = {
  E: '외향',
  I: '내향',
  S: '감각',
  N: '직관',
  T: '사고',
  F: '감정',
  J: '계획',
  P: '즉흥',
}

interface TraitRow {
  first: Pole
  second: Pole
  /** 우세한 극 */
  pole: Pole
  /** 우세도(%) — 응답이 없으면 null */
  percent: number | null
}

interface TraitBarsProps {
  /** 퀴즈를 방금 끝낸 경우의 실제 축 결과. 공유 링크 유입 등으로 없으면 null */
  axes: AxisResult[] | null
  /** axes 가 없을 때 코드 문자로 확정 극만 표시하기 위한 값 */
  code: MbtiCode
}

function buildRows(axes: AxisResult[] | null, code: MbtiCode): TraitRow[] {
  return AXIS_ORDER.map((axis, i) => {
    const [first, second] = AXIS_POLES[axis]
    const real = axes?.find((entry) => entry.axis === axis)
    if (real) {
      return { first, second, pole: real.pole, percent: real.percent }
    }
    const letter = code[i]
    const pole: Pole = letter === first ? first : second
    return { first, second, pole, percent: null }
  })
}

export function TraitBars({ axes, code }: TraitBarsProps) {
  const reduced = usePrefersReducedMotion()
  const rows = buildRows(axes, code)

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const alignedLeft = row.pole === row.first
        const width = row.percent === null ? '64%' : `${row.percent}%`
        const sideStyle = alignedLeft ? { left: 0 } : { right: 0 }

        const fillProps: HTMLMotionProps<'div'> = reduced
          ? { animate: { width } }
          : motionProps<'div'>(reduced, {
              initial: { width: 0 },
              whileInView: { width },
              viewport: { once: true },
              transition: { duration: 0.7, ease: 'easeOut' },
            })

        return (
          <div key={row.first + row.second}>
            <div className="flex justify-between text-xs font-bold">
              <span className={alignedLeft ? 'text-brand-600 dark:text-brand-300' : 'opacity-45'}>
                {POLE_LABEL[row.first]} · {row.first}
              </span>
              <span className={!alignedLeft ? 'text-brand-600 dark:text-brand-300' : 'opacity-45'}>
                {row.second} · {POLE_LABEL[row.second]}
              </span>
            </div>
            <div className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
              <motion.div
                className="absolute inset-y-0 rounded-full bg-brand-600"
                style={sideStyle}
                {...fillProps}
              />
            </div>
            {row.percent !== null && (
              <p
                className={`mt-1 text-xs opacity-55 ${alignedLeft ? 'text-left' : 'text-right'}`}
              >
                {row.percent}%
              </p>
            )}
          </div>
        )
      })}
      {axes === null && (
        <p className="pt-1 text-center text-xs opacity-55">
          테스트를 완료하면 성향의 세기까지 확인할 수 있어요.
        </p>
      )}
    </div>
  )
}
