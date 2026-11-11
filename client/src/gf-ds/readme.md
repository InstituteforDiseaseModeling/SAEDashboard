# GF Brand PPT

A design system for Gates Foundation communications, built on the Foundation's **2025 brand identity** — Blooming Saffron / Parchment / Weathered Slate, Noto Serif + Noto Sans — with the official logo package and both approved icon sets. Slide layouts, tokens, reusable components, and specimen cards are wired for the design-system compiler.

## Sources given

- **Approved fonts** (`GF APPROVED FONTS_250509/`): Noto Serif + Noto Sans TTF families → copied to `assets/fonts/`.
- **Core logo package** (`GATES FOUNDATION CORE LOGO PACKAGE/`): Primary, Stacked, and Monogram lockups in three colorways (Blooming Saffron / Parchment / Weathered Slate), EPS/JPEG/PNG/SVG → SVGs copied to `assets/logos/`.
- **Functional icons** (`GF FUNCTIONAL ICONS/`): 24 UI glyphs, Parchment + Weathered Slate → `assets/icons/functional/`.
- **Metaphorical icons** (`GF METAPHORICAL ICONS/`): 20 theme glyphs, Parchment + Weathered Slate → `assets/icons/metaphorical/`.
- **Visual identity guidelines** (`brand web/*.html`): saved pages of the official Frontify brand portal (Color, Typography, Logos, Icons, Photography, Data visualization, The Gate). These are JS single-page-app shells — the prose/spec content loads from Frontify's API and is **not** in the saved HTML — but the embedded theme config yielded the authoritative **condensed-Noto headline system** and body/link colors, now reflected in the type tokens.
- **Presentation template** (`GF Template/…​.potx`, 110 slides / 71 layouts): the actual Gates Foundation Overview PowerPoint template. Its theme ("Custom 4") defines the vibrant accent palette (orange accent1, red, pink, blue, teal, slate accent6; gold dk2) and uses Cambria/ Calibri as *theme* fonts — Office defaults, superseded by the approved Noto families. Real documentary photography and a data-viz donut chart were extracted → `assets/imagery/`.
- **Official color & typography references** (`FINAL GF COLOR AND TYPOGRAPHY REFERENCES PACKAGE/`) and the **Visual Identity PDFs** (Color, Logos, Typography, Icons, Photography, Data visualization, The Gate): the definitive palette (core + secondary 6×3 with exact hex/CMYK/Pantone, ASE swatches), type/tone reference, and all usage rules — the source of truth for `tokens/colors.css`, `tokens/dataviz.css`, `components/brand/Gate.jsx`, and this readme.
- **Presentation template extraction** (earlier files): `GATES_DESIGN_SYSTEM.md`, `GATES_QUICK_REFERENCE.md`, `gates-design-tokens.{css,json}`, `gates-pptxgenjs-examples.js`. These describe a PowerPoint template whose *fonts* (Cambria/Calibri) were Office defaults, not the brand — the approved-font package supersedes them. Their layout/spacing conventions and the secondary chart palette are retained.

No product codebase or Figma was provided. The primary "product" is the **presentation/slide template** plus the brand foundations.

---

## Content fundamentals

Full guidance in **`guidelines/voice.md`**; `CLAUDE.md` applies it automatically to copy generated in this project. Positioning: *Supporting all to achieve their full potential* (platform: *Partners of Human Potential*). Values — Collaboration, Optimism, Innovation, Rigor, Inclusion.

- **Voice:** clear, measured, mission-forward. Leads with people and impact. Mission line: *"Every life has equal value."*
- **Three voice tones** (from the official references) — pick per context:
  - **Tone One — Respectful, practical, and measured**
  - **Tone Two — Thoughtful, empathetic, and welcoming**
  - **Tone Three — Open-minded, hopeful, curious, and inspiring**
- **Tone:** confident without hype; concrete outcomes and numbers over adjectives.
- **Person:** collective "we" for the Foundation — but **careful with "we"**: don't claim credit for partners'/communities' work (we fund, support, collaborate, listen, learn). Use asset framing and people-first language; avoid deficit/colonial framing; say "lower-income countries." "you" is rare; no first-person singular.
- **Casing:** sentence case for titles and body; running heads (RH) are ALL CAPS. UPPERCASE also for short eyebrow labels (Noto Sans ExtraBold, usually on a saffron chip).
- **Quotes:** always use “curly” quotation marks, never straight quotes.
- **Emoji:** none.
- **Vibe:** calm, credible, human, data-grounded. Clarity over decoration.

