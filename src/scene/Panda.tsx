import { BurgerWrapper, Cheeseburger } from './Cheeseburger'
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
      <ellipse cx={0} cy={-17} rx={12.5} ry={12} {...OUTLINED} />
      {/* Legs, drawn over the body so the dark fur meets the white belly. */}
      <rect x={-9} y={-11} width={7.5} height={11} rx={3.5} fill={INK} />
      <rect x={1.5} y={-11} width={7.5} height={11} rx={3.5} fill={INK} />
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
      <ellipse cx={0} cy={-12} rx={15} ry={12.5} {...OUTLINED} />
      <Foot x={-11} />
      <Foot x={11} />
      {/* Arms resting on the belly. */}
      <ellipse cx={-10.5} cy={-15} rx={3.8} ry={7} fill={INK} transform="rotate(-25 -10.5 -15)" />
      <ellipse cx={10.5} cy={-15} rx={3.8} ry={7} fill={INK} transform="rotate(25 10.5 -15)" />
      <Head x={0} y={-30} eyes="open" />
    </g>
  )
}

/** Sitting, hugging the cheeseburger, munching with happy eyes. */
function Eating() {
  return (
    <g className={BREATHE} style={FROM_FEET}>
      <ellipse cx={0} cy={-12} rx={15} ry={12.5} {...OUTLINED} />
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
      <circle cx={29} cy={-16} r={3.2} {...OUTLINED} />
      <ellipse cx={8} cy={-11} rx={21} ry={11} {...OUTLINED} />
      {/*
        Dark fur over the shoulders. It starts behind the head and slants down
        into the front legs, so head, shoulders and paws read as one body.
      */}
      <ellipse cx={-1} cy={-10} rx={7} ry={11} fill={INK} transform="rotate(20 -1 -10)" />
      {/* Back leg. Its bottom covers the body's outline, so the leg grows out of the body. */}
      <ellipse cx={18} cy={-5.5} rx={8} ry={6} fill={INK} />
      <Foot x={23} />

      <Head x={-17} y={hugging ? -16 : -14} eyes={eyes} tilt={-8} />

      {/* Drawn after the head, so they sit in front of the chin. */}
      {hugging ? (
        <>
          <g transform="translate(-19 0)">
            <BurgerWrapper />
          </g>
          {/* One arm wrapped around the wrapper. */}
          <ellipse cx={-7.5} cy={-5.5} rx={9} ry={3.6} fill={INK} transform="rotate(-16 -7.5 -5.5)" />
        </>
      ) : (
        <>
          <ellipse cx={-24} cy={-2} rx={5.5} ry={3} fill={INK} />
          <ellipse cx={-10} cy={-2} rx={5.5} ry={3} fill={INK} />
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
      {/* The tuft of fur is drawn first, so the face covers its bottom half. */}
      <path d="M-3.5 -12.5 Q-1.5 -19 0.5 -15.5 Q2 -18.5 3.5 -12.5 Z" {...OUTLINED} />
      <circle cx={-12.5} cy={-10} r={6} fill={INK} />
      <circle cx={12.5} cy={-10} r={6} fill={INK} />
      <ellipse cx={0} cy={0} rx={17} ry={14.5} {...OUTLINED} />

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
