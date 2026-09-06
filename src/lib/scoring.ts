import {
  AXIS_ORDER,
  AXIS_POLES,
  AXIS_TIE_BREAK_POLE,
  MBTI_CODES,
  type AnswerMap,
  type Axis,
  type AxisResult,
  type MbtiCode,
  type Pole,
  type Question,
  type QuizResult,
} from '@/types'

const MBTI_CODE_SET: ReadonlySet<string> = new Set(MBTI_CODES)

/** 문자열이 유효한 16가지 MBTI 코드인지 검사하는 타입 가드 */
export function isValidMbtiCode(value: string): value is MbtiCode {
  return MBTI_CODE_SET.has(value)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** 한 축에 대한 응답을 집계한다 */
export function computeAxisResult(
  axis: Axis,
  questions: Question[],
  answers: AnswerMap,
): AxisResult {
  const axisQuestions = questions.filter((question) => question.axis === axis)

  // 미응답 문항은 0(중립)으로 취급한다
  const score = axisQuestions.reduce(
    (total, question) => total + question.direction * (answers[question.id] ?? 0),
    0,
  )
  const maxScore = axisQuestions.length * 2
  const [first, second] = AXIS_POLES[axis]

  let pole: Pole = AXIS_TIE_BREAK_POLE[axis]
  if (score > 0) pole = first
  else if (score < 0) pole = second

  const opposite = pole === first ? second : first
  const percent =
    maxScore === 0
      ? 50
      : clamp(50 + Math.round((Math.abs(score) / maxScore) * 50), 50, 100)

  return { axis, pole, opposite, score, percent }
}

/**
 * 전체 응답을 4축으로 집계해 하나의 MBTI 결과로 만든다.
 * 결과는 항상 결정적이며(동점은 tie-break 규칙 적용) 16가지 코드 중 하나를 반환한다.
 */
export function computeResult(
  questions: Question[],
  answers: AnswerMap,
): QuizResult {
  const axes = AXIS_ORDER.map((axis) =>
    computeAxisResult(axis, questions, answers),
  )
  const code = axes.map((axisResult) => axisResult.pole).join('')

  // 각 극은 AXIS_POLES 에서 왔으므로 항상 유효하다. 방어적으로 한 번 더 검증한다.
  if (!isValidMbtiCode(code)) {
    throw new Error(`유효하지 않은 MBTI 코드가 계산되었습니다: ${code}`)
  }

  return { code, axes }
}
