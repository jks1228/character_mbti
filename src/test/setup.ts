import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom 에는 matchMedia 가 없으므로 최소 구현을 채운다.
// 테스트는 애니메이션을 건너뛰도록 '동작 줄이기'를 켠 것으로 취급한다(다크모드는 꺼짐).
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: /prefers-reduced-motion/.test(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}
