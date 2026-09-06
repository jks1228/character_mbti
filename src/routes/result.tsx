import { Link, useParams } from 'react-router-dom'
import { mbtiTypes } from '@/data/mbti-types'
import { isValidMbtiCode } from '@/lib/scoring'

// T7에서 캐릭터 히어로·성향 막대·궁합·공유 UI 로 확장된다
export default function ResultPage() {
  const { type } = useParams()
  const code = (type ?? '').toUpperCase()

  if (!isValidMbtiCode(code)) {
    return (
      <section className="flex flex-col items-center gap-5 py-24 text-center">
        <p className="text-6xl" aria-hidden>
          ❓
        </p>
        <h1 className="text-2xl font-bold">알 수 없는 유형이에요</h1>
        <Link
          to="/types"
          className="rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700"
        >
          유형 갤러리 보기
        </Link>
      </section>
    )
  }

  const info = mbtiTypes[code]

  return (
    <section className="py-16 text-center">
      <p className="text-7xl" aria-hidden>
        {info.emoji}
      </p>
      <h1 className="mt-4 text-3xl font-extrabold">
        {info.code} · {info.nickname}
      </h1>
      <p className="mt-2 opacity-75">{info.tagline}</p>
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed opacity-70">
        {info.description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/quiz"
          className="rounded-full border border-current/20 px-5 py-2.5 font-semibold"
        >
          테스트 다시하기
        </Link>
        <Link
          to="/types"
          className="rounded-full border border-current/20 px-5 py-2.5 font-semibold"
        >
          전체 유형 보기
        </Link>
      </div>
    </section>
  )
}
