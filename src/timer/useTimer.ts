import { useEffect, useRef, useState } from 'react'
import {
  createTimer,
  getProgress,
  getRemainingMs,
  nextMode,
  pause as pauseTimer,
  reset as resetTimer,
  start as startTimer,
  type Mode,
  type Status,
  type TimerState,
} from './timer'

/** How often the screen refreshes while the timer runs. */
const TICK_MS = 250

export type UseTimerOptions = {
  /** Called once when a running timer reaches zero, with the mode that just finished. */
  onFinish?: (finishedMode: Mode) => void
}

export type UseTimer = {
  mode: Mode
  status: Status
  remainingMs: number
  progress: number
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
}

/**
 * Connects the pure timer logic to React.
 *
 * Two clocks, with different jobs:
 * - A repeating interval refreshes the screen every TICK_MS. It does not count
 *   down: remaining time is always computed from `endsAt - now`.
 * - A one-off timeout fires exactly when the timer ends. Browsers throttle
 *   repeating timers in background tabs much more than one-off ones, so this
 *   keeps the end of a session on time even when the tab is hidden.
 */
export function useTimer({ onFinish }: UseTimerOptions = {}): UseTimer {
  const [timer, setTimer] = useState<TimerState>(() => createTimer('focus'))
  const [now, setNow] = useState(() => Date.now())

  // Always holds the latest onFinish, without restarting the timeout when it changes.
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  })

  const isRunning = timer.status === 'running'
  const { endsAt, mode } = timer

  // Clock 1: refresh the screen while running.
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [isRunning])

  // Clock 2: end the session on time.
  useEffect(() => {
    if (endsAt === null) return

    const id = setTimeout(() => {
      setNow(Date.now())
      // Move to the next mode and wait for the user to start it.
      setTimer(createTimer(nextMode(mode)))
      onFinishRef.current?.(mode)
    }, Math.max(0, endsAt - Date.now()))

    // Pausing, resetting, or skipping changes endsAt, which cancels this timeout.
    return () => clearTimeout(id)
  }, [endsAt, mode])

  function start() {
    const current = Date.now()
    setNow(current)
    setTimer((t) => startTimer(t, current))
  }

  function pause() {
    const current = Date.now()
    setNow(current)
    setTimer((t) => pauseTimer(t, current))
  }

  function reset() {
    setTimer((t) => resetTimer(t))
  }

  function skip() {
    setTimer((t) => createTimer(nextMode(t.mode)))
  }

  return {
    mode: timer.mode,
    status: timer.status,
    remainingMs: getRemainingMs(timer, now),
    progress: getProgress(timer, now),
    start,
    pause,
    reset,
    skip,
  }
}
