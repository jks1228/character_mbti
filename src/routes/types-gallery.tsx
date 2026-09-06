import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { motionProps } from '@/lib/motion'
import { mbtiTypeList } from '@/data/mbti-types'

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function TypesGalleryPage() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="py-10">
      <h1 className="text-center text-2xl font-extrabold sm:text-3xl">
        16가지 캐릭터 유형
      </h1>
      <p className="mt-2 text-center text-sm opacity-65">
        카드를 눌러 각 유형의 자세한 설명을 확인해 보세요.
      </p>

      <motion.ul
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        {...motionProps<'ul'>(reduced, {
          variants: gridVariants,
          initial: 'hidden',
          whileInView: 'show',
          viewport: { once: true, amount: 0.1 },
        })}
      >
        {mbtiTypeList.map((info) => (
          <motion.li
            key={info.code}
            {...motionProps<'li'>(reduced, { variants: cardVariants })}
          >
            <Link
              to={`/result/${info.code}`}
              className="flex h-full flex-col items-center gap-1.5 rounded-2xl border border-current/10 bg-white/60 p-4 text-center transition hover:-translate-y-1 hover:shadow-xl dark:bg-white/5"
            >
              <span
                aria-hidden
                className="mb-1 grid size-14 place-items-center rounded-2xl text-3xl shadow-inner"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${info.theme.from}, ${info.theme.to})`,
                }}
              >
                {info.emoji}
              </span>
              <span className="font-extrabold tracking-wide">{info.code}</span>
              <span className="text-sm font-semibold">{info.nickname}</span>
              <span className="text-xs leading-snug opacity-60">
                {info.tagline}
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-10 text-center">
        <Link
          to="/quiz"
          className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          나는 어떤 유형일까? 테스트하기
        </Link>
      </div>
    </section>
  )
}
