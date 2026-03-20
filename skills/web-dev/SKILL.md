# SKILL.md - Simple Vercel Web Deploy

## Description
Create a static website and deploy it to Vercel using the Vercel CLI. This skill records the steps needed to avoid 404 errors after an initial deployment.

## Prerequisites
- Vercel CLI installed and logged in (`vercel login`).
- Workspace is a git repo (optional, but useful for Vercel Git integration).
- `public/` directory in the project root (Vercel serves static files from here by default).

## Steps
0. Search Google for well-designed sites that look astethitcally pleasing to base your design off of. 
1. **Create a `public/` folder** if it does not exist:
   ```bash
   mkdir -p public
   ```
2. **Add an `index.html`** (or any static assets) inside `public/`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <title>My Vercel Site</title>
   </head>
   <body>
     <h1>Hello, Vercel!</h1>
   </body>
   </html>
   ```
3. **Commit the changes** (optional but recommended):
   ```bash
   git add public/index.html
   git commit -m "Add static homepage to avoid 404"
   ```
4. **Deploy** with the Vercel CLI in non‑interactive mode:
   ```bash
   vercel --prod --non-interactive
   ```
   - This creates a production deployment and updates the alias `https://workspace-phi-bay.vercel.app`.
5. **Verify** the deployment URL returns a 200 status and displays the page.

## Common Pitfalls
- Deploying without a `public/` folder results in Vercel serving the root of the repo, which often has no `index.html`, causing a 404.
- If Vercel tries to link a GitHub repo, ensure the GitHub integration is connected, or use `--non-interactive` to skip linking.
- Remember to update any existing alias if you change the project name.

## Notes
- This skill is stored under `skills/web-dev/` for reuse.
- Adjust the `index.html` content as needed for your project.
