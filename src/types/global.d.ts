export {}

declare global {
  interface KakaoLinkTarget {
    mobileWebUrl: string
    webUrl: string
  }

  interface KakaoFeedSettings {
    objectType: 'feed'
    content: {
      title: string
      description: string
      imageUrl: string
      link: KakaoLinkTarget
    }
    buttons?: Array<{ title: string; link: KakaoLinkTarget }>
  }

  interface KakaoStatic {
    isInitialized: () => boolean
    init: (jsKey: string) => void
    Share: {
      sendDefault: (settings: KakaoFeedSettings) => void
    }
  }

  interface Window {
    Kakao?: KakaoStatic
  }
}
