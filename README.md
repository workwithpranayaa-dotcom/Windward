# Windward

A **generative art studio** in the browser. Every image is a seeded system — flow fields, orbital particles, L-systems, strange attractors — not a filter slapped on a photo.

Share a seed and the same piece regenerates. Export a PNG when you like it.

## Engines

1. **Flow field** — particles advected through 2D Perlin noise. The field is the artwork; color is velocity.
2. **Orbits** — nested harmonic oscillators. Small ratio changes produce completely different families of curves (Lissajous → almost-chaotic).
3. **L-system grove** — a turtle-graphics plant language (`F`, `+`, `-`, `[`, `]`). Rewrite depth grows a tree, not a sprite.
4. **Lorenz mist** — the classic chaotic attractor, projected and faded as a point cloud.
5. **Superformula** — Gielis curves. Polar forms that swing from diamonds to sea-urchins.

Perlin noise, the L-system interpreter, and the Lorenz integrator are written from scratch in this repo. No generative library.

## Run

Open `index.html`, or:

```bash
npx --yes serve .
```

## Keyboard

`Space` regenerate · `E` export PNG · `1–5` engines

Built for Pranaya Simkhada's portfolio — HTML, CSS, canvas, vanilla JS.
