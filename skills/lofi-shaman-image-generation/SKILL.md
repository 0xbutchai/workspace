---
name: lofi-shaman-image-generation
description: Create an image to later be used in a lofi shaman video. Use this skill for image generation.
---

## Animation Style Reference

### What you Want
- **Look and feel: Lofi Girl on YouTube** — soft anime-influenced illustration with defined edges
- Soft but clean linework on all characters and objects (NOT thick Western cartoon outlines)
- Cel-shaded flat colors with subtle painterly highlights and shadows within shapes
- Warm color palette (deep blues/purples, sage greens, earthy tones, light grey)
- Soft glow/bloom only on light sources (candles, fire, stars) — not on everything
- The scene should feel like a living illustration — cozy, atmospheric, calm
- **Style prompt must always include:** *"soft anime linework, cel-shaded flat colors, lofi girl YouTube channel style, skyrim aesthetic, warm palette, cozy atmosphere, NOT thick Western cartoon outlines"*

### Workflow - Full Reproduction Steps
1. Get scene elements from Aidan (6 categories above)
2. Generate full composite with Nano Banana — iterate until approved
3. Generate no-ball background (inpaint) + ball sprite

### Lessons - Generate DOs/DON'ts as you learn
> Read this before starting the image generation prompting phase.
- *DO* Lead with the locked-in style prompt from the top of this file. Use it verbatim. 
- *DO* Place shaman in the **midground**, not filling the frame — specify scale/distance.
- *DO* Edit (not regenerate) with explicit corrections like "add defined soft linework, remove blur, cel-shade the flat color areas," when iterating on an image.
- *DO* Generate one full composite first.
- *DO* Extract layers from the first composite (inpainting, sprite isolation). 
- *DO* Apply a circular mask in code to fake the alpha.
- *DO NOT* Painterly/impressionist styles
- *DO NOT* Prompt for thick outlines
- *DO NOT* Generate individual layers — it causes style/color mismatches that are very hard to fix.
- *DO NOT* Use words like "illustrated" or "painterly" — those words will wreck the output. 
- *DO NOT* Generate layers independently.
- *DO NOT* Ask Nano Banana for a transparent background
- *DO NOT* Expect any AI image generator to produce a truly transparent PNG.


---

## Phase 1: Full Composite Image

**Always generate the complete scene as a single image first.** 

### Before generating, collect from the user:
1. **Background** — sky, distant environment (aurora, night sky, mountains, treeline)
2. **Midground** — main ground plane (clearing, riverbank, rooftop, gravel pad)
3. **Foreground** — closest elements framing the scene (rocks, grass tufts, window, branches)
4. **Objects of interest** — key scene props (campfire, altar, basketball hoop, lanterns)
5. **Character** — description, pose, outfit (the shaman, their position in the scene)
6. **Objects to animate** — what will move; keep it to **1–2 things max** (fire, ball, leaves, ripples)

### Image generation
- Use Nano Banana (Gemini Pro model)
- Resolution: **2K (2752×1536)** — fall back to 1920×1080 if needed
- Include the style prompt from the reference above in every generation
- **Present the composite to Aidan and get approval before moving to Phase 2**
- Iterate with edits (not full regenerations) when small changes are needed

### Iteration workflow (edits)
```bash
BASEDIT=~/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro
uv run $BASEDIT/scripts/generate_image.py \
  --prompt "Edit: [describe specific change]. Keep everything else identical." \
  --filename "YYYY-MM-DD-HH-MM-SS-lofi-shaman-composite-vN.png" \
  --resolution 2K \
  -i /path/to/previous_version.png
```

---

## Phase 2: Layer Extraction

**Goal:** Isolate animated elements as separate PNGs so they can be moved independently for the video animation phase

### Process
1. **Identify what moves** — Ask Aidan to identify 1–2 elements or recommend some. More elemnts = exponentially harder.
2. **Generate a "no-animated-element" background:**
   - Use Nano Banana to inpaint the animated object out of the composite
   - Prompt: *"Remove [object] from the scene and inpaint the area naturally. Keep everything else completely identical."*
   - Verify the inpainted area matches the surrounding style
3. **Generate the animated element as a standalone sprite:**
   - Use Nano Banana with the composite as reference to generate the object alone
   - Prompt: *"A single [object], lofi anime style, matching the art style in the reference image. Transparent background."*
   - **Note:** Nano Banana saves PNG as RGB (no alpha channel) even when transparent background is requested. The "transparent" background will be rendered as dark gray (~52,52,52). Use a circular mask or color keying to extract the sprite.
4. **Create sprite with proper alpha:**
```python
from PIL import Image, ImageDraw
import numpy as np

ball = Image.open('02_ball.png').convert('RGB')
BALL_D = 70  # desired diameter in pixels
ball_small = ball.resize((BALL_D, BALL_D), Image.LANCZOS)
mask = Image.new('L', (BALL_D, BALL_D), 0)
ImageDraw.Draw(mask).ellipse([2, 2, BALL_D-2, BALL_D-2], fill=255)
ball_rgba = ball_small.convert('RGBA')
ball_rgba.putalpha(mask)
```
5. **Name files consistently:**
   - `01_background_no_ball.png` — static scene without the animated element
   - `02_ball_sprite.png` — isolated sprite with alpha

### Finding exact coordinates of objects
Use Python to locate the object's pixel position in the source image. For a basketball:
```python
from PIL import Image
import numpy as np

img = Image.open('composite.png').convert('RGB')
arr = np.array(img)
r, g, b = arr[:,:,0].astype(int), arr[:,:,1].astype(int), arr[:,:,2].astype(int)

# Orange basketball detection
is_orange = (r > 150) & (g > 80) & (g < r - 30) & (b < g - 20)
mask = is_orange.astype(int)
# Then flood-fill from known region or use cumsum block search
```
**OR** — use the coordinate picker tool deployed on Vercel (`/coords.html`) and have the user click directly on the object. This is far more reliable than automated color detection when the scene has similar colors (e.g., autumn leaves).

### Lessons learned — Phase 2
- **Automated color detection is unreliable** when similar colors exist in the scene (orange leaves ≈ orange basketball). Always prefer the coordinate picker tool or Gemini vision for locating objects.
- Nano Banana generates sprites at full 2K resolution even for small objects — always resize down to scene-appropriate size
- The sprite will be full-frame (2752×1536) with the object centered — crop and resize before use
- `rembg` is not useful for flat illustrated styles — it's designed for photorealistic backgrounds
- Always verify the no-ball background looks clean before animating
