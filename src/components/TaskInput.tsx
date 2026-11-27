import { MAX_TASK_LENGTH } from '../history/history'

type TaskInputProps = {
  value: string
  onChange: (value: string) => void
}

export function TaskInput({ value, onChange }: TaskInputProps) {
  return (
    <div className="w-full max-w-sm">
      {/* Hidden visually, but read out by screen readers. */}
      <label htmlFor="task" className="sr-only">
        Task
      </label>
      <input
        id="task"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_TASK_LENGTH}
        placeholder="What are you focusing on?"
        autoComplete="off"
        className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-slate-800 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      />
    </div>
  )
}
