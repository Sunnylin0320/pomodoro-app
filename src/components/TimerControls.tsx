import { formatTime } from '../timer/format'
import type { Mode, Status } from '../timer/timer'

type TimerControlsProps = {
  mode: Mode
  status: Status
  remainingMs: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const MODE_LABELS: Record<Mode, string> = {
  focus: 'Focus',
  break: 'Break',
}

const SECONDARY_BUTTON =
  'rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500'

export function TimerControls({
  mode,
  status,
  remainingMs,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const isRunning = status === 'running'
  const isPaused = status === 'paused'

  let primaryLabel = 'Start'
  if (isRunning) primaryLabel = 'Pause'
  else if (isPaused) primaryLabel = 'Resume'

  return (
    <section className="flex flex-col items-center gap-6">
      <p className="text-sm font-medium tracking-widest text-emerald-700 uppercase">
        {MODE_LABELS[mode]}
        {isPaused && ' · Paused'}
      </p>

      <p role="timer" aria-label="Time left" className="text-7xl font-bold text-slate-800 tabular-nums">
        {formatTime(remainingMs)}
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={isRunning ? onPause : onStart}
          className="w-28 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {primaryLabel}
        </button>
        <button type="button" onClick={onReset} className={SECONDARY_BUTTON}>
          Reset
        </button>
        <button type="button" onClick={onSkip} className={SECONDARY_BUTTON}>
          Skip
        </button>
      </div>
    </section>
  )
}
