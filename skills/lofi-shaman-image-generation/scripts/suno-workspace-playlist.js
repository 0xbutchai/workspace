#!/usr/bin/env node

/**
 * Suno Workspace → Playlist Automation
 * Creates workspace, generates songs, syncs to playlist
 * 
 * Usage:
 *   node suno-workspace-playlist.js "Video 2 - Spring Farm Porch"
 */

const playwright = require('playwright');

const workspaceName = process.argv[2];

if (!workspaceName) {
  console.error('Usage: node suno-workspace-playlist.js "Workspace Name"');
  process.exit(1);
}

console.log(`\n🎵 Suno Workspace → Playlist Automation`);
console.log(`📝 Workspace: ${workspaceName}\n`);

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to Suno Create page
    console.log('🔄 Step 1: Navigating to Suno Create page...');
    await page.goto('https://suno.com/create', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Workspaces', { timeout: 10000 });
    console.log('✅ Create page loaded');

    // Step 2: Create Workspace
    console.log('\n🔄 Step 2: Creating workspace...');
    await page.click('button:has-text("Create New Workspace")');
    await page.waitForSelector('input[placeholder*="workspace"]', { timeout: 5000 });
    
    const nameInput = await page.$('input[placeholder*="workspace"]');
    if (nameInput) {
      await nameInput.fill(workspaceName);
      await page.click('button:has-text("Confirm")');
      await page.waitForTimeout(1000);
      console.log(`✅ Workspace "${workspaceName}" created`);
    }

    // Step 3: Wait for songs to be ready in workspace
    console.log('\n🔄 Step 3: Waiting for songs to generate in workspace...');
    // This is where user would have already generated songs via UI
    // We're just verifying they exist
    let songCount = 0;
    let attempts = 0;
    while (songCount === 0 && attempts < 30) {
      const songs = await page.$$('text=Lo Tide at Seventy, text=[role="group"]');
      songCount = songs.length;
      if (songCount === 0) {
        await page.waitForTimeout(2000);
        await page.reload({ waitUntil: 'networkidle' });
        attempts++;
      }
    }
    console.log(`✅ Found songs in workspace (polling took ${attempts * 2}s)`);

    // Step 4: Get workspace song count and total duration
    console.log('\n🔄 Step 4: Counting workspace songs and calculating duration...');
    const workspaceSongText = await page.locator('text=/\\d+ songs/').first().textContent();
    const workspaceSongMatch = workspaceSongText?.match(/(\d+) songs/);
    const workspaceSongCount = parseInt(workspaceSongMatch?.[1] || '0');
    console.log(`✅ Workspace has ${workspaceSongCount} song(s)`);

    if (workspaceSongCount === 0) {
      console.warn('⚠️  No songs found in workspace. Generate songs first, then run this script.');
      await browser.close();
      process.exit(1);
    }

    // Calculate total duration from song lengths (each song row has duration info)
    const songDurations = await page.$$eval('[role="group"]', groups => {
      return groups.map(group => {
        const timeText = group.textContent.match(/(\d+):(\d+)/);
        if (timeText) {
          const mins = parseInt(timeText[1]);
          const secs = parseInt(timeText[2]);
          return mins * 60 + secs;
        }
        return 0;
      });
    });

    const totalSeconds = songDurations.reduce((a, b) => a + b, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = (totalMinutes / 60).toFixed(1);
    console.log(`✅ Total duration: ${totalHours}h (${totalMinutes} minutes)`);

    if (totalMinutes < 120) {
      console.warn(`⚠️  WARNING: Only ${totalHours}h of content (need 2h+). Generate more songs.`);
      // Don't exit — let them continue if they want
    }

    // Step 5: Add all songs to playlist
    console.log(`\n🔄 Step 5: Adding ${workspaceSongCount} song(s) to playlist...`);
    
    const moreOptionsButtons = await page.$$('button:has-text("More options")');
    console.log(`Found ${moreOptionsButtons.length} songs with "More options" button`);

    for (let i = 0; i < Math.min(workspaceSongCount, moreOptionsButtons.length); i++) {
      console.log(`  Adding song ${i + 1}/${workspaceSongCount}...`);
      
      // Reload to ensure fresh refs
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const buttons = await page.$$('button:has-text("More options")');
      if (buttons[i]) {
        await buttons[i].click();
        await page.waitForTimeout(300);

        // Click "Add to Playlist"
        const addBtn = await page.$('button:has-text("Add to Playlist")');
        if (addBtn) {
          await addBtn.click();
          await page.waitForTimeout(500);

          // Check if playlist exists, otherwise create it
          const existingPlaylist = await page.$(`text=${workspaceName}`);
          if (existingPlaylist) {
            // Click existing playlist
            await existingPlaylist.click();
            console.log(`  ✅ Added to existing playlist`);
          } else {
            // Create new playlist with workspace name
            const nameInput = await page.$('input[placeholder*="Playlist Name"]');
            if (nameInput) {
              await nameInput.fill(workspaceName);
              await page.click('button:has-text("Create Playlist")');
              console.log(`  ✅ Created new playlist "${workspaceName}" and added song`);
            }
          }
          await page.waitForTimeout(500);
        }
      }
    }

    // Step 6: Navigate to playlists and verify
    console.log('\n🔄 Step 6: Verifying playlist...');
    await page.goto('https://suno.com/me/playlists', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Find playlist with matching name
    const playlistLink = await page.$(`a:has-text("${workspaceName}")`);
    if (!playlistLink) {
      console.error(`❌ Playlist "${workspaceName}" not found!`);
      await browser.close();
      process.exit(1);
    }

    // Get playlist URL
    const href = await playlistLink.getAttribute('href');
    const playlistUrl = `https://suno.com${href}`;
    console.log(`✅ Playlist found: ${playlistUrl}`);

    // Navigate to playlist to verify song count
    await page.goto(playlistUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const playlistSongText = await page.locator('text=/\\d+ songs?/').first().textContent();
    const playlistSongMatch = playlistSongText?.match(/(\d+) songs?/);
    const playlistSongCount = parseInt(playlistSongMatch?.[1] || '0');
    console.log(`✅ Playlist has ${playlistSongCount} song(s)`);

    // Get playlist duration
    const playlistDurations = await page.$$eval('[role="group"]', groups => {
      return groups.map(group => {
        const timeText = group.textContent.match(/(\d+):(\d+)/);
        if (timeText) {
          const mins = parseInt(timeText[1]);
          const secs = parseInt(timeText[2]);
          return mins * 60 + secs;
        }
        return 0;
      });
    });

    const playlistTotalSeconds = playlistDurations.reduce((a, b) => a + b, 0);
    const playlistTotalMinutes = Math.floor(playlistTotalSeconds / 60);
    const playlistTotalHours = (playlistTotalMinutes / 60).toFixed(1);
    console.log(`✅ Playlist duration: ${playlistTotalHours}h (${playlistTotalMinutes} minutes)`);

    // Step 7: Verification
    console.log('\n🔄 Step 7: Running verification checks...');
    let verified = true;

    if (workspaceSongCount !== playlistSongCount) {
      console.error(`❌ FAIL: Workspace (${workspaceSongCount}) ≠ Playlist (${playlistSongCount})`);
      verified = false;
    } else {
      console.log(`✅ PASS: Song count matches (${workspaceSongCount} songs)`);
    }

    const playlistNameElement = await page.locator('h1, h2, [role="heading"]').first().textContent();
    if (!playlistNameElement?.includes(workspaceName)) {
      console.error(`❌ FAIL: Playlist name "${playlistNameElement}" ≠ Workspace name "${workspaceName}"`);
      verified = false;
    } else {
      console.log(`✅ PASS: Playlist name matches workspace name`);
    }

    if (playlistTotalMinutes < 120) {
      console.error(`❌ FAIL: Duration is ${playlistTotalHours}h (need 2h+)`);
      verified = false;
    } else {
      console.log(`✅ PASS: Duration is ${playlistTotalHours}h (2h+ requirement met)`);
    }

    // Final result
    if (verified) {
      console.log(`\n✅ SUCCESS! Playlist ready for review:`);
      console.log(`   📍 ${playlistUrl}`);
      console.log(`   🎵 ${playlistSongCount} song(s)`);
      console.log(`   ⏱️  ${playlistTotalHours}h (${playlistTotalMinutes} min)`);
    } else {
      console.log(`\n❌ VERIFICATION FAILED! Please review manually.`);
      await browser.close();
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
