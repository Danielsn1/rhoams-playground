import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

interface Switch {
  id: string
  off: string
  on: string
  label: string
  onColor: string
  offColor: string
}

const SWITCHES: Switch[] = [
  { id: 'sun',    off: '🌑', on: '☀️', label: 'Sun',    onColor: '#FECA57', offColor: '#636e72' },
  { id: 'light',  off: '💡', on: '💡', label: 'Light',  onColor: '#FECA57', offColor: '#b2bec3' },
  { id: 'star',   off: '✨', on: '⭐', label: 'Stars',  onColor: '#f9ca24', offColor: '#636e72' },
  { id: 'flower', off: '🌱', on: '🌸', label: 'Flower', onColor: '#FD79A8', offColor: '#55EFC4' },
]

export default function LightSwitches() {
  const { getCtx, getMasterGain } = useAudio()
  const [states, setStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SWITCHES.map((s) => [s.id, false]))
  )

  const toggleSound = useCallback((on: boolean): void => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(getMasterGain())
      osc.type = 'square'
      osc.frequency.value = on ? 880 : 440
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    } catch { /* ignore */ }
  }, [getCtx, getMasterGain])

  const toggle = useCallback((id: string): void => {
    setStates((prev) => {
      const next = !prev[id]
      toggleSound(next)
      return { ...prev, [id]: next }
    })
  }, [toggleSound])

  return (
    <div className="activity-card switch-card">
      <h2 className="activity-title">💡 Light Switches</h2>
      <div className="switch-grid">
        {SWITCHES.map((sw) => {
          const isOn = states[sw.id]
          return (
            <div key={sw.id} className="switch-item">
              <div
                className={`switch-emoji-display ${isOn ? 'switch-display--on' : ''}`}
                style={{ background: isOn ? sw.onColor + '44' : sw.offColor + '22' }}
              >
                {isOn ? sw.on : sw.off}
              </div>
              <button
                className={`toggle-switch ${isOn ? 'toggle-switch--on' : ''}`}
                onClick={() => toggle(sw.id)}
                onTouchStart={() => toggle(sw.id)}
                aria-label={`Toggle ${sw.label}`}
                style={isOn ? { background: sw.onColor } : {}}
              >
                <span className="toggle-knob" />
              </button>
              <span className="switch-label">{sw.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
