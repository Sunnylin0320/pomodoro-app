import { describe, expect, it } from 'vitest'
import { formatTime } from './format'

describe('formatTime', () => {
  it('formats whole minutes', () => {
    expect(formatTime(25 * 60_000)).toBe('25:00')
  })

  it('pads minutes and seconds with a leading zero', () => {
    expect(formatTime(65_000)).toBe('01:05')
  })

  it('rounds up partial seconds', () => {
    // 24:59.4 left should still read 25:00, not 24:59.
    expect(formatTime(25 * 60_000 - 600)).toBe('25:00')
    expect(formatTime(1)).toBe('00:01')
  })

  it('shows 00:00 at zero and never goes negative', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(-5_000)).toBe('00:00')
  })
})
