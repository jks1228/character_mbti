export interface SeoInput {
  title: string
  description: string
  imageUrl?: string
  url?: string
}

type MetaAttr = 'name' | 'property'

function getOrCreateMeta(attr: MetaAttr, key: string): HTMLMetaElement {
  const selector = `meta[${attr}="${key}"]`
  const found = document.head.querySelector<HTMLMetaElement>(selector)
  if (found) return found
  const created = document.createElement('meta')
  created.setAttribute(attr, key)
  document.head.appendChild(created)
  return created
}

/**
 * SPA 라우트에 맞춰 document 제목과 메타태그를 갱신한다.
 * 이전 값을 되돌리는 정리 함수를 반환하므로 useEffect 에서 그대로 쓰면 된다.
 * (크롤러가 런타임 변경을 못 읽을 수 있어, 정확한 미리보기는 정적 OG 이미지로 보완한다)
 */
export function applySeo(input: SeoInput): () => void {
  const previousTitle = document.title
  const touched: Array<{ el: HTMLMetaElement; previous: string }> = []

  const set = (attr: MetaAttr, key: string, value: string): void => {
    const el = getOrCreateMeta(attr, key)
    touched.push({ el, previous: el.getAttribute('content') ?? '' })
    el.setAttribute('content', value)
  }

  document.title = input.title
  set('name', 'description', input.description)
  set('property', 'og:title', input.title)
  set('property', 'og:description', input.description)
  set('name', 'twitter:title', input.title)
  set('name', 'twitter:description', input.description)
  if (input.url) set('property', 'og:url', input.url)
  if (input.imageUrl) {
    set('property', 'og:image', input.imageUrl)
    set('name', 'twitter:image', input.imageUrl)
  }

  return () => {
    document.title = previousTitle
    for (const { el, previous } of touched) el.setAttribute('content', previous)
  }
}
