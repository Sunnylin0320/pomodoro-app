// Pure logic for the focus history.
//
// A session is one finished focus period. Like the timer, nothing here reads
// the clock or touches storage: the current time and the id are passed in.

export type Session = {
  readonly id: string
  /** What the user was working on. May be empty. */
  readonly task: string
  /** Timestamp (ms) when the session finished. */
  readonly endedAt: number
  /** Time actually spent focusing. Pauses are not counted. */
  readonly durationMs: number
}

export const MAX_TASK_LENGTH = 80

export function createSession(id: string, task: string, endedAt: number, durationMs: number): Session {
  return {
    id,
    task: task.trim().slice(0, MAX_TASK_LENGTH),
    endedAt,
    durationMs,
  }
}

export function addSession(sessions: readonly Session[], session: Session): Session[] {
  return [...sessions, session]
}

/** Midnight at the start of the day that contains `now`, in the user's local time zone. */
export function startOfDay(now: number): number {
  const date = new Date(now)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/** Sessions that finished today (local time), oldest first. */
export function getTodaySessions(sessions: readonly Session[], now: number): Session[] {
  const dayStart = startOfDay(now)
  return sessions.filter((session) => session.endedAt >= dayStart && session.endedAt <= now)
}

export function getTotalMs(sessions: readonly Session[]): number {
  return sessions.reduce((total, session) => total + session.durationMs, 0)
}

/** A short, readable duration: "25m", "1h 15m", "2h". */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(Math.max(0, ms) / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}
