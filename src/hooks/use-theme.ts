import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  mode: ThemeMode
  /** 현재 실제로 적용된 테마가 다크인지 */
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  /** light → dark → system 순환 */
  cycleMode: () => void
}

export const THEME_STORAGE_KEY = 'anime-mbti:theme'
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system']

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useTheme 는 ThemeProvider 안에서만 사용할 수 있습니다')
  }
  return value
}
