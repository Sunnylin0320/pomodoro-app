import { useEffect, useState } from 'react'
import {
  createTimer,
  getProgress,
  getRemainingMs,
  isFinished,
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
 * The timer state only changes when the user acts or time runs out. While it
 * runs, `now` is refreshed every TICK_MS so the screen re-renders. The tick
 * does not count down: remaining time is always computed from `endsAt - now`.
 */
export function useTimer(): UseTimer {
  const [timer, setTimer] = useState<TimerState>(() => createTimer('focus'))
  const [now, setNow] = useState(() => Date.now())

  const isRunning = timer.status === 'running'

  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      const current = Date.now()
      setNow(current)
      // When time is up, move to the next mode and wait for the user to start it.
      setTimer((t) => (isFinished(t, current) ? createTimer(nextMode(t.mode)) : t))
    }, TICK_MS)

    // Cleanup: stop ticking when the timer pauses, resets, or the page closes.
    return () => clearInterval(id)
  }, [isRunning])

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
