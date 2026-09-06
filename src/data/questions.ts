import { type Question } from '@/types'

/**
 * 24문항 · 4축 각 6문항.
 * direction 1 = '그렇다'일수록 첫 번째 극(E/S/T/J), -1 = 두 번째 극(I/N/F/P).
 * 축마다 방향을 3:3으로 섞어 응답 편향을 줄인다.
 */
export const questions: Question[] = [
  // ── 외향(E) / 내향(I) ──────────────────────────────
  { id: 1, axis: 'EI', direction: 1, text: '처음 만난 사람과도 금방 대화를 트고 어울리는 편이다.' },
  { id: 2, axis: 'EI', direction: 1, text: '주말에는 사람들을 만나면서 에너지를 얻는다.' },
  { id: 3, axis: 'EI', direction: 1, text: '여러 명이 모인 시끌벅적한 자리가 즐겁다.' },
  { id: 4, axis: 'EI', direction: -1, text: '혼자 조용히 보내는 시간이 있어야 충전이 된다.' },
  { id: 5, axis: 'EI', direction: -1, text: '낯선 모임에 가면 말수가 줄고 주변부터 살핀다.' },
  { id: 6, axis: 'EI', direction: -1, text: '생각을 말로 꺼내기 전에 머릿속에서 충분히 정리한다.' },

  // ── 감각(S) / 직관(N) ──────────────────────────────
  { id: 7, axis: 'SN', direction: 1, text: '일할 때 검증된 방법과 구체적인 사실을 먼저 챙긴다.' },
  { id: 8, axis: 'SN', direction: 1, text: '먼 미래보다 지금 눈앞의 현실적인 문제에 집중한다.' },
  { id: 9, axis: 'SN', direction: 1, text: '설명할 때 추상적인 개념보다 실제 사례를 든다.' },
  { id: 10, axis: 'SN', direction: -1, text: '가능성과 큰 그림을 상상하는 데 시간 쓰는 것을 좋아한다.' },
  { id: 11, axis: 'SN', direction: -1, text: '무언가를 보면 "이게 무엇을 의미할까"부터 떠올린다.' },
  { id: 12, axis: 'SN', direction: -1, text: '익숙한 방식보다 새로운 아이디어를 시도하고 싶다.' },

  // ── 사고(T) / 감정(F) ──────────────────────────────
  { id: 13, axis: 'TF', direction: 1, text: '결정을 내릴 때 감정보다 논리와 근거를 우선한다.' },
  { id: 14, axis: 'TF', direction: 1, text: '대화에서 옳고 그름을 분명히 짚고 넘어가는 편이다.' },
  { id: 15, axis: 'TF', direction: 1, text: '피드백을 줄 때 돌려 말하기보다 사실대로 말한다.' },
  { id: 16, axis: 'TF', direction: -1, text: '누군가 속상해하면 해결책보다 먼저 공감해 준다.' },
  { id: 17, axis: 'TF', direction: -1, text: '선택할 때 사람들의 기분과 관계를 크게 고려한다.' },
  { id: 18, axis: 'TF', direction: -1, text: '비판보다 칭찬과 격려가 사람을 더 움직인다고 믿는다.' },

  // ── 판단(J) / 인식(P) ──────────────────────────────
  { id: 19, axis: 'JP', direction: 1, text: '할 일을 미리 계획표로 정리해 두어야 마음이 편하다.' },
  { id: 20, axis: 'JP', direction: 1, text: '일은 마감 훨씬 전에 끝내 놓는 편이다.' },
  { id: 21, axis: 'JP', direction: 1, text: '여행을 가면 일정과 동선을 촘촘히 짜 둔다.' },
  { id: 22, axis: 'JP', direction: -1, text: '계획이 갑자기 바뀌어도 즐겁게 받아들인다.' },
  { id: 23, axis: 'JP', direction: -1, text: '마감이 눈앞에 닥쳐야 집중이 잘 된다.' },
  { id: 24, axis: 'JP', direction: -1, text: '정해진 틀보다 상황에 따라 유연하게 움직이는 게 좋다.' },
]
