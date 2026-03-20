# SKILL.md - GitHub Push

## Description
Push workspace progress to GitHub safely — secret scanning, .gitignore, repo creation, and clean commits.

## Prerequisites
- Git installed, GitHub account exists, PAT with `repo` scope generated

## Workflow

### 1. Scan for Secrets First
```bash
grep -rn "cm_live_\|sk-\|ghp_\|api_key\s*=\|password\s*=\|BEGIN.*PRIVATE" . \
  --include="*.md" --include="*.json" --include="*.env" -i
```
If hits found: redact, then check git history (Step 5).

### 2. Verify .gitignore Covers
`*.key`, `*.pem`, `*.env`, `.env.local`, `*.env.*`, `secrets/`, `wallet.key`, `mnemonic`, `*secret*`, `*_token*`, `.openclaw/`, `node_modules/`

**Create .gitignore before staging anything:**
```bash
cat >> .gitignore << 'EOF'
.env
.env.local
.env.*
*.key
*.pem
secrets/
node_modules/
EOF
```

Test: `git check-ignore -v .env.local`

⚠️ **Never push .env or .env.local files** — these contain API keys, auth tokens, and passwords. Always add them to .gitignore BEFORE the first `git add`. If you already staged one, unstage it: `git rm --cached .env.local`

### 3. Create Repo via API (skip `gh auth login` — needs extra scopes)
```bash
curl -sf -X POST -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/user/repos \
  -d '{"name":"repo-name","private":false}'
```

### 4. Stage, Commit, Push
```bash
git config user.email "you@example.com" && git config user.name "Name"
git remote add origin https://USERNAME:$GH_TOKEN@github.com/USERNAME/repo.git
git add . && git status   # review before committing
git commit -m "descriptive message"
git branch -M main && git push -u origin main
```

### 5. Scrub History (if secret was committed)
```bash
pip install git-filter-repo
git filter-repo --replace-text <(echo 'EXPOSED_VALUE==>REDACTED')
git push origin --force --all
```
Then rotate the exposed key immediately.

## Key Lessons
- Use `curl` + token for repo creation — `gh auth login --with-token` requires `read:org` scope and will fail with a basic `repo`-scoped PAT
- Token in remote URL works fine: `https://user:token@github.com/...`
- `git check-ignore -v <path>` confirms what's actually excluded before pushing
- **NEVER push .env / .env.local** — learned the hard way. Always gitignore env files before the first `git add`. Next.js projects always have `.env.local` with secrets baked in.
