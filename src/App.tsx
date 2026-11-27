import { useEffect, useState } from 'react'
import { TaskInput } from './components/TaskInput'
import { TimerControls } from './components/TimerControls'
import { TodayHistory } from './components/TodayHistory'
import { getTodaySessions } from './history/history'
import { useSessions } from './history/useSessions'
import { PandaScene } from './scene/PandaScene'
import { ScenePreview, type ScenePreviewState } from './scene/ScenePreview'
import { playChime, unlockAudio } from './sound/chime'
import { getDocumentTitle } from './timer/title'
import { DURATIONS_MS, type Mode } from './timer/timer'
import { useTimer } from './timer/useTimer'

function App() {
  const [task, setTask] = useState('')
  const { sessions, addFocusSession } = useSessions()

  function handleFinish(finishedMode: Mode) {
    playChime(finishedMode)
    // Only finished focus sessions go into the history. The task name is kept for the next one.
    if (finishedMode === 'focus') addFocusSession(task, DURATIONS_MS.focus)
  }

  const timer = useTimer({ onFinish: handleFinish })

  // Show the countdown in the browser tab. Only touches the page when the text changes.
  const title = getDocumentTitle(timer.mode, timer.status, timer.remainingMs)
  useEffect(() => {
    document.title = title
  }, [title])

  function handleStart() {
    // Browsers only allow sound after a click, so get audio ready now for the chime later.
    unlockAudio()
    timer.start()
  }

  const [preview, setPreview] = useState<ScenePreviewState>({
    enabled: false,
    mode: 'focus',
    progress: 0,
  })

  // In development, the preview panel can take over the scene.
  const isPreviewing = import.meta.env.DEV && preview.enabled
  const scene = isPreviewing
    ? { mode: preview.mode, status: 'running' as const, progress: preview.progress }
    : { mode: timer.mode, status: timer.status, progress: timer.progress }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-emerald-50 px-6 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl shadow-md">
        <PandaScene mode={scene.mode} status={scene.status} progress={scene.progress} />
      </div>

      <TaskInput value={task} onChange={setTask} />

      <TimerControls
        mode={timer.mode}
        status={timer.status}
        remainingMs={timer.remainingMs}
        onStart={handleStart}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <TodayHistory sessions={getTodaySessions(sessions, timer.now)} />

      {import.meta.env.DEV && <ScenePreview value={preview} onChange={setPreview} />}
    </main>
  )
}

export default App
