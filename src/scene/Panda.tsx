import type { PandaPose } from './sky'

// Tweak the panda's look here.
const BLACK = '#2C2C2A'
const WHITE = '#FFFFFF'
const OUTLINE = 1.5

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
      return <Lying eyes="open" />
    case 'sleeping':
      return <Lying eyes="closed" />
  }
}

function Standing() {
  return (
    <g>
      <rect x={-8} y={-14} width={6} height={15} rx={2} fill={BLACK} />
      <rect x={2} y={-14} width={6} height={15} rx={2} fill={BLACK} />
      <ellipse cx={0} cy={-26} rx={15} ry={18} fill={WHITE} stroke={BLACK} strokeWidth={OUTLINE} />
      <ellipse cx={-14} cy={-28} rx={4.5} ry={10} fill={BLACK} transform="rotate(20 -14 -28)" />
      <ellipse cx={14} cy={-28} rx={4.5} ry={10} fill={BLACK} transform="rotate(-20 14 -28)" />
      <Head y={-52} />
    </g>
  )
}

function Sitting() {
  return (
    <g>
      <ellipse cx={0} cy={-14} rx={18} ry={15} fill={WHITE} stroke={BLACK} strokeWidth={OUTLINE} />
      <ellipse cx={-13} cy={-1} rx={7} ry={4} fill={BLACK} />
      <ellipse cx={13} cy={-1} rx={7} ry={4} fill={BLACK} />
      <ellipse cx={-13} cy={-16} rx={4.5} ry={9} fill={BLACK} transform="rotate(15 -13 -16)" />
      <ellipse cx={13} cy={-16} rx={4.5} ry={9} fill={BLACK} transform="rotate(-15 13 -16)" />
      <Head y={-38} />
    </g>
  )
}

/** Head for the upright poses, centered at (0, y). */
function Head({ y }: { y: number }) {
  return (
    <g>
      <circle cx={-11} cy={y - 10} r={6} fill={BLACK} />
      <circle cx={11} cy={y - 10} r={6} fill={BLACK} />
      <circle cx={0} cy={y} r={14} fill={WHITE} stroke={BLACK} strokeWidth={OUTLINE} />
      <ellipse cx={-6} cy={y} rx={3.5} ry={4.5} fill={BLACK} />
      <ellipse cx={6} cy={y} rx={3.5} ry={4.5} fill={BLACK} />
      <circle cx={-5.5} cy={y - 0.5} r={1.3} fill={WHITE} />
      <circle cx={5.5} cy={y - 0.5} r={1.3} fill={WHITE} />
      <circle cx={0} cy={y + 6} r={1.6} fill={BLACK} />
    </g>
  )
}

/** Lying on its belly, head resting on its paws. Shared by "lying" and "sleeping". */
function Lying({ eyes }: { eyes: 'open' | 'closed' }) {
  return (
    <g>
      <ellipse cx={8} cy={-8} rx={26} ry={9} fill={WHITE} stroke={BLACK} strokeWidth={OUTLINE} />
      <ellipse cx={28} cy={-1} rx={6} ry={3} fill={BLACK} />
      <ellipse cx={-20} cy={-1} rx={11} ry={3} fill={BLACK} />
      <circle cx={-27} cy={-22} r={5} fill={BLACK} />
      <circle cx={-12} cy={-22} r={5} fill={BLACK} />
      <circle cx={-20} cy={-12} r={12} fill={WHITE} stroke={BLACK} strokeWidth={OUTLINE} />
      <ellipse cx={-25} cy={-12} rx={3} ry={4} fill={BLACK} />
      <ellipse cx={-15} cy={-12} rx={3} ry={4} fill={BLACK} />
      {eyes === 'open' ? (
        // Sleepy, half-closed eyes.
        <g stroke={WHITE} strokeWidth={1.3} strokeLinecap="round">
          <path d="M-27 -12 L-23 -12" />
          <path d="M-17 -12 L-13 -12" />
        </g>
      ) : (
        // Closed eyes and floating z's.
        <g>
          <g fill="none" stroke={WHITE} strokeWidth={1.3} strokeLinecap="round">
            <path d="M-27 -13 Q-25 -10 -23 -13" />
            <path d="M-17 -13 Q-15 -10 -13 -13" />
          </g>
          <text x={-8} y={-28} fontSize={10} fontWeight={600} fill={WHITE}>
            z
          </text>
          <text x={-1} y={-37} fontSize={8} fontWeight={600} fill={WHITE}>
            z
          </text>
        </g>
      )}
      <circle cx={-20} cy={-7} r={1.4} fill={BLACK} />
    </g>
  )
}
