import { describe, expect, it } from 'vitest'
import {
  computeAxisResult,
  computeResult,
  isValidMbtiCode,
} from '@/lib/scoring'
import {
  AXIS_ORDER,
  MBTI_CODES,
  type AnswerMap,
  type AnswerValue,
  type Axis,
  type Question,
} from '@/types'

// 각 축 3문항(방향 +1, +1, -1)으로 구성한 테스트용 문항 세트
function makeQuestions(): Question[] {
  const axes: Axis[] = ['EI', 'SN', 'TF', 'JP']
  const questions: Question[] = []
  let id = 1
  for (const axis of axes) {
    questions.push({ id: id++, axis, text: `${axis}-a`, direction: 1 })
    questions.push({ id: id++, axis, text: `${axis}-b`, direction: 1 })
    questions.push({ id: id++, axis, text: `${axis}-c`, direction: -1 })
  }
  return questions
}

// 모든 문항에 같은 값을 응답한 맵을 만든다
function answerAll(questions: Question[], value: AnswerValue): AnswerMap {
  const map: AnswerMap = {}
  for (const question of questions) map[question.id] = value
  return map
}

const questions = makeQuestions()

describe('computeResult', () => {
  it('모든 문항에 "매우 그렇다"(+2)로 답하면 방향 부호에 따라 ESTJ 가 된다', () => {
    const result = computeResult(questions, answerAll(questions, 2))
    expect(result.code).toBe('ESTJ')
  })

  it('모든 문항에 "전혀 아니다"(-2)로 답하면 정반대인 INFP 가 된다', () => {
    const result = computeResult(questions, answerAll(questions, -2))
    expect(result.code).toBe('INFP')
  })

  it('모두 중립(0)이면 tie-break 규칙(I/N/F/P)에 따라 INFP 가 되고 우세도는 50 이다', () => {
    const result = computeResult(questions, answerAll(questions, 0))
    expect(result.code).toBe('INFP')
    for (const axis of result.axes) {
      expect(axis.percent).toBe(50)
      expect(axis.score).toBe(0)
    }
  })

  it('빈 응답 맵도 미응답을 0으로 처리해 INFP 를 반환한다', () => {
    const result = computeResult(questions, {})
    expect(result.code).toBe('INFP')
  })

  it('축별로 극을 섞어 답하면 해당 조합 코드(ENFJ)가 나오고 완전 편향 시 우세도는 100 이다', () => {
    // EI: E쪽(+), SN: N쪽(-), TF: F쪽(-), JP: J쪽(+)
    const answers: AnswerMap = {
      1: 2,
      2: 2,
      3: -2, // EI 합 +6 → E
      4: -2,
      5: -2,
      6: 2, // SN 합 -6 → N
      7: -2,
      8: -2,
      9: 2, // TF 합 -6 → F
      10: 2,
      11: 2,
      12: -2, // JP 합 +6 → J
    }
    const result = computeResult(questions, answers)
    expect(result.code).toBe('ENFJ')
    for (const axis of result.axes) expect(axis.percent).toBe(100)
  })

  it('약한 편향(부분 응답)이면 중간 우세도의 ISTP 를 반환한다', () => {
    const answers: AnswerMap = {
      1: -1, // EI 합 -1 → I
      4: 1, // SN 합 +1 → S
      7: 2, // TF 합 +2 → T
      12: 2, // dir -1 → JP 합 -2 → P
    }
    const result = computeResult(questions, answers)
    expect(result.code).toBe('ISTP')

    const byAxis = new Map(result.axes.map((axis) => [axis.axis, axis]))
    expect(byAxis.get('EI')?.percent).toBe(58)
    expect(byAxis.get('SN')?.percent).toBe(58)
    expect(byAxis.get('TF')?.percent).toBe(67)
    expect(byAxis.get('JP')?.percent).toBe(67)
  })

  it('결과 축은 항상 E/I → S/N → T/F → J/P 순서로 4개다', () => {
    const result = computeResult(questions, answerAll(questions, 1))
    expect(result.axes.map((axis) => axis.axis)).toEqual([...AXIS_ORDER])
  })

  it('어떤 응답 조합이든 항상 16코드 중 하나를 반환하고 우세도는 50~100 범위다', () => {
    const values: AnswerValue[] = [-2, -1, 0, 1, 2]
    for (let seed = 0; seed < 40; seed++) {
      const answers: AnswerMap = {}
      for (const question of questions) {
        const pick = values[(seed * 7 + question.id * 3) % values.length]
        if (pick === undefined) continue
        answers[question.id] = pick
      }
      const result = computeResult(questions, answers)
      expect(MBTI_CODES).toContain(result.code)
      for (const axis of result.axes) {
        expect(axis.percent).toBeGreaterThanOrEqual(50)
        expect(axis.percent).toBeLessThanOrEqual(100)
        expect(axis.pole).not.toBe(axis.opposite)
      }
    }
  })
})

describe('computeAxisResult', () => {
  it('해당 축 문항만 집계하고 다른 축 응답은 무시한다', () => {
    const answers: AnswerMap = { 1: 2, 2: 2, 3: -2, 7: -2, 8: -2 }
    const ei = computeAxisResult('EI', questions, answers)
    expect(ei.score).toBe(6)
    expect(ei.pole).toBe('E')
    expect(ei.opposite).toBe('I')
  })

  it('문항이 없는 축은 우세도 50, tie-break 극을 반환한다', () => {
    const result = computeAxisResult('EI', [], {})
    expect(result.percent).toBe(50)
    expect(result.pole).toBe('I')
  })
})

describe('isValidMbtiCode', () => {
  it('16가지 정식 코드는 모두 통과한다', () => {
    for (const code of MBTI_CODES) expect(isValidMbtiCode(code)).toBe(true)
  })

  it('소문자·오타·빈 문자열·길이 초과는 거부한다', () => {
    for (const invalid of ['intj', 'INTJX', 'XXXX', '', 'ABCD', 'INT']) {
      expect(isValidMbtiCode(invalid)).toBe(false)
    }
  })
})
