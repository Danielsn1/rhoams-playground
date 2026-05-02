/**
 * AnimalSounds.tsx
 *
 * Eight animal buttons, each backed by a real audio sample fetched from
 * Wikimedia Commons (CC-BY-SA).  Plain <audio> elements are used so the
 * browser can load cross-origin media without CORS restrictions.
 * Volume is kept in sync with the master volume from AudioContext.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../AudioContext'

interface Animal {
  id: string
  emoji: string
  name: string
  color: string
  /** Wikimedia Commons direct-download URL (OGG / MP3). */
  url: string
}

const ANIMALS: Animal[] = [
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Cat',
    color: '#FF9FF3',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Felis_catus-cat_meow.ogg',
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Dog',
    color: '#FECA57',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Barking_Jack_Russell.ogg',
  },
  {
    id: 'cow',
    emoji: '🐮',
    name: 'Cow',
    color: '#A29BFE',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Bos_taurus.ogg',
  },
  {
    id: 'duck',
    emoji: '🦆',
    name: 'Duck',
    color: '#48DBFB',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Anas_platyrhynchos_audio.ogg',
  },
  {
    id: 'horse',
    emoji: '🐴',
    name: 'Horse',
    color: '#FF9F43',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Salso-Equine-Whinny.ogg',
  },
  {
    id: 'sheep',
    emoji: '🐑',
    name: 'Sheep',
    color: '#DFE6E9',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Ovis_orientalis_aries.ogg',
  },
  {
    id: 'pig',
    emoji: '🐷',
    name: 'Pig',
    color: '#FD79A8',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Piglet_oink.ogg',
  },
  {
    id: 'elephant',
    emoji: '🐘',
    name: 'Elephant',
    color: '#B2BEC3',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Elephant_trumpet.ogg',
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
