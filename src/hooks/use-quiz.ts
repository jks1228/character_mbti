import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { questions } from '@/data/questions'
import {
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
} from '@/lib/progress'
import { type AnswerMap, type AnswerValue, type Question } from '@/types'

const TOTAL = questions.length

interface QuizState {
  index: number
  answers: AnswerMap
}

type QuizAction =
  | { type: 'answer'; id: number; value: AnswerValue }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'reset' }

function isAnswerValue(value: unknown): value is AnswerValue {
  return (
    value === -2 ||
    value === -1 ||
    value === 0 ||
    value === 1 ||
    value === 2
  )
}

// 저장된 응답에서 유효한 항목만 걸러낸다 (외부에서 조작된 값 방어)
function sanitizeAnswers(raw: unknown): AnswerMap {
  if (typeof raw !== 'object' || raw === null) return {}
  const validIds = new Set(questions.map((question) => question.id))
  const result: AnswerMap = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(key)
    if (validIds.has(id) && isAnswerValue(value)) result[id] = value
  }
  return result
}

function initState(): QuizState {
  const saved = loadQuizProgress()
  if (saved) {
    const answers = sanitizeAnswers(saved.answers)
    const answered = Object.keys(answers).length
    // 응답이 일부만 있을 때만 이어서 진행한다 (완료본/빈 값은 새로 시작)
    if (answered > 0 && answered < TOTAL) {
      const index = Math.min(Math.max(saved.index, 0), TOTAL - 1)
      return { index, answers }
    }
  }
  return { index: 0, answers: {} }
}

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'answer':
      return {
        ...state,
        answers: { ...state.answers, [action.id]: action.value },
      }
    case 'next':
      return { ...state, index: Math.min(state.index + 1, TOTAL) }
    case 'prev':
      return { ...state, index: Math.max(state.index - 1, 0) }
    case 'reset':
      return { index: 0, answers: {} }
  }
}

export interface UseQuizResult {
  index: number
  total: number
  answers: AnswerMap
  currentQuestion: Question | null
  currentAnswer: AnswerValue | null
  answeredCount: number
  /** 0~1 */
  progress: number
  isComplete: boolean
  isFirst: boolean
  answer: (value: AnswerValue) => void
  next: () => void
  prev: () => void
  reset: () => void
}

export function useQuiz(): UseQuizResult {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  const currentQuestion = questions[state.index] ?? null
  const answeredCount = Object.keys(state.answers).length
  const isComplete = answeredCount === TOTAL

  // 상태가 바뀔 때마다 진행 상황을 저장한다
  useEffect(() => {
    if (Object.keys(state.answers).length === 0) {
      clearQuizProgress()
      return
    }
    saveQuizProgress(state.index, state.answers)
  }, [state])

  const answer = useCallback(
    (value: AnswerValue) => {
      if (currentQuestion) {
        dispatch({ type: 'answer', id: currentQuestion.id, value })
      }
    },
    [currentQuestion],
  )
  const next = useCallback(() => dispatch({ type: 'next' }), [])
  const prev = useCallback(() => dispatch({ type: 'prev' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const currentAnswer =
    currentQuestion && state.answers[currentQuestion.id] !== undefined
      ? state.answers[currentQuestion.id] ?? null
      : null

  return useMemo(
    () => ({
      index: state.index,
      total: TOTAL,
      answers: state.answers,
      currentQuestion,
      currentAnswer,
      answeredCount,
      progress: answeredCount / TOTAL,
      isComplete,
      isFirst: state.index === 0,
      answer,
      next,
      prev,
      reset,
    }),
    [
      state.index,
      state.answers,
      currentQuestion,
      currentAnswer,
      answeredCount,
      isComplete,
      answer,
      next,
      prev,
      reset,
    ],
  )
}
