import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { PageShell } from './page-shell'
import { PageTransition } from './page-transition'

const HomePage = lazy(() => import('@/routes/home'))
const QuizPage = lazy(() => import('@/routes/quiz'))
const ResultPage = lazy(() => import('@/routes/result'))
const TypesGalleryPage = lazy(() => import('@/routes/types-gallery'))
const NotFoundPage = lazy(() => import('@/routes/not-found'))

export function AppRoutes() {
  const location = useLocation()

  return (
    <PageShell>
      <PageTransition locationKey={location.pathname}>
        <Suspense fallback={<Spinner />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result/:type" element={<ResultPage />} />
            <Route path="/types" element={<TypesGalleryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </PageShell>
  )
}
