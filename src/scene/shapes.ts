// Small geometry helpers that build SVG path strings.

export type Point = { x: number; y: number }

/** Rounds to two decimals, so the path strings stay short and readable. */
function fmt(value: number): string {
  return String(Math.round(value * 100) / 100)
}

/**
 * A limb: a capsule that tapers from `fromRadius` at one end to `toRadius` at
 * the other, with rounded ends. Good for legs: thick at the hip, thinner at
 * the paw.
 */
export function limb(from: Point, to: Point, fromRadius: number, toRadius: number): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)

  if (length === 0) {
    // Both ends in the same place: just a circle.
    const { x, y } = from
    const r = fromRadius
    return `M${fmt(x - r)} ${fmt(y)} A${r} ${r} 0 1 0 ${fmt(x + r)} ${fmt(y)} A${r} ${r} 0 1 0 ${fmt(x - r)} ${fmt(y)} Z`
  }

  // A unit vector at a right angle to the limb, pointing to one side of it.
  const nx = -dy / length
  const ny = dx / length

  const side = (point: Point, radius: number, sign: 1 | -1) =>
    `${fmt(point.x + sign * nx * radius)} ${fmt(point.y + sign * ny * radius)}`

  return [
    `M${side(from, fromRadius, 1)}`,
    // Down one side,
    `L${side(to, toRadius, 1)}`,
    // round the far end,
    `A${toRadius} ${toRadius} 0 0 0 ${side(to, toRadius, -1)}`,
    // back up the other side,
    `L${side(from, fromRadius, -1)}`,
    // and round the near end.
    `A${fromRadius} ${fromRadius} 0 0 0 ${side(from, fromRadius, 1)}`,
    'Z',
  ].join(' ')
}
