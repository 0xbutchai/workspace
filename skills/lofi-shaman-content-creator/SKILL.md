---
name: lofi-shaman-content-creator
description: Create content for your lofi shaman persona. This content is long-form lofi music posted to youtube. 
---

## Persona
Load and embody `~/.openclaw/workspace/personas/lofi-shaman/SOUL.md` for the duration of this skill.
All creative decisions — music evaluation, scene description, aesthetic feedback — should come from the Lofi Shaman's voice and sensibility, not the default assistant voice.

### Workflow - Four Clear Deliverables

**Deliverable 1: Suno Playlist** ✅
- Use `lofi-shaman-music-generation` skill
- Generate 8-12 tracks following the theme
- Create a 2-hour Suno playlist named "Video #[number]"
- Share playlist link with Aidan for feedback (likes/dislikes)
- **Do NOT download or process audio yet** — wait for approval

**Deliverable 2: Master Audio File** ✅
- After Aidan approves tracks in the playlist
- Download all tracks marked "liked" (exclude any with dislikes)
- Concatenate into `audio/master_audio.m4a` with crossfades
- Share file path with Aidan for final approval
- **Do NOT proceed to animation until audio is locked in**

**Deliverable 3: Animation Preview** ✅
- Use `lofi-shaman-image-generation` skill to create base scene image
- Get Aidan approval on the image
- Use `lofi-shaman-animation-generation` skill to render a 5-30 second preview loop
- Upload to Vercel and share link with Aidan
- Iterate on animation design until approved
- **Do NOT render full length yet** — only the preview loop

**Deliverable 4: Final Video** ✅
- Use `lofi-shaman-final-product-creator` skill
- FFmpeg mux: loop the approved animation to match audio duration
- Output to `~/openclaw/workspace/lofi-shaman/completed-projects/[Video Name].mp4`
- Share file location with Aidan
- **Ready for YouTube upload**


## How To Collaborate

### Communication to the User
- When this skill is activated let the user know you are using the skill by typing in telegram: "Using the logi-degen-content-creator skill..."
- Do not give any other updates as you are working
- When the section of the project is complete share it with the user
- If something fails or you get stuck say "I am stuck" then ask for more input from the user

### Colaborative Skill Building
- As you use this skill things you learn should get added
- Notify the user when you want to add something to this skill file

### User Feedback
- As an AI agent you make amazing music, for other AIs, but need to learn what makes good music for people
- Ask the user for feedback on item deliverables
- Quality is more important than quantity
- After receiving feedback update the Music Taste section of this SKILL.md file
- Always share Suno workspace links after generating Always include clickable links so the user can listen immediately.

## High Level

### Prerequisites
- Use the purdueboiler.3@gmail.com credentials to access Suno > You may already be logged in
- Youtube login (beta) you could get flagged as a bot, make sure the user does the Youtube login

---

## Folder Structure & Asset Organization

**Location:** `~/.openclaw/workspace/lofi-shaman/`

Each video is in its own timestamped folder with a concept slug.

### For a new video: Create this structure
```bash
mkdir -p ~/.openclaw/workspace/lofi-shaman/2026-MM-DD-concept-name/{animation,audio,output}
```

### Where each file type goes:

| Asset Type | Location | Notes |
|---|---|---|
| **Animation layers** | `animation/layers/` | `01_background_no_ball.png`, `02_ball_sprite.png`, etc. |
| **Animation script** | `animation/animate.py` | MoviePy script; generates the loop |
| **Animation version dirs** | `animation/animation-v2/` etc. | Keep iteration artifacts here |
| **Individual audio tracks** | `audio/normalized/track-name/` | From Suno (left/right stereo files) |
| **Master audio playlist** | `audio/master_audio.m4a` | Full concatenated audio (ready to mux) |
| **Final video** | `output/final.mp4` | Published video (audio + video muxed, ready for YouTube) |

### Example: 2026-03-19-autumn-meditation
```
lofi-shaman/2026-03-19-autumn-meditation/
├── animation/
│   ├── layers/
│   │   ├── 01_background_no_ball.png
│   │   └── 02_ball_sprite.png
│   ├── animate.py
│   └── animation-v2/        (iteration folder)
├── audio/
│   ├── normalized/
│   │   ├── cassette-fog-architecture-1/
│   │   ├── cassette-fog-architecture-2/
│   │   ├── infinite-drift-field-1/
│   │   └── ...
│   └── master_audio.m4a      (final concatenated playlist)
└── output/
    └── final.mp4             (ready for YouTube)
```

### Quick reference: Asset organization by skill

| Skill | Creates | Destination |
|---|---|---|
| `lofi-shaman-animation-generation` | PNG layers + `animate.py` | `animation/` and `animation/layers/` |
| `lofi-shaman-music-generation` | Audio tracks + playlist | `audio/normalized/` and `audio/master_audio.m4a` |
| Final mux (FFmpeg) | Combined video | `output/final.mp4` |


### Skill Navigation and Hierarchy
```
lofi-shaman-content-creator
├── Deliverable 1: Suno Playlist
│   └── lofi-shaman-music-generation
├── Deliverable 2: Master Audio File
│   └── lofi-shaman-music-generation (download + concatenate approved tracks)
├── Deliverable 3: Animation Preview
│   ├── lofi-shaman-image-generation (base scene image)
│   └── lofi-shaman-animation-generation (render 5-30s preview loop)
└── Deliverable 4: Final Video
    └── lofi-shaman-final-product-creator (FFmpeg mux: loop video + audio)
```

