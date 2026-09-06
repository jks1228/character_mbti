import { useState } from 'react'
import { type MbtiCode } from '@/types'

interface ShareBarProps {
  code: MbtiCode
}

// T8에서 카카오/X/Web Share/이미지 저장이 추가된다. 지금은 링크 복사만 제공한다.
export function ShareBar({ code }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(): Promise<void> {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}result/${code}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-current/20 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
      >
        {copied ? '링크가 복사됐어요' : '🔗 결과 링크 복사'}
      </button>
    </div>
  )
}
