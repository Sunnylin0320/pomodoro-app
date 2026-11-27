import { useId } from 'react'
import type { Mode, Status } from '../timer/timer'
import { Bamboo } from './Bamboo'
import { Cheeseburger } from './Cheeseburger'
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
/** The top of the sky is a deeper version of the sky color, the bottom a lighter one. */
const SKY_TOP_TINT = '#1F1A5C'
const SKY_BOTTOM_TINT = '#FFFFFF'
/** Clouds are white at noon and turn pink as the sun sets. */
const CLOUD_COLORS: ColorStop[] = [
  { at: 0, color: '#FFFFFF' },
  { at: 1, color: '#F8C8D4' },
]
const MOON = { x: 76, y: 20, r: 7, color: '#F1EFE8' }
const STARS = [
  { x: 12, y: 14, r: 0.7 },
  { x: 30, y: 8, r: 0.5 },
  { x: 44, y: 22, r: 0.6 },
  { x: 58, y: 10, r: 0.5 },
  { x: 90, y: 38, r: 0.6 },
  { x: 20, y: 34, r: 0.4 },
  { x: 64, y: 30, r: 0.4 },
]
const CLOUDS = [
  { x: 58, y: 16, scale: 1, seconds: 18 },
  { x: 84, y: 34, scale: 0.7, seconds: 24 },
  { x: 16, y: 26, scale: 0.6, seconds: 21 },
]
/** Left: a clump of three. Right: one short stalk, to balance the burger. */
const BAMBOO = [
  { x: 5, height: 30, swayDelay: 0.8 },
  { x: 10, height: 42, swayDelay: 0 },
  { x: 16, height: 34, swayDelay: 1.6 },
  { x: 94, height: 22, swayDelay: 1.1 },
]
const GRASS_TUFTS = [
  { x: 8, y: 88 },
  { x: 24, y: 95 },
  { x: 40, y: 92 },
  { x: 60, y: 96 },
  { x: 74, y: 90 },
  { x: 92, y: 87 },
]
const FLOWERS = [
  { x: 15, y: 91 },
  { x: 67, y: 94 },
  { x: 86, y: 97 },
]
/** Rolling hills: a far one behind the bamboo, and the near ground the panda sits on. */
const FAR_HILLS = 'M0 74 Q14 66 30 72 Q46 78 60 72 Q78 64 100 71 V100 H0 Z'
const NEAR_GROUND = 'M0 81 Q20 77 42 80 Q60 82.5 78 79.5 Q90 78 100 80 V100 H0 Z'
const PANDA_POSITION = { x: 50, scale: 0.7 }
/** During focus, the cheeseburger waits on the grass next to the panda. */
const BURGER_POSITION = { x: 82, scale: 0.42 }

/** When the mode switches, colors fade to their new value. */
const FILL_TRANSITION = 'motion-safe:transition-[fill] motion-safe:duration-1000'
const STOP_TRANSITION = 'motion-safe:transition-[stop-color] motion-safe:duration-1000'

type PandaSceneProps = {
  mode: Mode
  status: Status
  progress: number
}

const POSE_DESCRIPTIONS: Record<PandaPose, string> = {
  standing: 'standing',
  sitting: 'sitting',
  lying: 'lying down',
  eating: 'eating a cheeseburger',
  sleeping: 'asleep, hugging the empty wrapper',
}

