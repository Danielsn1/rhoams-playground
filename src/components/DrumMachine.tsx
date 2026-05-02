import { useState, useCallback } from 'react'
import { useAudio } from '../AudioContext'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconKick = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <circle cx="22" cy="22" r="18" fill="rgba(255,255,255,0.88)" />
    <circle cx="22" cy="22" r="12" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
    <circle cx="22" cy="22" r="5" fill="rgba(0,0,0,0.18)" />
    <line x1="11" y1="37" x2="7"  y2="43" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="33" y1="37" x2="37" y2="43" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const IconSnare = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <rect x="6" y="16" width="32" height="12" rx="2" fill="rgba(255,255,255,0.75)" />
    <ellipse cx="22" cy="16" rx="16" ry="5" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="22" cy="28" rx="16" ry="5" fill="rgba(255,255,255,0.65)" />
    <line x1="10" y1="28" x2="34" y2="28" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <line x1="10" y1="30" x2="34" y2="30" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <line x1="10" y1="32" x2="34" y2="32" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
  </svg>
)

const IconHiHat = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="22" cy="20" rx="14" ry="3.5" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="22" cy="25" rx="14" ry="3.5" fill="rgba(255,255,255,0.7)" />
    <circle cx="22" cy="11" r="3" fill="rgba(255,255,255,0.8)" />
  </svg>
)

const IconOpenHat = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="22" cy="15" rx="14" ry="3.5" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="22" cy="30" rx="14" ry="3.5" fill="rgba(255,255,255,0.7)" />
    <line x1="22" y1="19" x2="22" y2="26" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
)

const IconClap = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <path d="M8 26 C6 22 8 14 13 13 C15 12 17 14 17 17 L17 26 C17 29 15 31 12 31 L10 31 C8 31 7 29 8 26Z"
          fill="rgba(255,255,255,0.88)" />
    <line x1="13" y1="13" x2="11" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="14" x2="15" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="17" y1="17" x2="18" y2="10" stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <path d="M36 26 C38 22 36 14 31 13 C29 12 27 14 27 17 L27 26 C27 29 29 31 32 31 L34 31 C36 31 37 29 36 26Z"
          fill="rgba(255,255,255,0.88)" />
    <line x1="31" y1="13" x2="33" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="28" y1="14" x2="29" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="27" y1="17" x2="26" y2="10" stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="15" x2="22" y2="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="14" x2="17" y2="9"  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="25" y1="14" x2="27" y2="9"  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconTom = ({ variant }: { variant: 'high' | 'low' }) => {
  const high = variant === 'high'
  return (
    <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
      <rect x={high ? 9 : 5} y={high ? 14 : 17} width={high ? 26 : 34} height={high ? 16 : 11} rx="2" fill="rgba(255,255,255,0.75)" />
      <ellipse cx="22" cy={high ? 14 : 17} rx={high ? 13 : 17} ry={high ? 4.5 : 4} fill="rgba(255,255,255,0.9)" />
      <ellipse cx="22" cy={high ? 30 : 28} rx={high ? 13 : 17} ry={high ? 4.5 : 4} fill="rgba(255,255,255,0.6)" />
      <ellipse cx="22" cy={high ? 14 : 17} rx={high ? 13 : 17} ry={high ? 4.5 : 4} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      {high && <line x1="22" y1="5" x2="22" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  )
}

const IconCymbal = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="22" cy="20" rx="17" ry="5" fill="rgba(255,255,255,0.85)" transform="rotate(-12 22 20)" />
    <ellipse cx="22" cy="20" rx="4" ry="3" fill="rgba(255,255,255,0.95)" transform="rotate(-12 22 20)" />
    <circle cx="22" cy="9" r="2.5" fill="rgba(255,255,255,0.85)" />
  </svg>
)

// ─── Synthesis helpers ────────────────────────────────────────────────────────

type PlayFn = () => void

