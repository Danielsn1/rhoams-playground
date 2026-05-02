# 🧸 Rhoam's Playground

A colorful, interactive digital busy board for toddlers (ages 1–3), built with React + Vite + TypeScript and deployed to GitHub Pages.

**Live site:** https://danielsn1.github.io/rhoams-playground/

---

## Activities

| Board | What it does |
|---|---|
| 🎹 **Piano** | 8 chromatic keys (C4–C5) with sine-wave tones |
| 🥁 **Drum Kit** | 8 pads — kick, snare, hi-hat, open hat, clap, hi tom, lo tom, cymbal — with synthesized percussion |
| 🐾 **Animal Sounds** | 8 real animal sound samples — cat, dog, cow, frog, horse, sheep, pig, rooster |
| 🏗️ **Big Machines** | 8 synthesised vehicle sounds — train whistle, truck air horn, fire siren, jet engine, helicopter rotor, diesel excavator, foghorn, motorbike rev |
| 🫧 **Pop the Bubbles** | Floating bubbles, pop animation + sound on tap |
| 💡 **Light Switches** | 4 toggles with glow effects |
| ✨ **Magic Shapes** | 6 shape buttons with sparkle particle burst + chime |
| 🎡 **Spin the Wheel** | SVG pie wheel with a cubic-bezier spin animation |
| 🎨 **Colors** | 8 colour buttons that update a live swatch + matching tone |
| 🎉 **Celebration** | Confetti shower + ascending fanfare arpeggio |

---

## Audio architecture

### Synthesized sounds
Piano, drum kit, bubbles, shapes, colours, and celebration all use the **Web Audio API** — no files to download, works fully offline. A shared `AudioProvider` (React Context) owns a single `AudioContext` instance and a master `GainNode` so every component shares one context and the global volume slider works across all synthesized sounds.

### Sample-based sounds
Animal Sounds plays real audio files from `public/sounds/animals/` via plain `<audio>` elements. The `src` is set **lazily on first click** — never on mount — so no error events fire prematurely and buttons are never disabled before the user interacts. If a file fails to load (e.g. OGG format on Safari/iOS), a synthesised fallback sound plays automatically.

### Synthesised machine sounds
Big Machines uses the Web Audio API to synthesise each sound (steam whistle, air horn, siren, jet engine, helicopter rotor chop, diesel rumble, foghorn, engine rev). No files are downloaded, the sounds are always correct and work offline.

### Volume slider
A global 🔊 volume slider in the app header controls all sounds simultaneously — both the Web Audio gain and the HTML `<audio>` element volumes.

---

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/

---

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

**One-time setup required:** go to *Settings → Pages → Source* and select **GitHub Actions**.

`vite.config.ts` has `base: '/rhoams-playground/'` so all asset paths are correct at the `https://<user>.github.io/rhoams-playground/` URL.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (build tool + dev server)
- **Web Audio API** (synthesized sounds)
- **Google Fonts** — Noto Color Emoji for consistent emoji rendering across all browsers
- **GitHub Actions** + **GitHub Pages** (CI/CD)

---

## Sound credits

Animal and vehicle sound clips are sourced from public GitHub repositories (MIT / unencumbered) and served as static assets from `public/sounds/`.

