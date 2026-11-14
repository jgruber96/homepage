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

The previous terminal-style design is in the git history (commit `528300e`, before the redesign merged).

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000   # then visit http://localhost:8000
```

## 404 page

`404.html` is the custom 404 page: the "0" in 404 is the live black hole, plus the starfield, theme toggle and drifting astronaut from the homepage. It's self-contained (inline CSS/JS) so it works at any broken URL depth, and it shares the light/dark choice with the homepage.

Netlify, Cloudflare Pages and GitHub Pages pick up `404.html` automatically. On your own server or reverse proxy (nginx, Zoraxy, etc.), point the 404 error page at `/404.html`.
