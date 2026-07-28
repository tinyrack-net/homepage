# Corporate Landing Redesign Design QA

## Evidence

- Desktop dark: `.screenshots/home-desktop-dark-1440x1024.png`
- Desktop light: `.screenshots/home-desktop-light-1440x1024.png`
- Mobile dark: `.screenshots/home-mobile-dark-390x844.png`
- Korean desktop dark: `.screenshots/home-ko-desktop-dark-1440x1024.png`

## Comparison

- The landing is a philosophy-led corporate page: hero → principles → open-source CTA band → engineering blog, in a "we" company voice across en/ko/ja. Products and projects are never enumerated; the lineup lives on `/open-source/`.
- Visual material is token-only SVG illustration (`app/components/HomeVisuals.tsx`) themed on the brand values — rack, open source, self-hosting, simplicity: a detailed server rack (rails, screws, vents, a powered unit with a pulsing LED and a cable run) in the hero; a public repository feeding a contributor branch that merges back with a release tag (open source); a house with a chimney sheltering a powered home server and the devices it serves (self-hosting); and a tangle of lines resolving through one node into a single straight run (simplicity). Dot-grid and blueprint-grid backgrounds add texture, and the artwork bleeds edge-to-edge in its framed panel (no inner padding) so each illustration fills its half of the row. Principle titles are `display`-scale next to the visuals, with the section heading reduced to an uppercase label. Every color is a `stroke-tinyrack-*` / `fill-tinyrack-*` class, so the artwork adapts to both themes automatically; LEDs use `motion-safe:animate-pulse` and stay static under reduced motion.
- The "What we make" band replaces the former card grids: one muted panel with two CTAs (`/open-source/` and GitHub), grounded by a full-width circuit-trace strip (`CircuitVisual`) that ends in a chip with a pulsing LED.
- Motion: dashed strokes flow along the rack cable, the commit graph's in-progress tip, the home-node links, and the circuit's main trace via the `home-visual-flow` keyframe in `app/styles/app.css`; in-flight packet dots pulse. All motion is gated behind `prefers-reduced-motion: no-preference`.
- The blog section is deliberately compact: one row of three equal teasers (`md:grid-cols-3`), no featured card — the blog is a feature of the site, not its lead.
- Everything is built from existing `@tinyrack/ui` primitives and tokens — no new components, no hardcoded colors, no new CSS imports.

## Responsive and Interaction Checks

- 1440×1024 dark and light: hero rack aligns beside the headline; principle rows alternate visual/text sides; no horizontal overflow.
- 390×844 dark: the hero illustration is hidden below `md` so the headline carries; principle visuals stack above their text; the CTA band wraps its buttons.
- Korean locale renders the corporate copy with `word-break: keep-all`; hero overflow is enforced by e2e in all three locales.
- Illustrations are `aria-hidden` and non-focusable; the powered-unit LED uses the semantic `success` token in both themes.

## Severity Review

- P0 blockers: none.
- P1 functional or responsive regressions: none — full Playwright suite (26 tests) passes, including the principle-row and CTA-band assertions.
- P2 visual issues affecting usability or hierarchy: none.
- P3 polish differences: the static OG images (`public/og/index/*.png`) still show the homelab-era artwork and should be refreshed in a follow-up.

final result: passed
