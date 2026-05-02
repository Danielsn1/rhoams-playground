/**
 * Shared AudioContext singleton.
 * Using a single context prevents browser limits from being hit
 * when buttons are pressed rapidly.
 */

let ctx = null

export function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if the browser auto-suspended the context
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}
