import Piano from './components/Piano'
import DrumMachine from './components/DrumMachine'
import BubblePop from './components/BubblePop'
import ShapeButtons from './components/ShapeButtons'
import ColorButtons from './components/ColorButtons'
import Celebration from './components/Celebration'
import LightSwitches from './components/LightSwitches'
import SpinWheel from './components/SpinWheel'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🧸 Rhoam&apos;s Playground 🧸</h1>
        <p className="app-subtitle">Tap, press &amp; explore!</p>
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
      </main>
      <footer className="app-footer">
        <span>Made with ❤️ for Rhoam</span>
      </footer>
    </div>
  )
}
