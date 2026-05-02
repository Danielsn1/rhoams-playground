import { useState, useCallback } from 'react'
import { getAudioContext } from '../audio'

// --- Inline SVG icons (no emoji dependency) ---

const IconKick = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    <circle cx="22" cy="22" r="18" fill="rgba(255,255,255,0.88)" />
    <circle cx="22" cy="22" r="12" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
    <circle cx="22" cy="22" r="5" fill="rgba(0,0,0,0.18)" />
    {/* legs */}
    <line x1="11" y1="37" x2="7"  y2="43" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="33" y1="37" x2="37" y2="43" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const IconSnare = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* body */}
    <rect x="6" y="16" width="32" height="12" rx="2" fill="rgba(255,255,255,0.75)" />
    {/* top head */}
    <ellipse cx="22" cy="16" rx="16" ry="5" fill="rgba(255,255,255,0.9)" />
    {/* bottom head */}
    <ellipse cx="22" cy="28" rx="16" ry="5" fill="rgba(255,255,255,0.65)" />
    {/* snare wires */}
    <line x1="10" y1="28" x2="34" y2="28" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <line x1="10" y1="30" x2="34" y2="30" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <line x1="10" y1="32" x2="34" y2="32" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
  </svg>
)

const IconHiHat = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* stand pole */}
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    {/* top cymbal (closed) */}
    <ellipse cx="22" cy="20" rx="14" ry="3.5" fill="rgba(255,255,255,0.9)" />
    {/* bottom cymbal - very close */}
    <ellipse cx="22" cy="25" rx="14" ry="3.5" fill="rgba(255,255,255,0.7)" />
    {/* hi-hat clutch */}
    <circle cx="22" cy="11" r="3" fill="rgba(255,255,255,0.8)" />
  </svg>
)

const IconOpenHat = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* stand pole */}
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    {/* top cymbal */}
    <ellipse cx="22" cy="15" rx="14" ry="3.5" fill="rgba(255,255,255,0.9)" />
    {/* bottom cymbal - open (spaced far apart) */}
    <ellipse cx="22" cy="30" rx="14" ry="3.5" fill="rgba(255,255,255,0.7)" />
    {/* gap arrows to show openness */}
    <line x1="22" y1="19" x2="22" y2="26" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
)

const IconClap = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* left hand */}
    <path d="M8 26 C6 22 8 14 13 13 C15 12 17 14 17 17 L17 26 C17 29 15 31 12 31 L10 31 C8 31 7 29 8 26Z"
          fill="rgba(255,255,255,0.88)" />
    {/* left fingers */}
    <line x1="13" y1="13" x2="11" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="14" x2="15" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="17" y1="17" x2="18" y2="10" stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    {/* right hand (mirror) */}
    <path d="M36 26 C38 22 36 14 31 13 C29 12 27 14 27 17 L27 26 C27 29 29 31 32 31 L34 31 C36 31 37 29 36 26Z"
          fill="rgba(255,255,255,0.88)" />
    <line x1="31" y1="13" x2="33" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="28" y1="14" x2="29" y2="8"  stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    <line x1="27" y1="17" x2="26" y2="10" stroke="rgba(255,255,255,0.88)" strokeWidth="3" strokeLinecap="round" />
    {/* impact lines */}
    <line x1="22" y1="15" x2="22" y2="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="14" x2="17" y2="9"  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="25" y1="14" x2="27" y2="9"  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconTom = ({ small }) => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* body - hi tom is narrower/taller, lo tom is wider/shorter */}
    <rect x={small ? 9 : 5} y={small ? 14 : 17} width={small ? 26 : 34} height={small ? 16 : 11} rx="2" fill="rgba(255,255,255,0.75)" />
    {/* top head */}
    <ellipse cx="22" cy={small ? 14 : 17} rx={small ? 13 : 17} ry={small ? 4.5 : 4} fill="rgba(255,255,255,0.9)" />
    {/* bottom head */}
    <ellipse cx="22" cy={small ? 30 : 28} rx={small ? 13 : 17} ry={small ? 4.5 : 4} fill="rgba(255,255,255,0.6)" />
    {/* rim highlight */}
    <ellipse cx="22" cy={small ? 14 : 17} rx={small ? 13 : 17} ry={small ? 4.5 : 4} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    {/* mounting arm */}
    {small && <line x1="22" y1="5" x2="22" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />}
  </svg>
)

const IconCymbal = () => (
  <svg viewBox="0 0 44 44" fill="none" className="drum-svg" aria-hidden="true">
    {/* stand pole */}
    <line x1="22" y1="6" x2="22" y2="42" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" />
    {/* cymbal - large tilted ellipse */}
    <ellipse cx="22" cy="20" rx="17" ry="5" fill="rgba(255,255,255,0.85)" transform="rotate(-12 22 20)" />
    {/* dome (bell) in center */}
    <ellipse cx="22" cy="20" rx="4" ry="3" fill="rgba(255,255,255,0.95)" transform="rotate(-12 22 20)" />
    {/* nut */}
    <circle cx="22" cy="9" r="2.5" fill="rgba(255,255,255,0.85)" />
  </svg>
)

// --- Percussion synthesis helpers ---

function playKick() {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain); gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.4)
  gain.gain.setValueAtTime(1.0, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  osc.start(now); osc.stop(now + 0.4)
}

function playNoise(duration, filterFreq, gainAmt) {
  const ctx = getAudioContext()
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
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
  src.start(now); src.stop(now + duration)
}

function playSnare() {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  // Tone layer
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(200, now)
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.1)
  oscGain.gain.setValueAtTime(0.7, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  osc.connect(oscGain); oscGain.connect(ctx.destination)
  osc.start(now); osc.stop(now + 0.15)
  // Noise layer
  playNoise(0.2, 3000, 0.8)
}

function playHihat(open = false) {
  playNoise(open ? 0.4 : 0.08, 8000, open ? 0.5 : 0.6)
}

function playClap() {
  const ctx = getAudioContext()
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
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    src.start(now + offset); src.stop(now + offset + 0.08)
  })
}

function playTom(freq = 120) {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.3)
  gain.gain.setValueAtTime(0.8, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start(now); osc.stop(now + 0.35)
}

function playCymbal() {
  playNoise(1.2, 6000, 0.5)
}

const DRUMS = [
  { id: 'kick',    Icon: IconKick,          label: 'Kick',     color: '#FF6B6B', play: playKick },
  { id: 'snare',   Icon: IconSnare,         label: 'Snare',    color: '#FF9F43', play: playSnare },
  { id: 'hihat',   Icon: IconHiHat,         label: 'Hi-Hat',   color: '#FECA57', play: () => playHihat(false) },
  { id: 'openhat', Icon: IconOpenHat,       label: 'Open Hat', color: '#48DBFB', play: () => playHihat(true) },
  { id: 'clap',    Icon: IconClap,          label: 'Clap',     color: '#FF9FF3', play: playClap },
  { id: 'tom1',    Icon: () => <IconTom small />, label: 'Hi Tom', color: '#54A0FF', play: () => playTom(200) },
  { id: 'tom2',    Icon: () => <IconTom />, label: 'Lo Tom',   color: '#5F27CD', play: () => playTom(80) },
  { id: 'cymbal',  Icon: IconCymbal,        label: 'Cymbal',   color: '#A29BFE', play: playCymbal },
]

export default function DrumMachine() {
  const [active, setActive] = useState(null)

  const handleDrum = useCallback((drum) => {
    try {
      drum.play()
    } catch { /* ignore */ }
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
