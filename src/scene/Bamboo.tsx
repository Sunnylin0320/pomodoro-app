import { colorAt } from './sky'

// Tweak the bamboo's look here. Each color fades from its day shade to its night shade.
const STALK = [
  { at: 0, color: '#8BC34A' },
  { at: 1, color: '#2E5A1C' },
]
const NODE = [
  { at: 0, color: '#5E8F2A' },
  { at: 1, color: '#1E3D12' },
]
const LEAF = [
  { at: 0, color: '#6FAE3A' },
  { at: 1, color: '#25491A' },
]
const STALK_WIDTH = 2.4
const SEGMENT_HEIGHT = 7

/** A leaf pointing right from (0, 0). Rotate it to point anywhere. */
const LEAF_PATH = 'M0 0 Q3.5 -1.7 8 0 Q3.5 1.7 0 0 Z'

type BambooProps = {
  /** Where the stalk meets the ground, in scene coordinates. */
  x: number
  y: number
  height: number
  /** 0 in daylight, 1 at night. */
  shade: number
  /** Seconds to offset the sway, so neighboring stalks don't move in step. */
  swayDelay?: number
}

/** One bamboo stalk with segments and a few leaves, swaying gently in the wind. */
export function Bamboo({ x, y, height, shade, swayDelay = 0 }: BambooProps) {
  const stalk = colorAt(STALK, shade)
  const node = colorAt(NODE, shade)
  const leaf = colorAt(LEAF, shade)

  const segments = Math.max(1, Math.round(height / SEGMENT_HEIGHT))
  const segment = height / segments
  // Lines between segments: one at each joint, not at the very bottom or top.
  const joints = Array.from({ length: segments - 1 }, (_, i) => -(i + 1) * segment)
  // A second bunch of leaves at a joint about two thirds of the way up.
  const midJoint = joints[Math.floor(joints.length * 0.6)]

  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="motion-safe:animate-sway"
        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', animationDelay: `${swayDelay}s` }}
      >
        <rect x={-STALK_WIDTH / 2} y={-height} width={STALK_WIDTH} height={height} rx={STALK_WIDTH / 2} fill={stalk} />
        {joints.map((jointY) => (
          <rect
            key={jointY}
            x={-STALK_WIDTH / 2 - 0.3}
            y={jointY - 0.4}
            width={STALK_WIDTH + 0.6}
            height={0.8}
            rx={0.4}
            fill={node}
          />
        ))}

        <g fill={leaf}>
          {/* A fan of leaves at the top. */}
          {[-40, -90, -140].map((angle) => (
            <path key={angle} d={LEAF_PATH} transform={`translate(0 ${-height}) rotate(${angle})`} />
          ))}
          {/* Two drooping leaves lower down. */}
          {midJoint !== undefined &&
            [15, 165].map((angle) => (
              <path key={angle} d={LEAF_PATH} transform={`translate(0 ${midJoint}) rotate(${angle})`} />
            ))}
        </g>
      </g>
    </g>
  )
}
