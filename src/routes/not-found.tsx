import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-5 py-24 text-center">
      <p className="text-6xl" aria-hidden>
        🧭
      </p>
      <h1 className="text-2xl font-bold">길을 잃었어요</h1>
      <p className="opacity-70">요청한 페이지를 찾을 수 없어요.</p>
      <Link
        to="/"
        className="rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700"
      >
        홈으로 돌아가기
      </Link>
    </section>
  )
}
