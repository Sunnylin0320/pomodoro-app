/**
 * Format milliseconds as "mm:ss".
 *
 * Rounds up to the next whole second, so a fresh 25-minute timer shows
 * "25:00" and the display only reaches "00:00" when time is actually up.
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
