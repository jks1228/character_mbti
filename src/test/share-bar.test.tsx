import { createRef } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShareBar } from '@/components/result/share-bar'
import { ToastProvider } from '@/components/ui/toast'

function renderShareBar() {
  const ref = createRef<HTMLElement>()
  render(
    <ToastProvider>
      <MemoryRouter>
        <article ref={ref}>결과 카드</article>
        <ShareBar code="INTJ" captureRef={ref} />
      </MemoryRouter>
    </ToastProvider>,
  )
  return ref
}

beforeEach(() => {
  vi.spyOn(window, 'open').mockImplementation(() => null)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ShareBar', () => {
  it('카카오 키가 없으면 카카오톡 버튼은 숨기고, 트위터·링크 복사는 보인다', () => {
    renderShareBar()
    expect(screen.queryByRole('button', { name: /카카오톡/ })).toBeNull()
    expect(screen.getByRole('button', { name: /트위터/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /링크 복사/ })).toBeInTheDocument()
  })

  it('링크 복사를 누르면 클립보드에 쓰고 토스트를 띄운다', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    renderShareBar()

    fireEvent.click(screen.getByRole('button', { name: /링크 복사/ }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce()
      expect(screen.getByText('결과 링크를 복사했어요')).toBeInTheDocument()
    })
  })

  it('트위터 버튼은 새 창으로 인텐트를 연다', () => {
    renderShareBar()
    fireEvent.click(screen.getByRole('button', { name: /트위터/ }))
    expect(window.open).toHaveBeenCalledOnce()
  })
})
