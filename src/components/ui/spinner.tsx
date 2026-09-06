interface SpinnerProps {
  label?: string
}

export function Spinner({ label = '불러오는 중' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex items-center justify-center py-24"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-50" />
    </div>
  )
}
