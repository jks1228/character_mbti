import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'error'

export interface ToastMessage {
  id: number
  text: string
  tone: ToastTone
}

export interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (text: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast 는 ToastProvider 안에서만 사용할 수 있습니다')
  }
  return context
}
