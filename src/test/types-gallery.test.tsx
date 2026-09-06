import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TypesGalleryPage from '@/routes/types-gallery'
import { MBTI_CODES } from '@/types'
import { mbtiTypes } from '@/data/mbti-types'

describe('TypesGalleryPage', () => {
  it('16개 유형 카드를 모두 렌더하고 각 결과로 링크한다', () => {
    render(
      <MemoryRouter>
        <TypesGalleryPage />
      </MemoryRouter>,
    )

    for (const code of MBTI_CODES) {
      const link = screen.getByRole('link', {
        name: new RegExp(`${code}.*${mbtiTypes[code].nickname}`),
      })
      expect(link).toHaveAttribute('href', `/result/${code}`)
    }
  })
})
