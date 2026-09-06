import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MatchCard } from '@/components/result/match-card'
import { ResultHero } from '@/components/result/result-hero'
import { ShareBar } from '@/components/result/share-bar'
import { TraitBars } from '@/components/result/trait-bars'
import { mbtiTypes } from '@/data/mbti-types'
import { questions } from '@/data/questions'
import { computeResult, isValidMbtiCode } from '@/lib/scoring'
import { clearQuizProgress, loadQuizProgress } from '@/lib/progress'
import { applySeo } from '@/lib/seo'
import { buildSharePayload } from '@/lib/share'
import { type AxisResult } from '@/types'

function InvalidNotice() {
  return (
    <section className="flex flex-col items-center gap-5 py-24 text-center">
      <p className="text-6xl" aria-hidden>
        ❓
      </p>
      <h1 className="text-2xl font-bold">알 수 없는 유형이에요</h1>
      <p className="opacity-70">주소를 다시 확인하거나 갤러리에서 골라 보세요.</p>
      <Link
        to="/types"
        className="rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700"
      >
        유형 갤러리 보기
      </Link>
    </section>
  )
}

export default function ResultPage() {
  const { type } = useParams()
  const normalized = (type ?? '').toUpperCase()
  const validCode = isValidMbtiCode(normalized) ? normalized : null
  const cardRef = useRef<HTMLElement>(null)

  // 방금 퀴즈를 끝낸 사람이면 저장된 응답으로 실제 성향 세기를 계산한다
  const axes = useMemo<AxisResult[] | null>(() => {
    if (!validCode) return null
    const progress = loadQuizProgress()
    if (!progress) return null
    const result = computeResult(questions, progress.answers)
    return result.code === validCode ? result.axes : null
  }, [validCode])

  // 결과 유형에 맞춰 제목·OG 메타를 갱신하고, 벗어날 때 원래대로 되돌린다
  useEffect(() => {
    if (!validCode) return
    const payload = buildSharePayload(validCode)
    return applySeo({
      title: `${payload.title} | 애니 MBTI`,
      description: mbtiTypes[validCode].description,
      imageUrl: payload.imageUrl,
      url: payload.url,
    })
  }, [validCode])

  if (!validCode) return <InvalidNotice />

  const info = mbtiTypes[validCode]

  return (
    <div className="py-8">
      <article
        ref={cardRef}
        id="result-card"
        className="space-y-8 rounded-3xl bg-paper p-4 dark:bg-slate-950"
      >
        <ResultHero info={info} />

        <p className="mx-auto max-w-xl text-center leading-relaxed opacity-80">
          {info.description}
        </p>

        <section>
          <h2 className="mb-3 text-lg font-bold">나의 성향</h2>
          <TraitBars axes={axes} code={validCode} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
            <h3 className="font-bold">💪 강점</h3>
            <ul className="mt-2 space-y-1 text-sm opacity-90">
              {info.strengths.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
            <h3 className="font-bold">🌱 보완하면 좋은 점</h3>
            <ul className="mt-2 space-y-1 text-sm opacity-90">
              {info.weaknesses.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold opacity-70">잘 어울리는 직업</h3>
          <ul className="flex flex-wrap gap-2">
            {info.careers.map((career) => (
              <li
                key={career}
                className="rounded-full bg-black/5 px-3 py-1.5 text-sm dark:bg-white/10"
              >
                {career}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <MatchCard title="👏 이런 유형과 잘 맞아요" codes={info.compatible} tone="good" />
          <MatchCard title="😅 조금 노력이 필요한 유형" codes={info.incompatible} tone="bad" />
        </section>
      </article>

      <div className="mt-6">
        <ShareBar code={validCode} captureRef={cardRef} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/quiz" onClick={clearQuizProgress} size="lg">
          테스트 다시하기
        </Button>
        <Button to="/types" variant="outline" size="lg">
          전체 유형 보기
        </Button>
      </div>
    </div>
  )
}
