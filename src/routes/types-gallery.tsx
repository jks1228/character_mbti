import { Link } from 'react-router-dom'
import { mbtiTypeList } from '@/data/mbti-types'

// T9에서 반응형 그리드·등장 애니메이션으로 다듬어진다
export default function TypesGalleryPage() {
  return (
    <section className="py-12">
      <h1 className="text-center text-2xl font-bold">16가지 유형</h1>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {mbtiTypeList.map((info) => (
          <li key={info.code}>
            <Link
              to={`/result/${info.code}`}
              className="flex flex-col items-center gap-1 rounded-2xl border border-current/10 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="text-3xl" aria-hidden>
                {info.emoji}
              </span>
              <span className="font-bold">{info.code}</span>
              <span className="text-xs opacity-70">{info.nickname}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
