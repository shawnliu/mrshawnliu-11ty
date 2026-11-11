# 100 Postcard Paintings: project summary

Adding **100 Postcard Paintings** to the existing mrshawnliu.com Eleventy site, without rebuilding the site or introducing a new framework.

## Concept

An archive of 100 physical postcard-sized acrylic paintings and their journeys.

- Every position from **#001 through #100** appears in the archive.
- A postcard gets a data record once it has been painted.
- Unpainted positions stay visible as muted, non-clickable numbers.
- Painted postcards get automatically generated individual pages.
- The archive emphasizes the collection gradually filling up over time.

## URLs

Main route: `/100-postcard-paintings/`

All 100 positions are on that one page (Nov 2026). The earlier five range pages (`/21-40/` etc.) were dropped before ever being published. Each position has an anchor (`#001`…`#100`); postcard pages link back to their spot.

Individual pages: `/100-postcard-paintings/001/`, `/100-postcard-paintings/002/`, and so on. Only painted postcards have pages; there are no empty detail pages.

## Data model

Postcards live in `_data/postcards.json`. A record can contain:

```json
{
  "id": 8,
  "title": "melted",
  "painted": "2026-05-18",
  "mailed": "2026-05-31",
  "destination": "Cantabria, Spain",
  "status": "received",
  "painting": {
    "image": "/assets/images/100postcards/008.jpg",
    "thumbnail": "/assets/images/100postcards/thumbnails/008.jpg"
  },
  "received": {
    "image": "/assets/images/100postcards/008-received.jpg"
  },
  "notes": "melted popsicle"
}
```

All optional fields are handled gracefully. Decisions:

- No recipient names are published.
- `destination` is plain text.
- Received dates are not tracked.
- "Untitled" only appears when explicitly entered; a missing title stays blank.
- Notes appear as plain text.

## Statuses

`painted`, `in_transit`, `received`, `missing`, `held`.

- An unpainted postcard has no record (there is no `pending` status).
- `missing`: mailed, but it never arrived or the recipient never got back in touch. It can still have a scan.
- `held`: a painting the artist is keeping or isn't ready to send. More detail can go in `notes`.

## Spreadsheet transcription

The original spreadsheet was transcribed into records for **#001–#044**, including paintings not yet mailed or scanned.

- Gray spreadsheet rows were read as missing: #015, #024–027, #032.
- Corrections: "melted popsicle", "Manning, Australia".
- #039 keeps a record even though it was mailed before being scanned. Its image can come later from an altered photograph or a recipient's scan.
- At transcription: 44 records (12 painted, 26 received, 6 missing).

## Archive page design

