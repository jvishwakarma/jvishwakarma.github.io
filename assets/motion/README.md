# Motion assets

Drop exported videos here using these exact file names. Each one replaces the
animated placeholder in its slot automatically; no HTML changes needed. Until a
file exists, the slot keeps showing its built-in CSS animation.

To check which slot expects which file, open any page with `?slots` at the end
of the URL (for example `https://jvishwakarma.github.io/?slots`). Slots that are
still waiting for a video show their file name.

| File | Where it appears | Size | Length |
|---|---|---|---|
| `showreel.mp4` | Home, Motion section | 1920×1080 (16:9) | 45–60s, with sound |
| `e20-launch-loop.mp4` | Home, E20 campaign card | 1600×1000 (16:10) | 6–10s loop, silent |
| `risk-checks-sequence.mp4` | Home, Risk Checks card | 1600×1000 (16:10) | 6–10s loop, silent |
| `hrar-feature-drop.mp4` | Home, HRAR card | 1600×1000 (16:10) | 6–10s loop, silent |
| `e20-launch-film.mp4` | E20 campaign page, top | 1920×1080 (16:9) | 30–45s, with sound |
| `e20-social-9x16.mp4` | E20 campaign page, social | 1080×1920 (9:16) | 10–15s loop |
| `e20-social-4x5.mp4` | E20 campaign page, social | 1080×1350 (4:5) | 10–15s loop |
| `e20-social-1x1.mp4` | E20 campaign page, social | 1080×1080 (1:1) | 10–15s loop |
| `e20-landing-hero.mp4` | E20 campaign page, web | 1920×1200 (16:10) | 6s loop, silent |

## Export settings

- H.264 MP4, 30fps (60fps for fast UI motion), `yuv420p`, `+faststart`.
- Keep loops under 3 MB and films under 15 MB so the page stays fast.
  GitHub rejects files over 100 MB.
- Loops autoplay muted, so tell the story with captions, not voice-over.

Compressing an After Effects or Premiere master for the web:

```sh
# Silent loop
ffmpeg -i master.mov -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart e20-launch-loop.mp4

# Film with sound
ffmpeg -i master.mov -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart showreel.mp4
```

Videos only play while on screen, and never autoplay for visitors who have
turned on reduced motion; they get controls instead.
