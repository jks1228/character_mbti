import { useTheme, type ThemeMode } from '@/hooks/use-theme'

const LABEL: Record<ThemeMode, string> = {
  light: '라이트',
  dark: '다크',
  system: '시스템',
}

const ICON: Record<ThemeMode, string> = {
  light: '☀️',
  dark: '🌙',
  system: '🖥️',
}

export function ThemeToggle() {
  const { mode, cycleMode } = useTheme()

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={`테마 전환 (현재: ${LABEL[mode]} 모드)`}
      title={`테마: ${LABEL[mode]}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      <span aria-hidden>{ICON[mode]}</span>
      <span className="hidden sm:inline">{LABEL[mode]}</span>
    </button>
  )
}