- All 100 positions in numerical order, on one page.
- Full postcard thumbnails, never cropped.
- Empty positions muted and not clickable.
- Postcard numbers centered beneath each image or empty position; a small dot after the number marks received postcards, with a key above the grid.
- Cards at least 100px wide, as many columns as fit (`repeat(auto-fill, minmax(100px, 1fr))`: 8 across at full width, 3 on a phone). Hover or keyboard focus draws a light 1px frame (`--color-hr`, #ccc) 5px outside the card and number (`outline-offset`, so nothing shifts), in 2:3 cells since most cards are portrait. (Was 2/3 columns at 3:2 before Nov 2026.)
- Goal: it should feel like a wall of postcards, not a product or portfolio grid.

## Individual postcard pages

Generated from the JSON data. Each shows: permanent number, optional title, painted and mailed dates, destination, status, optional notes, the original scan, and an optional received photograph.

The received photograph may be the more important record of the project's journey, so when one exists:

- The received photograph comes first, in the larger column.
- The original scan sits beside it as a smaller archival reference.
- Both keep their natural proportions; neither is cropped or forced to match the other's height.
- Quiet labels: "Received" and "Original".
- On mobile they stack, received first.
- Metadata and notes go beneath the images.

With no received photograph, the original scan is the primary image.

## Images

```text
assets/images/100postcards/
├── 002.jpg
├── 002-received.jpg
├── _inbox/         (raw files dropped here; git-ignored, filtered out of the build)
└── thumbnails/
    └── 002.jpg
```

Public URLs: `/assets/images/100postcards/002.jpg`, `/assets/images/100postcards/002-received.jpg`, `/assets/images/100postcards/thumbnails/002.jpg`.

The `assetExists` filter in `.eleventy.js` leaves out image elements for files that don't exist yet, so records stay usable while images are being prepared.

### Adding images (Nov 2026)

Drop raw files into `assets/images/100postcards/_inbox/` with the postcard number anywhere in the name, then run `bash scripts/process-postcards.sh`:

- a name with `thumb` → thumbnail (Shawn crops these to the painted area himself), 400 px
- a name with `received` or `rcvd` → recipient's photo, 2000 px
- anything else → the scan with the paper edge, 1600 px

Sources are then moved into `_originals/100postcards/` (git-ignored, never published); the inbox folder stays, empty. Needs ImageMagick (`convert`). If a record lacks the matching `painting`/`received` path, add it to `_data/postcards.json`.

### Recommended sizes

- **Thumbnails:** 400 px on the longest edge (the grid shows cards at 80–110 CSS px wide, all 100 on one page; ~30 KB each).
- **Original scans:** 1600 px on the longest edge (e.g. 1067 × 1600 portrait). sRGB JPEG, 85% quality, roughly 400–550 KB.
- **Received photographs:** 2000 px on the longest edge, natural orientation and composition.

## Files

Added:
- `_data/postcards.json`
- `_layouts/postcard.html`
- `postcards/archive.njk`
- `postcards/postcard.njk`
- `assets/images/100postcards/` and `assets/images/100postcards/thumbnails/`
- `scripts/process-postcards.sh`
- `redirects.11ty.js` and `legacy/` (for the switch from Jekyll; see Status)

Modified:
- `.eleventy.js`: postcard formatting, lookup, range, URL and image-existence filters (`postcardId`, `postcardDate`, `postcardStatus`, `postcardById`, `numberRange`, `postcardArchiveUrl`, `assetExists`); passthrough for `legacy/`; inbox filtered out of the `assets` passthrough; `11ty.js` added to template formats.
- `css/main.scss`: archive and detail-page styles.
- `index.html`: homepage link to "100 Postcards".

Removed: the old placeholder `100-postcard-paintings.html`; the archive template now generates that route.

## Status

As of Nov 8, 2026:

- Work is on branch `feature/100-postcard-paintings`, still uncommitted and undeployed.
- The archive is now one page with all 100 positions (`postcardRanges.json` and the range pages were dropped; they were never published). Cards are at least 100px wide (8 across), in 2:3 cells. A dot after the number marks received postcards, with a key above the grid.
- Scans and thumbnails exist for #001–#020; received photos for #002, #004–#009, #011–#014, #016, #018–#020.
- Ready for the switch from the Jekyll site (`shawnliu.github.io`): `redirects.11ty.js` writes `/x.html` forwarders for every page, and old standalone Jekyll pages (Israel, fun/*, favorite albums, 2021 posts) are copied as-is from `legacy/`. Hosting will be Netlify (already connected to this repo), not GitHub Pages.
- The original project spec is outside this repo, on Shawn's Mac: `~/Documents/ChatGPT/100 Postcard Paintings/100-postcard-paintings-spec.md`.

## Next

- Commit and push.
- Scans and thumbnails for #021–#023, #028–#031, #033–#044.
- Merge into `main`: Netlify builds `main` to https://mrshawnliu.netlify.app (checked Nov 11: Netlify serves this repo's Eleventy build there), so that's the full preview. Then point mrshawnliu.com at Netlify; today it's served by GitHub Pages from the Jekyll repo `shawnliu.github.io`.
- Records for the newer postcards (#045 onward); remaining received photographs.
- The project announcement is planned for around 70 postcards, sent as a last email to the Zoom Zoom Drawing Club list on Buttondown.