export function PandaScene({ mode, status, progress }: PandaSceneProps) {
  // Gradients and masks are found by id, so each scene needs ids no other element on the page uses.
  // useId gives a unique one; we drop characters that are awkward inside url(#...).
  const id = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const skyId = `${id}-sky`
  const moonId = `${id}-moon`
  const glowId = `${id}-glow`

  const isFocus = mode === 'focus'
  const skyColor = getSkyColor(mode, progress)
  const skyTop = colorAt(
    [
      { at: 0, color: skyColor },
      { at: 1, color: SKY_TOP_TINT },
    ],
    0.3,
  )
  const skyBottom = colorAt(
    [
      { at: 0, color: skyColor },
      { at: 1, color: SKY_BOTTOM_TINT },
    ],
    0.2,
  )
  const sun = getSunPosition(progress)
  const sunColor = colorAt(SUN_COLORS, progress)
  const pose = getPandaPose(mode, progress)

  const groundColor = isFocus ? colorAt(FOCUS_GROUND, progress) : NIGHT_GROUND
  // Far away things look paler and closer to the sky's color.
  const hillColor = colorAt(
    [
      { at: 0, color: groundColor },
      { at: 1, color: skyBottom },
    ],
    0.3,
  )
  const tuftColor = colorAt(
    [
      { at: 0, color: groundColor },
      { at: 1, color: '#1B3A0A' },
    ],
    0.45,
  )
  /** How dark the plants are: 0 at noon, darker as the sun sets, 1 at night. */
  const shade = isFocus ? progress * 0.7 : 1

  const label = isFocus
    ? `Panda ${POSE_DESCRIPTIONS[pose]} next to a cheeseburger while the sun sets`
    : `Panda ${POSE_DESCRIPTIONS[pose]} under the moon`

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} className="block w-full">
      <defs>
        {/* userSpaceOnUse: the gradient runs from y=0 to y=100 of the scene, whatever shape uses it. */}
        <linearGradient id={skyId} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={100}>
          <stop offset="0%" stopColor={skyTop} className={STOP_TRANSITION} />
          <stop offset="80%" stopColor={skyBottom} className={STOP_TRANSITION} />
        </linearGradient>
        {/* A soft glow: bright in the middle, fading to transparent at the edge. */}
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={isFocus ? sunColor : MOON.color} stopOpacity={isFocus ? 0.6 : 0.3} />
          <stop offset="100%" stopColor={isFocus ? sunColor : MOON.color} stopOpacity={0} />
        </radialGradient>
        {/* White shows, black hides: a full moon with a circle cut out leaves a crescent. */}
        <mask id={moonId}>
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="white" />
          <circle cx={MOON.x + 4} cy={MOON.y - 3} r={MOON.r - 0.5} fill="black" />
        </mask>
      </defs>

      <rect width={100} height={100} fill={`url(#${skyId})`} />

      {isFocus ? (
        // Drawn before the hills, so the sun sets behind them.
        <g className="motion-safe:animate-fade-in">
          <circle cx={sun.x} cy={sun.y} r={SUN_RADIUS * 2.4} fill={`url(#${glowId})`} />
          <circle cx={sun.x} cy={sun.y} r={SUN_RADIUS} fill={sunColor} />
        </g>
      ) : (
        <g className="motion-safe:animate-fade-in">
          {STARS.map((star, index) => (
            <circle
              key={`${star.x}-${star.y}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill={MOON.color}
              className="motion-safe:animate-twinkle"
              // Each star starts at a different moment, so they don't blink together.
              style={{ animationDelay: `${index * 0.6}s` }}
            />
          ))}
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r * 2.4} fill={`url(#${glowId})`} />
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill={MOON.color} mask={`url(#${moonId})`} />
        </g>
      )}

      {isFocus &&
        CLOUDS.map((cloud) => (
          <Cloud key={cloud.x} {...cloud} color={colorAt(CLOUD_COLORS, progress)} />
        ))}

      <path d={FAR_HILLS} fill={hillColor} className={FILL_TRANSITION} />

      {BAMBOO.map((stalk) => (
        <Bamboo key={stalk.x} x={stalk.x} y={HORIZON_Y + 1} height={stalk.height} shade={shade} swayDelay={stalk.swayDelay} />
      ))}

      <path d={NEAR_GROUND} fill={groundColor} className={FILL_TRANSITION} />

      <g fill="none" stroke={tuftColor} strokeWidth={0.6} strokeLinecap="round">
        {GRASS_TUFTS.map((tuft) => (
          <path
            key={tuft.x}
            d="M0 0 L-1.2 -2.6 M0 0 L0 -3.2 M0 0 L1.2 -2.6"
            transform={`translate(${tuft.x} ${tuft.y})`}
          />
        ))}
      </g>
      {FLOWERS.map((flower) => (
        <g key={flower.x} transform={`translate(${flower.x} ${flower.y})`} opacity={isFocus ? 1 : 0.5}>
          <circle r={0.9} fill="#FFFFFF" />
          <circle r={0.4} fill="#FFD23F" />
        </g>
      ))}

      {isFocus && (
        <g transform={`translate(${BURGER_POSITION.x} ${HORIZON_Y + 2}) scale(${BURGER_POSITION.scale})`}>
          <Cheeseburger />
        </g>
      )}

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

type CloudProps = {
  x: number
  y: number
  scale: number
  /** How long one drift takes. Different speeds make the sky feel less mechanical. */
  seconds: number
  color: string
}

/** A puffy cloud that drifts slowly back and forth. */
function Cloud({ x, y, scale, seconds, color }: CloudProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="motion-safe:animate-drift" style={{ animationDuration: `${seconds}s` }} fill={color} opacity={0.9}>
        <ellipse cx={0} cy={2} rx={9} ry={2.6} />
        <circle cx={-4} cy={0.6} r={3.2} />
        <circle cx={0.5} cy={-0.8} r={4.2} />
        <circle cx={4.8} cy={0.8} r={3} />
      </g>
    </g>
  )
}
