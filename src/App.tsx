import { useAudio } from './AudioContext'
import Piano from './components/Piano'
import DrumMachine from './components/DrumMachine'
import BubblePop from './components/BubblePop'
import ShapeButtons from './components/ShapeButtons'
import ColorButtons from './components/ColorButtons'
import Celebration from './components/Celebration'
import LightSwitches from './components/LightSwitches'
import SpinWheel from './components/SpinWheel'
import AnimalSounds from './components/AnimalSounds'
import MachineSounds from './components/MachineSounds'
import './App.css'

export default function App() {
  const { volume, setVolume } = useAudio()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🧸 Rhoam&apos;s Playground 🧸</h1>
        <p className="app-subtitle">Tap, press &amp; explore!</p>
        <div className="volume-bar">
          <span className="volume-icon" aria-hidden="true">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            className="volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Master volume"
          />
        </div>
      </header>
      <main className="board-grid">
        <Piano />
        <DrumMachine />
        <BubblePop />
        <LightSwitches />
        <ShapeButtons />
        <SpinWheel />
        <ColorButtons />
        <Celebration />
        <AnimalSounds />
        <MachineSounds />
      </main>
      <footer className="app-footer">
        <span>Made with ❤️ for Rhoam</span>
      </footer>
    </div>
  )
}
