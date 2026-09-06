import { cn } from '@/lib/cn'

interface OptionButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
  /** 키보드 단축키(1~5) 표시용 */
  hotkey: number
}

export function OptionButton({
  label,
  selected,
  onSelect,
  hotkey,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
        selected
          ? 'border-brand-600 bg-brand-600/10 font-semibold'
          : 'border-current/15 hover:border-brand-400 hover:bg-black/5 dark:hover:bg-white/10',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-full border text-xs',
          selected
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-current/30 opacity-60',
        )}
      >
        {hotkey}
      </span>
      <span>{label}</span>
    </button>
  )
}
