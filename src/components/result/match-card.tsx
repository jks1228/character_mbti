import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { mbtiTypes } from '@/data/mbti-types'
import { type MbtiCode } from '@/types'

interface MatchCardProps {
  title: string
  codes: MbtiCode[]
  tone: 'good' | 'bad'
}

export function MatchCard({ title, codes, tone }: MatchCardProps) {
  return (
    <div>
      <h3 className="text-sm font-bold opacity-70">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {codes.map((code) => {
          const info = mbtiTypes[code]
          return (
            <li key={code}>
              <Link
                to={`/result/${code}`}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition hover:scale-[1.04]',
                  tone === 'good'
                    ? 'border-emerald-400/50 bg-emerald-400/10'
                    : 'border-rose-400/50 bg-rose-400/10',
                )}
              >
                <span aria-hidden>{info.emoji}</span>
                <span className="font-bold">{code}</span>
                <span className="opacity-60">{info.nickname}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
