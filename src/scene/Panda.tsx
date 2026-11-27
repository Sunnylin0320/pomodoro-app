import { BurgerWrapper, Cheeseburger } from './Cheeseburger'
import { limb } from './shapes'
import type { PandaPose } from './sky'

// Tweak the panda's look here.
/** Soft charcoal for the outline and the dark fur. Softer than pure black. */
const INK = '#2F2F2F'
const WHITE = '#FFFFFF'
const BLUSH = '#F6A5A0'
const OUTLINE = 2

/** Shared props for every outlined white shape. */
const OUTLINED = { fill: WHITE, stroke: INK, strokeWidth: OUTLINE, strokeLinejoin: 'round' } as const

/**
 * SVG groups scale from the scene's origin by default. This makes the
 * breathing animation scale from the bottom of the panda (its feet) instead.
 */
const FROM_FEET = { transformBox: 'fill-box', transformOrigin: 'center bottom' } as const
const BREATHE = 'motion-safe:animate-breathe'

/*
 * Body shapes, drawn with curves (C) instead of plain ellipses, so they look
 * soft and a little uneven, like a real body: narrower at the shoulders,
 * fuller at the belly.
 */
/** Ends above the ground, so the short legs show underneath. */
const STANDING_BODY = 'M0 -31 C8 -31 12.5 -22 12.5 -14 C12.5 -8 7 -5.5 0 -5.5 C-7 -5.5 -12.5 -8 -12.5 -14 C-12.5 -22 -8 -31 0 -31 Z'
const SITTING_BODY = 'M0 -26 C10 -26 15 -17 15 -10 C15 -3.5 9 0 0 0 C-9 0 -15 -3.5 -15 -10 C-15 -17 -10 -26 0 -26 Z'
/** Low at the shoulders under the head, higher and rounder at the back. */
const LYING_BODY = 'M-12 -12 C-12 -19 -4 -22 6 -22 C18 -22 29 -18 29 -9 C29 -3 24 0 17 0 L-6 0 C-10 0 -12 -6 -12 -12 Z'
/** The lying panda's back leg: a rounded thigh resting on the ground. */
const BACK_LEG = 'M10 -1 C8.5 -9 13 -16.5 19.5 -16 C25.5 -15.5 28.5 -8.5 27.5 -3.5 C27 0 23 1 18 1 Z'
/** A round head, a little fuller at the cheeks than at the top. */
const HEAD = 'M0 -14 C11 -14 17 -8 17 1 C17 9 9.5 13.5 0 13.5 C-9.5 13.5 -17 9 -17 1 C-17 -8 -11 -14 0 -14 Z'

type Eyes = 'open' | 'happy' | 'sleepy' | 'closed'

type PandaProps = {
  pose: PandaPose
}

/**
 * The panda, drawn in its own coordinates: (0, 0) is the point on the ground
 * under its feet, and negative y is up. PandaScene moves and scales it.
 */
export function Panda({ pose }: PandaProps) {
  switch (pose) {
    case 'standing':
      return <Standing />
    case 'sitting':
      return <Sitting />
    case 'lying':
      return <Lying eyes="sleepy" hugging={false} />
    case 'eating':
      return <Eating />
    case 'sleeping':
      return <Lying eyes="closed" hugging />
  }
}

/** Standing and waving. */
function Standing() {
  return (
    <g className={BREATHE} style={FROM_FEET}>
      {/* Legs, drawn before the body: the belly's outline overlaps their tops, and only the feet show below. */}
      <path d={limb({ x: -5.5, y: -8 }, { x: -6, y: -3.6 }, 3.8, 3.6)} fill={INK} />
      <path d={limb({ x: 5.5, y: -8 }, { x: 6, y: -3.6 }, 3.8, 3.6)} fill={INK} />
      <path d={STANDING_BODY} {...OUTLINED} />
      {/* Left arm down, right arm waving. */}
      <ellipse cx={-11.5} cy={-18} rx={3.8} ry={7} fill={INK} transform="rotate(20 -11.5 -18)" />
      <ellipse cx={16} cy={-24} rx={3.8} ry={7} fill={INK} transform="rotate(55 16 -24)" />
      <Head x={0} y={-36} eyes="open" />
    </g>
  )
}

