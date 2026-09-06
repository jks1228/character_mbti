import { useMemo, useState, type ReactNode, type RefObject } from 'react'
import { useToast } from '@/hooks/use-toast'
import { downloadResultImage } from '@/lib/download-image'
import {
  buildSharePayload,
  canUseNativeShare,
  copyLink,
  isKakaoConfigured,
  shareKakao,
  shareNative,
  shareX,
} from '@/lib/share'
import { type MbtiCode } from '@/types'

interface ShareBarProps {
  code: MbtiCode
  /** 이미지로 저장할 결과 카드 DOM 참조 */
  captureRef: RefObject<HTMLElement | null>
}

interface ShareButtonProps {
  onClick: () => void
  icon: ReactNode
  label: string
  disabled?: boolean
}

function ShareButton({ onClick, icon, label, disabled = false }: ShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
    >
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  )
}

export function ShareBar({ code, captureRef }: ShareBarProps) {
  const { showToast } = useToast()
  const payload = useMemo(() => buildSharePayload(code), [code])
  const [saving, setSaving] = useState(false)

  const kakaoEnabled = isKakaoConfigured()
  const nativeEnabled = canUseNativeShare()

  async function handleKakao(): Promise<void> {
    try {
      await shareKakao(payload)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '카카오 공유에 실패했어요',
        'error',
      )
    }
  }

  async function handleNative(): Promise<void> {
    try {
      await shareNative(payload)
    } catch {
      showToast('공유에 실패했어요', 'error')
    }
  }

  async function handleCopy(): Promise<void> {
    try {
      await copyLink(payload)
      showToast('결과 링크를 복사했어요')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '복사에 실패했어요',
        'error',
      )
    }
  }

  async function handleDownload(): Promise<void> {
    const node = captureRef.current
    if (!node) return
    setSaving(true)
    try {
      await downloadResultImage(node, code)
      showToast('결과 이미지를 저장했어요')
    } catch {
      showToast('이미지 저장에 실패했어요', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-bold opacity-70">결과 공유하기</p>
      <div className="flex flex-wrap justify-center gap-2">
        {kakaoEnabled && (
          <ShareButton onClick={handleKakao} icon="💬" label="카카오톡" />
        )}
        <ShareButton onClick={() => shareX(payload)} icon="𝕏" label="트위터" />
        {nativeEnabled && (
          <ShareButton onClick={handleNative} icon="📤" label="공유" />
        )}
        <ShareButton onClick={handleCopy} icon="🔗" label="링크 복사" />
        <ShareButton
          onClick={handleDownload}
          icon="🖼️"
          label={saving ? '저장 중…' : '이미지 저장'}
          disabled={saving}
        />
      </div>
    </div>
  )
}
