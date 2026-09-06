import { type AnswerValue } from '@/types'

export interface LikertOption {
  value: AnswerValue
  /** 버튼에 표시할 문구 */
  label: string
}

// 긍정 → 부정 순으로 배치한다
export const likertOptions: LikertOption[] = [
  { value: 2, label: '매우 그렇다' },
  { value: 1, label: '그런 편이다' },
  { value: 0, label: '보통이다' },
  { value: -1, label: '아닌 편이다' },
  { value: -2, label: '전혀 아니다' },
]
