import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page) {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__portfolioMotion?.snapshot().ready);
  await expect(page.locator('h1')).toHaveClass(/gpu-type-ready/);
}
async function freeze(page: Page) {
  await page.evaluate(() => { document.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); }); window.__portfolioMotion?.freeze(4); });
  await page.waitForTimeout(100);
}
test('visual: desktop GPU typography and persistent field', async ({ page }) => {
  await ready(page); await freeze(page);
  await expect(page).toHaveScreenshot('desktop-hero.png');
});
test('visual: mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page); await freeze(page);
  await expect(page).toHaveScreenshot('mobile-hero.png');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
test('visual: real project footage and source links', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => document.getElementById('work')!.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await freeze(page);
  await expect(page).toHaveScreenshot('selected-work.png');
  for (const name of ['forest']) {
    const response = await page.request.get(`/media/${name}.mp4`);
    expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type']).toBe('video/mp4');
  }
});
test('same GPU canvas and clock survive route navigation, return and history', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { (window as any).__originalCanvas = document.querySelector('canvas.motion-world'); });
  const before = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  await page.getByRole('link', { name: 'Explore CYBR GEO', exact: true }).click();
  await expect(page.locator('h1')).toHaveText(/CYBR\s*GEO/);
  expect(await page.evaluate(() => (window as any).__originalCanvas === document.querySelector('canvas.motion-world'))).toBeTruthy();
  const after = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  expect(after.time).toBeGreaterThan(before.time);
  expect(after.contextLosses).toBe(0);
  await page.getByRole('link', { name: 'All selected work', exact: true }).click();
  await expect(page.locator('.featured-cybr-geo')).toBeInViewport();
  await page.goBack(); await expect(page.locator('h1')).toHaveText(/CYBR\s*GEO/);
});
test('scroll continuously interpolates between project motifs', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => {
    const center = (id: string) => { const rect = document.getElementById(`${id}-scene`)!.getBoundingClientRect(); return rect.top + scrollY + rect.height * 0.42; };
    window.scrollTo({ top: (center('cybr-geo') + center('cybr-scenes')) / 2 - innerHeight * 0.42, behavior: 'instant' });
  });
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  expect(state.weights[3]).toBeGreaterThan(0.3);
  expect(state.weights[3]).toBeLessThan(0.7);
  expect(state.weights[4]).toBeGreaterThan(0.3);
  expect(state.weights[4]).toBeLessThan(0.7);
  expect(state.weights.slice(0, 2)).toEqual([0, 0]);
  expect(state.weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 3);
});
test('reduced motion is static, keeps text readable, and does not autoplay footage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await ready(page);
  const first = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  await page.waitForTimeout(500);
  const second = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  expect(second.time).toBe(first.time);
  expect(second.frames - first.frames).toBeLessThan(3);
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
  await page.locator('.featured-cybr-forest').scrollIntoViewIfNeeded();
  expect(await page.locator('video[data-world-media="forest"]').evaluate((el: HTMLVideoElement) => el.paused)).toBeTruthy();
});
test('WebGL unavailable: all content and navigation remain usable', async ({ page }) => {
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(kind: any, ...rest: any[]) { return kind === 'webgl2' ? null : original.call(this, kind, ...rest); } as any; });
  await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('data-gpu', 'fallback');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
  await page.getByRole('link', { name: 'Explore CYBR GEO', exact: true }).click();
  await expect(page.locator('h1')).toHaveText(/CYBR\s*GEO/);
});
test('GPU context loss restores the same presentation safely', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { const gl = document.querySelector<HTMLCanvasElement>('canvas')!.getContext('webgl2')!; (window as any).__loss = gl.getExtension('WEBGL_lose_context'); (window as any).__loss?.loseContext(); });
  await expect(page.locator('html')).toHaveAttribute('data-gpu', 'fallback');
  await expect(page.locator('h1')).not.toHaveClass(/gpu-type-ready/);
  await page.evaluate(() => (window as any).__loss.restoreContext());
  await page.waitForFunction(() => window.__portfolioMotion?.snapshot().ready);
  expect(await page.evaluate(() => window.__portfolioMotion!.snapshot().contextLosses)).toBe(1);
});
test('motion switch persists and restores visible DOM headings', async ({ page }) => {
  await ready(page);
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-gpu', 'disabled');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-gpu', 'disabled');
  await expect(page.locator('h1')).not.toHaveClass(/gpu-type-ready/);
});
test('mobile menu, keyboard escape and all detail routes work', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 }); await ready(page);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
  for (const id of ['cybr-light','cybr-geo','cybr-scenes','aqua','ignia','cybr-forest','drone-sim-studio','amber-lab','cnt-workbench','firesim','llmwiki']) {
    await page.goto(`/project/${id}`); await expect(page.locator('.dossier')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
test('performance: bounded pixels, draw calls, startup bytes and renderer CPU', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await ready(page); await page.waitForTimeout(2400);
  const desktop = await page.evaluate(() => { const canvas = document.querySelector<HTMLCanvasElement>('canvas')!; return { ...window.__portfolioMotion!.snapshot(), pixels: canvas.width * canvas.height }; });
  expect(errors).toEqual([]); expect(desktop.pixels).toBeLessThanOrEqual(1_705_000); expect(desktop.drawCalls).toBeLessThanOrEqual(3); expect(desktop.cpuP95Ms).toBeLessThan(30);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector<HTMLCanvasElement>('canvas')!.width < 700);
  const mobilePixels = await page.evaluate(() => { const canvas = document.querySelector<HTMLCanvasElement>('canvas')!; return canvas.width * canvas.height; });
  expect(mobilePixels).toBeLessThan(600_000);
  await test.info().attach('software-GPU-performance', { body: JSON.stringify(desktop, null, 2), contentType: 'application/json' });
});
test('resume is complete and print stylesheet excludes navigation', async ({ page }) => {
  await page.goto('/resume'); await expect(page.locator('h1')).toHaveText('Alejandro Figueroa');
  await expect(page.getByText('September 2021—present')).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).not.toBeVisible(); await expect(page.locator('.resume-actions')).not.toBeVisible();
});

