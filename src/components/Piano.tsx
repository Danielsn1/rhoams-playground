import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

interface PianoKey {
  note: string
  freq: number
  color: string
  label: string
}

const KEYS: PianoKey[] = [
  { note: 'C4', freq: 261.63, color: '#FF6B6B', label: 'Do' },
  { note: 'D4', freq: 293.66, color: '#FF9F43', label: 'Re' },
  { note: 'E4', freq: 329.63, color: '#FECA57', label: 'Mi' },
  { note: 'F4', freq: 349.23, color: '#48DBFB', label: 'Fa' },
  { note: 'G4', freq: 392.00, color: '#FF9FF3', label: 'Sol' },
  { note: 'A4', freq: 440.00, color: '#54A0FF', label: 'La' },
  { note: 'B4', freq: 493.88, color: '#5F27CD', label: 'Si' },
  { note: 'C5', freq: 523.25, color: '#FF6B6B', label: 'Do' },
]

export default function Piano() {
  const { getCtx, getMasterGain } = useAudio()
  const [active, setActive] = useState<string | null>(null)

  const playNote = useCallback((freq: number): void => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(getMasterGain())
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.6, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 1.2)
    } catch {
      // Audio not supported
    }
  }, [getCtx, getMasterGain])

  const handlePress = useCallback((key: PianoKey): void => {
    playNote(key.freq)
    setActive(key.note)
    setTimeout(() => setActive(null), 300)
  }, [playNote])

  return (
    <div className="activity-card piano-card">
      <h2 className="activity-title">🎹 Piano</h2>
      <div className="piano-keys">
        {KEYS.map((key) => (
          <button
            key={key.note}
            className={`piano-key ${active === key.note ? 'piano-key--active' : ''}`}
            style={{ background: key.color }}
            onClick={() => handlePress(key)}
            onTouchStart={() => handlePress(key)}
            aria-label={`Play note ${key.label}`}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  )
}
