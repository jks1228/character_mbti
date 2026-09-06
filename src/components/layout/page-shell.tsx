import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './theme-toggle'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
        >
          <span aria-hidden className="text-xl">
            🎭
          </span>
          애니 MBTI
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-xs opacity-60">
        재미로 보는 성격 유형 테스트 · 결과는 참고용이에요
      </footer>
    </div>
  )
}
