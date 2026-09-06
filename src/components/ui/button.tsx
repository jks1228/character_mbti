import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  /** 있으면 <Link> 로, 없으면 <button> 으로 렌더된다 */
  to?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,box-shadow] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700',
  outline:
    'border border-current/25 hover:bg-black/5 dark:hover:bg-white/10',
  ghost: 'hover:bg-black/5 dark:hover:bg-white/10',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  )

  if (to && !disabled) {
    return (
      <Link to={to} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
