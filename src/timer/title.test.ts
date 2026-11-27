import { describe, expect, it } from 'vitest'
import { APP_NAME, getDocumentTitle } from './title'

const MINUTE = 60_000

describe('getDocumentTitle', () => {
  it('shows the app name when the timer is idle', () => {
    expect(getDocumentTitle('focus', 'idle', 25 * MINUTE)).toBe(APP_NAME)
    expect(getDocumentTitle('break', 'idle', 5 * MINUTE)).toBe(APP_NAME)
  })

  it('shows the remaining time and mode while running', () => {
    expect(getDocumentTitle('focus', 'running', 24 * MINUTE + 59_000)).toBe('24:59 · Focus')
    expect(getDocumentTitle('break', 'running', 4 * MINUTE)).toBe('04:00 · Break')
  })

  it('marks a paused timer', () => {
    expect(getDocumentTitle('focus', 'paused', 12 * MINUTE)).toBe('⏸ 12:00 · Focus')
  })
})
