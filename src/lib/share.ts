import { mbtiTypes } from '@/data/mbti-types'
import { type MbtiCode } from '@/types'

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'

export interface SharePayload {
  url: string
  title: string
  description: string
  imageUrl: string
}

function siteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL
  if (configured && configured.trim().length > 0) {
    return configured.replace(/\/+$/, '')
  }
  return window.location.origin
}

export function buildSharePayload(code: MbtiCode): SharePayload {
  const origin = siteOrigin()
  const base = import.meta.env.BASE_URL
  const info = mbtiTypes[code]
  return {
    url: `${origin}${base}result/${code}`,
    title: `내 MBTI는 ${code} · ${info.nickname}`,
    description: info.tagline,
    imageUrl: `${origin}${base}og/${code}.png`,
  }
}

export function getKakaoKey(): string | null {
  const key = import.meta.env.VITE_KAKAO_JS_KEY
  return key && key.trim().length > 0 ? key : null
}

export function isKakaoConfigured(): boolean {
  return getKakaoKey() !== null
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export function shareX(payload: SharePayload): void {
  const params = new URLSearchParams({ text: payload.title, url: payload.url })
  window.open(
    `https://twitter.com/intent/tweet?${params.toString()}`,
    '_blank',
    'noopener,noreferrer',
  )
}

export async function shareNative(payload: SharePayload): Promise<boolean> {
  if (!navigator.share) return false
  try {
    await navigator.share({
      title: payload.title,
      text: payload.description,
      url: payload.url,
    })
    return true
  } catch (error) {
    // 사용자가 공유 시트를 닫으면 AbortError → 실패로 보지 않는다
    if (error instanceof DOMException && error.name === 'AbortError') return false
    throw error
  }
}

export async function copyLink(payload: SharePayload): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('이 브라우저에서는 링크 복사를 지원하지 않아요')
  }
  await navigator.clipboard.writeText(payload.url)
}

let kakaoLoading: Promise<KakaoStatic> | null = null

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () =>
      reject(new Error('카카오 SDK 를 불러오지 못했어요')),
    )
    document.head.appendChild(script)
  })
}

export async function loadKakao(): Promise<KakaoStatic> {
  const key = getKakaoKey()
  if (!key) throw new Error('카카오 공유가 설정되어 있지 않아요')

  const existing = window.Kakao
  if (existing?.isInitialized()) return existing

  if (!kakaoLoading) {
    kakaoLoading = (async () => {
      await injectScript(KAKAO_SDK_URL)
      const kakao = window.Kakao
      if (!kakao) throw new Error('카카오 SDK 로드에 실패했어요')
      if (!kakao.isInitialized()) kakao.init(key)
      return kakao
    })().catch((error: unknown) => {
      kakaoLoading = null
      throw error
    })
  }
  return kakaoLoading
}

export async function shareKakao(payload: SharePayload): Promise<void> {
  const kakao = await loadKakao()
  const home = siteOrigin()
  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: payload.title,
      description: payload.description,
      imageUrl: payload.imageUrl,
      link: { mobileWebUrl: payload.url, webUrl: payload.url },
    },
    buttons: [
      {
        title: '나도 테스트하기',
        link: { mobileWebUrl: home, webUrl: home },
      },
    ],
  })
}
