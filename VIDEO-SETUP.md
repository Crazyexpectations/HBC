# The video

**It's already in place** at `public/video/for-her.mp4` — 720p, 8 min 14 sec,
77 MB. Nothing to do unless you want to replace it.

This file lives at the repo root on purpose: anything inside `public/` gets
copied into the built site and served publicly, and setup notes don't belong
there.

## Replacing it

Name the replacement `for-her.mp4` and put it in `public/video/`. The path is
set as `VIDEO.src` in [`src/content.ts`](src/content.ts) if you'd rather call
it something else.

**Compress it first.** GitHub rejects any single file over 100 MB, and a phone
recording is usually many times that — the 562 MB, 1080p, 9.3 Mbps source this
one came from is typical. That failure happens on **push**, not on build, and
the error doesn't explain itself.

ffmpeg is installed (`winget install Gyan.FFmpeg`, already done). The exact
command used for the current file:

```bash
ffmpeg -y -i input.mp4 -vf "scale=-2:720" -c:v libx264 -crf 24 -preset medium \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart public/video/for-her.mp4
```

562 MB → 77 MB, with no visible quality loss on a phone.

Check the size before committing:

```powershell
(Get-Item public\video\for-her.mp4).Length / 1MB
```

Over ~90 MB? Raise `-crf` (26, then 28 — higher means smaller and softer), or
drop to `scale=-2:540`. GitHub also prints a warning over 50 MB; that one is
cosmetic and the push still succeeds.

### Why each flag is there

- `-movflags +faststart` — moves the file index to the front so playback
  starts while the rest is still downloading. Without it she taps play and
  stares at a black frame until the whole file arrives.
- `-pix_fmt yuv420p` — anything else and iOS Safari refuses to decode it.
- `-profile:v high -level 4.0` — broad mobile hardware-decoder support.

## If a future one won't fit under 100 MB

Upload it unlisted to YouTube and say so — the section can be rewired to the
YouTube IFrame API, which still reports play/pause/ended, so the song ducking
keeps working.

**Not Google Photos or Drive.** Photos share links can't be embedded at all.
Drive embeds as a cross-origin iframe that reports no events, so the song
would keep playing underneath the video with no way to know when it ended.

## Checking it works

1. `start.bat`
2. Scroll past the photos to **One More Thing To Watch**
3. Tap the cover — the song should fade out as the video starts, and fade
   back in when it ends

If the cover taps through to a black frame, the filename or folder is wrong;
the section shows *"This one didn't load"* underneath when the browser can't
find the file.
