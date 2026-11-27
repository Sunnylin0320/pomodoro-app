// Saves the focus history in the browser's localStorage.
//
// localStorage only stores strings, so sessions are saved as JSON. Anything
// read back is treated as untrusted: it may be from an older version of the
// app, edited by hand, or missing because storage is turned off. Bad data
// never crashes the app; it is skipped.

import type { Session } from './history'

/** The version in the key lets a future format live next to this one. */
export const STORAGE_KEY = 'panda-pomodoro:sessions:v1'

/** The part of localStorage we use. Tests pass in a fake. */
export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>

export function loadSessions(store: KeyValueStore = localStorage): Session[] {
  try {
    const raw = store.getItem(STORAGE_KEY)
    if (raw === null) return []

    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter(isSession)
  } catch {
    // Invalid JSON, or storage is blocked (for example, some private browsing modes).
    return []
  }
}

/** Returns false if the sessions could not be saved, for example when storage is full. */
export function saveSessions(sessions: readonly Session[], store: KeyValueStore = localStorage): boolean {
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(sessions))
    return true
  } catch {
    return false
  }
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false

  const { id, task, endedAt, durationMs } = value as Record<string, unknown>
  return (
    typeof id === 'string' &&
    typeof task === 'string' &&
    typeof endedAt === 'number' &&
    Number.isFinite(endedAt) &&
    typeof durationMs === 'number' &&
    Number.isFinite(durationMs) &&
    durationMs >= 0
  )
}
