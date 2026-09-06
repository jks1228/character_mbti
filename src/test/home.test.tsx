import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import HomePage from '@/routes/home'
import { QUIZ_PROGRESS_KEY } from '@/lib/progress'

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('HomePage', () => {
  it('저장된 진행이 없으면 "테스트 시작하기"만 보이고 이어하기는 없다', () => {
    renderHome()
    expect(
      screen.getByRole('link', { name: /테스트 시작하기/ }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/이어서 하기/)).not.toBeInTheDocument()
  })

  it('저장된 진행이 있으면 이어서 하기·처음부터 버튼이 보인다', () => {
    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({
        index: 5,
        answers: { 1: 2, 2: -1, 3: 1 },
        updatedAt: Date.now(),
      }),
    )
    renderHome()
    expect(screen.getByText(/이어서 하기 \(3\/24\)/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '처음부터' })).toBeInTheDocument()
    expect(screen.queryByText('테스트 시작하기')).not.toBeInTheDocument()
  })

  it('유형 갤러리 링크가 항상 존재한다', () => {
    renderHome()
    const galleryLink = screen.getByRole('link', { name: /유형 갤러리/ })
    expect(galleryLink).toHaveAttribute('href', '/types')
  })
})
