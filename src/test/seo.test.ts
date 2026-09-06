import { afterEach, describe, expect, it } from 'vitest'
import { applySeo } from '@/lib/seo'

function metaContent(selector: string): string | null {
  return document.head.querySelector(selector)?.getAttribute('content') ?? null
}

afterEach(() => {
  document.title = ''
  document.head
    .querySelectorAll('meta[name], meta[property]')
    .forEach((el) => el.remove())
})

describe('applySeo', () => {
  it('제목과 메타태그를 갱신하고, 정리 함수로 원래 값을 되돌린다', () => {
    document.title = '기본 제목'
    const desc = document.createElement('meta')
    desc.setAttribute('name', 'description')
    desc.setAttribute('content', '기본 설명')
    document.head.appendChild(desc)

    const restore = applySeo({
      title: 'INTJ 결과',
      description: '전략가 올빼미',
      imageUrl: 'https://example.com/og/INTJ.png',
      url: 'https://example.com/result/INTJ',
    })

    expect(document.title).toBe('INTJ 결과')
    expect(metaContent('meta[name="description"]')).toBe('전략가 올빼미')
    expect(metaContent('meta[property="og:title"]')).toBe('INTJ 결과')
    expect(metaContent('meta[property="og:image"]')).toBe(
      'https://example.com/og/INTJ.png',
    )
    expect(metaContent('meta[name="twitter:description"]')).toBe('전략가 올빼미')

    restore()
    expect(document.title).toBe('기본 제목')
    expect(metaContent('meta[name="description"]')).toBe('기본 설명')
  })
})
