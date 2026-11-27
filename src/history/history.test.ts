import { describe, expect, it } from 'vitest'
import {
  addSession,
  createSession,
  formatDuration,
  getTodaySessions,
  getTotalMs,
  MAX_TASK_LENGTH,
  startOfDay,
  type Session,
} from './history'

const MINUTE_MS = 60_000

// Built from local time, so the tests pass in any time zone.
const at = (hour: number, minute = 0, day = 27) => new Date(2026, 10, day, hour, minute).getTime()

const session = (id: string, endedAt: number, durationMs = 25 * MINUTE_MS): Session =>
  createSession(id, `Task ${id}`, endedAt, durationMs)

describe('createSession', () => {
  it('trims the task name', () => {
    expect(createSession('a', '  Write README  ', at(9), 1).task).toBe('Write README')
  })

  it('cuts very long task names', () => {
    const task = 'x'.repeat(MAX_TASK_LENGTH + 20)
    expect(createSession('a', task, at(9), 1).task).toHaveLength(MAX_TASK_LENGTH)
  })
})

describe('addSession', () => {
  it('returns a new list and leaves the old one unchanged', () => {
    const before = [session('a', at(9))]
    const after = addSession(before, session('b', at(10)))

    expect(after.map((s) => s.id)).toEqual(['a', 'b'])
    expect(before).toHaveLength(1)
  })
})

describe('startOfDay', () => {
  it('returns local midnight', () => {
    expect(startOfDay(at(15, 30))).toBe(at(0))
  })
})

describe('getTodaySessions', () => {
  it('keeps only sessions that finished today', () => {
    const sessions = [
      session('yesterday', at(23, 50, 26)),
      session('midnight', at(0)),
      session('morning', at(9)),
    ]

    expect(getTodaySessions(sessions, at(12)).map((s) => s.id)).toEqual(['midnight', 'morning'])
  })

  it('returns an empty list when nothing happened today', () => {
    expect(getTodaySessions([session('old', at(9, 0, 20))], at(12))).toEqual([])
  })
})

describe('getTotalMs', () => {
  it('adds up the durations', () => {
    const sessions = [session('a', at(9)), session('b', at(10), 10 * MINUTE_MS)]
    expect(getTotalMs(sessions)).toBe(35 * MINUTE_MS)
  })

  it('is zero for no sessions', () => {
    expect(getTotalMs([])).toBe(0)
  })
})

describe('formatDuration', () => {
  it('shows minutes under an hour', () => {
    expect(formatDuration(0)).toBe('0m')
    expect(formatDuration(25 * MINUTE_MS)).toBe('25m')
  })

  it('shows hours and minutes', () => {
    expect(formatDuration(75 * MINUTE_MS)).toBe('1h 15m')
  })

  it('drops the minutes on whole hours', () => {
    expect(formatDuration(120 * MINUTE_MS)).toBe('2h')
  })

  it('rounds partial minutes down', () => {
    expect(formatDuration(25 * MINUTE_MS - 1)).toBe('24m')
  })
})
