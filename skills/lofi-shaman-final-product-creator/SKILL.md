---
name: lofi-shaman-final-product-creator
description: Piece together all components (animation loop + master audio) into a final coherent video ready for YouTube upload.
---

## Persona
Load and embody `~/.openclaw/workspace/personas/lofi-shaman/SOUL.md` for the duration of this skill.

## Overview

You have:
1. **Base animation loop** — a rendered video (3-30 seconds, approved by Aidan)
2. **Master audio** — concatenated, approved tracks (already downloaded and combined)

Your job: **Loop the video to match the audio duration and mux them together** into a final deliverable.

---

## Phase 2: Final Assembly — FFmpeg Mux Audio + Looped Video

### Prerequisites
- Know the loop count: `floor(audio_duration / loop_duration)` = `floor(1040 / 20)` = 52 loops → `-stream_loop 51` (0-indexed)
- Location of base loop: `[project-dir]/animation/base_loop.mp4`
- Location of master audio: `[project-dir]/audio/master_audio.m4a`
- Output destination: `~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4`

### FFmpeg Command
```bash
ffmpeg \
  -stream_loop [LOOP_COUNT] \
  -i [project-dir]/animation/base_loop.mp4 \
  -i [project-dir]/audio/master_audio.m4a \
  -c:v libx264 \
  -b:v 350k \
  -preset fast \
  -c:a aac \
  -shortest \
  -movflags +faststart \
  "/home/butch/.openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4" \
  > /tmp/ffmpeg_mux.log 2>&1 &
echo "PID: $!"
```

**Key flags explained:**
- `-stream_loop [LOOP_COUNT]` — loops the input video N times total (original + N-1 repeats)
- `-map 0:v -map 1:a` — video from input 0, audio from input 1
- `-c:v libx264 -b:v 350k` — re-encode video at 350kbps (produces ~61MB for 17:20)
- `-shortest` — stop when the shorter stream (audio) ends
- `-movflags +faststart` — move moov atom to front for browser streaming
- `> /tmp/ffmpeg_mux.log 2>&1 &` — **run in background** to avoid session timeout killing it

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

### Deliverable ✅

**Full video file** in `~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4`
- Duration matches the master audio length
- No compression applied (unless Aidan explicitly requests it)
- Ready for YouTube upload

### Lessons Learned

- **Never use `-c:v copy`** for the final mux when combining with stream_loop — the output will be ~134MB (too large for Vercel). Always re-encode at a target bitrate like 350k.
- **The moov atom issue:** with `-movflags +faststart`, ffmpeg does a two-pass write. The file will appear invalid (`moov atom not found`) until the process fully completes. Don't panic — just wait.
- **Session timeout kills ffmpeg** — always run as a background process (`&`) with output redirected to a log file. This is the only reliable way to complete a 17-minute encode.
- **`-shortest` is essential** — without it, the video will run past the audio end (silence for the remaining loops).
- The audio `master_audio.m4a` is already pre-built from the music generation workflow — the video loop just needs to match its duration.

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
