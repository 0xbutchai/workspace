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

### 2. Verify .gitignore Covers Everything

**Sensitive files (always exclude):**
```
*.key, *.pem, *.env, .env.local, *.env.*
secrets/, wallet.key, mnemonic
*secret*, *_token*, *_api_key*
.openclaw/
```

**Build & dependency artifacts (always exclude):**
```
node_modules/, .next/, dist/, build/
__pycache__/, *.pyc, .pytest_cache/
venv/, .venv/
.turbo/, out/
```

**Project-specific patterns (for workspace with multiple projects):**

If your workspace contains multiple sub-projects with their own repos, ignore them:
```
# Projects with their own .git repos
0xbutchai-skills/
landclearing/
lazer-denver/
```

If your workspace has media/animation working directories:
```
# Media project working artifacts
lofi-shaman/        # animation output, audio files
lofi-degen/         # similar
*/animation/        # per-project animation dirs
*/animation-v*/     # versioned animation dirs
*/audio/            # audio working files
public/             # deployment artifacts
.vercel/            # Vercel deployment cache
```

If your workspace has generated images/videos:
```
# Timestamped generated files (YYYY-MM-DD-HH-MM-SS-* pattern)
*-*-*-*.png
*-*-*-*.jpg
generated_*.png
generated_*.jpg
*.mp4
*.webm
```

**Create .gitignore before staging anything:**
```bash
cat > .gitignore << 'EOF'
# Sensitive files
*.key
*.pem
.env
.env.*
secrets/
wallet.key

# Dependencies
node_modules/
venv/
__pycache__/

# Build artifacts
.next/
dist/
build/

# Workspace-level projects with own repos
0xbutchai-skills/
landclearing/

# Media working directories
lofi-shaman/
*/animation*/
public/

# Generated files
*-*-*-*.png
*.mp4
EOF
```

Test before committing: `git check-ignore -v <filename>`

⚠️ **Never push .env, .env.local, *.key, or secrets/** — these contain API keys, auth tokens, passwords. Always add to .gitignore BEFORE the first `git add`. If already staged, unstage it: `git rm --cached .env.local`

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

## Workspace Structure: Multiple Projects Pattern

If your workspace root contains multiple sub-projects (each with own repo + code), add each to .gitignore:

```bash
# Run git status at workspace root
cd ~/.openclaw/workspace && git status
# Look for untracked dirs with .git inside

# For each, check if it has its own .git repo
for dir in $(git status --porcelain | grep '^??' | awk '{print $2}' | cut -d'/' -f1 | uniq); do
  if [ -d "$dir/.git" ]; then
    echo "$dir has own .git — add to .gitignore"
  fi
done

# Add to .gitignore
echo "0xbutchai-skills/" >> .gitignore
echo "landclearing/" >> .gitignore
```

Why ignore sub-projects with their own repos?
- They should be version-controlled independently
- If you commit their contents to the workspace repo, you have two git histories (confusing)
- Alternative: use `git submodule` to formally track them, but that adds complexity
- For simple cases: just ignore them and manage each repo separately

## Media & Generated Files Pattern

If your workspace has media projects (video, animation, audio):
- Always ignore working directories: `lofi-shaman/`, `*/animation/`, `*/audio/`
- Always ignore generated files: `*.mp4`, `*-*-*-*.png` (timestamped images)
- Always ignore deployment artifacts: `public/`, `.vercel/`

These are build outputs, not source code. Keep them on the machine for development, but don't version-control them.
