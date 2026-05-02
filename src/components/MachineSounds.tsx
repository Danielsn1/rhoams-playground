/**
 * MachineSounds.tsx
 *
 * Heavy-machinery sound board for toddlers.  Each button plays a real audio
 * sample from Wikimedia Commons (CC-BY-SA) via a plain <audio> element.
 * Volume stays in sync with the master volume from AudioContext.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../AudioContext'

interface Machine {
  id: string
  emoji: string
  name: string
  color: string
  url: string
}

const MACHINES: Machine[] = [
  {
    id: 'train-horn',
    emoji: '🚂',
    name: 'Train',
    color: '#E17055',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Train_whistle.ogg',
  },
  {
    id: 'tractor',
    emoji: '🚜',
    name: 'Tractor',
    color: '#FECA57',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Tractor_at_work.ogg',
  },
  {
    id: 'fire-truck',
    emoji: '🚒',
    name: 'Fire Truck',
    color: '#FF6B6B',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Firetruck_siren.ogg',
  },
  {
    id: 'airplane',
    emoji: '✈️',
    name: 'Airplane',
    color: '#54A0FF',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Turbofan_takeoff.ogg',
  },
  {
    id: 'helicopter',
    emoji: '🚁',
    name: 'Helicopter',
    color: '#48DBFB',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Helicopter_sound.ogg',
  },
  {
    id: 'construction',
    emoji: '🏗️',
    name: 'Digger',
    color: '#FF9F43',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Excavator_digging.ogg',
  },
  {
    id: 'boat',
    emoji: '⛴️',
    name: 'Boat Horn',
    color: '#A29BFE',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ship_horn.ogg',
  },
  {
    id: 'motorcycle',
    emoji: '🏍️',
    name: 'Motorbike',
    color: '#00D2D3',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Motorcycle_revving.ogg',
  },
]

export default function MachineSounds() {
  const { volume } = useAudio()
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const [active, setActive] = useState<string | null>(null)
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    MACHINES.forEach((machine) => {
      const el = new Audio(machine.url)
      el.preload = 'none'
      el.volume = volume
      el.addEventListener('error', () => {
        setFailed((prev) => new Set(prev).add(machine.id))
      })
      audioRefs.current[machine.id] = el
    })

    return () => {
      Object.values(audioRefs.current).forEach((el) => {
        el.pause()
        el.src = ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Object.values(audioRefs.current).forEach((el) => {
      el.volume = volume
    })
  }, [volume])

  const handleMachine = useCallback((machine: Machine): void => {
    const el = audioRefs.current[machine.id]
    if (!el || failed.has(machine.id)) return
    el.currentTime = 0
    void el.play()
    setActive(machine.id)
    setLabel(`${machine.emoji} ${machine.name}!`)
    setTimeout(() => setActive(null), 700)
    setTimeout(() => setLabel(null), 2200)
  }, [failed])

  return (
    <div className="activity-card machine-card">
      <h2 className="activity-title">🏗️ Big Machines!</h2>
      {label && <div className="animal-speech">{label}</div>}
      <div className="animal-grid">
        {MACHINES.map((machine) => (
          <button
            key={machine.id}
            className={`animal-btn${active === machine.id ? ' animal-btn--active' : ''}${failed.has(machine.id) ? ' animal-btn--failed' : ''}`}
            style={{ background: machine.color }}
            onClick={() => handleMachine(machine)}
            onTouchStart={() => handleMachine(machine)}
            aria-label={`${machine.name} sound`}
            disabled={failed.has(machine.id)}
          >
            <span className="animal-emoji">{machine.emoji}</span>
            <span className="animal-name">{machine.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
