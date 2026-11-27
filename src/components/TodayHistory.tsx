import { formatDuration, getTotalMs, type Session } from '../history/history'

type TodayHistoryProps = {
  /** Today's sessions, oldest first. */
  sessions: Session[]
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })

export function TodayHistory({ sessions }: TodayHistoryProps) {
  const count = sessions.length
  const summary = `${count} ${count === 1 ? 'session' : 'sessions'} · ${formatDuration(getTotalMs(sessions))}`
  // Newest first. Copy before reversing, because reverse() changes the array in place.
  const newestFirst = [...sessions].reverse()

  return (
    <section aria-labelledby="today-heading" className="w-full max-w-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="today-heading" className="font-semibold text-slate-800">
          Today
        </h2>
        <p className="text-sm text-slate-500">{summary}</p>
      </div>

      {count === 0 ? (
        <p className="rounded-2xl bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
          No focus sessions yet. Finish one to see it here.
        </p>
      ) : (
        <ol className="divide-y divide-slate-200 rounded-2xl bg-white/60">
          {newestFirst.map((session) => (
            <li key={session.id} className="flex items-center gap-4 px-4 py-3">
              <time dateTime={new Date(session.endedAt).toISOString()} className="text-sm text-slate-500 tabular-nums">
                {timeFormat.format(session.endedAt)}
              </time>
              <span className={`flex-1 truncate ${session.task ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {session.task || 'Untitled'}
              </span>
              <span className="text-sm text-slate-500">{formatDuration(session.durationMs)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
