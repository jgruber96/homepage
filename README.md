# homepage

Personal homepage: hacker-style terminal look, amber theme, light/dark that follows the visitor's system setting.

## Files

| File | What it is |
|---|---|
| `index.html` | Page content (intro, bio, project cards, contact) |
| `style.css` | All styling; colour tokens at the top |
| `main.js` | Shell, matrix rain, light/dark toggle, clock, stats |
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
