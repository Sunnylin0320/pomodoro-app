// Pure Pomodoro timer logic.
//
// Every function takes the current state (and the current time, `now`, in ms)
// and returns a new state. Nothing here reads the clock or touches the DOM,
// which keeps the logic easy to test.
//
// Instead of counting down one second at a time, a running timer stores the
// moment it will end (`endsAt`). The remaining time is always `endsAt - now`,
// so it stays accurate even when the browser throttles background tabs.

export type Mode = 'focus' | 'break'
export type Status = 'idle' | 'running' | 'paused'

export type TimerState = {
  readonly mode: Mode
  readonly status: Status
  /** Time left while idle or paused. Ignored while running. */
  readonly remainingMs: number
  /** Timestamp (ms) when a running timer reaches zero. Null otherwise. */
  readonly endsAt: number | null
}

const MINUTE_MS = 60_000

export const DURATIONS_MS: Readonly<Record<Mode, number>> = {
  focus: 0.1 * MINUTE_MS,
  break: 0.1 * MINUTE_MS,
}

export function createTimer(mode: Mode = 'focus'): TimerState {
  return {
    mode,
    status: 'idle',
    remainingMs: DURATIONS_MS[mode],
    endsAt: null,
  }
}

export function start(state: TimerState, now: number): TimerState {
  if (state.status === 'running') return state
  return {
    ...state,
    status: 'running',
    endsAt: now + state.remainingMs,
  }
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state
  return {
    ...state,
    status: 'paused',
    remainingMs: getRemainingMs(state, now),
    endsAt: null,
  }
}

export function reset(state: TimerState): TimerState {
  return createTimer(state.mode)
}

export function getRemainingMs(state: TimerState, now: number): number {
  if (state.status === 'running' && state.endsAt !== null) {
    return Math.max(0, state.endsAt - now)
  }
  return state.remainingMs
}

export function isFinished(state: TimerState, now: number): boolean {
  return getRemainingMs(state, now) === 0
}

/** How far through the current mode we are: 0 at the start, 1 when time is up. */
export function getProgress(state: TimerState, now: number): number {
  const total = DURATIONS_MS[state.mode]
  const elapsed = total - getRemainingMs(state, now)
  return Math.min(1, Math.max(0, elapsed / total))
}

export function nextMode(mode: Mode): Mode {
  return mode === 'focus' ? 'break' : 'focus'
}
