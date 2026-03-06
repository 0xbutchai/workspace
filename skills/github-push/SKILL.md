# SKILL.md - GitHub Push

## Description
Push workspace progress to a GitHub repository safely — with secret scanning, .gitignore setup, history scrubbing if needed, and clean commit hygiene.

## When to Use
- "Push to GitHub"
- "Commit and push my changes"
- "Set up GitHub for this workspace"
- "Push progress to the repo"

## Prerequisites
- Git installed (`git --version`)
- GitHub account with a target repo created (or create one via `gh repo create`)
- Auth: either `gh` CLI authenticated (`gh auth status`) or SSH key configured

## Workflow

### Step 1 — Audit for Secrets FIRST
Before any git operation, scan all tracked files for sensitive content:
```bash
grep -rn "cm_live_\|sk-\|api_key\s*=\|password\s*=\|secret\s*=\|BEGIN.*PRIVATE" \
  . --include="*.md" --include="*.json" --include="*.txt" --include="*.env" -i
```
If any raw key values are found:
1. Remove or redact them from the file
2. If already committed → scrub history (see Step 5)

### Step 2 — Create / Verify .gitignore
Ensure `.gitignore` exists and covers:
- `*.key`, `*.pem`, `*.env`, `.env.*`
- `wallet.key`, `mnemonic`, `*.seed`
- `*secret*`, `*password*`, `*credentials*`, `*_api_key*`, `*_token*`
- `.openclaw/` (local state directory)
- OS junk: `.DS_Store`, `Thumbs.db`
- Editor dirs: `.vscode/`, `.idea/`

### Step 3 — Initialize / Connect Remote
```bash
git init                                      # if not already a repo
git remote add origin <github-url>            # SSH: git@github.com:user/repo.git
git remote -v                                 # verify
```

### Step 4 — Stage, Commit, Push
```bash
git add .
git status                                    # review what's staged
git commit -m "descriptive message"
git branch -M main                            # rename to main if needed
git push -u origin main
```

### Step 5 — Scrubbing Secrets from History (if needed)
If a raw key was committed in a previous commit, remove it with `git-filter-repo`:
```bash
# Install if needed
pip install git-filter-repo

# Remove a specific file from all history
git filter-repo --path path/to/secret-file --invert-paths

# Or replace a specific string across all history
git filter-repo --replace-text <(echo 'cm_live_XXXX==>REDACTED')

# Force push the rewritten history
git push origin --force --all
```
⚠️ Force-pushing rewrites shared history. Coordinate with any collaborators first.

### Step 6 — Rotate Exposed Keys
If a key was ever committed (even briefly), treat it as compromised:
- Revoke and regenerate it in the provider dashboard
- Update the new key in your environment/config
- Never reuse the exposed key

## Guardrails
- Never commit raw API keys, private keys, mnemonics, or passwords
- Always run the secret scan (Step 1) before first commit
- Prefer env vars or secret managers; reference names only (e.g. `CLAWMART_API_KEY`) in docs
- When in doubt, add to .gitignore before staging

## Notes
- `.openclaw/workspace-state.json` contains local agent state — keep it gitignored
- `MEMORY.md` is safe to commit if it contains only references (not raw values) to secrets
- After pushing, verify on GitHub that no sensitive content is visible in the file tree or commit history
