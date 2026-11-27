// A soft two-note chime, synthesized with the Web Audio API, so the app needs
// no sound files.
//
// Browsers block sound until the user has interacted with the page. Call
// `unlockAudio()` from a click handler (the Start button) before the chime is
// needed; `playChime()` stays silent until then.

import type { Mode } from '../timer/timer'

// Tweak the sound here.
const VOLUME = 0.25
const NOTE_LENGTH_S = 1.2
const NOTE_GAP_S = 0.35

/**
 * Notes in hertz, played one after the other.
 * After focus the chime goes down (time to relax); after a break it goes up (time to focus).
 */
const NOTES: Record<Mode, number[]> = {
  focus: [880, 659.25],
  break: [659.25, 880],
}

let audioContext: AudioContext | null = null

/** Create or resume the audio context. Must run inside a user action, like a click. */
export function unlockAudio(): void {
  audioContext ??= new AudioContext()
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
}

/** Play the chime for the mode that just finished. */
export function playChime(finishedMode: Mode): void {
  if (!audioContext) return

  const startAt = audioContext.currentTime
  NOTES[finishedMode].forEach((frequency, index) => {
    playNote(audioContext!, frequency, startAt + index * NOTE_GAP_S)
  })
}

function playNote(context: AudioContext, frequency: number, at: number): void {
  const oscillator = context.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency

  // Volume envelope: a quick rise, then a slow fade, like a small bell.
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(VOLUME, at + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + NOTE_LENGTH_S)

  oscillator.connect(gain).connect(context.destination)
  oscillator.start(at)
  oscillator.stop(at + NOTE_LENGTH_S)
}
