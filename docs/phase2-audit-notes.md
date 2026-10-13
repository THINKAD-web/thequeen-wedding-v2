# Phase 2 audit notes (for PR appendix)

Generated during `fix/nav-structure-design-audit` — see PR body for summary tables.

## Route layout exceptions (minimal header)

These pages use a **legacy minimal header** (logo + single CTA only), not the full glass nav:

- `/buffet`, `/gallery`, `/directions`, `/reviews` — simple top bar
- `/dress-show`, `/dress-show-2027`, `/dress-show2` — campaign/micro layouts (custom theme)
- `/marketing`, `/chat`, `/admin*` — utility pages

Full shared nav applied to: `hall-galaxy.html`, `queens-table.html`, all `build-content` list/post pages, `banquet.html`, `partners/`, `news/press.html`, `index.html` (SPA header).

## MOU site posts (internal)

| Slug | Date | Agreement date in copy |
|------|------|------------------------|
| widuk-university-mou | 2026-04-30 | 2026.4.30 |
| hyundai-steel-mou | 2026-04-08 | 2026.4.8 |
| posco-union-mou | 2026-06-26 | 2026.6.26 |

## External press (언론보도 tab)

Four items in `data/press-data.js` — no duplicate full articles on site.
