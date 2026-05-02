import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

interface Shape {
  id: string
  emoji: string
  color: string
  name: string
}

interface Particle {
  id: number
  shape: string
  angle: number
}

const SHAPES: Shape[] = [
  { id: 'circle',   emoji: '⭕', color: '#FF6B6B', name: 'Circle' },
  { id: 'star',     emoji: '⭐', color: '#FECA57', name: 'Star' },
  { id: 'heart',    emoji: '❤️', color: '#FF6B6B', name: 'Heart' },
  { id: 'diamond',  emoji: '💎', color: '#48DBFB', name: 'Diamond' },
  { id: 'triangle', emoji: '🔺', color: '#FF9F43', name: 'Triangle' },
  { id: 'square',   emoji: '🟦', color: '#54A0FF', name: 'Square' },
]

export default function ShapeButtons() {
  const { getCtx, getMasterGain } = useAudio()
  const [active, setActive] = useState<string | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  const shimmerSound = useCallback((): void => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      ;[523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(getMasterGain())
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.2, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.3)
      })
    } catch { /* ignore */ }
  }, [getCtx, getMasterGain])

  const handleShape = useCallback((shape: Shape): void => {
    shimmerSound()
    setActive(shape.id)
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      shape: shape.id,
      angle: (i / 8) * 360,
    }))
    setParticles(newParticles)
    setTimeout(() => setActive(null), 500)
    setTimeout(() => setParticles([]), 700)
  }, [shimmerSound])

  return (
    <div className="activity-card shape-card">
      <h2 className="activity-title">✨ Magic Shapes</h2>
      <div className="shape-grid">
        {SHAPES.map((shape) => (
          <div key={shape.id} className="shape-wrapper">
            <button
              className={`shape-btn ${active === shape.id ? 'shape-btn--active' : ''}`}
              style={{ background: shape.color }}
              onClick={() => handleShape(shape)}
              onTouchStart={() => handleShape(shape)}
              aria-label={`${shape.name} button`}
            >
              <span className="shape-emoji">{shape.emoji}</span>
              {active === shape.id &&
                particles
                  .filter((p) => p.shape === shape.id)
                  .map((p) => (
                    <span
                      key={p.id}
                      className="sparkle"
                      style={{ '--angle': `${p.angle}deg` } as React.CSSProperties}
                    >
                      ✨
                    </span>
                  ))}
            </button>
            <span className="shape-label">{shape.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
