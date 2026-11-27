import { describe, expect, it } from 'vitest'
import { limb } from './shapes'

describe('limb', () => {
  it('builds a tapered capsule along a horizontal line', () => {
    expect(limb({ x: 0, y: 0 }, { x: 10, y: 0 }, 2, 1)).toBe('M0 2 L10 1 A1 1 0 0 0 10 -1 L0 -2 A2 2 0 0 0 0 2 Z')
  })

  it('offsets the sides at a right angle to a vertical limb', () => {
    // Going down: the sides sit to the left and right of the line.
    expect(limb({ x: 0, y: 0 }, { x: 0, y: 10 }, 2, 2)).toBe('M-2 0 L-2 10 A2 2 0 0 0 2 10 L2 0 A2 2 0 0 0 -2 0 Z')
  })

  it('rounds coordinates to two decimals', () => {
    const path = limb({ x: 0, y: 0 }, { x: 3, y: 7 }, 1, 1)
    expect(path).not.toMatch(/\d\.\d{3}/)
  })

  it('draws a circle when both ends are the same point', () => {
    expect(limb({ x: 5, y: 5 }, { x: 5, y: 5 }, 2, 2)).toBe('M3 5 A2 2 0 1 0 7 5 A2 2 0 1 0 3 5 Z')
  })
})
