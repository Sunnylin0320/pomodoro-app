// Tweak the burger's look here. The outline matches the panda's ink.
const INK = '#2F2F2F'
const BUN = '#F4B860'
const SESAME = '#FFF4DC'
const PATTY = '#7B4A2D'
const CHEESE = '#FFD23F'
const LETTUCE = '#8CC63F'
/** Thinner than the panda's, so the thin layers still show when the burger is small. */
const OUTLINE = 1

const OUTLINED = { stroke: INK, strokeWidth: OUTLINE, strokeLinejoin: 'round' } as const

const TOP_BUN = 'M-12.5 -12.5 Q-12.5 -23 0 -23 Q12.5 -23 12.5 -12.5 Z'
/** The same top bun with a round bite taken out of its right side. */
const TOP_BUN_BITTEN = 'M-12.5 -12.5 Q-12.5 -23 0 -23 Q6 -23 9.2 -20.4 A3.6 3.6 0 0 0 12.5 -15 L12.5 -12.5 Z'

type CheeseburgerProps = {
  /** Show a bite mark, for when the panda is eating it. */
  bitten?: boolean
}

/**
 * A cheeseburger, drawn in its own coordinates: (0, 0) is the middle of its
 * bottom edge. About 29 wide and 23 tall.
 */
export function Cheeseburger({ bitten = false }: CheeseburgerProps) {
  // Drawn from the bottom of the stack up, so each layer overlaps the one below.
  return (
    <g>
      <rect x={-11.5} y={-5} width={23} height={5} rx={2.5} fill={BUN} {...OUTLINED} />
      <rect x={-12.5} y={-10.5} width={25} height={6} rx={3} fill={PATTY} {...OUTLINED} />
      {/* Cheese, a bit wider than the patty, with two drips. */}
      <path
        d="M-13.5 -11.5 H13.5 V-10 H9.5 L7.5 -7 L5.5 -10 H-3.5 L-5.5 -6.5 L-7.5 -10 H-13.5 Z"
        fill={CHEESE}
        {...OUTLINED}
      />
      {/* Lettuce with a wavy bottom edge, sticking out past the bun. The top edge hides under the bun. */}
      <path
        d="M-14.5 -13 H14.5 V-11.5 Q12.5 -9.6 10.5 -11.5 Q8.5 -9.6 6.5 -11.5 Q4.5 -9.6 2.5 -11.5 Q0.5 -9.6 -1.5 -11.5 Q-3.5 -9.6 -5.5 -11.5 Q-7.5 -9.6 -9.5 -11.5 Q-11.5 -9.6 -14.5 -11.5 Z"
        fill={LETTUCE}
        {...OUTLINED}
      />
      <path d={bitten ? TOP_BUN_BITTEN : TOP_BUN} fill={BUN} {...OUTLINED} />
      <g fill={SESAME}>
        <ellipse cx={-5.5} cy={-17.5} rx={1} ry={0.6} transform="rotate(-20 -5.5 -17.5)" />
        <ellipse cx={0} cy={-20.2} rx={1} ry={0.6} />
        <ellipse cx={-1} cy={-15.5} rx={1} ry={0.6} transform="rotate(15 -1 -15.5)" />
        <ellipse cx={4.5} cy={-17} rx={1} ry={0.6} transform="rotate(25 4.5 -17)" />
      </g>
    </g>
  )
}
