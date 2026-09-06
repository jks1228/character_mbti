import { Link } from 'react-router-dom'
import { questions } from '@/data/questions'

// T6에서 상태 머신·진행바·문항 슬라이드로 대체된다
export default function QuizPage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl font-bold">테스트</h1>
      <p className="mt-3 opacity-70">총 {questions.length}문항 (T6에서 구현)</p>
      <Link
        to="/result/INTJ"
        className="mt-8 inline-block rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white"
      >
        결과 미리보기
      </Link>
    </section>
  )
}
