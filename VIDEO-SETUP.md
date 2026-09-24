# Adding the video

Name it **`for-her.mp4`** and put it in **`public/video/`** — that exact name,
that exact folder. The page looks for `video/for-her.mp4`, set as `VIDEO.src`
in [`src/content.ts`](src/content.ts) if you'd rather call it something else.

This file lives at the repo root on purpose: anything inside `public/` gets
copied into the built site and served publicly, and setup notes don't belong
there.

## It almost certainly needs compressing first

**GitHub rejects any single file over 100 MB.** A 6–7 minute video straight
off a phone is usually 500 MB–1.5 GB, so committing it as-is will fail the
**push** — not the build — and the error message isn't obvious about why.

One command. This takes a 6–7 minute clip down to roughly 40–70 MB, which is
both under the limit and actually loadable on her phone's data:

```bash
ffmpeg -i input.mp4 -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow \
  -c:a aac -b:a 128k -movflags +faststart public/video/for-her.mp4
```

Check the size before committing:

```powershell
(Get-Item public\video\for-her.mp4).Length / 1MB      # Windows
```
```bash
ls -lh public/video/for-her.mp4                        # macOS / Linux
```

Still over ~90 MB? Raise `-crf` (try 28, then 30 — higher means smaller and
softer), or drop the resolution to `scale=-2:540`.

### Why `-movflags +faststart` matters

It moves the file's index to the front, so playback can start while the rest
is still downloading. Without it she taps play and stares at a black frame
until the entire file has arrived — which on mobile data is a long time.

### No ffmpeg?

Windows: `winget install Gyan.FFmpeg`. Otherwise any online compressor works
— aim for 720p and under 90 MB.

## If it won't fit under 100 MB

Upload it unlisted to YouTube or Google Drive and link to it instead. Say the
word and the cover can be pointed at a link rather than a local file.

## Checking it worked

1. `start.bat`
2. Scroll past the photos to **One More Thing To Watch**
3. Tap the cover — the song should fade out as the video starts, and fade
   back in when it ends

If the cover taps through to a black frame with no sound, the file name or
folder is wrong; the section shows *"This one didn't load"* underneath when
the browser can't find it.
