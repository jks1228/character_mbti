import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ToastContext,
  type ToastContextValue,
  type ToastMessage,
  type ToastTone,
} from '@/hooks/use-toast'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'
import { motionProps } from '@/lib/motion'
import { cn } from '@/lib/cn'

let sequence = 0

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (text: string, tone: ToastTone = 'success') => {
      sequence += 1
      const id = sequence
      setToasts((current) => [...current, { id, text, tone }])
      window.setTimeout(() => dismiss(id), 3000)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, showToast, dismiss }),
    [toasts, showToast, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

interface ToastViewportProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => onDismiss(toast.id)}
            {...motionProps<'button'>(reduced, {
              initial: { opacity: 0, y: 16, scale: 0.96 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, scale: 0.96 },
              transition: { duration: 0.2 },
            })}
            className={cn(
              'pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg',
              toast.tone === 'error' ? 'bg-rose-600' : 'bg-slate-900 dark:bg-slate-700',
            )}
          >
            {toast.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
