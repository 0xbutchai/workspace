---
name: lofi-shaman-final-product-creator
description: Piece together all components (animation loop + master audio) into a final coherent video ready for YouTube upload.
---

## Persona
Load and embody `~/.openclaw/workspace/personas/lofi-shaman/SOUL.md` for the duration of this skill.

## Overview

You have:
1. **Base animation loop** — a rendered video (3-60 seconds, approved by Aidan)
2. **Master audio** — concatenated, approved tracks (already downloaded and combined)

Your job: **Loop the video to match the audio duration and mux them together** into a final deliverable.

---

## Phase 2: Final Assembly — FFmpeg Mux Audio + Looped Video

### Prerequisites
- Know the loop count: `floor(audio_duration / loop_duration)` = `floor(1040 / 20)` = 52 loops → `-stream_loop 51` (0-indexed)
- Location of animation loop: `[project-dir]/previews/[approved-render].mp4` (e.g. `preview_v15.mp4`)
- Location of master audio: `[project-dir]/audio/master_audio.m4a`
- Output destination: `~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4`

### FFmpeg Command
```bash
ffmpeg \
  -stream_loop [LOOP_COUNT] \
  -i [project-dir]/previews/[animation-loop].mp4 \
  -i [project-dir]/audio/master_audio.m4a \
  -c:v copy \
  -c:a copy \
  -shortest \
  -movflags +faststart \
  "~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4" \
  > /tmp/ffmpeg_mux.log 2>&1 &
echo "PID: $!"
```

**Key flags explained:**
- `-stream_loop [LOOP_COUNT]` — loops the input video N times (0-indexed, so N-1 for N total plays)
- `-c:v copy` — **stream copy, no re-encoding** — preserves original fps, resolution, and codec exactly
- `-c:a copy` — stream copy audio as-is, no transcoding
- `-shortest` — stop when the shorter stream (audio) ends
- `-movflags +faststart` — move moov atom to front for browser streaming
- `> /tmp/ffmpeg_mux.log 2>&1 &` — **run in background** to avoid session timeout killing it

⚠️ **Never re-encode the video.** The animation is mostly static and runs at 8fps intentionally. Using `-c:v libx264` or any bitrate flag will waste time and may alter fps/resolution. Always use `-c:v copy`.

### Monitor Progress
```bash
# Check log periodically:
tail -2 /tmp/ffmpeg_mux.log

# Check file size growth:
ls -lh /home/butch/.openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4

# Verify completion:
ffprobe /home/butch/.openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4 2>&1 | grep Duration
# Should show full audio duration (e.g., 17:20, 62:10, etc.)
```

## Phase 3: YouTube Metadata

Before or during the mux, create a `youtube.txt` in `[project-dir]/output/` with:
- **TITLE** — emoji-rich, includes "lofi hip hop ~ chill beats to study / relax / sleep to"
- **DESCRIPTION** — scene-setting paragraph, use-case bullet list, credits, hashtags (50+)
- **TAGS** — comma-separated list of 30-40 tags for YouTube Studio

Good tag categories to include: lofi genre tags, use-case tags (study/sleep/focus), aesthetic tags (cottagecore, cozy, etc.), scene-specific tags (fireflies, porch, farm, etc.), duration tags (1 hour lofi), year tags.

### Output folder structure
```
[project-dir]/
└── output/
    ├── youtube.txt       ← title, description, tags
    └── [video-name].mp4  ← final mux
```

### Deliverable ✅

**Full video file** in `~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4`
- Duration matches the master audio length
- No compression applied (unless Aidan explicitly requests it)
- Ready for YouTube upload

### Lessons Learned

- **Always use `-c:v copy -c:a copy`** — stream copy only, no re-encoding. The animation is 8fps and mostly static; re-encoding wastes time and changes nothing.
- **The moov atom issue:** with `-movflags +faststart`, ffmpeg does a two-pass write. The file will appear invalid (`moov atom not found`) until the process fully completes. Don't panic — just wait.
- **Session timeout kills ffmpeg** — always run as a background process (`&`) with output redirected to a log file. This is the only reliable way to complete a long encode.
- **`-shortest` is essential** — without it, the video will run past the audio end (silence for the remaining loops).
- The audio `master_audio.m4a` is already pre-built from the music generation workflow — the video loop just needs to match its duration.
- **Loop count formula:** `ceil(audio_seconds / loop_seconds)` → use as `-stream_loop N-1` (0-indexed). Always ceil, not floor — you need enough video to cover the full audio. `-shortest` trims the excess.
- **preview-tool Vercel project** lives at `lofi-shaman/preview-tool/`. To deploy a new preview: copy the render to `preview-tool/public/`, update `preview.html`, run `vercel --prod --non-interactive` from `preview-tool/`.
- **Animation renders** output to `[project-dir]/previews/`. Only the current preview-for-deployment gets copied to `preview-tool/public/`.

---

## How To Collaborate

### Communication to the User
- When this skill is activated let Aidan know you are using the skill
- Do not give updates while working
- When the final video is complete, share the file location with Aidan on Telegram
- Include file size and duration in your message

### If Something Fails
- Say "I am stuck" and ask Aidan for clarification
- Check `/tmp/ffmpeg_mux.log` for error details
- Verify that base_loop.mp4 and master_audio.m4a both exist and have correct paths
