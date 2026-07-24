# MODRACX Portfolio Design System

## Core Pattern

- Star-atlas portfolio: the work presented as six wards on a chart
- The constellation spine — an SVG path that draws itself on scroll and
  ignites a rune waypoint at each section. This is the signature element;
  everything else stays quiet around it.
- The grimoire: a keyword console (`?` or `Cmd/Ctrl+K`) for jumping around
- Outcome-first content

## Token Intent

- Primitive: cosmic indigo base with gold and lavender light
- Semantic: void, midnight, glass, glass-edge, ink scale, glow
- Component: wards, glass panels, relics, meters, codex, missive, sheet,
  grimoire, waypoints

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

- Visible focus states
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
