/**
 * 결과 카드 DOM 을 PNG 로 저장한다.
 * html-to-image 는 초기 번들에서 제외하기 위해 동적 import 한다.
 * 캐릭터가 로컬 이모지/CSS 그라디언트라 외부 리소스 CORS 문제가 없다.
 */
export async function downloadResultImage(
  node: HTMLElement,
  code: string,
): Promise<void> {
  const { toPng } = await import('html-to-image')
  const isDark = document.documentElement.classList.contains('dark')

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: isDark ? '#020617' : '#ffffff',
  })

  const link = document.createElement('a')
  link.download = `mbti-${code}.png`
  link.href = dataUrl
  link.click()
}