/** Sitting with its feet out, showing the paw pads. */
function Sitting() {
  return (
    <g className={BREATHE} style={FROM_FEET}>
      <path d={SITTING_BODY} {...OUTLINED} />
      {/* Arms resting on the belly. */}
      <ellipse cx={-10.5} cy={-15} rx={3.8} ry={7} fill={INK} transform="rotate(-25 -10.5 -15)" />
      <ellipse cx={10.5} cy={-15} rx={3.8} ry={7} fill={INK} transform="rotate(25 10.5 -15)" />
      <Foot x={-11} />
      <Foot x={11} />
      <Head x={0} y={-30} eyes="open" />
    </g>
  )
}

/** Sitting, hugging the cheeseburger, munching with happy eyes. */
function Eating() {
  return (
    <g className={BREATHE} style={FROM_FEET}>
      <path d={SITTING_BODY} {...OUTLINED} />
      <Foot x={-11} />
      <Foot x={11} />
      <Head x={0} y={-30} eyes="happy" />
      {/* The burger and the paws holding it bob up and down together, like chewing. */}
      <g className="motion-safe:animate-munch" style={{ transformBox: 'fill-box' }}>
        <g transform="translate(0 -6) scale(0.62)">
          <Cheeseburger bitten />
        </g>
        <ellipse cx={-8.5} cy={-11} rx={3.8} ry={4.5} fill={INK} />
        <ellipse cx={8.5} cy={-11} rx={3.8} ry={4.5} fill={INK} />
      </g>
    </g>
  )
}

/**
 * Lying on its belly, head tilted and resting. Shared by "lying" (tired, chin
 * on its paws) and "sleeping" (hugging the empty burger wrapper).
 */
function Lying({ eyes, hugging }: { eyes: Eyes; hugging: boolean }) {
  return (
    <g className={BREATHE} style={FROM_FEET}>
      {/* The tail is drawn first, so the body covers half of it. */}
      <circle cx={28.5} cy={-15} r={3.2} {...OUTLINED} />
      <path d={LYING_BODY} {...OUTLINED} />
      {/* Back leg: a round thigh with its sole turned toward us. */}
      <path d={BACK_LEG} fill={INK} />
      <Foot x={23} />
      {/*
        Shoulder and front leg in one tapered shape. It is drawn before the
        head, so the head covers its top and the paw comes out under the chin.
      */}
      <path
        d={hugging ? limb({ x: 2, y: -14 }, { x: -4, y: -6 }, 7.5, 4.5) : limb({ x: 2, y: -14 }, { x: -6, y: -3 }, 7.5, 4)}
        fill={INK}
      />

      <Head x={-17} y={hugging ? -16 : -14} eyes={eyes} tilt={-8} />

      {/* Drawn after the head, so they sit in front of the chin. */}
      {hugging ? (
        <>
          <g transform="translate(-19 0)">
            <BurgerWrapper />
          </g>
          {/* The forearm wrapped around the wrapper. */}
          <ellipse cx={-7.5} cy={-5.5} rx={9} ry={3.6} fill={INK} transform="rotate(-16 -7.5 -5.5)" />
        </>
      ) : (
        <>
          <ellipse cx={-24} cy={-2.4} rx={5} ry={3} fill={INK} />
          <ellipse cx={-10} cy={-2.4} rx={5} ry={3} fill={INK} />
        </>
      )}

      {eyes === 'closed' && (
        // Floating z's while asleep.
        <g className="motion-safe:animate-float-up" style={{ transformBox: 'fill-box' }}>
          <text x={0} y={-28} fontSize={10} fontWeight={700} fill={WHITE}>
            z
          </text>
          <text x={7} y={-37} fontSize={8} fontWeight={700} fill={WHITE}>
            z
          </text>
        </g>
      )}
    </g>
  )
}

