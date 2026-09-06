import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Spinner } from '@/components/ui/spinner'
import { QuestionCard } from '@/components/quiz/question-card'
import { useQuiz } from '@/hooks/use-quiz'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { likertOptions } from '@/data/likert-options'
import { questions } from '@/data/questions'
import { computeResult } from '@/lib/scoring'
import { type AnswerValue } from '@/types'

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -64 : 64, opacity: 0 }),
}

export default function QuizPage() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const {
    index,
    total,
    answers,
    currentQuestion,
    currentAnswer,
    answeredCount,
    progress,
    isComplete,
    isFirst,
    answer,
    next,
    prev,
  } = useQuiz()

  // 슬라이드 방향: 1 = 다음(오른→왼), -1 = 이전(왼→오)
  const [direction, setDirection] = useState(1)

  // 24문항을 모두 채우면 결과를 계산해 이동한다
  useEffect(() => {
    if (!isComplete) return
    const { code } = computeResult(questions, answers)
    navigate(`/result/${code}`, { replace: true })
  }, [isComplete, answers, navigate])

  const goNext = useCallback(() => {
    setDirection(1)
    next()
  }, [next])

  const goPrev = useCallback(() => {
    setDirection(-1)
    prev()
  }, [prev])

  const handleAnswer = useCallback(
    (value: AnswerValue) => {
      answer(value)
      setDirection(1)
      if (reduced) {
        next()
        return
      }
      window.setTimeout(() => next(), 240)
    },
    [answer, next, reduced],
  )

  const handleBack = useCallback(() => {
    if (isFirst) {
      navigate('/')
      return
    }
    goPrev()
  }, [isFirst, navigate, goPrev])

  // 키보드: 1~5 응답, ←/Backspace 이전, → 다음
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key >= '1' && event.key <= '5') {
        const option = likertOptions[Number(event.key) - 1]
        if (option) handleAnswer(option.value)
      } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
        event.preventDefault()
        handleBack()
      } else if (event.key === 'ArrowRight' && currentAnswer !== null) {
        goNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleAnswer, handleBack, goNext, currentAnswer])

  if (!currentQuestion) {
    return <Spinner label="결과를 계산하는 중" />
  }

  const cardMotion: HTMLMotionProps<'div'> = reduced
    ? {}
    : {
        variants: slideVariants,
        initial: 'enter',
        animate: 'center',
        exit: 'exit',
        transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <section className="py-8">
      <p className="sr-only" aria-live="polite">
        {total}문항 중 {index + 1}번째 문항입니다. {answeredCount}문항 답변 완료.
      </p>

      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label={isFirst ? '그만두고 홈으로' : '이전 문항'}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-current/20 text-lg transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          ←
        </button>
        <ProgressBar
          value={progress}
          label={`${total}문항 중 ${answeredCount}문항 완료`}
        />
        <span className="w-12 shrink-0 text-right text-sm tabular-nums opacity-60">
          {answeredCount}/{total}
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentQuestion.id}
          custom={direction}
          {...cardMotion}
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={index + 1}
            total={total}
            currentValue={currentAnswer}
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          {isFirst ? '그만두기' : '이전'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentAnswer === null}
        >
          다음
        </Button>
      </div>
    </section>
  )
}
