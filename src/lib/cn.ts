/** 조건부 className 을 공백으로 이어 붙이는 작은 헬퍼 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
