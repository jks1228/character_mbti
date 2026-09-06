import { useMemo } from 'react'
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/cn'
import { clearQuizProgress, getQuizProgressSummary } from '@/lib/progress'
import { questions } from '@/data/questions'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const DECOR = [
  { emoji: '🦊', position: 'left-[6%] top-[14%]', delay: 0 },
  { emoji: '🐬', position: 'right-[8%] top-[22%]', delay: 0.6 },
  { emoji: '🦉', position: 'left-[12%] bottom-[16%]', delay: 1.2 },
  { emoji: '🦜', position: 'right-[12%] bottom-[12%]', delay: 0.3 },
]

function BackgroundDecor({ reduced }: { reduced: boolean }) {
  const blobA: HTMLMotionProps<'div'> = reduced
    ? {}
    : {
        animate: { x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.08, 1] },
        transition: { duration: 13, repeat: Infinity, ease: 'easeInOut' },
      }
  const blobB: HTMLMotionProps<'div'> = reduced
    ? {}
    : {
        animate: { x: [0, -28, 0], y: [0, 22, 0], scale: [1, 1.1, 1] },
        transition: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
      }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        {...blobA}
        className="absolute -left-16 top-4 size-64 rounded-full bg-brand-400/30 blur-3xl"
      />
      <motion.div
        {...blobB}
        className="absolute -right-12 top-40 size-72 rounded-full bg-pink-400/25 blur-3xl"
      />
      <div className="hidden sm:block">
        {DECOR.map(({ emoji, position, delay }) => {
          const float: HTMLMotionProps<'span'> = reduced
            ? {}
            : {
                animate: { y: [0, -14, 0] },
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay,
                },
              }
          return (
            <motion.span
              key={emoji}
              {...float}
              className={cn('absolute text-3xl opacity-70', position)}
            >
              {emoji}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const reduced = usePrefersReducedMotion()
  const total = questions.length
  const progress = useMemo(() => getQuizProgressSummary(), [])

  return (
    <div className="relative">
      <BackgroundDecor reduced={reduced} />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-5 py-16 text-center sm:gap-6 sm:py-24"
      >
        <motion.p variants={itemVariants} className="text-6xl sm:text-7xl" aria-hidden>
          🎭
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-extrabold leading-tight sm:text-5xl"
        >
          16가지 캐릭터로 보는
          <br />
          나의 성격 유형
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-md text-balance opacity-70 sm:text-lg"
        >
          {total}개의 질문에 답하면 나와 가장 닮은 애니메이션 캐릭터를 찾아드려요.
        </motion.p>

        <motion.p variants={itemVariants} className="text-sm opacity-55">
          문항 {total}개 · 약 3분 소요
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center"
        >
          {progress ? (
            <>
              <Button to="/quiz" size="lg" fullWidth>
                이어서 하기 ({progress.answered}/{total})
              </Button>
              <Button
                to="/quiz"
                variant="outline"
                size="lg"
                fullWidth
                onClick={clearQuizProgress}
              >
                처음부터
              </Button>
            </>
          ) : (
            <Button to="/quiz" size="lg" fullWidth>
              테스트 시작하기
            </Button>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button to="/types" variant="ghost" size="sm">
            먼저 유형 갤러리 둘러보기 →
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
