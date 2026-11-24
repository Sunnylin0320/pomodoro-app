import { describe, expect, it } from 'vitest'
import {
  createTimer,
  DURATIONS_MS,
  getProgress,
  getRemainingMs,
  isFinished,
  nextMode,
  pause,
  reset,
  start,
} from './timer'

const MINUTE = 60_000

describe('createTimer', () => {
  it('starts a focus timer at 25 minutes, idle', () => {
    const timer = createTimer('focus')
    expect(timer.status).toBe('idle')
    expect(getRemainingMs(timer, 0)).toBe(25 * MINUTE)
  })

  it('starts a break timer at 5 minutes', () => {
    expect(getRemainingMs(createTimer('break'), 0)).toBe(5 * MINUTE)
  })

  it('defaults to focus mode', () => {
    expect(createTimer().mode).toBe('focus')
  })
})

describe('start', () => {
  it('counts down based on the current time', () => {
    const timer = start(createTimer('focus'), 0)
    expect(timer.status).toBe('running')
    expect(getRemainingMs(timer, 1 * MINUTE)).toBe(24 * MINUTE)
  })

  it('does nothing if the timer is already running', () => {
    const running = start(createTimer('focus'), 0)
    expect(start(running, 5 * MINUTE)).toBe(running)
  })

  it('does not change the original state', () => {
    const idle = createTimer('focus')
    start(idle, 0)
    expect(idle.status).toBe('idle')
  })
})

describe('pause', () => {
  it('freezes the remaining time', () => {
    const paused = pause(start(createTimer('focus'), 0), 10 * MINUTE)
    expect(paused.status).toBe('paused')
    // Time keeps passing, but a paused timer should not count down.
    expect(getRemainingMs(paused, 20 * MINUTE)).toBe(15 * MINUTE)
  })

  it('resumes from where it was paused', () => {
    const paused = pause(start(createTimer('focus'), 0), 10 * MINUTE)
    const resumed = start(paused, 30 * MINUTE)
    expect(getRemainingMs(resumed, 31 * MINUTE)).toBe(14 * MINUTE)
  })

  it('does nothing if the timer is not running', () => {
    const idle = createTimer('focus')
    expect(pause(idle, 0)).toBe(idle)
  })
})

describe('reset', () => {
  it('goes back to the full duration of the same mode', () => {
    const paused = pause(start(createTimer('break'), 0), 2 * MINUTE)
    const fresh = reset(paused)
    expect(fresh.mode).toBe('break')
    expect(fresh.status).toBe('idle')
    expect(getRemainingMs(fresh, 99 * MINUTE)).toBe(DURATIONS_MS.break)
  })
})

describe('isFinished', () => {
  it('is false before time is up', () => {
    const timer = start(createTimer('focus'), 0)
    expect(isFinished(timer, 24 * MINUTE)).toBe(false)
  })

  it('is true once time is up, and remaining time never goes negative', () => {
    const timer = start(createTimer('focus'), 0)
    expect(isFinished(timer, 25 * MINUTE)).toBe(true)
    expect(getRemainingMs(timer, 30 * MINUTE)).toBe(0)
  })
})

describe('getProgress', () => {
  it('is 0 at the start', () => {
    expect(getProgress(createTimer('focus'), 0)).toBe(0)
  })

  it('is 0.5 halfway through', () => {
    const timer = start(createTimer('focus'), 0)
    expect(getProgress(timer, 12.5 * MINUTE)).toBe(0.5)
  })

  it('is 1 when time is up and never goes above 1', () => {
    const timer = start(createTimer('break'), 0)
    expect(getProgress(timer, 5 * MINUTE)).toBe(1)
    expect(getProgress(timer, 60 * MINUTE)).toBe(1)
  })

  it('stays the same while paused', () => {
    const paused = pause(start(createTimer('focus'), 0), 5 * MINUTE)
    expect(getProgress(paused, 50 * MINUTE)).toBe(0.2)
  })
})

describe('nextMode', () => {
  it('alternates between focus and break', () => {
    expect(nextMode('focus')).toBe('break')
    expect(nextMode('break')).toBe('focus')
  })
})
