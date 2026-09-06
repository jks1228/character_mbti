import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { loadJson, saveJson } from '@/lib/storage'
import {
  THEME_MODES,
  THEME_STORAGE_KEY,
  ThemeContext,
  type ThemeContextValue,
  type ThemeMode,
} from '@/hooks/use-theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeSystemDark(onChange: () => void): () => void {
  const mq = globalThis.matchMedia?.(DARK_QUERY)
  if (!mq) return () => {}
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSystemDark(): boolean {
  return globalThis.matchMedia?.(DARK_QUERY).matches ?? false
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() =>
    loadJson<ThemeMode>(THEME_STORAGE_KEY, 'system'),
  )

  // OS 다크모드 설정을 외부 스토어로 구독한다 (system 모드에서 실시간 반영)
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDark,
    () => false,
  )
  const isDark = mode === 'system' ? systemDark : mode === 'dark'

  // 계산된 테마를 html.dark 클래스에 반영한다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // 선택한 모드를 저장한다
  useEffect(() => {
    saveJson(THEME_STORAGE_KEY, mode)
  }, [mode])

  const cycleMode = useCallback(() => {
    setMode((prev) => {
      const index = THEME_MODES.indexOf(prev)
      return THEME_MODES[(index + 1) % THEME_MODES.length] ?? 'system'
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark, setMode, cycleMode }),
    [mode, isDark, cycleMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
