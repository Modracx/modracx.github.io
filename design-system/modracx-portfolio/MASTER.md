# MODRACX Portfolio Design System

## Core Pattern

- Star-atlas portfolio: the work presented as six wards on a chart
- The constellation spine — an SVG path that draws itself on scroll and
  ignites a rune waypoint at each section. This is the signature element;
  everything else stays quiet around it.
- The grimoire: a keyword console (`?` or `Cmd/Ctrl+K`) for jumping around
- Outcome-first content

## Token Intent

- Channel: `--c-bg`, `--c-surface`, `--c-ink`, `--c-gold`, `--c-lavender` —
  bare `r g b` triplets, so any rule can tint with
  `rgb(var(--c-gold) / 0.4)` and follow the theme for free
- Primitive: cosmic indigo base with gold and lavender light
- Semantic: void, midnight, glass, glass-edge, ink scale, glow
- Text vs decoration: `--gold` / `--lavender` draw; `--gold-ink` /
  `--lavender-ink` are the only accents allowed to colour text;
  `--on-accent` is the ink that rides on an accent fill
- Component: wards, glass panels, relics, meters, codex, missive, sheet,
  grimoire, waypoints, theme switch

## Themes

Two charts, both defined in `css/tokens.css` and nowhere else:

- Night chart — `:root`, the default
- Day chart — `[data-theme="light"]`, and `prefers-color-scheme: light` for
  readers who have not chosen

An explicit `[data-theme]` always wins. Atmosphere does not switch off in the
day chart, it dims: `--star-opacity`, `--nebula-opacity`, `--grain-opacity`,
`--vignette-strength`. The particle canvas carries its own matched palettes in
`js/particles.js` and repaints on the `themechange` event.

## Typography

- Display: Cormorant Garamond (500, italic for accents)
- Body / UI: Space Grotesk (300–600)
- Rune: DM Mono — uppercase labels, meta, console

## Layout

- Full-height gate on the home page; a `.threshold` hero on inner pages
- Sections are `.chapter` blocks strung along the spine inside `[data-spine]`
- Cards are glass-morphism over the live atmosphere, never opaque

## Atmosphere Layers (all `aria-hidden`, all optional)

`.cosmos` (gradient + three parallax star sheets + two nebulae) → `#particles`
canvas → content → `.grain` + `.vignette` + `.wisp` cursor light.
Every layer stands down under `prefers-reduced-motion`; the particle canvas
renders one static frame instead of animating.

## Interaction

- Visible focus states — a hard 2px ring plus a soft halo, so it reads on any
  ground in either chart
- All text at 5:1 or better in both charts, enforced by
  `npm run audit:contrast`
- 44px touch targets
- Motion is ambient and continuous, never blocking
- No hover-only critical interactions; the ward sheets are real links first

## Content Strategy

- Explain how systems work
- Show what problems are solved
- Describe decision-making, not just output
- Structural devices must encode something true: the four "stretches" are
  numbered because they are a sequence; the six wards are not numbered
  because they are a set
