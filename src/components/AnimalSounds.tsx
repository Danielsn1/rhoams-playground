/**
 * AnimalSounds.tsx
 *
 * Eight animal buttons, each backed by a real audio sample served from
 * public/sounds/animals/.  Plain <audio> elements are used so volume
 * is kept in sync with the master volume from AudioContext.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../AudioContext'

interface Animal {
  id: string
  emoji: string
  name: string
  color: string
  url: string
}

const BASE = import.meta.env.BASE_URL

const ANIMALS: Animal[] = [
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Cat',
    color: '#FF9FF3',
    url: `${BASE}sounds/animals/cat.wav`,
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Dog',
    color: '#FECA57',
    url: `${BASE}sounds/animals/dog.wav`,
  },
  {
    id: 'cow',
    emoji: '🐮',
    name: 'Cow',
    color: '#A29BFE',
    url: `${BASE}sounds/animals/cow.ogg`,
  },
  {
    id: 'frog',
    emoji: '🐸',
    name: 'Frog',
    color: '#48DBFB',
    url: `${BASE}sounds/animals/frog.wav`,
  },
  {
    id: 'horse',
    emoji: '🐴',
    name: 'Horse',
    color: '#FF9F43',
    url: `${BASE}sounds/animals/horse.mp3`,
  },
  {
    id: 'sheep',
    emoji: '🐑',
    name: 'Sheep',
    color: '#DFE6E9',
    url: `${BASE}sounds/animals/sheep.ogg`,
  },
  {
    id: 'pig',
    emoji: '🐷',
    name: 'Pig',
    color: '#FD79A8',
    url: `${BASE}sounds/animals/pig.mp3`,
  },
  {
    id: 'rooster',
    emoji: '🐓',
    name: 'Rooster',
    color: '#E17055',
    url: `${BASE}sounds/animals/rooster.mp3`,
  },
]

export default function AnimalSounds() {
  const { volume } = useAudio()
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const [active, setActive] = useState<string | null>(null)
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const [speech, setSpeech] = useState<string | null>(null)

  // Create audio elements once on mount
  useEffect(() => {
    ANIMALS.forEach((animal) => {
      const el = new Audio(animal.url)
      el.preload = 'none'
      el.volume = volume
      el.addEventListener('error', () => {
        setFailed((prev) => new Set(prev).add(animal.id))
      })
      audioRefs.current[animal.id] = el
    })

    return () => {
      Object.values(audioRefs.current).forEach((el) => {
        el.pause()
        el.src = ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once; volume sync is handled below

  // Keep audio element volumes in sync with master volume
  useEffect(() => {
    Object.values(audioRefs.current).forEach((el) => {
      el.volume = volume
    })
  }, [volume])

  const handleAnimal = useCallback((animal: Animal): void => {
    const el = audioRefs.current[animal.id]
    if (!el || failed.has(animal.id)) return
    el.currentTime = 0
    void el.play()
    setActive(animal.id)
    setSpeech(`${animal.emoji} ${animal.name}!`)
    setTimeout(() => setActive(null), 600)
    setTimeout(() => setSpeech(null), 2000)
  }, [failed])

  return (
    <div className="activity-card animal-card">
      <h2 className="activity-title">🐾 Animal Sounds</h2>
      {speech && <div className="animal-speech">{speech}</div>}
      <div className="animal-grid">
        {ANIMALS.map((animal) => (
          <button
            key={animal.id}
            className={`animal-btn${active === animal.id ? ' animal-btn--active' : ''}${failed.has(animal.id) ? ' animal-btn--failed' : ''}`}
            style={{ background: animal.color }}
            onClick={() => handleAnimal(animal)}
            onTouchStart={() => handleAnimal(animal)}
            aria-label={`${animal.name} sound`}
            disabled={failed.has(animal.id)}
          >
            <span className="animal-emoji">{animal.emoji}</span>
            <span className="animal-name">{animal.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
