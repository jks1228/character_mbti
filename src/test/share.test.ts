import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildSharePayload,
  canUseNativeShare,
  copyLink,
  isKakaoConfigured,
  shareX,
} from '@/lib/share'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('buildSharePayload', () => {
  it('결과 URL·OG 이미지 경로·제목을 코드 기준으로 만든다', () => {
    const payload = buildSharePayload('INTJ')
    expect(payload.url).toContain('/result/INTJ')
    expect(payload.imageUrl).toContain('/og/INTJ.png')
    expect(payload.title).toContain('INTJ')
  })
})

describe('shareX', () => {
  it('트위터 인텐트 URL 을 새 창으로 연다', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const payload = buildSharePayload('ENFP')
    shareX(payload)
    expect(openSpy).toHaveBeenCalledOnce()
    const openedUrl = String(openSpy.mock.calls[0]?.[0])
    expect(openedUrl.startsWith('https://twitter.com/intent/tweet?')).toBe(true)
    expect(openedUrl).toContain(encodeURIComponent(payload.url))
  })
})

describe('copyLink', () => {
  it('클립보드에 결과 URL 을 쓴다', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const payload = buildSharePayload('ISTP')
    await copyLink(payload)
    expect(writeText).toHaveBeenCalledWith(payload.url)
  })
})

describe('환경 기반 기능 감지', () => {
  it('카카오 키가 없으면 isKakaoConfigured 는 false 다', () => {
    expect(isKakaoConfigured()).toBe(false)
  })

  it('jsdom 에는 navigator.share 가 없어 canUseNativeShare 는 false 다', () => {
    expect(canUseNativeShare()).toBe(false)
  })
})
