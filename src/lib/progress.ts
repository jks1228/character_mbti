import { loadJson, remove, saveJson } from '@/lib/storage'
import { type AnswerMap } from '@/types'

export const QUIZ_PROGRESS_KEY = 'anime-mbti:quiz-progress'

export interface QuizProgress {
  /** 마지막으로 보고 있던 문항 인덱스 */
  index: number
  answers: AnswerMap
  updatedAt: number
}

export interface QuizProgressSummary {
  answered: number
  index: number
}

function isProgress(value: unknown): value is QuizProgress {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.index === 'number' &&
    typeof record.answers === 'object' &&
    record.answers !== null
  )
}

export function loadQuizProgress(): QuizProgress | null {
  const data = loadJson<unknown>(QUIZ_PROGRESS_KEY, null)
  return isProgress(data) ? data : null
}

export function saveQuizProgress(index: number, answers: AnswerMap): void {
  saveJson<QuizProgress>(QUIZ_PROGRESS_KEY, {
    index,
    answers,
    updatedAt: Date.now(),
  })
}

export function clearQuizProgress(): void {
  remove(QUIZ_PROGRESS_KEY)
}

/** 홈에서 '이어서 하기'를 노출할지 판단하기 위한 요약. 응답이 하나도 없으면 null. */
export function getQuizProgressSummary(): QuizProgressSummary | null {
  const progress = loadQuizProgress()
  if (!progress) return null
  const answered = Object.keys(progress.answers).length
  if (answered === 0) return null
  return { answered, index: progress.index }
}
