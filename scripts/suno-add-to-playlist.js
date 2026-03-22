#!/usr/bin/env node
/**
 * Add songs from a Suno workspace to a playlist.
 * Connects to the EXISTING OpenClaw browser (CDP on port 18800).
 * No extra browser launch needed — uses the already-logged-in session.
 *
 * Usage:
 *   node suno-add-to-playlist.js <workspace-id> <playlist-name>
 *
 * Example:
 *   node suno-add-to-playlist.js b569b779-2e19-4365-9e42-b0e5a11d5789 "Video 2 - Spring Farm Porch"
 */

const puppeteer = require('puppeteer-core');

const WID = process.argv[2];
const PLAYLIST = process.argv[3];

if (!WID || !PLAYLIST) {
  console.error('Usage: node suno-add-to-playlist.js <workspace-id> "Playlist Name"');
  process.exit(1);
}

const CDP_URL = 'http://127.0.0.1:18800';
const WORKSPACE_URL = `https://suno.com/create?wid=${WID}`;

const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log(`\n🎵 Suno: Add workspace songs to playlist`);
  console.log(`   Workspace: ${WID}`);
  console.log(`   Playlist:  ${PLAYLIST}\n`);

  // Connect to existing OpenClaw browser
  const browser = await puppeteer.connect({ browserURL: CDP_URL });
  const pages = await browser.pages();
  
  // Use existing page or open new tab
  let page = pages.find(p => p.url().includes('suno.com'));
  if (!page) {
    page = await browser.newPage();
  }

  // Navigate to workspace
  console.log('🔄 Navigating to workspace...');
  await page.goto(WORKSPACE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await delay(2000);

  // Count songs in workspace
  const songCount = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/(\d+)\s+songs?/i);
    return match ? parseInt(match[1]) : 0;
  });
  console.log(`✅ Workspace has ${songCount} song(s)`);

  if (songCount === 0) {
    console.error('❌ No songs found. Exiting.');
    process.exit(1);
  }

  // Find all "More options" buttons
  let moreButtons = await page.$$('button[aria-label="More options"]');
  console.log(`   Found ${moreButtons.length} "More options" buttons`);

  let added = 0;
  let failed = 0;

  for (let i = 0; i < moreButtons.length; i++) {
    // Re-query buttons each iteration (DOM may have changed)
    moreButtons = await page.$$('button[aria-label="More options"]');
    const btn = moreButtons[i];
    if (!btn) { console.log(`   ⚠️  Button ${i} gone, skipping`); continue; }

    console.log(`\n   [${i + 1}/${moreButtons.length}] Clicking "More options"...`);

    // Scroll button into view and click
    await btn.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await delay(300);
    await btn.click();
    await delay(1500); // Wait for dropdown to render

    // Look for "Add to Playlist" in the dropdown
    const addBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => {
        const spans = b.querySelectorAll('span');
        for (const s of spans) {
          if (s.textContent.trim() === 'Add to Playlist') return true;
        }
        return b.innerText.includes('Add to Playlist') && !b.innerText.includes('Add to Queue');
      }) || null;
    });

    const addBtnEl = addBtn.asElement();
    if (!addBtnEl) {
      console.log(`   ⚠️  "Add to Playlist" not found in menu, pressing Escape`);
      await page.keyboard.press('Escape');
      await delay(500);
      failed++;
      continue;
    }

    console.log(`   Clicking "Add to Playlist"...`);
    await addBtnEl.click();
    await delay(1500); // Wait for playlist picker to render

    // Try to find and click the target playlist
    const clicked = await page.evaluate((name) => {
      // Look for elements that contain the playlist name and have an image (playlist icon)
      const candidates = Array.from(document.querySelectorAll('*'));
      for (const el of candidates) {
        if (el.children.length > 0 &&
            el.children.length < 10 &&
            el.textContent.trim() === name &&
            el.querySelector('img')) {
          el.click();
          return 'clicked-exact';
        }
      }
      // Fallback: look for any clickable element with the playlist name
      for (const el of candidates) {
        if (el.textContent.trim() === name &&
            (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button')) {
          el.click();
          return 'clicked-fallback';
        }
      }
      return 'not-found';
    }, PLAYLIST);

    if (clicked.startsWith('clicked')) {
      console.log(`   ✅ Added to "${PLAYLIST}" (${clicked})`);
      added++;
    } else {
      console.log(`   ❌ Playlist "${PLAYLIST}" not found in picker`);
      await page.keyboard.press('Escape');
      failed++;
    }

    await delay(1000); // Let UI settle before next song
  }

  console.log(`\n📊 Results: ${added} added, ${failed} failed, ${moreButtons.length} total`);

  // Verify by checking playlist
  console.log('\n🔄 Verifying playlist...');
  await page.goto('https://suno.com/me/playlists', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);

  const playlistInfo = await page.evaluate((name) => {
    const links = Array.from(document.querySelectorAll('a'));
    for (const a of links) {
      if (a.textContent.includes(name)) {
        const href = a.getAttribute('href');
        const countMatch = a.parentElement?.textContent.match(/(\d+)\s+songs?/i);
        return { href, count: countMatch ? parseInt(countMatch[1]) : -1 };
      }
    }
    return null;
  }, PLAYLIST);

  if (playlistInfo) {
    console.log(`✅ Playlist "${PLAYLIST}": ${playlistInfo.count} song(s)`);
    console.log(`   📍 https://suno.com${playlistInfo.href}`);
    
    if (playlistInfo.count === songCount) {
      console.log(`\n✅ VERIFIED: Playlist (${playlistInfo.count}) = Workspace (${songCount})`);
    } else {
      console.log(`\n⚠️  MISMATCH: Playlist (${playlistInfo.count}) ≠ Workspace (${songCount})`);
    }
  } else {
    console.log(`❌ Playlist "${PLAYLIST}" not found`);
  }

  // Disconnect (don't close — it's the shared browser)
  browser.disconnect();
  console.log('\n🏁 Done.');
})();