test('all project scenes fit narrow screens and retain project-specific content', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  for (const id of ['cybr-light', 'cybr-geo', 'cybr-scenes', 'cybr-forest']) {
    const scene = page.locator(`#${id}-scene`);
    await scene.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.__portfolioMotion?.freeze(4));
    await expect(scene.locator('.chapter-description')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await test.info().attach(`${id}-mobile`, { body: await page.screenshot(), contentType: 'image/png' });
    await page.evaluate(() => window.__portfolioMotion?.resume());
  }
});

test('curation features four CYBR systems with consecutive numbering and no archive requests', async ({ page }) => {
  const archiveRequests: string[] = [];
  page.on('request', request => { if (/\/media\/(aqua|ignia)\.(mp4|webp)(?:\?|$)/.test(request.url())) archiveRequests.push(request.url()); });
  await ready(page);
  await expect(page.locator('.work-index a')).toHaveText(['01CYBR LIGHT', '02CYBR GEO', '03CYBR SCENES', '04CYBR FOREST']);
  await expect(page.locator('.chapter-top > span:first-child')).toHaveText(['01 / 04', '02 / 04', '03 / 04', '04 / 04']);
  for (const id of ['aqua', 'ignia', 'drone-sim-studio', 'amber-lab', 'cnt-workbench', 'firesim', 'llmwiki']) {
    await expect(page.locator(`.featured-${id}`)).toHaveCount(0);
    await expect(page.locator(`a[href="/project/${id}"]`)).toHaveCount(0);
  }
  await expect(page.locator('[data-world-media="water"], [data-world-media="fire"]')).toHaveCount(0);
  for (const id of ['cybr-light', 'cybr-geo', 'cybr-scenes']) {
    const image = page.locator(`.featured-${id} .chapter-render img`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(600);
  }
  await page.locator('.featured-cybr-forest').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.__portfolioMotion!.snapshot().weights[5])).toBeGreaterThan(0.35);
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await page.goto('/resume');
  await expect(page.locator('.resume-projects h3')).toHaveText(['CYBR LIGHT','CYBR GEO','CYBR SCENES','CYBR FOREST']);
  expect(archiveRequests).toEqual([]);
  await page.goto('/project/cybr-scenes');
  await expect(page.locator('.next-project')).toHaveAttribute('href', '/project/cybr-forest');
  await expect(page.locator('.next-project .eyebrow')).toHaveText('Next project / 04');
  await page.locator('.next-project').click();
  await expect(page.locator('.next-project')).toHaveAttribute('href', '/project/cybr-light');
  await expect(page.locator('.next-project .eyebrow')).toHaveText('Next project / 01');
});

