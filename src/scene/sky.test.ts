import { describe, expect, it } from 'vitest'
import {
  BREAK_SKY,
  FOCUS_SKY,
  HORIZON_Y,
  SUN_START,
  colorAt,
  getPandaPose,
  getSkyColor,
  getSunPosition,
  hexToRgb,
  lerp,
  rgbToHex,
} from './sky'

describe('getPandaPose', () => {
  it('stands during the first third of focus', () => {
    expect(getPandaPose('focus', 0)).toBe('standing')
    expect(getPandaPose('focus', 0.32)).toBe('standing')
  })

  it('sits during the second third of focus', () => {
    expect(getPandaPose('focus', 1 / 3)).toBe('sitting')
    expect(getPandaPose('focus', 0.5)).toBe('sitting')
  })

  it('lies down during the last third of focus', () => {
    expect(getPandaPose('focus', 2 / 3)).toBe('lying')
    expect(getPandaPose('focus', 1)).toBe('lying')
  })

  it('sleeps for the whole break', () => {
    expect(getPandaPose('break', 0)).toBe('sleeping')
    expect(getPandaPose('break', 0.5)).toBe('sleeping')
    expect(getPandaPose('break', 1)).toBe('sleeping')
  })
})

describe('lerp', () => {
  it('returns the start, the end, and values in between', () => {
    expect(lerp(0, 100, 0)).toBe(0)
    expect(lerp(0, 100, 1)).toBe(100)
    expect(lerp(0, 100, 0.3)).toBe(30)
    expect(lerp(80, 20, 0.5)).toBe(50)
  })
})

describe('hexToRgb and rgbToHex', () => {
  it('convert a color both ways', () => {
    expect(hexToRgb('#85B7EB')).toEqual({ r: 133, g: 183, b: 235 })
    expect(rgbToHex({ r: 133, g: 183, b: 235 })).toBe('#85b7eb')
  })

  it('round channels and pad single digits', () => {
    expect(rgbToHex({ r: 0, g: 9.6, b: 255 })).toBe('#000aff')
  })
})

describe('colorAt', () => {
  const stops = [
    { at: 0, color: '#000000' },
    { at: 0.5, color: '#ffffff' },
    { at: 1, color: '#000000' },
  ]

  it('returns the exact color at a stop', () => {
    expect(colorAt(stops, 0)).toBe('#000000')
    expect(colorAt(stops, 0.5)).toBe('#ffffff')
    expect(colorAt(stops, 1)).toBe('#000000')
  })

  it('blends between the two nearest stops', () => {
    // Halfway between black (0) and white (255) is 127.5, which rounds to 128 (0x80).
    expect(colorAt(stops, 0.25)).toBe('#808080')
  })

  it('clamps progress outside 0 to 1', () => {
    expect(colorAt(stops, -1)).toBe('#000000')
    expect(colorAt(stops, 2)).toBe('#000000')
  })
})

describe('getSkyColor', () => {
  it('goes from day to sunset to dusk during focus', () => {
    expect(getSkyColor('focus', 0)).toBe(FOCUS_SKY[0].color.toLowerCase())
    expect(getSkyColor('focus', 0.5)).toBe(FOCUS_SKY[1].color.toLowerCase())
    expect(getSkyColor('focus', 1)).toBe(FOCUS_SKY[2].color.toLowerCase())
  })

  it('blends smoothly between stops', () => {
    // Halfway between day blue #85B7EB and sunset #F5C4B3.
    expect(getSkyColor('focus', 0.25)).toBe('#bdbecf')
  })

  it('starts the break at night', () => {
    expect(getSkyColor('break', 0)).toBe(BREAK_SKY[0].color.toLowerCase())
  })

  it('ends the break at the same color the next focus starts with', () => {
    expect(getSkyColor('break', 1)).toBe(getSkyColor('focus', 0))
  })
})

describe('getSunPosition', () => {
  it('starts high in the sky', () => {
    expect(getSunPosition(0)).toEqual(SUN_START)
  })

  it('reaches the horizon when focus ends', () => {
    expect(getSunPosition(1).y).toBeCloseTo(HORIZON_Y)
  })

  it('keeps going down as time passes', () => {
    const ys = [0, 0.25, 0.5, 0.75, 1].map((p) => getSunPosition(p).y)
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]).toBeGreaterThan(ys[i - 1])
    }
  })
})
