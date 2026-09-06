import { fireEvent, render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import QuizPage from '@/routes/quiz'
import { questions } from '@/data/questions'
import { isValidMbtiCode } from '@/lib/scoring'

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="path">{location.pathname}</div>
}

function renderQuiz() {
  return render(
    <MemoryRouter initialEntries={['/quiz']}>
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result/:type" element={<LocationProbe />} />
        <Route path="/" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('QuizPage', () => {
  it('첫 문항과 진행바가 보인다', () => {
    renderQuiz()
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('모든 문항에 답하면 /result/<유효코드> 로 이동한다', () => {
    renderQuiz()
    for (let i = 0; i < questions.length; i++) {
      fireEvent.click(screen.getByRole('button', { name: /매우 그렇다/ }))
    }
    const path = screen.getByTestId('path').textContent ?? ''
    expect(path.startsWith('/result/')).toBe(true)
    expect(isValidMbtiCode(path.replace('/result/', ''))).toBe(true)
  })

  it('숫자 키로 응답하면 다음 문항으로 넘어간다', () => {
    renderQuiz()
    fireEvent.keyDown(window, { key: '3' })
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4')
  })

  it('첫 문항에서 이전을 누르면 홈으로 나간다', () => {
    renderQuiz()
    fireEvent.click(screen.getByRole('button', { name: '그만두기' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/')
  })
})
