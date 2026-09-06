import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import ResultPage from '@/routes/result'
import { mbtiTypes } from '@/data/mbti-types'
import { questions } from '@/data/questions'
import { QUIZ_PROGRESS_KEY, loadQuizProgress } from '@/lib/progress'
import { type AnswerMap } from '@/types'

function renderResult(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/result/:type" element={<ResultPage />} />
        <Route path="/types" element={<div>갤러리</div>} />
        <Route path="/quiz" element={<div>퀴즈</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

// 특정 코드가 나오도록 모든 문항을 극단값으로 채운다
function answersFor(target: string): AnswerMap {
  const axisOrder = ['EI', 'SN', 'TF', 'JP']
  const firstPoles = new Set(['E', 'S', 'T', 'J'])
  const map: AnswerMap = {}
  for (const q of questions) {
    const wantedPole = target[axisOrder.indexOf(q.axis)] ?? 'I'
    const wantsFirst = firstPoles.has(wantedPole)
    const towardFirst = q.direction === 1 ? 2 : -2
    map[q.id] = (wantsFirst ? towardFirst : -towardFirst) as -2 | 2
  }
  return map
}

beforeEach(() => {
  localStorage.clear()
})

describe('ResultPage', () => {
  it('유효한 코드(소문자 포함)면 캐릭터·설명·직업을 보여준다', () => {
    renderResult('/result/intj')
    expect(screen.getByText(mbtiTypes.INTJ.nickname)).toBeInTheDocument()
    expect(screen.getByText(mbtiTypes.INTJ.tagline)).toBeInTheDocument()
    expect(
      screen.getByText(mbtiTypes.INTJ.description),
    ).toBeInTheDocument()
  })

  it('잘못된 코드면 안내와 갤러리 링크를 보여준다', () => {
    renderResult('/result/ZZZZ')
    expect(screen.getByText(/알 수 없는 유형/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /유형 갤러리/ }),
    ).toHaveAttribute('href', '/types')
  })

  it('궁합 유형 칩은 해당 결과로 링크된다', () => {
    renderResult('/result/INTJ')
    const chip = screen.getByRole('link', { name: /ENFP/ })
    expect(chip).toHaveAttribute('href', '/result/ENFP')
  })

  it('응답이 저장돼 있고 코드가 일치하면 성향 세기(%)를 표시한다', () => {
    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({
        index: questions.length,
        answers: answersFor('INTJ'),
        updatedAt: Date.now(),
      }),
    )
    renderResult('/result/INTJ')
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0)
  })

  it('직접 유입(응답 없음)이면 세기 안내 문구를 보여주고 깨지지 않는다', () => {
    renderResult('/result/ENFP')
    expect(screen.getByText(mbtiTypes.ENFP.nickname)).toBeInTheDocument()
    expect(
      screen.getByText(/테스트를 완료하면 성향의 세기/),
    ).toBeInTheDocument()
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })

  it('테스트 다시하기를 누르면 저장된 진행이 초기화된다', () => {
    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({ index: 3, answers: { 1: 2 }, updatedAt: Date.now() }),
    )
    renderResult('/result/INTJ')
    fireEvent.click(screen.getByRole('link', { name: '테스트 다시하기' }))
    expect(loadQuizProgress()).toBeNull()
  })
})
