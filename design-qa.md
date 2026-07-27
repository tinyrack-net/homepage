# Design QA

## Target

- Selected direction: option 3, revised 16:9 editorial media
- Reference: `call_C1LS0FuHEPq17URwBfan6lmU.png`
- Primary comparison: `/ko/`, 1440×1024, dark

## Comparison

The reference and implementation were placed side by side at the same rendered
size. The implementation keeps the reference hierarchy: restrained one-line
navigation, a large authored statement with inverse and muted emphasis, two
actions, a ruled transition, and three editorial teasers.

Approved implementation constraints account for the intentional differences:

- The live manifest supplies article titles, dates, and feature images.
- Every editorial image uses an exact 16:9 frame with `object-fit: cover`.
- Desktop exposes the full three-state theme control and language selector.
- Typography, spacing, surfaces, borders, and page widths use Tinyrack tokens.

## Viewports and states checked

- Korean: 1440×1024 dark, 390×844 dark and light
- English: 1440×1024 light
- Japanese: 1440×1024 dark
- Mobile drawer: site navigation, community links, theme, and language
- Desktop header: active navigation, inline settings, and labeled menu

## Findings

- P0: none
- P1: none
- P2: none
- Headline overflow: none in English, Korean, or Japanese at desktop and mobile
- Browser console errors: none

## Mobile drawer regression check

- Verified with `@tinyrack/ui` 0.18.0 at `/ko/`, 390×844, dark.
- Drawer viewport and popup both end at x=390, matching `window.innerWidth`.
- Computed outer border widths are all `0px`.
- The 8px inner-corner radius and overlay shadow remain.
- Content uses the Drawer-provided 24px padding; the first section also starts at
  x=24 without nested application padding.

final result: passed
