import { useState } from 'react'
import { TimerControls } from './components/TimerControls'
import { PandaScene } from './scene/PandaScene'
import { ScenePreview, type ScenePreviewState } from './scene/ScenePreview'
import { useTimer } from './timer/useTimer'

function App() {
  const timer = useTimer()
  const [preview, setPreview] = useState<ScenePreviewState>({
    enabled: false,
    mode: 'focus',
    progress: 0,
  })

  // In development, the preview panel can take over the scene.
  const usePreview = import.meta.env.DEV && preview.enabled
  const scene = usePreview
    ? { mode: preview.mode, status: 'running' as const, progress: preview.progress }
    : { mode: timer.mode, status: timer.status, progress: timer.progress }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-emerald-50 p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl shadow-md">
        <PandaScene mode={scene.mode} status={scene.status} progress={scene.progress} />
      </div>

      <TimerControls
        mode={timer.mode}
        status={timer.status}
        remainingMs={timer.remainingMs}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      {import.meta.env.DEV && <ScenePreview value={preview} onChange={setPreview} />}
    </main>
  )
}

export default App
