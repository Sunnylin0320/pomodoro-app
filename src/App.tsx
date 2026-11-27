import { TimerControls } from './components/TimerControls'
import { useTimer } from './timer/useTimer'

function App() {
  const timer = useTimer()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 p-6">
      <TimerControls
        mode={timer.mode}
        status={timer.status}
        remainingMs={timer.remainingMs}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skip}
      />
    </main>
  )
}

export default App
