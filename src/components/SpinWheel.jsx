import { useState, useCallback } from 'react'
import { getAudioContext } from '../audio'

const SEGMENTS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#54A0FF',
  '#FF9FF3', '#48DBFB', '#5F27CD', '#00D2D3',
]

function spinSound() {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.6)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch { /* ignore */ }
}

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const spin = useCallback(() => {
    if (spinning) return
    spinSound()
    const extraSpin = 720 + Math.random() * 720
    setRotation((prev) => prev + extraSpin)
    setSpinning(true)
    setTimeout(() => setSpinning(false), 2000)
  }, [spinning])

  const segmentAngle = 360 / SEGMENTS.length
  const r = 110
  const cx = 120
  const cy = 120

  function polarToCartesian(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function segmentPath(startAngle, endAngle) {
    const s = polarToCartesian(startAngle, r)
    const e = polarToCartesian(endAngle, r)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
  }

  return (
    <div className="activity-card wheel-card">
      <h2 className="activity-title">🎡 Spin the Wheel!</h2>
      <div className="wheel-container">
        <svg
          className="spin-wheel"
          viewBox="0 0 240 240"
          width="240"
          height="240"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 2s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none',
            cursor: spinning ? 'default' : 'pointer',
          }}
          onClick={spin}
          onTouchStart={spin}
          aria-label="Spin wheel"
          role="button"
        >
          {SEGMENTS.map((color, i) => (
            <path
              key={i}
              d={segmentPath(i * segmentAngle, (i + 1) * segmentAngle)}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          <circle cx={cx} cy={cy} r="18" fill="white" stroke="#ccc" strokeWidth="2" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16">🎯</text>
        </svg>
        <div className="wheel-pointer">▼</div>
      </div>
      <button
        className={`spin-btn ${spinning ? 'spin-btn--spinning' : ''}`}
        onClick={spin}
        disabled={spinning}
        aria-label="Spin the wheel"
      >
        {spinning ? '🌀 Spinning!' : '🎡 Spin!'}
      </button>
    </div>
  )
}
