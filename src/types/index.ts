// 앱 전역에서 쓰는 도메인 타입 모음

/** MBTI 4개 지표 축 */
export type Axis = 'EI' | 'SN' | 'TF' | 'JP'

export type EiPole = 'E' | 'I'
export type SnPole = 'S' | 'N'
export type TfPole = 'T' | 'F'
export type JpPole = 'J' | 'P'
/** 축의 한쪽 극을 나타내는 한 글자 */
export type Pole = EiPole | SnPole | TfPole | JpPole

/** 코드 문자열을 만들 때 사용하는 축 순서 (E/I → S/N → T/F → J/P) */
export const AXIS_ORDER = ['EI', 'SN', 'TF', 'JP'] as const satisfies readonly Axis[]

/** 각 축의 [첫 번째 극, 두 번째 극]. 첫 번째 극이 양(+) 방향이다. */
export const AXIS_POLES = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
} as const satisfies Record<Axis, readonly [Pole, Pole]>

/**
 * 정확히 동점(50:50)일 때 채택할 극.
 * 결과가 항상 결정적이도록 명시하며, 애매할 때 내면적인 쪽(I/N/F/P)으로 기운다.
 */
export const AXIS_TIE_BREAK_POLE = {
  EI: 'I',
  SN: 'N',
  TF: 'F',
  JP: 'P',
} as const satisfies Record<Axis, Pole>

/** 16가지 MBTI 코드 */
export type MbtiCode =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ'

export const MBTI_CODES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
] as const satisfies readonly MbtiCode[]

/** 리커트 5점 응답을 -2..+2 로 매핑한 값 */
export type AnswerValue = -2 | -1 | 0 | 1 | 2

/** 질문 id → 응답 값 */
export type AnswerMap = Record<number, AnswerValue>

export interface Question {
  id: number
  axis: Axis
  text: string
  /** 1: '그렇다'일수록 첫 번째 극(E/S/T/J)에 가중, -1: 두 번째 극(I/N/F/P)에 가중 */
  direction: 1 | -1
}

export interface AxisResult {
  axis: Axis
  pole: Pole
  opposite: Pole
  /** 부호 있는 원점수 (양수 = 첫 번째 극 우세, 음수 = 두 번째 극 우세) */
  score: number
  /** 우세도 백분율 (50~100) */
  percent: number
}

export interface QuizResult {
  code: MbtiCode
  axes: AxisResult[]
}

export interface MbtiTypeTheme {
  /** 그라디언트 시작 색 (CSS 색상 문자열) */
  from: string
  /** 그라디언트 끝 색 */
  to: string
  /** 강조 색 */
  accent: string
}

export interface MbtiTypeInfo {
  code: MbtiCode
  /** 애니메이션풍 캐릭터 별명 */
  nickname: string
  /** 한 줄 소개 */
  tagline: string
  description: string
  strengths: string[]
  weaknesses: string[]
  compatible: MbtiCode[]
  incompatible: MbtiCode[]
  careers: string[]
  theme: MbtiTypeTheme
  emoji: string
}
