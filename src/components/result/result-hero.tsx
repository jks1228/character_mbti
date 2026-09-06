import { motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { motionProps } from '@/lib/motion'
import { type MbtiTypeInfo } from '@/types'

interface ResultHeroProps {
  info: MbtiTypeInfo
}

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const textItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ResultHero({ info }: ResultHeroProps) {
  const reduced = usePrefersReducedMotion()
  const { from, to } = info.theme

  return (
    <div
      className="relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white shadow-xl"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <motion.p
        className="text-7xl sm:text-8xl"
        aria-hidden
        {...motionProps<'p'>(reduced, {
          initial: { scale: 0, rotate: -25 },
          animate: { scale: 1, rotate: 0 },
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 13,
            delay: 0.05,
          },
        })}
      >
        {info.emoji}
      </motion.p>

      <motion.div
        {...motionProps<'div'>(reduced, {
          variants: textContainer,
          initial: 'hidden',
          animate: 'show',
        })}
      >
        <motion.p
          {...motionProps<'p'>(reduced, { variants: textItem })}
          className="mt-4 text-sm font-bold tracking-[0.35em] text-white/80"
        >
          {info.code}
        </motion.p>
        <motion.h1
          {...motionProps<'h1'>(reduced, { variants: textItem })}
          className="mt-1 text-3xl font-extrabold sm:text-4xl"
        >
          {info.nickname}
        </motion.h1>
        <motion.p
          {...motionProps<'p'>(reduced, { variants: textItem })}
          className="mx-auto mt-3 max-w-md text-balance text-white/90"
        >
          {info.tagline}
        </motion.p>
      </motion.div>
    </div>
  )
}
