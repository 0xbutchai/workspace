# Suno Workspace Flow — Learned Process (2026-03-20)

## Discovery: Workspace-Based Song Management

**What we learned from Aidan:**
Instead of managing individual songs and playlists, Suno allows:
1. **Create a Workspace** — organize all songs for a project in one place
2. **Generate songs IN that workspace** — all songs auto-save to the workspace
3. **Sync workspace to playlist** — create a shareable playlist from the workspace for mobile
4. **Share the playlist** — user reviews, likes/dislikes from their phone

This is WAY better than individual playlist management.

---

## Documented Workflow (Tested)

### Step 1: Create a Workspace
- Navigate to `suno.com/create`
- Click the workspace name button (upper left, right of prompt box)
- Sidebar opens with workspace list
- Click "Create New Workspace"
- A textbox appears for the workspace name
- Type the name (e.g., "test", "Video 2 - Spring Farm Porch")
- Click "Confirm"
- Workspace is created and ready

**Selectors/refs:**
- Workspace panel toggle: button with workspace name
- Create button: "Create New Workspace"
- Input field: textbox with placeholder "New workspace name"
- Confirm button: "Confirm"

### Step 2: Enter the Workspace
- Click on the workspace name in the list
- The page updates to show that workspace (URL changes: `?wid=<workspace-id>`)
- The right panel shows empty ("No songs found")
- The current workspace name appears in the upper left button

### Step 3: Generate a Song IN that Workspace
- While in the workspace, fill in the prompt as normal
- Click "Instrumental" if needed
- Click "Create song"
- Song is generated and automatically saved to THIS workspace
- No extra steps needed — workspace handles the save automatically

### Step 4: Manage Songs (New Feature Needed)
- Once songs are generated, right-click on the checkbox left of the artwork
- Select "Add to playlist" or "Create new playlist"
- This creates/adds the song to a shareable playlist

**Key point:** Right-click context menu (not just click)

### Step 5: Share the Playlist
- Once playlist is created from workspace songs
- Get the shareable URL
- Send to user
- User can review, like/dislike on mobile

---

## Automation Plan

### What to Automate:
1. **Create Workspace** → Simple form fill + click
2. **Select Workspace** → Click workspace button
3. **Generate Songs** → Fill prompt + click Create (already working)
4. **Bulk-Add to Playlist** → This is the tricky part
   - Requires right-click on checkboxes
   - Selecting from context menu
   - Repeat for each song

### Challenges:
- Right-click menus are harder to automate than left-click
- Might need to use Playwright's `context_menu` event or simulate right-click with `pointer_button: 'right'`
- The checkbox selection is tiny — need reliable selectors

### Strategy:
- Build a Playwright script that:
  1. Takes workspace name as input
  2. Navigates to that workspace
  3. Waits for songs to finish generating (poll for "Generating" status to clear)
  4. For each song, right-click the checkbox
  5. Click "Create New Playlist" or select existing
  6. Return playlist URL

---

## Test Run: "test" Workspace
- Created workspace: "test"
- Entered workspace (confirmed by URL: `?wid=a7299fe3-f362-4397-af9c-c8c879fefc77`)
- Generated test song with prompt: "Test song: Simple lofi beat at 70 BPM, chill vibes"
- Song is now generating in the workspace

**Next:** Once it completes, test the right-click → playlist creation flow.

---

## For Next Time:
- Automate workspace creation
- Automate song generation (already works)
- **Build right-click playlist automation**
- Return playlist URL to user
- Entire flow: `music-generation skill` → workspace → songs → playlist → share link
