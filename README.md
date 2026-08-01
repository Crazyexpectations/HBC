# Happy Birthday, Cherry 💌

A one-page, interactive birthday website: a "do you love me?" gate, then a
scroll-driven story — hero, photo memories, a love letter, reasons I love
you, a blowable birthday cake, a gift that opens into a ring, and a closing
scene. Built with React + TypeScript + Vite, Three.js/React Three Fiber,
GSAP, Framer Motion, and Lenis.

## Quick start

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. `npm run build` produces a static site in
`dist/` — that's all a static host (like GitHub Pages) needs.

## Make it actually yours — edit this file

**[`src/content.ts`](src/content.ts)** is the only file you need to touch
for text. Everything is there and commented:

- `HER_NAME`, `YOUR_SIGNATURE`
- `LOVE_LETTER` — the letter, one paragraph per line
- `REASONS` — the "Reasons I Love You" cards
- `CAKE`, `SURPRISE`, `ENDING` — the short copy in those sections
- `DEFAULT_CAPTIONS` — one caption per photo, in the same order as the
  files in `All images/`

Nothing else in the codebase needs to change for a content-only edit.

## Photos

Drop photos into the `All images/` folder (JPG/PNG/WebP), then run:

```bash
npm run optimize-images
```

This resizes/compresses everything into `public/images/`, **strips EXIF
data (including GPS location)** for privacy, and regenerates
`src/assets/photoManifest.json` in chronological (filename) order. Re-run it
any time you add, remove, or reorder photos — then update `DEFAULT_CAPTIONS`
in `content.ts` to match the new order/count.

The `All images/` and `song to use/` folders are git-ignored on purpose —
only the optimized output in `public/` gets committed.

## Music

`song to use/Headinclouds.mp3` is copied to `public/audio/song.mp3` and
loops for the whole site once she clicks "Yes". To change the song, drop a
new mp3 at `public/audio/song.mp3` (any filename — just keep that exact
path, or update the path in
[`src/components/audio/MusicPlayer.tsx`](src/components/audio/MusicPlayer.tsx)).

## Deploying to GitHub Pages

1. Create a **new, separate GitHub repo** for this site (don't reuse an
   unrelated repo — this project has its own git history).
2. From this folder:
   ```bash
   git init
   git add -A
   git commit -m "Happy birthday, Cherry"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → GitHub Actions**. That's it —
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
   deploys automatically on every push to `main`. The site will be live at
   `https://<you>.github.io/<repo>/`.

**Privacy note:** GitHub Pages sites are publicly reachable by anyone with
the link, even if the source repo is private. If you'd rather this not be
discoverable, keep the repo private and only share the Pages URL directly
with her (don't link it from anywhere public), or consider a host with
link-level access control instead.

## The video

`VID20230615104225.mp4` (112 MB) was left out — it's over GitHub's 100 MB
per-file limit and there was no video-compression tool available in the
build environment. To include a moment from it later: trim/compress it
(e.g. `ffmpeg -i input.mp4 -vf scale=-2:720 -crf 28 out.mp4`) down to a few
MB, drop it in `public/video/`, and add a `<video>` element wherever you'd
like it — e.g. inside the Memories section.

## Project structure

```
src/
  content.ts              ← edit this for all text
  App.tsx                 ← loading → gate → site state machine
  MainSite.tsx             ← the 7 sections, in order
  components/
    gate/                 ← "do you love me?" screen
    hero/ memories/ letter/ reasons/ cake/ surprise/ ending/
    three/                ← shared 3D bits (gift box, canvas wrapper)
    ui/                   ← shared small UI (buttons, floating emoji, stars)
scripts/optimize-images.mjs
```

## Notes

- Everything runs client-side — no backend, no build-time secrets.
- 3D scenes pause rendering when scrolled out of view, and reduce
  particle counts / disable bloom on touch devices, to keep things smooth
  on phones.
- The "No" button on the gate screen is intentionally unclickable — it
  flees the cursor/finger on approach.
