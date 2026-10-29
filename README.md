# homepage

Personal homepage: hacker-style terminal look, amber theme, light/dark that follows the visitor's system setting.

## Files

| File | What it is |
|---|---|
| `index.html` | Page content (intro, bio, project cards, contact) |
| `style.css` | All styling; colour tokens at the top |
| `main.js` | Shell, matrix rain, light/dark toggle, clock, stats |
| `favicon.ico`, `favicon.png`, `icon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` | Site icon (amber `>_` prompt) for tabs, bookmarks and phone home screens |
| `config.js` | **Your settings** — handle, links, lines of code, random list, timing |

Not part of the live site (don't upload these when publishing):

- `startpage.html` — the original private browser start page
- `index-light.html` — the earlier light-only design
- `backup/index-single-file.html` — the site as one file, before the split

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000   # then visit http://localhost:8000
```

## Shell commands

`help` · `about` · `projects` · `contact` · `neofetch` · `theme light|dark|amber|green|cyan` · `matrix` · `ls` · `cat` · `clear`

## 404 page

`404.html` is the custom 404 page: same amber terminal look, a drifting astronaut with a loose data cable, and a tiny shell (`cd ~` goes home). It's self-contained (inline CSS/JS) so it works at any broken URL depth, and it shares the light/dark choice with the homepage.

Netlify, Cloudflare Pages and GitHub Pages pick up `404.html` automatically. On your own server or reverse proxy (nginx, Zoraxy, etc.), point the 404 error page at `/404.html`.
