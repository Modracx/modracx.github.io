# MODRACX Portfolio

Personal portfolio website for Kenneth D'Silva (MODRACX), focused on ecommerce
development, custom web systems, and professional services.

This project serves as the public-facing web presence for MODRACX and is
designed to present services, technical capabilities, selected work, and
contact pathways in a clear and polished format. It highlights experience in
Magento, Shopify, frontend development, custom business systems, performance,
SEO, and long-term website maintenance.

The site is a hand-authored static portfolio — no build step, no dependencies.
Five HTML pages load four stylesheets and five scripts directly:

```
css/  tokens · base · atmosphere · components
js/   particles · atmosphere · pathway · scroll · ui
```

The visual direction is "The Atlas of the Realm": a night-sky star chart where
each area of work is a ward on the map, strung along a constellation spine that
draws itself as you scroll. A canvas particle system reacts to the pointer —
motes drift toward a resting cursor, scatter from a moving one, stream toward a
held one, and link into constellations with their neighbours.

Every atmospheric layer is decorative and hidden from assistive technology, and
the whole ambient system stands down under `prefers-reduced-motion`. The content
works without JavaScript: ward cards are ordinary links to their sections, and
the project brief falls back to a plain mail link.

See [docs/brand-guidelines.md](docs/brand-guidelines.md) and
[design-system/modracx-portfolio/MASTER.md](design-system/modracx-portfolio/MASTER.md)
for the tokens and patterns.

## Packages & Open Source

- [MODRACX Packagist Vendor Packages](https://packagist.org/packages/modracx/)
- [modracx/mage-admin-dev-tools](https://packagist.org/packages/modracx/mage-admin-dev-tools)

## Copyright and Usage

Copyright (c) 2026 Kenneth D'Silva. All rights reserved.

This portfolio is for viewing purposes only. You may not copy, reproduce, or
distribute any part of this code, design, or content without explicit
permission.

See [LICENSE](LICENSE) for details.
