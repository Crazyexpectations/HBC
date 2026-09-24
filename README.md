# Happy Birthday, Cherry 💌

A one-page, interactive birthday website: a "do you love me?" gate, then a
scroll-driven story — hero, photo memories, the letter, the things I'll
always love about you, a memory game and five wishes she unwraps, a blowable
birthday cake, a wish lantern she lets go, and a closing scene. Built with
React + TypeScript + Vite, Three.js/React Three Fiber, GSAP, Framer Motion,
and Lenis.

**The page's tone follows the letter, not the other way round.** The letter
is a letting-go letter — *"you don't owe me a relationship"*, *"I hope
Ireland gives u some happiness"* — so the sections around it were rewritten
to agree with it. If you rewrite the letter into something else, reread
`WISHES`, `ENDING`, `SURPRISE`, `REASONS` and `CAKE.afterMessage` too, or
the page will start arguing with its own centrepiece.

`WISHES` is the one block that is deliberately *not* a restatement of the
letter. The letter's hopes are the general ones ("I hope u meet good
people"); the five wishes are the specific ones — her stress, her friends,
the house, her health. Keep them specific. Generic wishes there would just
be the letter again in a smaller font.

Nothing on the page has a failure state. That's deliberate: the letter
promises her birthday won't be a day she has to answer for anything, and a
quiz she can score badly on would have broken that promise on the same
screen.

## Quick start

**Windows:** double-click **`start.bat`**. It installs dependencies on the
first run, starts the server on <http://localhost:5173/>, and opens your
browser. Leave that window open while you work — edits to `src/content.ts`
appear instantly, no restart. Close it (or press Ctrl+C) when you're done.

**`stop.bat`** is only needed if the server is still running somewhere you
can't reach — e.g. you closed the window without stopping it, and `start.bat`
now complains the port is in use. It stops whatever is listening on ports
5173/4173 and nothing else.

Any platform, from a terminal:

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. `npm run build` produces a static site in
`dist/` — that's all a static host (like GitHub Pages) needs.

There is **nothing left as a placeholder** — every word on the page is
written. Read it once end to end before you send the link, then send it.

## Make it actually yours — edit this file

**[`src/content.ts`](src/content.ts)** is the only file you need to touch
for text. Everything is there and commented:

- `WISHES` — the five sealed cards she opens; the last one unlocks the gift
  box. Add or remove items freely, the counter and the unlock read off the
  array's length
- `HER_NAME`, `YOUR_SIGNATURE`
- `LOVE_LETTER` — the letter (see below)
- `REASONS` + `REASONS_HEADING` — the "Things I'll Always Love About You" cards
- `HERO`, `LETTER`, `MEMORIES_HEADING`, `GAMES_HEADING` — the headings and
  hints on those scenes
- `CAKE`, `SURPRISE`, `ENDING` — the short copy in those sections
- `DEFAULT_CAPTIONS` — one caption per photo, in the same order as the
  files in `All images/`

Nothing else in the codebase needs to change for a content-only edit.

### Writing the letter

`LOVE_LETTER` is an array of blocks, one paragraph gap between each. Two
conventions, both documented inline in the file:

```ts
lines('I hope u meet good people',       // these stack tightly, no gap
      'I hope u laugh until your stomach hurts'),

'## Happy birthday Cherry ❤️',            // big, centred, handwritten
```

Use `## ` sparingly — two or three lines in the whole letter. It's what
makes them land.

The letter used to type itself out character by character. At forty-odd
blocks that would have been over a minute of watching a cursor before she
could read a word, with no way to scroll back over a line, so it's a real
sheet of paper now: everything is there, and blocks fade up as she reaches
them. Length costs nothing — write as much as you want.

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

`index.html` already sends `noindex, nofollow, noarchive` and `no-referrer`,
so the page stays out of search results and doesn't leak its own URL to
anything it links to. The link preview card is text-only **on purpose** —
adding an `og:image` would push one of her photos into the thumbnail cache
of every chat app the link passes through.

## The video

There is a video section after the photos. It's sealed behind a cover — a
framed black panel telling her to **turn her volume up** and **watch it till
the end** — and nothing about the video is visible or downloaded until she
taps it.

The file is committed at `public/video/for-her.mp4` — 720p, 8 min 14 sec,
77 MB, down from a 562 MB 1080p source. To replace it, see
[`VIDEO-SETUP.md`](VIDEO-SETUP.md): it has the exact ffmpeg command and the
reason for each flag.

⚠️ **Any replacement must be compressed first.** GitHub rejects single files
over 100 MB, and that failure happens on **push**, not on build.

Three details in the player that are easy to break:

- `preload="none"` — she will open this on mobile data. Nothing downloads
  until she taps.
- `play()` is called **synchronously inside the click handler**, before the
  state update. Browsers only let audio start from a real gesture; deferring
  that call past a render (or into `requestAnimationFrame`) loses the gesture
  and the video starts muted or not at all.
- `playsInline` — without it, iOS Safari yanks the video fullscreen the
  instant it plays.

### Ducking the song

The song never plays over something else. `audioHolds` in
[`useAppStore`](src/store/useAppStore.ts) is a list of named reasons the
music is currently held; the player fades out and pauses while it's
non-empty, keeps its position, and fades back in when the last hold clears.