test('AQUA and IGNIA archive routes retain footage without remounting the GPU canvas', async ({ page }) => {
  for (const [id, motif] of [['aqua', 'water'], ['ignia', 'fire']]) {
    await page.goto(`/project/${id}`);
    await page.waitForFunction(() => window.__portfolioMotion?.snapshot().ready);
    await page.evaluate(() => { (window as any).__originalCanvas = document.querySelector('canvas.motion-world'); });
    await expect(page.locator('h1')).toHaveText(id.toUpperCase());
    await expect(page.locator('.detail-hero > .eyebrow')).toContainText('Archive /');
    await expect(page.getByRole('link', { name: 'View source', exact: true })).toHaveAttribute('href', /https:\/\/github\.com\/cybrdelic\//);
    await expect(page.getByRole('link', { name: 'Watch video', exact: true })).toHaveAttribute('href', `/media/${id}.mp4`);
    await expect(page.locator('.detail-media video')).toHaveAttribute('src', `/media/${id}.mp4`);
    await expect(page.locator('.detail-media video')).toHaveAttribute('poster', `/media/${id}.webp`);
    const source = page.locator(`video[data-world-media="${motif}"]`);
    const decodesH264 = await source.evaluate((video: HTMLVideoElement) => !!video.canPlayType('video/mp4; codecs="avc1.64001f"'));
    const expectVideoOrPoster = async () => {
      if (decodesH264) await expect.poll(() => source.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
      else await expect.poll(() => source.evaluate((video: HTMLVideoElement) => video.error?.code)).toBe(4);
    };
    await expectVideoOrPoster();
    await test.info().attach(`${id}-codec-support`, { body: JSON.stringify({ decodesH264 }), contentType: 'application/json' });
    if (!decodesH264) {
      // Playwright's open Chromium build lacks H.264; verify the real-poster fallback too.
      await page.locator('.detail-media').scrollIntoViewIfNeeded();
      const poster = page.locator('.detail-media img');
      await expect(poster).toHaveAttribute('src', `/media/${id}.webp`);
      await expect.poll(() => poster.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(page.locator('.next-project')).toHaveAttribute('href', '/project/cybr-light');
    const response = await page.request.get(`/media/${id}.mp4`);
    expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type']).toBe('video/mp4');
    await page.getByRole('link', { name: 'All selected work', exact: true }).click();
    await expect(page.locator('.featured-cybr-light')).toBeInViewport();
    await expect(page.locator('[data-world-media="water"], [data-world-media="fire"]')).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__originalCanvas === document.querySelector('canvas.motion-world'))).toBeTruthy();
    await page.goBack();
    await expect(page.locator('h1')).toHaveText(id.toUpperCase());
    await expectVideoOrPoster();
    expect(await page.evaluate(() => (window as any).__originalCanvas === document.querySelector('canvas.motion-world'))).toBeTruthy();
    await page.getByRole('link', { name: 'All selected work', exact: true }).click();
    await expect(page.locator('.featured-cybr-light')).toBeInViewport();
    await expect(page.locator('[data-world-media="water"], [data-world-media="fire"]')).toHaveCount(0);
    expect(await page.evaluate(() => window.__portfolioMotion!.snapshot().contextLosses)).toBe(0);
  }
});

test('visual: four-project index and final forest scene', async ({ page }) => {
  await ready(page);
  await page.locator('.work-index').scrollIntoViewIfNeeded();
  await expect(page.locator('.work-index')).toHaveScreenshot('featured-index.png');
  await page.locator('.featured-cybr-forest').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(500);
  await freeze(page);
  await expect(page).toHaveScreenshot('featured-forest.png');
});

test('native gallery switches assembled, exploded and raw output with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [id, label, asset] of [['cybr-geo', 'Exploded assembly', '/media/geo-exploded.webp'], ['cybr-light', 'Unfiltered', '/media/light-raw.webp']]) {
    await page.goto(`/project/${id}`);
    const control = page.getByRole('button', { name: label, exact: true });
    await control.click();
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    const image = page.locator('.render-gallery img');
    await expect(image).toHaveAttribute('src', asset);
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(600);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
