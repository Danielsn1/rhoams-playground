import { useState, useCallback } from 'react'

const ANIMALS = [
  { id: 'cat', emoji: '🐱', name: 'Cat', color: '#FF9FF3', sound: 'meow' },
  { id: 'dog', emoji: '🐶', name: 'Dog', color: '#FECA57', sound: 'woof' },
  { id: 'duck', emoji: '🦆', name: 'Duck', color: '#48DBFB', sound: 'quack' },
  { id: 'cow', emoji: '🐮', name: 'Cow', color: '#A29BFE', sound: 'moo' },
  { id: 'lion', emoji: '🦁', name: 'Lion', color: '#FF9F43', sound: 'roar' },
  { id: 'frog', emoji: '🐸', name: 'Frog', color: '#00D2D3', sound: 'ribbit' },
  { id: 'sheep', emoji: '🐑', name: 'Sheep', color: '#DFE6E9', sound: 'baa' },
  { id: 'pig', emoji: '🐷', name: 'Pig', color: '#FD79A8', sound: 'oink' },
]

function playAnimalSound(sound) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    if (sound === 'meow') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(900, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.start(now); osc.stop(now + 0.5)
    } else if (sound === 'woof') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25)
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc.start(now); osc.stop(now + 0.35)
    } else if (sound === 'quack') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.2)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.start(now); osc.stop(now + 0.3)
    } else if (sound === 'moo') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.4)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.8)
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
      osc.start(now); osc.stop(now + 1.0)
    } else if (sound === 'roar') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.3)
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.8)
      gain.gain.setValueAtTime(0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      osc.start(now); osc.stop(now + 0.9)
    } else if (sound === 'ribbit') {
      [0, 0.18].forEach((offset) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.type = 'square'
        osc.frequency.setValueAtTime(200, now + offset)
        osc.frequency.exponentialRampToValueAtTime(150, now + offset + 0.12)
        gain.gain.setValueAtTime(0.3, now + offset)
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15)
        osc.start(now + offset); osc.stop(now + offset + 0.15)
      })
    } else if (sound === 'baa') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.5)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      osc.start(now); osc.stop(now + 0.7)
    } else if (sound === 'oink') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(250, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15)
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.3)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.start(now); osc.stop(now + 0.4)
    }
  } catch {
    // Audio not supported
  }
}

export default function AnimalSounds() {
  const [active, setActive] = useState(null)
  const [speech, setSpeech] = useState(null)

  const handleAnimal = useCallback((animal) => {
    playAnimalSound(animal.sound)
    setActive(animal.id)
    setSpeech(`${animal.name} says ${animal.sound}!`)
    setTimeout(() => setActive(null), 500)
    setTimeout(() => setSpeech(null), 2000)
  }, [])

  return (
    <div className="activity-card animal-card">
      <h2 className="activity-title">🐾 Animal Sounds</h2>
      {speech && <div className="animal-speech">{speech}</div>}
      <div className="animal-grid">
        {ANIMALS.map((animal) => (
          <button
            key={animal.id}
            className={`animal-btn ${active === animal.id ? 'animal-btn--active' : ''}`}
            style={{ background: animal.color }}
            onClick={() => handleAnimal(animal)}
            onTouchStart={() => handleAnimal(animal)}
            aria-label={`${animal.name} sound`}
          >
            <span className="animal-emoji">{animal.emoji}</span>
            <span className="animal-name">{animal.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