Two things hold it:

- **the video**, for as long as it's playing
- **the cake**, while the mic is open

The cake one isn't politeness. `useMicBlow` decides a blow happened by
averaging the *low frequency* bins — exactly where the music sits — so a song
coming out of her phone speaker either masks her breath or trips the
threshold on its own.

It's a list rather than a boolean because those two can overlap, and a
boolean would let whichever finished first switch the song back on over the
other.

## Project structure

```
src/
  content.ts              ← edit this for all text
  index.css               ← design system: palette, type scale, reduced-motion
  App.tsx                 ← loading → gate → site state machine
  MainSite.tsx            ← the 9 sections, in order
  lib/motion.ts           ← shared motion vocabulary (see below)
  hooks/useReducedMotion.ts
  components/
    layout/               ← Section / SectionHeading / Reveal primitives
    gate/                 ← "do you love me?" screen
    hero/ letter/ memories/ video/ reasons/ games/ cake/ surprise/ ending/
      letter/Envelope.tsx      ← the envelope, and opening it
      letter/LetterPaper.tsx   ← the letter itself, word by word
      video/VideoSection.tsx   ← the sealed video + audio ducking
      surprise/LanternRelease3D.tsx
    three/                ← shared 3D bits (gift box, canvas wrapper)
    ui/                   ← shared small UI (buttons, floating emoji, stars)
scripts/optimize-images.mjs
```

## How the page is put together

**Sections.** Every scene renders through
[`components/layout/Section.tsx`](src/components/layout/Section.tsx), which
owns the background wash, grain, vignette and vertical rhythm. Two props do
most of the work:

- `tone` — where in the night the scene sits. The page runs
  `arrival → inside → warm → lit → dawn → close`, so scrolling travels from
  deep night to first light instead of repeating one gradient eight times.
- `density` — `full` / `tall` / `natural` / `compact`. Not every scene
  deserves a full viewport.

**Headings** come from
[`SectionHeading.tsx`](src/components/layout/SectionHeading.tsx) so the page
has one voice, with `align` and `variant` as the deliberate ways to differ.

**Motion** is centralised in [`lib/motion.ts`](src/lib/motion.ts) — shared
easing curves and variant builders (`riseIn`, `scaleIn`, `stagger`, …).
Wrap anything that should animate in
[`Reveal`](src/components/layout/Reveal.tsx) rather than hand-rolling
`initial` / `whileInView` per component.

**The letter section** is the one place `density` is dynamic. Closed, it's a
single centred envelope and gets `full`. Open, it's the longest thing on the
page — `full` would vertically centre a sheet several screens tall and leave
the opening lines stranded below the fold — so
[`LetterSection`](src/components/letter/LetterSection.tsx) switches it to
`natural` once the paper unfolds.

**The letter's words fly in as she scrolls**, a block at a time. That effect
is plain CSS — a `word-fly-in` keyframe plus a per-word `--i` delay, under
"THE LETTER" in [`index.css`](src/index.css) — driven by a single
`IntersectionObserver` in `LetterPaper.tsx` that adds `.is-visible` to a
block and then stops watching it.

It is deliberately *not* one Framer Motion component per word. The letter is
several hundred words long and she is reading it on a phone; several hundred
JS-driven animators is how you get a letter that stutters while she's trying
to read it. This way only `transform` and `opacity` animate, the compositor
does all of it, and once a word has landed nothing is running at all.

Two things in there are load-bearing and look like they could be tidied away:

- the literal `{' '}` text node between word spans. `inline-block` elements
  with no whitespace between them give the browser nowhere to wrap, which on
  a phone runs every line straight off the edge of the page.
- the reduced-motion override zeroing `animation-delay`. The global rule
  collapses *duration* but not *delay*, and a sixty-word block staggered at
  28ms would still take a minute and a half to finish appearing.

## Accessibility

`prefers-reduced-motion` is honoured throughout, and it's a single switch
rather than a per-component audit:

- `reduceVariants()` in `lib/motion.ts` strips every transform channel from
  React-driven animation, keeping only opacity.
- A global rule in `index.css` collapses all CSS animations/transitions, and
  removes purely decorative motion (`.motion-decorative`) outright rather
  than freezing it mid-screen.
- Lenis smooth scroll, the custom cursor, the confetti/fireworks, and the
  gate's fleeing "No" button all opt out.

Also: a skip link, visible focus rings, a focus-trapped lightbox that
restores focus on close, keyboard-reachable photos, and `aria-live` on the
gate teases and the gift-box unlock. Each wish card is a real `<button>`
carrying `aria-expanded`, so opening one is announced as a disclosure rather
than as silent decoration.

Two things that are 3D objects also exist as ordinary controls, because a
mesh inside a `<canvas>` can't be tabbed to and is fiddly to hit on a phone:
the envelope is a real `<button>`, and the lantern has a **let it go** button
under the scene that does exactly what tapping the lantern does.

## Notes

- Everything runs client-side — no backend, no build-time secrets.
- 3D scenes pause rendering when scrolled out of view, and reduce
  particle counts on touch devices, to keep things smooth on phones.
- The "No" button on the gate screen is intentionally unclickable — it
  flees the cursor/finger on approach (and stands still, still refusing,
  under reduced motion).
