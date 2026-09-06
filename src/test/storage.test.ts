import { afterEach, describe, expect, it } from 'vitest'
import { loadJson, remove, saveJson } from '@/lib/storage'

afterEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('저장한 값을 그대로 읽어온다', () => {
    saveJson('foo', { a: 1, b: ['x', 'y'] })
    expect(loadJson('foo', null)).toEqual({ a: 1, b: ['x', 'y'] })
  })

  it('없는 키는 fallback 을 반환한다', () => {
    expect(loadJson('missing', 42)).toBe(42)
  })

  it('깨진 JSON 이 저장돼 있으면 fallback 을 반환한다', () => {
    localStorage.setItem('broken', '{not json')
    expect(loadJson('broken', 'safe')).toBe('safe')
  })

  it('remove 후에는 fallback 을 반환한다', () => {
    saveJson('temp', 'value')
    remove('temp')
    expect(loadJson('temp', 'gone')).toBe('gone')
  })
})
