import { useEffect, useState } from 'react'
import { addSession, createSession, type Session } from './history'
import { loadSessions, saveSessions } from './storage'

export type UseSessions = {
  sessions: Session[]
  /** Record a finished focus session. */
  addFocusSession: (task: string, durationMs: number) => void
}

/** The focus history, kept in React state and saved to localStorage on every change. */
export function useSessions(): UseSessions {
  // The function form reads localStorage only once, on the first render.
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())

  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  function addFocusSession(task: string, durationMs: number) {
    // Create the id and timestamp here, not inside the updater, so the updater stays pure.
    const session = createSession(crypto.randomUUID(), task, Date.now(), durationMs)
    setSessions((current) => addSession(current, session))
  }

  return { sessions, addFocusSession }
}
