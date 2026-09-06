import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/components/layout/app-routes'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { ToastProvider } from '@/components/ui/toast'

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {/* reducedMotion="user" 로 모든 motion 컴포넌트가 사용자 설정을 존중한다 */}
        <MotionConfig reducedMotion="user">
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRoutes />
          </BrowserRouter>
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  )
}