---

## Visual foundations

- **Color — official palette (`GF COLOR AND TYPOGRAPHY REFERENCES`).**
  - **Core** (used most widely): **Weathered Slate `#313A44`**, **Parchment `#F5F3ED`**, **Blooming Saffron `#EBCB00`**, plus White `#FFFFFF` and Black `#000000`. Saffron is a bright yellow — use it as **fills/blocks/chips with Slate text on top**, never as text or thin lines on light.
  - **Secondary** (flexibility for data-viz, social, content): six hue families — **Yellow, Orange, Red, Magenta, Blue, Turquoise** — each in **Light / Medium / Dark**. Blooming Saffron IS the medium Yellow. Full hexes live in `tokens/colors.css`.
  - **Zig-zag method** for combinations: anchor on Parchment + Weathered Slate, then add one **Light**, one **Medium**, one **Dark** — each from a **different hue column** (never two from the same column). Only use approved colors; no additions or substitutions; color should have purpose, not decoration.
  - **Accessibility:** never rely on color alone — always add text/labels/legends. Avoid red–green, green–brown, and blue–purple pairings.
- **Photography:** documentary and human — real people in real health, family, community and development settings. Warm natural light, full color, never staged or desaturated. For text over photos, use a Slate scrim/gradient. Assets in `assets/imagery/`.
- **Type:** headline system is **condensed Noto** (per the visual-identity guidelines): **Noto Sans ExtraCondensed Black, UPPERCASE** for the biggest H1/statement titles and large numerals; **Noto Serif ExtraCondensed** for editorial headlines; **Noto Sans Condensed Black, uppercase** for subheads. **Noto Serif** (regular width) for mid-level headings, and **Noto Sans** for body/UI — body weight is **Light (300)**, emphasis **ExtraBold (800)**. Tokens: `--font-headline`, `--font-headline-serif`, `--font-subhead`, `--font-display`, `--font-body`. Hierarchy from size; emphasis from weight — not from switching color.
- **Spacing:** 64px slide margins, 20px section gaps (from the deck's 0.5"/0.3" system).
- **Backgrounds:** flat Parchment, White, Slate, or full-bleed Saffron — or full-bleed documentary photography with a Slate scrim. No gradients or textures as decoration.
- **Corners:** restrained (2–4px). The saffron chips/bars are square.
- **Cards:** white surface, subtle shadow, hairline border, optional **top** accent bar — never a colored left-border-only.
- **Shadows:** low, soft, slate-tinted (sm/md/lg).
- **Divider / accent rule:** a short **Saffron** bar (4px) near titles is the signature flourish. No underlines beneath titles, no side stripes.
- **Motion:** signature 700ms fade between slides; 150–300ms ease for UI. No bounces.
- **Hover:** saffron darkens to `#D2B500`; links (slate, underlined) shift to `--saffron-dark`.
- **Anti-patterns:** saffron text on light · decorative title underlines · sidebar stripes · pure-black body text · 3+ colors in one view · literal `•` bullets · low-contrast text.

---

## Logos

`assets/logos/` — Primary, Stacked, and Monogram lockups, each in **Saffron / Parchment / Slate** (SVG; one raster PNG of the primary-slate for convenience).

- **Primary wordmark** (horizontal) — the default for most communications: external comms, website navigation, stationery, swag, campaigns, signage, presentation & document templates. Not for social profile icons; never below 2 in.
- **Stacked wordmark** — only when the primary is too small to be legible or a vertical/compact format suits better (narrow print, some collateral). Not for website navigation; never below 2 in.
- **Monogram** — small-scale only: social profile icons, favicons, compact digital, ERG/division lockups. **Never a core brand element**; not for external comms, nav, stationery, campaigns, or signage; not larger than 3 in. The wordmark and monogram are **not interchangeable**.
- **Color:** place logos in approved-palette colors, usually on a solid palette background (Parchment / Weathered Slate / Blooming Saffron), or over photography **only if perfectly legible**. Pairing: Slate logo on light grounds, Parchment logo on Slate.
- **Clear space:** give the logo at least two equal margins of breathing room — the simplest way is to align it to the top-left within the layout margins. Balanced, consistent spacing matters more than an exact measurement.
- **Don'ts:** don't fill with a non-approved color · don't modify/redraw/stretch the structure · don't combine wordmark + monogram · don't use non-accessible color pairings · don't place on busy imagery · don't rotate · don't add effects.
- **Alt text:** always exactly "Gates Foundation".

---

## Iconography

The brand ships **two approved icon sets**, both single-weight, rounded, single-color glyphs on a 153×153 canvas, provided in Parchment (light) and Weathered Slate (dark) colorways:

- **Functional (24):** UI actions — accept, dismiss, arrows & carrots (up/down/left/right/top-right), download, upload, link, menu, more-options, microphone, pause, play, plus, subtract, search, share, sort.
- **Metaphorical (20):** program themes — bacteria, caregiving, chemistry, clinic, communication, community, economic-growth, education, empowerment, equality, family, globe, healthcare, ideas, knowledge, nutrition, school, statistics, technology, vaccine.

Use them via the **`Icon`** component, which recolors any glyph through a CSS mask so a single asset paints in any brand color (`color="var(--slate)"`, `"var(--saffron)"`, etc.). Emoji and unicode-as-icons are never used; do not hand-draw icons — use only these approved glyphs. (An `Icon` wrapper is an intentional addition; see below.)

**Usage rules (from the Icons guidelines):** icons are derived from the graphic quality of *The Gate*. **Functional** icons are for the web — navigation, social, signage (arrows only); not for swag or as any entity's logo. **Metaphorical** icons signal a topic/focus area to support content — social, email newsletters, PowerPoint; never alone, never as a logo, never a stand-in for content. A **multi-color** metaphorical variant exists for PowerPoint/social with ample contrast (on a Slate or Parchment base) — don't recolor it. Colors are **Weathered Slate or Parchment**. **Don'ts:** don't modify/redesign/distort, don't reinterpret meaning or substitute, don't use as decoration or as a repeating pattern, don't scale metaphorical icons up as large graphic elements, don't combine two icons equally scaled. **Accessibility:** maintain ≥ 4.5:1 contrast, ≥ 40px touch target, and add an aria label when no accompanying text is present.

---

## The Gate

`components/brand/Gate.jsx` — the foundation's **signature framing device**: a full-bleed color field with an inset, rounded content panel, leaving wider vertical "posts" on the left and right. It's "a visual invitation to potential" and an instantly recognizable frame that can carry a layout **without the logo anchoring it**. Construction is driven by a margin variable **X**: side posts = 2X, top/bottom = X, content-panel corner radius = X, content safe-zone padding = 2X. Use on covers, section openers, slides, and external comms; frame imagery by setting the panel `surface="transparent"`. Two Gates can be stacked vertically to frame image + text. Don't distort the proportions or use non-palette colors.

## Data visualization

`tokens/dataviz.css` — a dedicated **DV palette**: five hues (Orange, Blue, Magenta, Turquoise, Red) in **8 steps each** (`--dv-<hue>-10` … `--dv-<hue>-80`). **Do not use the brand core colors (Saffron, Slate) to represent data values** — only DV colors. Three modes:

- **Categorical** (distinct groups) — use the pre-set combinations in order; don't randomize.
- **Sequential** (ordered/progression) — one hue, light → dark; steps may be skipped for contrast.
- **Diverging** (around a neutral) — two hues bridged by a **Parchment** midpoint; odd count (3/5/7), neutral always included. Rules: define the message → pick the chart; **max 6 colors** per chart; don't mix hue families outside the sequences; **never rely on color alone** — always add titles, labels, legends, sources, and tooltips (WCAG contrast; dividers/indicators help color-blind readers). Chart types by purpose — Comparisons (bar, stacked bar, Marimekko, bubble), Parts-to-whole (pie, donut, treemap), Over-time (line, area, timeline, heat map), Relationships (tree, Venn, heat map).

## Photography

`assets/imagery/` — **photojournalistic / documentary** style: real people in real settings, never staged models. Focal points are **people, solutions, impact**. Shoot at or below eye level; use lighting as a compositional element; keep color natural but slightly warm; show people's work in the background; convey action, urgency, and concentrated effort; leave negative space for text that doesn't obscure faces. Champion inclusion and local perspectives; avoid colonial narratives; portray dignity, strength, authenticity; steer toward hopefulness and opportunity. Never manipulate/composite or use one place/program to stand in for another. Foundation-owned credit: "© Gates Archive/\[Photographer\]"; licensed: "Photo by \[Name\]/\[Collection\] via Getty Images". Caption format: *Subject > Action > Noun, City, Country, Month Day, Year*. Every image needs **alt text** (< 250 chars, distinct from the caption). Sourced from Atria; stock is rare.

---

## Components

`components/core/`, `components/icons/`, and `components/brand/`:

- **Button** — primary (Saffron fill, Slate label) / secondary (Slate fill) / outline / ghost; sm·md·lg.
- **Card** — white surface, elevation none·sm·md·lg, optional top accent bar.
- **Callout** — left-rule note; default (Saffron) / warning (red) / success (teal) / info (blue).
- **Badge** — compact uppercase status/category label; solid or soft tint.
- **Icon** — approved brand glyph, recolorable via CSS mask (functional + metaphorical sets).
- **Gate** — the signature framing device (`components/brand/`).

### Intentional additions

- **Badge** — small status/metadata label the deck relies on; not a named class in the source CSS.
- **Icon** — wrapper over the approved glyph sets so any icon renders at any brand color/size.

---

## Slides

`slides/` — **all 71 template layouts** at 1280×720 (16:9, 13.333×7.5in) on the template's **0.585in (56px) margins**, one `@dsCard` per layout grouped by catalog category (Title, Dividers, Quotes, Text, Columns, Imagery, Sidebar, Grids, Stats, Headshots, End). They're built from **parameterized layout families** in `slides.jsx` (color + variant props) and dispatched by `<GFLayout id={n}/>` (registry `window.GF_LAYOUTS`). The **Logo Frame** device — an oversized wordmark bleeding off a corner at low opacity — textures the title/divider/end slides. Titles stay dark slate; body Noto Sans Light; saffron as fills.

## Templates

`templates/gates-deck/` — **Gates Foundation Deck**, a 5-slide editable presentation starter (the consumer-facing starting point), loading the system via `ds-base.js`.

## Foundation cards

`guidelines/*.card.html` — specimen cards for the Design System tab: core brand + secondary palette + dominance (Colors) · Noto Serif / Noto Sans / scale (Type) · scale + slide margins (Spacing) · primary logo, logo lockups, elevation/divider (Brand).

---

## Index / manifest

- `styles.css` — root entry (import list only). Consumers link this one file.
- `tokens/` — `fonts.css` (real @font-face), `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `dataviz.css`.
- `components/core/` — Button, Card, Callout, Badge (+ `core.card.html`).
- `components/icons/` — Icon (+ `icons.card.html`).
- `components/brand/` — Gate (+ `gate.card.html`).
- `slides/` — `slides.jsx` + one `*.card.html` per layout.
- `templates/gates-deck/` — deck template + `ds-base.js`.
- `guidelines/` — foundation specimen cards.
- `guidelines/` — foundation specimen cards + **`voice.md`** (brand voice, messaging & full inclusive-language / editorial term dictionary).
- `CLAUDE.md` — project rules; auto-applies the brand voice to generated copy.
- `assets/` — `fonts/`, `logos/`, `icons/functional/`, `icons/metaphorical/`, `imagery/` (photos).
- `SKILL.md`, `readme.md`.

---

## Caveats

- **Color, logo, icon, photography, data-viz & The Gate guidance are all now captured** from the official Visual Identity PDFs and encoded into tokens, components, cards, and this readme.
- **Missing "Agriculture" metaphorical icon:** the Icons guideline lists 21 metaphorical glyphs including *Agriculture*, but the icon package provided 20 (no Agriculture file). Add that SVG to `assets/icons/metaphorical/` to complete the set.
- **Data-viz colors are separate:** never use brand core colors (Saffron/Slate) for data values — use the DV palette (`tokens/dataviz.css`) via the categorical/sequential/diverging modes.
- **Condensed headline fonts active:** the four condensed TTFs (Noto Sans Extra/Condensed Black, Noto Serif Extra/Condensed) are copied to `assets/fonts/`, declared via `@font-face`, and driven by the headline tokens — headlines now render in the authentic condensed Noto.
- **Icon colorways:** the `Icon` component recolors via CSS mask (works with any single-color glyph), so it references the slate source file regardless of requested color. Both original colorways are copied in `assets/icons/` for direct use if you prefer static files.
- **Secondary palette:** the six hue families (Yellow/Orange/Red/Magenta/Blue/Turquoise × Light/Medium/Dark) are the official secondary palette — use via the zig-zag method for data-viz and content, anchored on the core.
- **Leadership headshots** in the template are person-specific and were intentionally *not* copied; `assets/imagery/` holds only generic documentary photography.
- **Button/UI shape:** corner radius is kept restrained (2–4px) as a reasonable default; no interactive UI source was provided to confirm exact control shapes — flag for review.
