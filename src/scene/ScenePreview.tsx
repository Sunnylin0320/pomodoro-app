import type { Mode } from '../timer/timer'

export type ScenePreviewState = {
  enabled: boolean
  mode: Mode
  progress: number
}

type ScenePreviewProps = {
  value: ScenePreviewState
  onChange: (value: ScenePreviewState) => void
}

/**
 * Development-only panel to scrub through the scene without waiting for the
 * timer. App only renders it when `import.meta.env.DEV` is true.
 */
export function ScenePreview({ value, onChange }: ScenePreviewProps) {
  return (
    <fieldset className="fixed right-4 bottom-4 w-64 rounded-xl border border-slate-300 bg-white/90 p-4 text-sm text-slate-700 shadow-lg">
      <legend className="px-1 font-semibold">Scene preview (dev only)</legend>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(event) => onChange({ ...value, enabled: event.target.checked })}
        />
        Override the timer
      </label>

      <div className="mt-3 flex gap-4">
        {(['focus', 'break'] as const).map((mode) => (
          <label key={mode} className="flex items-center gap-1 capitalize">
            <input
              type="radio"
              name="preview-mode"
              checked={value.mode === mode}
              onChange={() => onChange({ ...value, mode, enabled: true })}
            />
            {mode}
          </label>
        ))}
      </div>

      <label className="mt-3 block">
        Progress: <span className="font-mono tabular-nums">{value.progress.toFixed(2)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value.progress}
          onChange={(event) => onChange({ ...value, progress: event.target.valueAsNumber, enabled: true })}
          className="mt-1 block w-full"
        />
      </label>
    </fieldset>
  )
}
