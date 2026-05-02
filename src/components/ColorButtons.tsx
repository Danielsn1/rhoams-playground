import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

interface ColorItem {
  id: string
  label: string
  hex: string
}

const COLORS: ColorItem[] = [
  { id: 'red',    label: '🔴 Red',    hex: '#FF6B6B' },
  { id: 'orange', label: '🟠 Orange', hex: '#FF9F43' },
  { id: 'yellow', label: '🟡 Yellow', hex: '#FECA57' },
  { id: 'green',  label: '🟢 Green',  hex: '#55EFC4' },
  { id: 'blue',   label: '🔵 Blue',   hex: '#54A0FF' },
  { id: 'purple', label: '🟣 Purple', hex: '#A29BFE' },
  { id: 'pink',   label: '🩷 Pink',   hex: '#FD79A8' },
  { id: 'cyan',   label: '🩵 Cyan',   hex: '#48DBFB' },
]

export default function ColorButtons() {
  const { getCtx, getMasterGain } = useAudio()
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState('#F9F9F9')

  const clickSound = useCallback((freq: number): void => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(getMasterGain())
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch { /* ignore */ }
  }, [getCtx, getMasterGain])

  const handleColor = useCallback((color: ColorItem, idx: number): void => {
    clickSound(220 + idx * 40)
    setActiveColor(color.id)
    setBgColor(color.hex)
    setTimeout(() => setActiveColor(null), 400)
  }, [clickSound])

  return (
    <div className="activity-card color-card" style={{ background: bgColor + '33' }}>
      <h2 className="activity-title">🎨 Colors!</h2>
      <div className="color-btn-grid">
        {COLORS.map((color, idx) => (
          <button
            key={color.id}
            className={`color-btn ${activeColor === color.id ? 'color-btn--active' : ''}`}
            style={{
              background: color.hex,
              boxShadow: activeColor === color.id ? `0 0 30px ${color.hex}` : undefined,
            }}
            onClick={() => handleColor(color, idx)}
            onTouchStart={() => handleColor(color, idx)}
            aria-label={`${color.label} button`}
          >
            {color.label}
          </button>
        ))}
      </div>
      <div
        className="color-display"
        style={{ background: bgColor, transition: 'background 0.5s ease' }}
        aria-label="Current colour display"
      />
    </div>
  )
}
