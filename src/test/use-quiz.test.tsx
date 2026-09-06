import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuiz } from '@/hooks/use-quiz'
import { loadQuizProgress } from '@/lib/progress'
import { questions } from '@/data/questions'

beforeEach(() => {
  localStorage.clear()
})

describe('useQuiz', () => {
  it('처음에는 첫 문항, 응답 0, 미완료 상태다', () => {
    const { result } = renderHook(() => useQuiz())
    expect(result.current.index).toBe(0)
    expect(result.current.answeredCount).toBe(0)
    expect(result.current.isComplete).toBe(false)
    expect(result.current.currentQuestion?.id).toBe(questions[0]?.id)
  })

  it('모든 문항에 응답하면 isComplete 가 true 가 된다', () => {
    const { result } = renderHook(() => useQuiz())
    for (let i = 0; i < questions.length; i++) {
      act(() => {
        result.current.answer(2)
        result.current.next()
      })
    }
    expect(result.current.answeredCount).toBe(questions.length)
    expect(result.current.isComplete).toBe(true)
  })

  it('prev 는 첫 문항 아래로 내려가지 않는다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.prev())
    expect(result.current.index).toBe(0)
  })

  it('응답이 localStorage 에 저장되고 새 인스턴스에서 복원된다', () => {
    const first = renderHook(() => useQuiz())
    act(() => {
      first.result.current.answer(1)
      first.result.current.next()
    })
    act(() => {
      first.result.current.answer(-2)
      first.result.current.next()
    })
    expect(Object.keys(loadQuizProgress()?.answers ?? {})).toHaveLength(2)
    first.unmount()

    const second = renderHook(() => useQuiz())
    expect(second.result.current.answeredCount).toBe(2)
    expect(second.result.current.index).toBe(2)
  })

  it('reset 하면 상태와 저장이 모두 비워진다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => {
      result.current.answer(2)
      result.current.next()
    })
    act(() => result.current.reset())
    expect(result.current.index).toBe(0)
    expect(result.current.answeredCount).toBe(0)
    expect(loadQuizProgress()).toBeNull()
  })
})
