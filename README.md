# Quiet — hosting on GitHub Pages

This folder is a ready-to-host website. Once it's live, customers open Quiet from a link — no downloading or opening `.html` files — and can add it to their phone home screen with your feather icon.

## What's in here
- `index.html` — the Light journal (your home page)
- `dark.html` — the Nightfall (dark) journal
- `manifest-light.webmanifest` / `manifest-dark.webmanifest` — make each installable as an app
- `sw.js` — service worker so the app works offline after the first visit
- `icon-*`, `apple-touch-icon-*`, `favicon-48.png` — your home-screen icons (light + dark)

## Put it online (free, ~5 minutes)

1. Create a free account at github.com if you don't have one.
2. Click the **+** (top right) → **New repository**. Name it something like `quiet` (this becomes part of your URL). Set it to **Public**. Create it.
3. On the new repo page, click **uploading an existing file**.
4. Drag in **all the files from this folder** (not the folder itself — the files). Click **Commit changes**.
5. Go to the repo's **Settings** → **Pages** (left menu).
6. Under "Build and deployment", set **Source = Deploy from a branch**, **Branch = main**, **Folder = / (root)**. Click **Save**.
7. Wait 1–2 minutes, then refresh. GitHub shows your live link at the top of the Pages screen.

## Your links

With a repo named `quiet` and username `YOURNAME`:
- **Light version:**  `https://YOURNAME.github.io/quiet/`
- **Dark version:**   `https://YOURNAME.github.io/quiet/dark.html`

Give customers whichever you sold them (or both). Test the links on your own phone first.

## How customers add it to their home screen
- **iPhone (Safari):** open the link → tap the Share button → **Add to Home Screen**. Your feather icon and "Quiet" appear like an app.
- **Android (Chrome):** open the link → menu (⋮) → **Add to Home screen** / **Install app**.

After the first open it works offline, and each person's entries are saved privately on their own device.

## Updating later
To push a new version, just re-upload the changed file(s) in the repo and commit. Tip: if you change the app, bump `CACHE='quiet-v1'` to `quiet-v2` in `sw.js` so phones pick up the update.

## Note
GitHub Pages is free and reliable for this. If you'd rather not use GitHub, the same files work on Netlify (drag-and-drop) or Cloudflare Pages.
