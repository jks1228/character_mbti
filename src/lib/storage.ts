// localStorage 접근을 SSR·프라이빗 모드·차단 환경에서도 안전하게 감싸는 래퍼

function getStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // 일부 브라우저는 접근 자체에서 예외를 던진다
    return null
  }
}

/** 저장된 JSON 값을 읽는다. 없거나 파싱에 실패하면 fallback 을 반환한다. */
export function loadJson<T>(key: string, fallback: T): T {
  const storage = getStorage()
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** 값을 JSON 으로 직렬화해 저장한다. 실패(용량 초과 등)는 조용히 무시한다. */
export function saveJson<T>(key: string, value: T): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // 무시
  }
}

/** 키를 삭제한다. */
export function remove(key: string): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    // 무시
  }
}
