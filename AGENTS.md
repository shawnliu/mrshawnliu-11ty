# AGENTS.md

Context for any AI assistant working in this repo. Read this first, then the doc for the project you're touching.

## What this is

The source for **mrshawnliu.com**, Shawn Liu's personal site. Shawn is an artist and designer in Brooklyn who draws, paints, and mails art to strangers. The site shows his work and is meant to be a creative medium in its own right. It's built slowly, by hand, and kept simple.

## Stack

- [Eleventy](https://www.11ty.dev/) 3, converted from an older Jekyll site.
- Templates: Nunjucks (`.njk`), plus HTML and Markdown processed with Nunjucks.
- Styles: `css/main.scss`, compiled by the `sass` package through a custom extension in `.eleventy.js`.
- Dates: `luxon`.
- Output: `_eleventy-output/` (git-ignored).
- Remote: `github.com/shawnliu/mrshawnliu-11ty`.
- Hosting: Netlify (`mrshawnliu.netlify.app`), serving mrshawnliu.com. There's no `netlify.toml`; build settings live in the Netlify dashboard. How it deploys isn't recorded. There's no `.netlify` folder (so it wasn't linked with the Netlify CLI from here); most likely Netlify builds from GitHub `main`, or it was uploaded by hand. Confirm in Netlify (Site configuration → Build & deploy) before deploying, and update this line.

## Commands

```sh
npm start        # local dev server with live reload
npm run build    # build into _eleventy-output/
```

## Layout

| Path | What |
|---|---|
| `.eleventy.js` | Config: passthrough copies, filters, collections, Sass |
| `_data/` | Global data: `site.json`, `nav.json`, `postcards.json`, `postcardRanges.json` |
| `_includes/` | `head.html`, `footer.html`, `zz-footer.html` |
| `_layouts/` | `default`, `page`, `posts`, `postcard`, `zoomzoom`, `zoomzoom-index` |
| `index.html` | Homepage |
| `about.md`, `today.md`, `ig.html` | Standalone pages |
| `april-12-2026.html` | Page for the April 12, 2026 mail art project |
| `postcards/` | 100 Postcard Paintings archive and detail templates |
| `zoomzoom/`, `posts/zoomzoom/` | Zoom Zoom Drawing Club (an online drawing club Shawn hosted, 2022–23) |
| `assets/` | Images (passthrough-copied) |
| `docs/`, `AGENTS.md`, `CLAUDE.md` | Notes for people and assistants; not built (see `.eleventyignore`) |

## Projects

- **100 Postcard Paintings**: active. Full history, data model and decisions: [`docs/100-postcard-paintings.md`](docs/100-postcard-paintings.md).
- **April 12**: a mail art project becoming a book. Announce on the site when the book is done.
- **Zoom Zoom Drawing Club**: archive pages exist; to be finished.
- **Neophyte**: Shawn's zine (about seven years, 12–13 issues). Possibly an archive here; old material is on Patreon, which Shawn wants to move off.
- **Newsletter**: Buttondown. The homepage mentions a newsletter but has no signup form yet.

## Working here

- Don't rebuild the site or add a framework. Extend what's here.
- Keep it quiet and plain: no recipient names, no tracking.
- Work on a branch; check `git status` first, since there may be uncommitted work.
- When you finish a meaningful change, update the relevant doc in `docs/` (and this file if the structure changes) so the next assistant can pick up where you left off.
