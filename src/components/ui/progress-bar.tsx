import { motion } from 'framer-motion'

interface ProgressBarProps {
  /** 0~1 */
  value: number
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label ?? '진행률'}
      className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
    >
      <motion.div
        className="h-full rounded-full bg-brand-600"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 24 }}
      />
    </div>
  )
}
