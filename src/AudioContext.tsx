/**
 * AudioContext.tsx
 *
 * Provides a shared Web Audio API context to the whole component tree via
 * React's createContext / useContext primitives.
 *
 * - A single AudioContext is created lazily on first user interaction and
 *   held in a ref so it never triggers re-renders.
 * - A master GainNode sits between all sound generators and the speakers,
 *   making the global volume slider trivially easy to implement.
 * - `volume` (0–1) is stored in component state so the slider can be a
 *   controlled input; changing it updates the GainNode immediately.
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AudioContextValue {
  /** Returns (and lazily initialises) the shared Web Audio API context. */
  getCtx: () => AudioContext
  /**
   * Returns the master GainNode.  All synthesis nodes should connect here
   * instead of directly to ctx.destination so the volume slider works.
   */
  getMasterGain: () => GainNode
  /** Current master volume (0–1). */
  volume: number
  /** Update master volume and the underlying GainNode gain simultaneously. */
  setVolume: (v: number) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<AudioContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const [volume, setVolumeState] = useState(0.8)

  /** Lazily creates the AudioContext + masterGain on first call. */
  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      // Safari still ships the prefixed version
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      ctxRef.current = new AC()
      gainRef.current = ctxRef.current.createGain()
      gainRef.current.gain.value = volume
      gainRef.current.connect(ctxRef.current.destination)
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally omit `volume` – gain is set once at creation time

  const getMasterGain = useCallback((): GainNode => {
    getCtx() // ensure initialised
    return gainRef.current!
  }, [getCtx])

  const setVolume = useCallback((v: number): void => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolumeState(clamped)
    if (gainRef.current) gainRef.current.gain.value = clamped
  }, [])

  return (
    <Ctx.Provider value={{ getCtx, getMasterGain, volume, setVolume }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAudio(): AudioContextValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('useAudio must be used inside <AudioProvider>')
  return value
}
