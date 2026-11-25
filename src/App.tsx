import { TimerControls } from './components/TimerControls'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 p-6">
      {/* Fake data for now. Lesson 3 replaces it with the useTimer hook. */}
      <TimerControls
        mode="focus"
        status="idle"
        remainingMs={25 * 60_000}
        onStart={() => console.log('start')}
        onPause={() => console.log('pause')}
        onReset={() => console.log('reset')}
        onSkip={() => console.log('skip')}
      />
    </main>
  )
}

export default App
