import { useState, useCallback } from 'react'
import { getAudioContext } from '../audio'

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
  { id: 'kick',    emoji: '🥁', label: 'Kick',     color: '#FF6B6B', play: playKick },
  { id: 'snare',   emoji: '🪘', label: 'Snare',    color: '#FF9F43', play: playSnare },
  { id: 'hihat',   emoji: '🎩', label: 'Hi-Hat',   color: '#FECA57', play: () => playHihat(false) },
  { id: 'openhat', emoji: '🎪', label: 'Open Hat', color: '#48DBFB', play: () => playHihat(true) },
  { id: 'clap',    emoji: '👏', label: 'Clap',     color: '#FF9FF3', play: playClap },
  { id: 'tom1',    emoji: '🎸', label: 'Hi Tom',   color: '#54A0FF', play: () => playTom(200) },
  { id: 'tom2',    emoji: '🪗', label: 'Lo Tom',   color: '#5F27CD', play: () => playTom(80) },
  { id: 'cymbal',  emoji: '✨', label: 'Cymbal',   color: '#A29BFE', play: playCymbal },
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
            <span className="drum-emoji">{drum.emoji}</span>
            <span className="drum-label">{drum.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
