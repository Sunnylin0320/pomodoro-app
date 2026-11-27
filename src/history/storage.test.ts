import { describe, expect, it } from 'vitest'
import type { Session } from './history'
import { loadSessions, saveSessions, STORAGE_KEY, type KeyValueStore } from './storage'

/** An in-memory stand-in for localStorage. */
function fakeStore(initial: Record<string, string> = {}): KeyValueStore {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
  }
}

const sample: Session = { id: 'a', task: 'Write README', endedAt: 1_000, durationMs: 1_500_000 }

describe('loadSessions', () => {
  it('returns an empty list when nothing is saved', () => {
    expect(loadSessions(fakeStore())).toEqual([])
  })

  it('reads back what saveSessions wrote', () => {
    const store = fakeStore()
    saveSessions([sample], store)
    expect(loadSessions(store)).toEqual([sample])
  })

  it('returns an empty list for invalid JSON', () => {
    expect(loadSessions(fakeStore({ [STORAGE_KEY]: '{not json' }))).toEqual([])
  })

  it('returns an empty list when the data is not a list', () => {
    expect(loadSessions(fakeStore({ [STORAGE_KEY]: '{"id":"a"}' }))).toEqual([])
  })

  it('skips entries with the wrong shape and keeps the rest', () => {
    const raw = JSON.stringify([sample, null, { id: 'b' }, { ...sample, id: 'c', durationMs: -1 }])
    expect(loadSessions(fakeStore({ [STORAGE_KEY]: raw }))).toEqual([sample])
  })

  it('returns an empty list when storage is blocked', () => {
    const blocked: KeyValueStore = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {},
    }
    expect(loadSessions(blocked)).toEqual([])
  })
})

describe('saveSessions', () => {
  it('returns false when storage is full', () => {
    const full: KeyValueStore = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(saveSessions([sample], full)).toBe(false)
  })
})
