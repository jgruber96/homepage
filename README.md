# homepage

Personal homepage: ray-traced black hole hero, glowing project cards, and a drifting astronaut. Light/dark follows the visitor's system setting (with a toggle).

## Files

| File | What it is |
|---|---|
| `index.html` | Page content: intro, about, contact (plain HTML) |
| `projects.js` | **The project cards.** A commented list; add, remove or reorder projects here |
| `astronaut.js` | The floating astronaut. **His speech lines are at the top** |
| `blackhole.js` | The WebGL black hole in the hero |
| `main.js` | Theme toggle, clock, builds the project cards, card glow, nav highlight, starfield |
| `style.css` | All styling; colour and font variables at the top |
| `favicon.ico`, `favicon.png`, `icon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` | Site icon for tabs, bookmarks and phone home screens |
| `config.js` | Settings for the old terminal design; no longer used by `index.html` |

Not part of the live site (don't upload these when publishing):

- `startpage.html` — the original private browser start page
- `index-light.html` — the earlier light-only design
- `backup/index-single-file.html` — the site as one file, before the split

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000   # then visit http://localhost:8000
```

## 404 page

`404.html` is the custom 404 page: same amber terminal look, a drifting astronaut with a loose data cable, and a tiny shell (`cd ~` goes home). It's self-contained (inline CSS/JS) so it works at any broken URL depth, and it shares the light/dark choice with the homepage.

Netlify, Cloudflare Pages and GitHub Pages pick up `404.html` automatically. On your own server or reverse proxy (nginx, Zoraxy, etc.), point the 404 error page at `/404.html`.
