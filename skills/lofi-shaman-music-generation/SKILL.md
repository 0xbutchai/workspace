---
name: lofi-shaman-music-generation
description: Create music for your lofi shaman persona. This skill optimizes prompt building for creating a playlist of AI generated lofi music.
---

### Creativity
- As an incredible AI musician you have an infinite amount of music creation skill, but like to ask the use for ideas
- Solicit a few words of feedback to get an idea for what the prompt should be
- This feedback should *not* largely alter the song prompting process
- **Use the feedback as random input to convery emotion and gain creativity in the prompting

### Suno Prompt Writing — Learned Best Practices
- Lofi theme
- **BPM matters**: 70-85 BPM is optimal for focus/flow state. Always specify BPM.
- **No lyrics for coding**: Lyrics activate language centers and break focus. Always specify instrumental mode in Suno UI — don't just say "no vocals" in the prompt.
- **Psychedelic lofi formula**: vinyl crackle + tape flutter + slow chord drift + synth pads with long reverb tails + gentle pitch modulation = the vibe
- **Instrument stack for flow state**: mellow jazz piano, soft brush drums, deep sub bass, shimmering synth pads, atmospheric hum
- **Structure of a good prompt**: Genre tags → BPM → Instruments → Mood descriptors → Atmosphere keywords (skip vocal instructions — use the Instrumental toggle instead)
- **Suno upsells your prompt**: It rewrites the prompt into something richer (e.g. "Floating lofi-chillhop instrumental: dusty jazz piano voicings drifting over warm vinyl crackle..."). The output titles it generates are great signals for what worked.
- **Suno generates 2 songs per Create click** — always generates pairs. 4 clicks = 8 songs.
- **Suno automated login issue**: Google OAuth hits reCAPTCHA in Playwright browser. Fix: have user log in manually in the visible Playwright browser window on their screen.
- **Suno homepage trick**: You can type a prompt and hit Create without being logged in — songs generate but are gated. Login to access them.

### Example Prompts
**Psychedelic Coding Flow State (2026-03-17)**: Lofi hip hop, chillhop, psychedelic ambient. 75 BPM. Mellow jazz piano chords slowly drifting over warm vinyl crackle and tape flutter. Deep sub bass pulses, soft brush drums, shimmering synth pads with long reverb tails. Hypnotic, meditative, cosmic. Flow state. Deep focus. Late night coding session. Dreamy chord progressions, slow harmonic movement, gentle pitch modulation. > Generated tracks: Flow State in 75, Flow State Constellations, Infinite Tabs Infinite Stars, Midnight Syntax

### Sound Identity - The Users Taste Profile
- **Electronic, not acoustic** — the channel vibe is electronic lofi, not organic/classical instrumental. Avoid anything that sounds like a live band or orchestral performance.
- **No wind instruments in the foreground** — flutes, saxophones, brass etc. don't fit the channel vibe. Synths, pads, and electronic textures only.
- **Hi-hat technique** — a fast-pacing hi-hat used *periodically* (not throughout) can build intense focus. Use it sparingly to add energy at key moments, not as a constant layer.
- **The target**: electronic lofi with synth pads, sub bass, soft electronic percussion, and atmospheric texture
- **Passive listening is the goal** — music should wash over you, not demand attention. No catchy hooks, no rigid pop structure, no memorable melodies that stick. It should feel like ambient atmosphere, not a song.
- **No song formula** — avoid verse/chorus/bridge structure. Let it flow freely without predictable sections.

### ✅ Gold Standard Tracks
- **Orbital Coffee Break** (2026-03-18) — ALL 4 songs are perfect. Use as the primary reference for all future prompts.
  - https://suno.com/song/7ad38214-8826-47f4-bcac-54667d065417
  - https://suno.com/song/26a89796-7a25-4175-b5fc-09350ce9fe26
  - https://suno.com/song/01b75a93-1f3d-454f-87bd-be1c0a8bf39c
  - https://suno.com/song/2c16beff-844f-494c-b26c-c31c510cd9d7
- **Subroutines in Slow Motion — Song 1**: Great example. Use alongside Orbital Coffee Break as reference.

### ⚠️ Partially Works
- **Subway Static Ritual — Song 2**: Decent but too much active listening. Moves in the right direction.
- **Subway Static Ritual — Song 1**: Too rigid/structured, sounds like a pop formula. Too catchy.

### ❌ What Doesn't Work
- Acoustic/orchestral instrument sounds (too "live band")
- Wind instruments (flute, sax, brass) in the foreground
- Anything that sounds like a lounge jazz session rather than an electronic chill space
- **"Super Mario" sounding** — overly melodic, game-music energy (e.g. Midnight Transfer). Avoid bright lead synths, arpeggiators, or anything that sounds like a video game OST.
- **Catchy melodies** — if it gets stuck in your head, it's wrong for this channel
- **Pop song structure** — no hooks, no drops, no recognizable sections. Music should be structureless and ambient.

###
- A playlist of ~2 hours for Aidan to screen
  > Liked songs make the final cut
  > disliked songs do not get added
- After approval string all songs together to one master file named video #
  > (#) Number is the iteration
