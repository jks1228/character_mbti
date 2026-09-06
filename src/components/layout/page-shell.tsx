import { type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ThemeToggle } from './theme-toggle'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        본문 바로가기
      </a>

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
        >
          <span aria-hidden className="text-xl">
            🎭
          </span>
          애니 MBTI
        </Link>
        <nav className="flex items-center gap-1.5">
          <NavLink
            to="/types"
            className={({ isActive }) =>
              cn(
                'rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10',
                isActive && 'bg-black/5 dark:bg-white/10',
              )
            }
          >
            유형 갤러리
          </NavLink>
          <ThemeToggle />
        </nav>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-xs opacity-60">
        재미로 보는 성격 유형 테스트 · 결과는 참고용이에요
      </footer>
    </div>
  )
}
