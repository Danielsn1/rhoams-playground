/**
 * MachineSounds.tsx
 *
 * Eight machine-sound buttons that play real audio samples from
 * public/sounds/machines/. Follows the same lazy-load pattern as
 * AnimalSounds.tsx: src is set on first click, never on mount.
 * A synthesised fallback plays if the file fails to load/play.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../AudioContext'

interface Machine {
  id: string
  emoji: string
  name: string
  color: string
  url: string
}

const BASE = import.meta.env.BASE_URL

const MACHINES: Machine[] = [
  { id: 'train',      emoji: '🚂', name: 'Train',      color: '#E17055', url: `${BASE}sounds/machines/train.mp3` },
  { id: 'truck',      emoji: '🚛', name: 'Truck',      color: '#FECA57', url: `${BASE}sounds/machines/truck.mp3` },
  { id: 'fire-truck', emoji: '🚒', name: 'Fire Truck', color: '#FF6B6B', url: `${BASE}sounds/machines/firetruck.mp3` },
  { id: 'airplane',   emoji: '✈️', name: 'Airplane',   color: '#54A0FF', url: `${BASE}sounds/machines/airplane.mp3` },
  { id: 'helicopter', emoji: '🚁', name: 'Helicopter', color: '#48DBFB', url: `${BASE}sounds/machines/helicopter.mp3` },
  { id: 'excavator',  emoji: '🏗️', name: 'Digger',     color: '#FF9F43', url: `${BASE}sounds/machines/excavator.mp3` },
  { id: 'boat',       emoji: '⛴️', name: 'Boat',       color: '#A29BFE', url: `${BASE}sounds/machines/boat.mp3` },
  { id: 'motorcycle', emoji: '🏍️', name: 'Motorbike',  color: '#00D2D3', url: `${BASE}sounds/machines/motorcycle.mp3` },
]

// Synthesised fallbacks — used only when the sample file fails to load/play
function synthMachine(id: string, ctx: AudioContext, out: GainNode): void {
  const t = ctx.currentTime
  switch (id) {
    case 'train': {
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.35, t + 0.05)
      g.gain.setValueAtTime(0.35, t + 0.75)
      g.gain.linearRampToValueAtTime(0, t + 0.95)
      ;[1047, 784].forEach((freq) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        osc.connect(g)
        osc.start(t)
        osc.stop(t + 0.95)
      })
      g.connect(out)
      break
    }
    case 'truck': {
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.4, t + 0.03)
      g.gain.setValueAtTime(0.4, t + 0.5)
      g.gain.linearRampToValueAtTime(0, t + 0.65)
      ;[110, 147].forEach((freq) => {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = freq
        osc.connect(g)
        osc.start(t)
        osc.stop(t + 0.65)
      })
      g.connect(out)
      break
    }
    case 'fire-truck': {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(500, t)
      osc.frequency.linearRampToValueAtTime(1100, t + 0.5)
      osc.frequency.linearRampToValueAtTime(500, t + 1.0)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.22, t + 0.08)
      g.gain.setValueAtTime(0.22, t + 0.9)
      g.gain.linearRampToValueAtTime(0, t + 1.0)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 1.0)
      break
    }
    default: {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 120
      g.gain.setValueAtTime(0.3, t)
      g.gain.linearRampToValueAtTime(0, t + 0.5)
      osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + 0.5)
    }
  }
}

export default function MachineSounds() {
  const { volume, getCtx, getMasterGain } = useAudio()
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const [active, setActive] = useState<string | null>(null)
  const [label, setLabel] = useState<string | null>(null)

  // Create audio elements WITHOUT src — src is set lazily on first click.
  useEffect(() => {
    MACHINES.forEach((machine) => {
      const el = new Audio()
      el.preload = 'none'
      el.volume = volume
      audioRefs.current[machine.id] = el
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

  const handleMachine = useCallback((machine: Machine): void => {
    const el = audioRefs.current[machine.id]
    if (!el) return

    // Set src on first use (lazy loading avoids premature error events)
    if (!el.getAttribute('src')) el.src = machine.url

    el.currentTime = 0
    void el.play().catch(() => {
      try { synthMachine(machine.id, getCtx(), getMasterGain()) } catch { /* ignore */ }
    })

    setActive(machine.id)
    setLabel(`${machine.emoji} ${machine.name}!`)
    setTimeout(() => setActive(null), 700)
    setTimeout(() => setLabel(null), 2200)
  }, [getCtx, getMasterGain])

  return (
    <div className="activity-card machine-card">
      <h2 className="activity-title">🏗️ Big Machines!</h2>
      {label && <div className="animal-speech">{label}</div>}
      <div className="animal-grid">
        {MACHINES.map((machine) => (
          <button
            key={machine.id}
            className={`animal-btn${active === machine.id ? ' animal-btn--active' : ''}`}
            style={{ background: machine.color }}
            onClick={() => handleMachine(machine)}
            onTouchStart={() => handleMachine(machine)}
            aria-label={`${machine.name} sound`}
          >
            <span className="animal-emoji">{machine.emoji}</span>
            <span className="animal-name">{machine.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

