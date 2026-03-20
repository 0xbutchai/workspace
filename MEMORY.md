# MEMORY.md - Long-Term Memory

## ClawRouter Installation (2026-03-06)

**What:** ClawRouter is a third-party OpenClaw plugin by BlockRunAI — an agent-native LLM router with 41+ models, smart routing, and pay-per-request USDC payments via x402 protocol (no API keys needed).

**Installed via:**
```bash
curl -fsSL https://blockrun.ai/ClawRouter-update | bash
openclaw gateway restart
```

**Version installed:** 0.12.11

**Plugin ID:** `clawrouter` (loaded from `~/.openclaw/extensions/clawrouter/dist/index.js`)

**Wallet generated:**
- EVM (Base): `0xcf4Dbc2aB3FC6C147443aE45f3A50726E76A49b7`
- Solana: `E4RXzriRsRRGp1JcGQwhhCjc65Bq8kDAXCCpVTZzQB2c`
- Key file: `~/.openclaw/blockrun/wallet.key`
- Mnemonic: `~/.openclaw/blockrun/mnemonic`
- ⚠️ Wallet needs to be funded with USDC on Base or Solana to use paid models

**Default routing model:** `blockrun/auto` (smart routing, ~74-100% savings vs direct)

**Routing profiles:**
- `/model auto` — balanced default
- `/model eco` — cheapest possible
- `/model premium` — best quality
- `/model free` — gpt-oss-120b (free tier, no USDC needed)

**To verify it's installed and running:**
```bash
openclaw plugins list 2>&1 | grep -A2 clawrouter
```
Should show `ClawRouter | clawrouter | loaded`

**GitHub:** https://github.com/BlockRunAI/ClawRouter
**Support Telegram:** t.me/blockrunAI

---

## ClawMart Setup (2026-03-06)

**Skill installed:** `~/.openclaw/workspace/skills/clawmart/SKILL.md`
**API key:** stored as `CLAWMART_API_KEY` in systemd gateway service (persists across reboots)
**API base:** https://www.shopclawmart.com/api/v1/

---

## Skills Editor Web Page (0xbutchai-skills)

**Location:** `~/.openclaw/workspace/0xbutchai-skills/`
**Purpose:** Web interface for editing OpenClaw skill markdown files. Allows editing, renaming, and saving skill definitions.
**Key components:**
- `app/skills/page.js` – UI editor with Save, Copy, Download, Reset.
- `app/api/save/route.js` – API endpoint to persist edits to `lib/skillsData.json` and workspace skill files.
- `sync-local.js` – Syncs saved edits from Vercel Blob storage back to local OpenClaw skill directory.

The page will be enhanced with:
1. **Rename feature** – change skill name and underlying file path.
2. **Working Save** – actually write edits to markdown files on the backend.
3. **Push mechanism** – copy edited skill files into the active OpenClaw skills folder (`~/.npm-global/lib/node_modules/openclaw/skills/`).

**Skill installed:** `~/.openclaw/workspace/skills/clawmart/SKILL.md`
**API key:** stored as `CLAWMART_API_KEY` in systemd gateway service (persists across reboots)
**API base:** https://www.shopclawmart.com/api/v1/

---

## Forge Persona Installed (2026-03-06)

**What:** "Forge — Staff Engineer + Release Captain" persona from ClawMart (already purchased).

**Source:** https://www.shopclawmart.com/listings/forge-staff-engineer-release-captain-b9bf88f1

**Installed at:** `~/.openclaw/workspace/personas/forge/`
- `SOUL.md` — identity, voice, engineering standards
- `MEMORY.md` — collaboration, shipping, incident, security defaults
- `OPERATING_LOOP.md` — Clarify → Plan → Execute → Verify → Summarize playbook

**Forge's vibe:** Operator-mode, calm, blunt, high-signal, security-minded. Correctness first, small reviewable diffs, PR-first workflow, tests + lint before calling done.

**User preference:** Use Forge persona automatically for all coding tasks (writing, reviewing, debugging code).

---

## Proton Mail Account Created (2026-03-06)

- **Email:** 0xbutchai@proton.me
- **Display name:** Butch
- **Credentials:** stored at `~/.openclaw/secrets/proton.txt` (chmod 600)
- **Note:** `~/.openclaw/secrets/` is gitignored

## Blackmagic Cloud Account (2026-03-18)

- **Email:** 0xbutchai@proton.me
- **Password:** GjZIqPmYe7ZLtBDPUC3X
- **Purpose:** DaVinci Resolve video editing for Lofi Shaman YouTube channel
- **Credentials:** also appended to `~/.openclaw/secrets/proton.txt`

## Lofi Shaman Video — COMPLETE (2026-03-18 23:31 MDT)

**Final Video File:**
- Location: `/home/butch/.openclaw/workspace/lofi-shaman/animation/lofi_shaman_final.mp4`
- Duration: 17m 20s (1040 seconds)
- Resolution: 1920×1080 (HD)
- Codecs: H.264 video + AAC audio
- File size: 63 MB
- Format: MP4 (YouTube-ready)

**What's In It:**
- **Animation**: Seamless 60-second looping scene with basketball arc animation once per loop (~2 seconds)
- **Layers**: Lofi anime illustration (background sky, midground clearing, hoop, character, ball, foreground grass)
- **Audio**: 6 best lofi ambient tracks (17m 20s total):
  1. Orbital Coffee Break (4 tracks) — gold standard reference
  2. Cassette Fog Architecture (2 tracks) — ambient downtempo
- **Style**: Mostly static with subtle parallax drift

**Build Process (Fast Path):**
1. Generated 6 image layers at 1920×1080 using Gemini 3 Pro Image
2. Removed white backgrounds from isolated elements (ball, hoop, character, foreground)
3. Rendered 1 static frame + 48 frames of ball animation (2s) using NumPy compositing
4. Stitched 3 parts with FFmpeg: static (28s) → animation (2s) → static (30s) = 60s loop
5. Encoded audio: transcoded 6 Opus tracks to AAC, concatenated to 17m 20s master
6. Looped video 18x to match audio duration using FFmpeg concat demuxer
7. Final mux: video + audio with H.264/AAC codecs

**Upload Ready:**
- Direct to YouTube
- No additional encoding needed
- 1080p HD suitable for all viewing
- Audio + video synced and verified

## Google Account Created (2026-03-13)

- **Login email:** 0xbutchai@proton.me (not a Gmail — linked existing Proton address)
- **Display name:** Butch
- **Password:** same as Proton (stored in `~/.openclaw/secrets/proton.txt`)
- **Manage:** https://myaccount.google.com

## GitHub Account Created (2026-03-06)

- **Username:** 0xbutchai
- **Email:** 0xbutchai@proton.me
- **Profile:** https://github.com/0xbutchai
- **Password:** same as Proton (stored in `~/.openclaw/secrets/proton.txt`)
- **gh CLI:** installed at `~/.local/bin/gh` (v2.67.0)
- **Next:** generate a PAT and run `gh auth login` to enable CLI repo creation + push
