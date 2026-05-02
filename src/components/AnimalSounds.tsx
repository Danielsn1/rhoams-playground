/**
 * AnimalSounds.tsx
 *
 * Eight animal buttons that play real audio samples from public/sounds/animals/.
 * Audio src is set lazily on first click (never on mount) to avoid premature
 * error events that would disable buttons before the user interacts.
 * If a file fails to load or play (e.g. OGG on Safari), a synthesised fallback
 * sound plays instead so buttons are always functional.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../AudioContext'

interface Animal {
  id: string
  emoji: string
  name: string
  color: string
  url: string
}

const BASE = import.meta.env.BASE_URL

const ANIMALS: Animal[] = [
  { id: 'cat',     emoji: '🐱', name: 'Cat',     color: '#FF9FF3', url: `${BASE}sounds/animals/cat.wav` },
  { id: 'dog',     emoji: '🐶', name: 'Dog',     color: '#FECA57', url: `${BASE}sounds/animals/dog.wav` },
  { id: 'cow',     emoji: '🐮', name: 'Cow',     color: '#A29BFE', url: `${BASE}sounds/animals/cow.ogg` },
  { id: 'frog',    emoji: '🐸', name: 'Frog',    color: '#48DBFB', url: `${BASE}sounds/animals/frog.wav` },
  { id: 'horse',   emoji: '🐴', name: 'Horse',   color: '#FF9F43', url: `${BASE}sounds/animals/horse.mp3` },
  { id: 'sheep',   emoji: '🐑', name: 'Sheep',   color: '#DFE6E9', url: `${BASE}sounds/animals/sheep.ogg` },
  { id: 'pig',     emoji: '🐷', name: 'Pig',     color: '#FD79A8', url: `${BASE}sounds/animals/pig.mp3` },
  { id: 'rooster', emoji: '🐓', name: 'Rooster', color: '#E17055', url: `${BASE}sounds/animals/rooster.mp3` },
]

// Synthesised fallback sounds — used when a file fails to load/play
function synthAnimal(id: string, ctx: AudioContext, out: GainNode): void {
  const t = ctx.currentTime

  switch (id) {
    case 'cat': {
      // Quick rising-then-falling tone (meow)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(650, t)
      osc.frequency.linearRampToValueAtTime(900, t + 0.12)
      osc.frequency.linearRampToValueAtTime(620, t + 0.38)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.3, t + 0.04)
      g.gain.setValueAtTime(0.3, t + 0.3)
      g.gain.linearRampToValueAtTime(0, t + 0.4)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 0.4)
      break
    }
    case 'dog': {
      // Noise burst + low thump (bark)
      const bufSize = Math.ceil(ctx.sampleRate * 0.15)
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource()
      ns.buffer = buf
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1200
      bp.Q.value = 1
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.6, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      ns.connect(bp)
      bp.connect(g)
      g.connect(out)
      ns.start(t)
      const kick = ctx.createOscillator()
      const kg = ctx.createGain()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(180, t)
      kick.frequency.exponentialRampToValueAtTime(60, t + 0.15)
      kg.gain.setValueAtTime(0.8, t)
      kg.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      kick.connect(kg)
      kg.connect(out)
      kick.start(t)
      kick.stop(t + 0.15)
      break
    }
    case 'cow': {
      // Long descending tone (moo)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(280, t)
      osc.frequency.exponentialRampToValueAtTime(120, t + 1.1)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.35, t + 0.08)
      g.gain.setValueAtTime(0.35, t + 1.0)
      g.gain.linearRampToValueAtTime(0, t + 1.2)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 1.2)
      break
    }
    case 'frog': {
      // Three quick pulses (ribbit)
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        const s = t + i * 0.18
        osc.type = 'square'
        osc.frequency.value = 900
        g.gain.setValueAtTime(0, s)
        g.gain.linearRampToValueAtTime(0.25, s + 0.02)
        g.gain.linearRampToValueAtTime(0, s + 0.08)
        osc.connect(g)
        g.connect(out)
        osc.start(s)
        osc.stop(s + 0.1)
      }
      break
    }
    case 'horse': {
      // Rapid pitch sweep (whinny)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, t)
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.25)
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.5)
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.75)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.35, t + 0.06)
      g.gain.setValueAtTime(0.35, t + 0.7)
      g.gain.linearRampToValueAtTime(0, t + 0.8)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 0.8)
      break
    }
    case 'sheep': {
      // Wavering low tone (baa)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, t)
      osc.frequency.linearRampToValueAtTime(400, t + 0.1)
      osc.frequency.linearRampToValueAtTime(450, t + 0.2)
      osc.frequency.linearRampToValueAtTime(410, t + 0.35)
      osc.frequency.linearRampToValueAtTime(440, t + 0.5)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.35, t + 0.06)
      g.gain.setValueAtTime(0.35, t + 0.5)
      g.gain.linearRampToValueAtTime(0, t + 0.6)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 0.6)
      break
    }
    case 'pig': {
      // Short rising squeal (oink)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(500, t)
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.2)
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.3)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.3, t + 0.04)
      g.gain.setValueAtTime(0.3, t + 0.26)
      g.gain.linearRampToValueAtTime(0, t + 0.35)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 0.35)
      break
    }
    case 'rooster': {
      // Three rising phrases (cock-a-doodle-doo)
      const notes = [
        { freq: 600, dur: 0.25, s: 0 },
        { freq: 800, dur: 0.18, s: 0.3 },
        { freq: 1100, dur: 0.35, s: 0.55 },
      ]
      notes.forEach(({ freq, dur, s }) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        const st = t + s
        osc.type = 'sawtooth'
        osc.frequency.value = freq
        g.gain.setValueAtTime(0, st)
        g.gain.linearRampToValueAtTime(0.35, st + 0.04)
        g.gain.setValueAtTime(0.35, st + dur - 0.06)
        g.gain.linearRampToValueAtTime(0, st + dur)
        osc.connect(g)
        g.connect(out)
        osc.start(st)
        osc.stop(st + dur)
      })
      break
    }
  }
}

export default function AnimalSounds() {
  const { volume, getCtx, getMasterGain } = useAudio()
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const [active, setActive] = useState<string | null>(null)
  const [speech, setSpeech] = useState<string | null>(null)

  // Create audio elements WITHOUT src — src is set lazily on first click.
  // This prevents the browser from firing error events on mount, which was
  // the cause of all buttons appearing disabled before the user interacted.
  useEffect(() => {
    ANIMALS.forEach((animal) => {
      const el = new Audio()
      el.preload = 'none'
      el.volume = volume
      audioRefs.current[animal.id] = el
    })
    return () => {
      Object.values(audioRefs.current).forEach((el) => el.pause())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep audio element volumes in sync with the master volume slider
  useEffect(() => {
    Object.values(audioRefs.current).forEach((el) => { el.volume = volume })
  }, [volume])

  const handleAnimal = useCallback((animal: Animal): void => {
    const el = audioRefs.current[animal.id]
    if (!el) return

    // Set src on first use (lazy loading avoids premature error events)
    if (!el.getAttribute('src')) el.src = animal.url

    el.currentTime = 0
    void el.play().catch(() => {
      // File unavailable or format unsupported (e.g. OGG on Safari) —
      // play the synthesised fallback so the button always does something.
      try { synthAnimal(animal.id, getCtx(), getMasterGain()) } catch { /* ignore */ }
    })

    setActive(animal.id)
    setSpeech(`${animal.emoji} ${animal.name}!`)
    setTimeout(() => setActive(null), 600)
    setTimeout(() => setSpeech(null), 2000)
  }, [getCtx, getMasterGain])

  return (
    <div className="activity-card animal-card">
      <h2 className="activity-title">🐾 Animal Sounds</h2>
      {speech && <div className="animal-speech">{speech}</div>}
      <div className="animal-grid">
        {ANIMALS.map((animal) => (
          <button
            key={animal.id}
            className={`animal-btn${active === animal.id ? ' animal-btn--active' : ''}`}
            style={{ background: animal.color }}
            onClick={() => handleAnimal(animal)}
            onTouchStart={() => handleAnimal(animal)}
            aria-label={`${animal.name} sound`}
          >
            <span className="animal-emoji">{animal.emoji}</span>
            <span className="animal-name">{animal.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