/** A sole facing the viewer, with a pad and three toes. Centered at (x, -4). */
function Foot({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} -4)`}>
      <ellipse cx={0} cy={0} rx={6.5} ry={5.5} fill={INK} />
      <ellipse cx={0} cy={1} rx={2.6} ry={2} fill={WHITE} />
      <circle cx={-2.6} cy={-2.4} r={0.9} fill={WHITE} />
      <circle cx={0} cy={-3.2} r={0.9} fill={WHITE} />
      <circle cx={2.6} cy={-2.4} r={0.9} fill={WHITE} />
    </g>
  )
}

/**
 * The head, drawn around its own center and moved to (x, y).
 * Big and round on purpose: a big head and small body read as "cute".
 */
function Head({ x, y, eyes, tilt = 0 }: { x: number; y: number; eyes: Eyes; tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <circle cx={-12.5} cy={-10} r={6} fill={INK} />
      <circle cx={12.5} cy={-10} r={6} fill={INK} />
      <path d={HEAD} {...OUTLINED} />

      {/* Eye patches, tilted so they droop toward the cheeks. */}
      <ellipse cx={-7} cy={0.5} rx={4.4} ry={5.4} fill={INK} transform="rotate(30 -7 0.5)" />
      <ellipse cx={7} cy={0.5} rx={4.4} ry={5.4} fill={INK} transform="rotate(-30 7 0.5)" />
      <Eye x={-6.5} eyes={eyes} />
      <Eye x={6.5} eyes={eyes} />

      <ellipse cx={-11} cy={4.5} rx={2.8} ry={1.7} fill={BLUSH} />
      <ellipse cx={11} cy={4.5} rx={2.8} ry={1.7} fill={BLUSH} />

      <ellipse cx={0} cy={3.8} rx={1.7} ry={1.15} fill={INK} />
      {/* A small "ω" mouth. */}
      <path
        d="M-2.4 5.6 Q-1.2 7.4 0 5.8 Q1.2 7.4 2.4 5.6"
        fill="none"
        stroke={INK}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </g>
  )
}

/** One eye inside its patch, centered at (x, 0) in head coordinates. */
function Eye({ x, eyes }: { x: number; eyes: Eyes }) {
  if (eyes === 'open') {
    return (
      <g>
        <circle cx={x} cy={0} r={2.4} fill={WHITE} />
        <circle cx={x} cy={0.2} r={1.5} fill={INK} />
        {/* The sparkle. Both eyes catch the light from the same side. */}
        <circle cx={x - 0.6} cy={-0.5} r={0.6} fill={WHITE} />
      </g>
    )
  }

  if (eyes === 'happy') {
    // Squeezed shut with joy: an upside-down curve, like "^".
    return (
      <path
        d={`M${x - 2} 0.8 Q${x} -1.6 ${x + 2} 0.8`}
        fill="none"
        stroke={WHITE}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
    )
  }

  if (eyes === 'sleepy') {
    // Heavy lids: only the bottom half of the eye shows under a flat lid.
    return (
      <g>
        <path d={`M${x - 2.4} 0 A2.4 2.4 0 0 0 ${x + 2.4} 0 Z`} fill={WHITE} />
        <circle cx={x} cy={0.9} r={1.1} fill={INK} />
        <path d={`M${x - 2.6} 0 L${x + 2.6} 0`} stroke={WHITE} strokeWidth={0.9} strokeLinecap="round" />
      </g>
    )
  }

  // Closed: a curve, like a smile turned into an eye.
  return (
    <path
      d={`M${x - 2} -0.4 Q${x} 1.8 ${x + 2} -0.4`}
      fill="none"
      stroke={WHITE}
      strokeWidth={1.1}
      strokeLinecap="round"
    />
  )
}
