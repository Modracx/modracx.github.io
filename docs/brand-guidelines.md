# MODRACX Brand Guidelines

## Voice

- Direct, technical, and practical.
- Focus on outcomes, systems, and clarity.
- Avoid hype. Emphasize what the work does.
- The theme is atmospheric; the copy stays plain-spoken. Mystical framing
  belongs in eyebrows and section names, never in claims about the work.

## Visual Direction

- Theme name: The Atlas of the Realm
- Mood: night sky, star chart, illuminated atlas
- Style: deep cosmic background, glass-morphism surfaces, gold and lavender
  light, restrained but continuous ambient motion

The atlas is read in two lights, and both are the same map:

- **Night chart** (dark) — the default and the brand's home key. Lit motes on
  a deep ground, gold and lavender glowing.
- **Day chart** (light) — parchment ground, stars as ink flecks, the same
  accents deepened until they carry text. Atmospheric layers dim rather than
  disappear (`--star-opacity`, `--nebula-opacity`, `--grain-opacity`,
  `--vignette-strength`).

Readers with no stored preference get whichever chart their system asks for;
the switch in the header pins a choice and remembers it.

## Color System

All colour lives in `css/tokens.css`. Nothing downstream hardcodes a value;
rules tint through channel tokens — `rgb(var(--c-gold) / 0.4)` — so a theme is
a swap of that one file.

|                    | Night chart | Day chart |
| ------------------ | ----------- | --------- |
| Ground (`--c-bg`)  | `#07071a`   | `#f5f6fb` |
| Deepest            | `#04040f`   | `#e6e9f6` |
| Surface            | `#161a41`   | `#ffffff` |
| Gold, decorative   | `#f0c060`   | `#c08a1e` |
| Lavender, decor.   | `#a78bfa`   | `#6c54d6` |
| Strongest text     | `#f0f4ff`   | `#10132a` |
| Ink soft           | `#c8cfe8`   | `#23273f` |
| Ink muted          | `#9aa3c7`   | `#454a6b` |
| Ink faint          | `#8a92b8`   | `#555a7c` |

Two rules keep the accents honest:

- **Decoration and text are separate tokens.** `--gold` / `--lavender` draw
  borders, dots, rules, and glows. `--gold-ink` / `--lavender-ink` are the only
  ones allowed to colour text — in the day chart they darken to `#7a5410` and
  `#4b3aa8` while the decorative pair stays warm.
- **`--on-accent` (`#0a0a1e`) is the ink that rides on a gold or lavender
  fill**, and it is dark in both charts. Any fill carrying it — including every
  stop of a gradient — must clear 5:1 against it, which is why `--lavender-soft`
  exists for the two fills that carry glyphs.

## Contrast

The floor is **5:1 for all text**, in both charts, on every surface it can
land on — above the 4.5:1 WCAG AA requirement for body copy.

This is enforced, not asserted. `npm run audit:contrast` loads every page in
both charts, walks the rendered DOM, composites each element's real background
through its translucent ancestors, and fails on anything under 5:1. Gradient
fills, which have no single background colour to measure, are checked against
their declared stops in the same script.

    npm run serve            # in one shell
    npm run audit:contrast   # in another

## Typography

- Display: `Cormorant Garamond` — set large, italic for accented phrases
- Body / UI: `Space Grotesk`
- Rune (labels, meta, console): `DM Mono`, uppercase, wide tracking

## Principles

- Wards, waypoints, and the grimoire explain capability without jargon.
- Prefer systems thinking over generic portfolio storytelling.
- Every atmospheric layer is decoration: it stays `aria-hidden`, never traps
  focus, and stands down under `prefers-reduced-motion`.
- Keep interactions accessible, readable, and fast — 44px targets, visible
  focus, no hover-only critical paths.
- The theme switch is progressive enhancement: it is built by `js/theme.js`, so
  without scripting the night chart simply renders and nothing is lost. The
  stored choice is applied by an inline snippet in each page's `<head>` so the
  correct chart is painted on the first frame.
