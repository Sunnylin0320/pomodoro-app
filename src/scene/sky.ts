// Pure functions that decide what the panda scene looks like.
//
// The scene is driven only by the timer's mode and progress (0 to 1). Nothing
// here draws anything: these functions answer "what should be on screen right
// now?", and the SVG components draw the answer.

import type { Mode } from '../timer/timer'

export type PandaPose = 'standing' | 'sitting' | 'lying' | 'eating' | 'sleeping'

export type Rgb = { r: number; g: number; b: number }

export type ColorStop = { at: number; color: string }

export type Point = { x: number; y: number }

// Scene coordinates: the SVG viewBox is 100 wide and 100 tall.
export const HORIZON_Y = 80
export const SUN_START: Point = { x: 25, y: 18 }
export const SUN_END: Point = { x: 78, y: HORIZON_Y }

/** Sky colors during focus: day blue, then sunset, then dusk. */
export const FOCUS_SKY: ColorStop[] = [
  { at: 0, color: '#85B7EB' },
  { at: 0.5, color: '#F5C4B3' },
  { at: 1, color: '#534AB7' },
]

/** Sky colors during a break: deep night that brightens back to day blue. */
export const BREAK_SKY: ColorStop[] = [
  { at: 0, color: '#26215C' },
  { at: 0.7, color: '#3C3489' },
  { at: 1, color: '#85B7EB' },
]

/** During a break, the panda eats its cheeseburger until this point, then sleeps. */
export const EATING_UNTIL = 0.5

/**
 * The panda's story: it holds on through focus (standing, sitting, then lying
 * down), earns the cheeseburger at the break, eats it, and falls asleep full.
 */
export function getPandaPose(mode: Mode, progress: number): PandaPose {
  if (mode === 'break') return progress < EATING_UNTIL ? 'eating' : 'sleeping'
  if (progress < 1 / 3) return 'standing'
  if (progress < 2 / 3) return 'sitting'
  return 'lying'
}

export function getSkyColor(mode: Mode, progress: number): string {
  return colorAt(mode === 'focus' ? FOCUS_SKY : BREAK_SKY, progress)
}

/**
 * Where the sun is during focus. It moves right and sinks along a curve:
 * slowly at first, then faster, and touches the horizon when progress is 1.
 */
export function getSunPosition(progress: number): Point {
  const t = clamp01(progress)
  const sink = 1 - Math.cos((t * Math.PI) / 2)
  return {
    x: lerp(SUN_START.x, SUN_END.x, t),
    y: lerp(SUN_START.y, SUN_END.y, sink),
  }
}

/** Linear interpolation: the value `t` of the way from `a` to `b`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** The color at position `t` along a list of color stops sorted by `at`. */
export function colorAt(stops: ColorStop[], t: number): string {
  const p = clamp01(t)

  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1]
    const to = stops[i]
    if (p <= to.at) {
      const local = (p - from.at) / (to.at - from.at)
      return mixColors(from.color, to.color, local)
    }
  }

  return stops[stops.length - 1].color.toLowerCase()
}

export function hexToRgb(hex: string): Rgb {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`
}

function mixColors(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return rgbToHex({
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  })
}

function toHexByte(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0')
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}
