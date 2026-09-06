import { describe, expect, it } from 'vitest'
import { resolveBasename } from '@/lib/base-path'

describe('resolveBasename', () => {
  it('루트 배포를 뜻하는 값은 모두 "/" 로 정규화한다', () => {
    for (const raw of ['/', './', '/./', '', '.']) {
      expect(resolveBasename(raw)).toBe('/')
    }
  })

  it('하위 경로 배포는 끝 슬래시를 뗀 경로를 반환한다', () => {
    expect(resolveBasename('/anime-mbti/')).toBe('/anime-mbti')
    expect(resolveBasename('/foo/bar/')).toBe('/foo/bar')
    expect(resolveBasename('/app')).toBe('/app')
  })
})
