import { useState, useCallback, useRef, useEffect } from 'react'
import { useAudio } from '../AudioContext'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  size: number
  delay: number
  shape: 'circle' | 'square'
}

const CONFETTI_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3',
]

let confettiId = 0

function randomConfetti(): ConfettiPiece {
  return {
    id: confettiId++,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 6,
    delay: Math.random() * 0.5,
    shape: Math.random() > 0.5 ? 'circle' : 'square',
  }
}

export default function Celebration() {
  const { getCtx, getMasterGain } = useAudio()
  const [celebrating, setCelebrating] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const celebrationSound = useCallback((): void => {
    try {
      const ctx = getCtx()
      const notes = [523, 659, 784, 1047, 1319]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(getMasterGain())
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4)
        osc.start(ctx.currentTime + i * 0.12)
        osc.stop(ctx.currentTime + i * 0.12 + 0.4)
      })
    } catch { /* ignore */ }
  }, [getCtx, getMasterGain])

  const celebrate = useCallback((): void => {
    if (celebrating) return
    celebrationSound()
    setCelebrating(true)
    setConfetti(Array.from({ length: 40 }, randomConfetti))
    timerRef.current = setTimeout(() => {
      setCelebrating(false)
      setConfetti([])
    }, 3000)
  }, [celebrating, celebrationSound])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <div className="activity-card celebration-card">
      <h2 className="activity-title">🎉 Celebration!</h2>
      <div className="celebration-area">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.x}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.shape === 'circle' ? '50%' : '2px',
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
        <button
          className={`celebrate-btn ${celebrating ? 'celebrate-btn--active' : ''}`}
          onClick={celebrate}
          aria-label="Celebrate!"
        >
          {celebrating ? '🎊 Yay!' : '🎉 Party!'}
        </button>
      </div>
    </div>
  )
}
