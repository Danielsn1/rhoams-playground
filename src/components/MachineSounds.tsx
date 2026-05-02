/**
 * MachineSounds.tsx
 *
 * Eight machine-sound buttons synthesised with the Web Audio API — no files
 * to load, no network errors, and every sound is precisely what the label says.
 * Follows the same synthesis pattern as DrumMachine.tsx.
 */

import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

interface Machine {
  id: string
  emoji: string
  name: string
  color: string
}

const MACHINES: Machine[] = [
  { id: 'train',      emoji: '🚂', name: 'Train',      color: '#E17055' },
  { id: 'truck',      emoji: '🚛', name: 'Truck',      color: '#FECA57' },
  { id: 'fire-truck', emoji: '🚒', name: 'Fire Truck', color: '#FF6B6B' },
  { id: 'airplane',   emoji: '✈️', name: 'Airplane',   color: '#54A0FF' },
  { id: 'helicopter', emoji: '🚁', name: 'Helicopter', color: '#48DBFB' },
  { id: 'excavator',  emoji: '🏗️', name: 'Digger',     color: '#FF9F43' },
  { id: 'boat',       emoji: '⛴️', name: 'Boat',       color: '#A29BFE' },
  { id: 'motorcycle', emoji: '🏍️', name: 'Motorbike',  color: '#00D2D3' },
]

export default function MachineSounds() {
  const { getCtx, getMasterGain } = useAudio()
  const [active, setActive] = useState<string | null>(null)
  const [label, setLabel] = useState<string | null>(null)

  const playMachine = useCallback((id: string): void => {
    const ctx = getCtx()
    const out = getMasterGain()
    const t = ctx.currentTime

    switch (id) {
      case 'train': {
        // Steam whistle: two-tone chord (C6 + G5)
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
        // Air horn: two-tone (A2 + D3)
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
        // Wailing siren: square wave sweeping 500–1100 Hz
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(500, t)
        osc.frequency.linearRampToValueAtTime(1100, t + 0.5)
        osc.frequency.linearRampToValueAtTime(500, t + 1.0)
        osc.frequency.linearRampToValueAtTime(1100, t + 1.5)
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.22, t + 0.08)
        g.gain.setValueAtTime(0.22, t + 1.4)
        g.gain.linearRampToValueAtTime(0, t + 1.5)
        osc.connect(g)
        g.connect(out)
        osc.start(t)
        osc.stop(t + 1.5)
        break
      }

      case 'airplane': {
        // Jet engine: high-pass filtered noise + rising turbine whine
        const dur = 1.5
        const sr = ctx.sampleRate
        const buf = ctx.createBuffer(1, Math.ceil(sr * dur), sr)
        const data = buf.getChannelData(0)
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
        const ns = ctx.createBufferSource()
        ns.buffer = buf
        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 3000
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.35, t + 0.4)
        g.gain.setValueAtTime(0.35, t + 1.2)
        g.gain.linearRampToValueAtTime(0, t + dur)
        ns.connect(hp)
        hp.connect(g)
        g.connect(out)
        ns.start(t)
        // Turbine whine
        const whine = ctx.createOscillator()
        whine.type = 'sawtooth'
        whine.frequency.setValueAtTime(1800, t)
        whine.frequency.linearRampToValueAtTime(2600, t + dur)
        const wg = ctx.createGain()
        wg.gain.setValueAtTime(0, t)
        wg.gain.linearRampToValueAtTime(0.15, t + 0.4)
        wg.gain.setValueAtTime(0.15, t + 1.2)
        wg.gain.linearRampToValueAtTime(0, t + dur)
        whine.connect(wg)
        wg.connect(out)
        whine.start(t)
        whine.stop(t + dur)
        break
      }

      case 'helicopter': {
        // Rotor chop: white noise amplitude-modulated at 5 Hz
        const dur = 1.5
        const sr = ctx.sampleRate
        const chopRate = 5
        const buf = ctx.createBuffer(1, Math.ceil(sr * dur), sr)
        const data = buf.getChannelData(0)
        for (let i = 0; i < data.length; i++) {
          const chop = Math.abs(Math.sin(2 * Math.PI * chopRate * i / sr))
          data[i] = (Math.random() * 2 - 1) * chop
        }
        const ns = ctx.createBufferSource()
        ns.buffer = buf
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.5, t + 0.25)
        g.gain.setValueAtTime(0.5, t + 1.25)
        g.gain.linearRampToValueAtTime(0, t + dur)
        ns.connect(g)
        g.connect(out)
        ns.start(t)
        break
      }

      case 'excavator': {
        // Diesel engine: low sawtooth with irregular pitch variation
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sawtooth'
        ;[82, 95, 78, 90, 83, 92, 80, 88].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, t + i * 0.19)
        })
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.45, t + 0.08)
        g.gain.setValueAtTime(0.45, t + 1.3)
        g.gain.linearRampToValueAtTime(0, t + 1.5)
        osc.connect(g)
        g.connect(out)
        osc.start(t)
        osc.stop(t + 1.5)
        break
      }

      case 'boat': {
        // Foghorn: two low sines (A2 + E2 — perfect fifth)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.45, t + 0.2)
        g.gain.setValueAtTime(0.45, t + 1.1)
        g.gain.linearRampToValueAtTime(0, t + 1.4)
        ;[110, 82].forEach((freq) => {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = freq
          osc.connect(g)
          osc.start(t)
          osc.stop(t + 1.4)
        })
        g.connect(out)
        break
      }

      case 'motorcycle': {
        // Engine rev: sawtooth sweeping up then settling
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(130, t)
        osc.frequency.exponentialRampToValueAtTime(380, t + 0.35)
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.85)
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.4, t + 0.04)
        g.gain.setValueAtTime(0.4, t + 0.8)
        g.gain.linearRampToValueAtTime(0, t + 1.0)
        osc.connect(g)
        g.connect(out)
        osc.start(t)
        osc.stop(t + 1.0)
        break
      }
    }
  }, [getCtx, getMasterGain])

  const handleMachine = useCallback((machine: Machine): void => {
    try { playMachine(machine.id) } catch { /* ignore */ }
    setActive(machine.id)
    setLabel(`${machine.emoji} ${machine.name}!`)
    setTimeout(() => setActive(null), 700)
    setTimeout(() => setLabel(null), 2200)
  }, [playMachine])

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
