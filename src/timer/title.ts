import { formatTime } from './format'
import type { Mode, Status } from './timer'

export const APP_NAME = 'Panda Pomodoro'

const MODE_LABELS: Record<Mode, string> = {
  focus: 'Focus',
  break: 'Break',
}

/**
 * The browser tab title. While a timer runs or is paused, it shows the time
 * left, so you can check it from another tab.
 */
export function getDocumentTitle(mode: Mode, status: Status, remainingMs: number): string {
  if (status === 'idle') return APP_NAME

  const text = `${formatTime(remainingMs)} · ${MODE_LABELS[mode]}`
  return status === 'paused' ? `⏸ ${text}` : text
}
