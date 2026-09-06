import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'

interface PageTransitionProps {
  /** 라우트가 바뀔 때마다 달라지는 키 (보통 location.pathname) */
  locationKey: string
  children: ReactNode
}

const animatedProps: HTMLMotionProps<'div'> = {
  variants: {
    initial: { opacity: 0, y: 14 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -14 },
  },
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
}

export function PageTransition({ locationKey, children }: PageTransitionProps) {
  const reduced = usePrefersReducedMotion()
  const props = reduced ? {} : animatedProps

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={locationKey} {...props}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
