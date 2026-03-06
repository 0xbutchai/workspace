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

## GitHub Account Created (2026-03-06)

- **Username:** 0xbutchai
- **Email:** 0xbutchai@proton.me
- **Profile:** https://github.com/0xbutchai
- **Password:** same as Proton (stored in `~/.openclaw/secrets/proton.txt`)
- **gh CLI:** installed at `~/.local/bin/gh` (v2.67.0)
- **Next:** generate a PAT and run `gh auth login` to enable CLI repo creation + push
