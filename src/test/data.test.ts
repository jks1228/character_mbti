import { describe, expect, it } from 'vitest'
import { questions } from '@/data/questions'
import { mbtiTypes, mbtiTypeList } from '@/data/mbti-types'
import { likertOptions } from '@/data/likert-options'
import { computeResult, isValidMbtiCode } from '@/lib/scoring'
import {
  AXIS_ORDER,
  MBTI_CODES,
  type AnswerMap,
  type Axis,
} from '@/types'

describe('questions 데이터', () => {
  it('총 24문항이다', () => {
    expect(questions).toHaveLength(24)
  })

  it('id 는 1~24 로 중복 없이 채워진다', () => {
    const ids = questions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  it('축마다 정확히 6문항이고 방향이 3:3으로 균형 잡혀 있다', () => {
    for (const axis of AXIS_ORDER) {
      const inAxis = questions.filter((q) => q.axis === axis)
      expect(inAxis).toHaveLength(6)
      const positives = inAxis.filter((q) => q.direction === 1)
      expect(positives).toHaveLength(3)
    }
  })

  it('모든 문항 텍스트는 비어 있지 않다', () => {
    for (const q of questions) expect(q.text.trim().length).toBeGreaterThan(5)
  })
})

describe('likertOptions 데이터', () => {
  it('5단계이며 값이 2..-2 로 유일하다', () => {
    expect(likertOptions).toHaveLength(5)
    expect(likertOptions.map((o) => o.value)).toEqual([2, 1, 0, -1, -2])
  })
})

describe('mbtiTypes 데이터', () => {
  it('16가지 코드를 모두 키로 가진다', () => {
    expect(Object.keys(mbtiTypes).sort()).toEqual([...MBTI_CODES].sort())
    expect(mbtiTypeList).toHaveLength(16)
  })

  it('각 항목의 code 필드가 키와 일치한다', () => {
    for (const code of MBTI_CODES) expect(mbtiTypes[code].code).toBe(code)
  })

  it('필수 텍스트 필드가 채워져 있다', () => {
    for (const info of mbtiTypeList) {
      expect(info.nickname.trim().length).toBeGreaterThan(1)
      expect(info.tagline.trim().length).toBeGreaterThan(3)
      expect(info.description.trim().length).toBeGreaterThan(30)
      expect(info.emoji.trim().length).toBeGreaterThan(0)
    }
  })

  it('배열 필드가 최소 개수를 만족한다', () => {
    for (const info of mbtiTypeList) {
      expect(info.strengths.length).toBeGreaterThanOrEqual(4)
      expect(info.weaknesses.length).toBeGreaterThanOrEqual(3)
      expect(info.compatible.length).toBeGreaterThanOrEqual(2)
      expect(info.incompatible.length).toBeGreaterThanOrEqual(1)
      expect(info.careers.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('compatible/incompatible 은 유효한 MBTI 코드이며 자기 자신을 가리키지 않는다', () => {
    for (const info of mbtiTypeList) {
      for (const ref of [...info.compatible, ...info.incompatible]) {
        expect(isValidMbtiCode(ref)).toBe(true)
        expect(ref).not.toBe(info.code)
      }
    }
  })

  it('theme 색상은 hex 문자열이다', () => {
    const hex = /^#[0-9a-fA-F]{6}$/
    for (const info of mbtiTypeList) {
      expect(info.theme.from).toMatch(hex)
      expect(info.theme.to).toMatch(hex)
      expect(info.theme.accent).toMatch(hex)
    }
  })
})

describe('questions + scoring 통합', () => {
  // 특정 코드가 나오도록 축별로 몰아서 응답하는 헬퍼
  function answersFor(target: string): AnswerMap {
    const map: AnswerMap = {}
    const poleByAxis: Record<Axis, string> = {
      EI: target[0] ?? 'I',
      SN: target[1] ?? 'N',
      TF: target[2] ?? 'F',
      JP: target[3] ?? 'P',
    }
    for (const q of questions) {
      const wantsFirstPole = ['E', 'S', 'T', 'J'].includes(poleByAxis[q.axis])
      // direction 이 +1 이면 '매우 그렇다'가 첫 극, -1 이면 반대
      const towardFirst = q.direction === 1 ? 2 : -2
      map[q.id] = wantsFirstPole ? towardFirst : ((towardFirst * -1) as -2 | 2)
    }
    return map
  }

  it('실제 24문항으로 16가지 코드를 모두 만들어 낼 수 있다', () => {
    for (const code of MBTI_CODES) {
      const result = computeResult(questions, answersFor(code))
      expect(result.code).toBe(code)
      for (const axis of result.axes) expect(axis.percent).toBe(100)
    }
  })
})
