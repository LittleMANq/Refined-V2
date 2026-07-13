# Today Screen — Art Direction Concepts

Three high-fidelity concept images of the Today (home) screen, generated 2026-07-13 with Higgsfield `nano-banana-pro` (2K, 9:16, Hebrew RTL layout). Same content in all three: greeting + date, 3:4 editorial hero photograph, stylist reasoning line, quick actions (regenerate / save / "why this?"), 5-tab bar (Today, Closet, Create, Stylist, You). Hebrew glyphs in the renders are approximate, layout only.

> **Note on the image files:** this session's network egress policy blocks the Higgsfield CDN host (`d8j0ntlcm91z4.cloudfront.net`), so the PNGs could not be downloaded into the repo from the remote environment. Run `./fetch-images.sh` from this folder on any normal network to place them, or grab them from the URLs below. The generations are also in the Higgsfield account history (job IDs listed per concept).

---

## Concept 1 — Editorial Ink
`concept-1-editorial-ink.png` · job `186b0c9e-5cfe-4850-962b-eb5a99b2b16a`
[Full-res PNG](https://d8j0ntlcm91z4.cloudfront.net/user_33u5nuYHdbDpVywvjjZ6eOtPaZK/hf_20260713_070314_186b0c9e-5cfe-4850-962b-eb5a99b2b16a.png)

- **Palette:** warm paper `#FAF7F2` field, deep ink `#1B1714` type and primary pills, antique gold `#B08953` exactly twice per screen (one gold word in the display headline, one gold ring / active-tab dot). An evolution of the current tokens, not a replacement.
- **Type:** oversized serif display (Frank Ruhl Libre weight class) for the look title with one word in gold, dramatic scale drop to a small refined sans (Heebo) for the reasoning line and labels. Hierarchy comes from scale contrast, magazine style.
- **Premium because:** it reads like a printed fashion editorial. The whitespace, the flat matte paper, the surgical gold, and the soft-shadow 3:4 photo card make the daily look feel like a magazine cover produced for one person.

## Concept 2 — Gallery
`concept-2-gallery.png` · job `bd68f3d1-3b16-409e-ba97-719b7fbaed53`
[Full-res PNG](https://d8j0ntlcm91z4.cloudfront.net/user_33u5nuYHdbDpVywvjjZ6eOtPaZK/hf_20260713_070339_bd68f3d1-3b16-409e-ba97-719b7fbaed53.png)

- **Palette:** museum white `#FFFFFF`, near-black `#111111`, warm grays only. Zero accent color in the chrome, the fashion photograph is the only color on screen.
- **Type:** one small sans family throughout, tiny letterspaced museum-placard labels (including a numbered caption row under the hero, "01 / הלוק של היום"), hairline dividers instead of cards, text-only quiet actions plus a single slim near-black pill.
- **Premium because:** extreme restraint. The UI disappears and presents the outfit like an artwork in a gallery, COS / Jil Sander energy. Luxury is expressed through silence and precision, not decoration.

## Concept 3 — After Dark
`concept-3-after-dark.png` · job `bf03dddc-a833-44bb-8acf-096323dc08a9`
[Full-res PNG](https://d8j0ntlcm91z4.cloudfront.net/user_33u5nuYHdbDpVywvjjZ6eOtPaZK/hf_20260713_070402_bf03dddc-a833-44bb-8acf-096323dc08a9.png)

- **Palette:** warm charcoal near-black `#17130F` (dark plaster / ebony, not tech dark-mode blue), cream `#F2E9DC` typography, muted antique gold confined to the active tab glow and one hairline detail.
- **Type:** elegant cream serif display for the look title over a whispering low-opacity sans reasoning line, hairline-bordered charcoal pills for actions.
- **Premium because:** cinematic low-key photography with a golden tungsten pool of light gives it a private members' club / Aesop-at-night intimacy. The screen feels like an evening ritual, not an app session.

---

## Concept 1B — Editorial Ink, Fitted-style item stack (revision)
`concept-1b-editorial-ink-fitted.png` · job `0a80287f-c310-4f63-9d1c-5fded482d131` · generated 2026-07-13
[Full-res PNG](https://d8j0ntlcm91z4.cloudfront.net/user_33u5nuYHdbDpVywvjjZ6eOtPaZK/hf_20260713_111522_0a80287f-c310-4f63-9d1c-5fded482d131.png)

Feedback round: the hero should read like Fitted, the outfit shown as **separate garment cutouts**, not one merged photograph.

- **Hero:** a tall warm-toned card holding a stacked collage of 4-5 isolated product cutouts in worn order (blazer, silk top, trousers, loafers + bag), each with clean edges and its own soft shadow, clearly separated pieces composing one look.
- **Palette & type:** same Editorial Ink system (paper `#FAF7F2`, ink `#1B1714`, gold `#B08953` twice per screen) with a Fitted-style italic serif accent word in the display title.
- **Premium because:** it keeps the magazine typography while making every piece feel ownable and tappable, the Fitted mental model with Refined's warmth.
- **Status:** rendered; one further generation (2 credits) remains in reserve for a correction pass.

---

## Translation notes (for the winning direction)

- All three keep the locked component grammar: full-width pills, 3:4 portrait hero, hairline dividers, generous whitespace, RTL right-aligned.
- Concept 1 maps 1:1 onto the existing tokens (paper / ink / gold) and mainly demands a typographic upgrade (serif display scale, gold-word treatment).
- Concept 2 would replace the warm palette with true white + near-black and drop gold entirely except possibly the paywall moment.
- Concept 3 could ship as an evening mode of Concept 1 (same gold, inverted surfaces) rather than a standalone identity.

## Credit usage

- Model: `nano-banana-pro` (billed as `nano_banana_2`), 2K, 9:16, 1 image per direction.
- Round 1: 3 generations × 2 credits = 6 credits (11.55 → 5.55). No retries needed (cap was 6 generations).
- Round 2 (Fitted-style revision): 1 generation × 2 credits (5.55 → est. 3.55). Total so far: **8 credits**, 4 of 6 allowed generations used.
