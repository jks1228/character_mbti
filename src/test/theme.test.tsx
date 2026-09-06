import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { ThemeToggle } from '@/components/layout/theme-toggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('ThemeToggle', () => {
  it('클릭할 때마다 system → light → dark 순으로 순환하며 저장한다', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    const button = screen.getByRole('button')

    expect(button.getAttribute('aria-label')).toContain('시스템')

    fireEvent.click(button)
    expect(button.getAttribute('aria-label')).toContain('라이트')
    expect(localStorage.getItem('anime-mbti:theme')).toBe('"light"')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    fireEvent.click(button)
    expect(button.getAttribute('aria-label')).toContain('다크')
    expect(localStorage.getItem('anime-mbti:theme')).toBe('"dark"')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    fireEvent.click(button)
    expect(button.getAttribute('aria-label')).toContain('시스템')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