function usePercussion() {
  const { getCtx, getMasterGain } = useAudio()

  const playNoise = useCallback((duration: number, filterFreq: number, gainAmt: number): void => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const bufSize = Math.ceil(ctx.sampleRate * duration)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = filterFreq
    filter.Q.value = 0.8
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(gainAmt, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(getMasterGain())
    src.start(now)
    src.stop(now + duration)
  }, [getCtx, getMasterGain])

  const playKick = useCallback((): void => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(getMasterGain())
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.4)
    gain.gain.setValueAtTime(1.0, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc.start(now)
    osc.stop(now + 0.4)
  }, [getCtx, getMasterGain])

  const playSnare = useCallback((): void => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1)
    oscGain.gain.setValueAtTime(0.7, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc.connect(oscGain)
    oscGain.connect(getMasterGain())
    osc.start(now)
    osc.stop(now + 0.15)
    playNoise(0.2, 3000, 0.8)
  }, [getCtx, getMasterGain, playNoise])

  const playHihat = useCallback((open: boolean): void => {
    playNoise(open ? 0.4 : 0.08, 8000, open ? 0.5 : 0.6)
  }, [playNoise])

  const playClap = useCallback((): void => {
    const ctx = getCtx()
    const now = ctx.currentTime
    ;[0, 0.01, 0.02].forEach((offset) => {
      const bufSize = Math.ceil(ctx.sampleRate * 0.08)
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1200
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.7, now + offset)
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08)
      src.connect(filter)
      filter.connect(gain)
      gain.connect(getMasterGain())
      src.start(now + offset)
      src.stop(now + offset + 0.08)
    })
  }, [getCtx, getMasterGain])

  const playTom = useCallback((freq: number): void => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.3)
    gain.gain.setValueAtTime(0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc.connect(gain)
    gain.connect(getMasterGain())
    osc.start(now)
    osc.stop(now + 0.35)
  }, [getCtx, getMasterGain])

  const playCymbal = useCallback((): void => {
    playNoise(1.2, 6000, 0.5)
  }, [playNoise])

  return { playKick, playSnare, playHihat, playClap, playTom, playCymbal }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Drum {
  id: string
  Icon: React.ComponentType
  label: string
  color: string
  play: PlayFn
}

export default function DrumMachine() {
  const { playKick, playSnare, playHihat, playClap, playTom, playCymbal } = usePercussion()
  const [active, setActive] = useState<string | null>(null)

  const DRUMS: Drum[] = [
    { id: 'kick',    Icon: IconKick,                      label: 'Kick',     color: '#FF6B6B', play: playKick },
    { id: 'snare',   Icon: IconSnare,                     label: 'Snare',    color: '#FF9F43', play: playSnare },
    { id: 'hihat',   Icon: IconHiHat,                     label: 'Hi-Hat',   color: '#FECA57', play: () => playHihat(false) },
    { id: 'openhat', Icon: IconOpenHat,                   label: 'Open Hat', color: '#48DBFB', play: () => playHihat(true) },
    { id: 'clap',    Icon: IconClap,                      label: 'Clap',     color: '#FF9FF3', play: playClap },
    { id: 'tom1',    Icon: () => <IconTom variant="high" />, label: 'Hi Tom',   color: '#54A0FF', play: () => playTom(200) },
    { id: 'tom2',    Icon: () => <IconTom variant="low" />,  label: 'Lo Tom',   color: '#5F27CD', play: () => playTom(80) },
    { id: 'cymbal',  Icon: IconCymbal,                    label: 'Cymbal',   color: '#A29BFE', play: playCymbal },
  ]

  const handleDrum = useCallback((drum: Drum): void => {
    try { drum.play() } catch { /* ignore */ }
    setActive(drum.id)
    setTimeout(() => setActive(null), 150)
  }, [])

  return (
    <div className="activity-card drum-card">
      <h2 className="activity-title">🥁 Drum Kit</h2>
      <div className="drum-grid">
        {DRUMS.map((drum) => (
          <button
            key={drum.id}
            className={`drum-btn ${active === drum.id ? 'drum-btn--active' : ''}`}
            style={{ background: drum.color }}
            onClick={() => handleDrum(drum)}
            onTouchStart={() => handleDrum(drum)}
            aria-label={`${drum.label} drum`}
          >
            <drum.Icon />
            <span className="drum-label">{drum.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
