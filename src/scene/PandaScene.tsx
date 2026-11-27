import type { Mode, Status } from '../timer/timer'
import { Panda } from './Panda'
import {
  HORIZON_Y,
  colorAt,
  getPandaPose,
  getSkyColor,
  getSunPosition,
  type ColorStop,
  type PandaPose,
} from './sky'

// Tweak the scene's look here.
const SUN_RADIUS = 7
const SUN_COLORS: ColorStop[] = [
  { at: 0, color: '#FAC775' },
  { at: 0.5, color: '#EF9F27' },
  { at: 1, color: '#D85A30' },
]
const FOCUS_GROUND: ColorStop[] = [
  { at: 0, color: '#97C459' },
  { at: 1, color: '#3B6D11' },
]
const NIGHT_GROUND = '#27500A'
const MOON = { x: 76, y: 20, r: 7, color: '#F1EFE8' }
const STARS = [
  { x: 12, y: 14, r: 0.7 },
  { x: 30, y: 8, r: 0.5 },
  { x: 44, y: 22, r: 0.6 },
  { x: 58, y: 10, r: 0.5 },
  { x: 90, y: 38, r: 0.6 },
  { x: 20, y: 34, r: 0.4 },
]
const PANDA_POSITION = { x: 50, scale: 0.55 }

/** When the mode switches, the sky and ground fade to their new color. */
const COLOR_TRANSITION = 'motion-safe:transition-[fill] motion-safe:duration-1000'

type PandaSceneProps = {
  mode: Mode
  status: Status
  progress: number
}

const POSE_DESCRIPTIONS: Record<PandaPose, string> = {
  standing: 'standing',
  sitting: 'sitting',
  lying: 'lying down',
  sleeping: 'asleep',
}

export function PandaScene({ mode, status, progress }: PandaSceneProps) {
  const isFocus = mode === 'focus'
  const skyColor = getSkyColor(mode, progress)
  const sun = getSunPosition(progress)
  const pose = getPandaPose(mode, progress)
  const groundColor = isFocus ? colorAt(FOCUS_GROUND, progress) : NIGHT_GROUND

  const label = isFocus
    ? `Panda ${POSE_DESCRIPTIONS[pose]} while the sun sets`
    : `Panda ${POSE_DESCRIPTIONS[pose]} under the moon`

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} className="block w-full">
      <rect width={100} height={100} fill={skyColor} className={COLOR_TRANSITION} />

      {isFocus ? (
        // Drawn before the ground, so the sun disappears behind the horizon.
        <circle
          cx={sun.x}
          cy={sun.y}
          r={SUN_RADIUS}
          fill={colorAt(SUN_COLORS, progress)}
          className="motion-safe:animate-fade-in"
        />
      ) : (
        <g className="motion-safe:animate-fade-in">
          {STARS.map((star) => (
            <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill={MOON.color} />
          ))}
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill={MOON.color} />
          {/* A sky-colored circle over the moon turns it into a crescent. */}
          <circle cx={MOON.x + 4} cy={MOON.y - 3} r={MOON.r - 0.5} fill={skyColor} />
        </g>
      )}

      <rect y={HORIZON_Y} width={100} height={100 - HORIZON_Y} fill={groundColor} className={COLOR_TRANSITION} />

      <g transform={`translate(${PANDA_POSITION.x} ${HORIZON_Y + 2}) scale(${PANDA_POSITION.scale})`}>
        {/* A new key on every pose change makes React mount a fresh group, which replays the fade-in. */}
        <g key={pose} className="motion-safe:animate-fade-in">
          <Panda pose={pose} />
        </g>
      </g>

      {status === 'paused' && (
        <text x={50} y={10} textAnchor="middle" fontSize={5} fontWeight={600} fill="#FFFFFF">
          Paused
        </text>
      )}
    </svg>
  )
}
