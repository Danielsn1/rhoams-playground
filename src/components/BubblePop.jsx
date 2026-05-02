import { useState, useCallback, useEffect, useRef } from 'react'
import { getAudioContext } from '../audio'

const COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3',
  '#A29BFE', '#FD79A8', '#6AB04C', '#E17055',
]

function createBubble(id) {
  return {
    id,
    x: Math.random() * 90 + 5,
    y: Math.random() * 80 + 5,
    size: Math.random() * 40 + 40,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    popped: false,
  }
}

function popSound() {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  } catch { /* ignore */ }
}

let nextId = 0

export default function BubblePop() {
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: 10 }, () => createBubble(nextId++))
  )
  const timerRef = useRef(null)

  const popBubble = useCallback((id) => {
    popSound()
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    )
    // Remove popped bubble and maybe add a new one after animation
    setTimeout(() => {
      setBubbles((prev) => {
        const filtered = prev.filter((b) => b.id !== id)
        return [...filtered, createBubble(nextId++)]
      })
    }, 400)
  }, [])

  // Keep refilling to at least 10 bubbles
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length < 10) {
          return [...prev, createBubble(nextId++)]
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="activity-card bubble-card">
      <h2 className="activity-title">🫧 Pop the Bubbles!</h2>
      <div className="bubble-arena">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            className={`bubble ${bubble.popped ? 'bubble--pop' : 'bubble--float'}`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle at 35% 35%, white 5%, ${bubble.color}99 30%, ${bubble.color} 70%)`,
              border: `3px solid ${bubble.color}`,
            }}
            onClick={() => !bubble.popped && popBubble(bubble.id)}
            onTouchStart={() => !bubble.popped && popBubble(bubble.id)}
            aria-label="Pop bubble"
          />
        ))}
      </div>
    </div>
  )
}
