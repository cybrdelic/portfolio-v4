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
  for (const name of ['aqua', 'ignia']) {
    const response = await page.request.get(`/media/${name}.mp4`);
    expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type']).toBe('video/mp4');
  }
});
test('same GPU canvas and clock survive route navigation, return and history', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { (window as any).__originalCanvas = document.querySelector('canvas.motion-world'); });
  const before = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  await page.getByRole('link', { name: 'Explore AQUA', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('AQUA');
  expect(await page.evaluate(() => (window as any).__originalCanvas === document.querySelector('canvas.motion-world'))).toBeTruthy();
  const after = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  expect(after.time).toBeGreaterThan(before.time);
  expect(after.contextLosses).toBe(0);
  await page.getByRole('link', { name: 'All selected work', exact: true }).click();
  await expect(page.locator('.featured-aqua')).toBeInViewport();
  await page.goBack(); await expect(page.locator('h1')).toHaveText('AQUA');
});
test('scroll continuously interpolates between project motifs', async ({ page }) => {
  await ready(page);
  await page.locator('.featured-ignia').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => window.__portfolioMotion!.snapshot());
  expect(state.weights[1]).toBeGreaterThan(0.35);
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
  await page.locator('.featured-aqua').scrollIntoViewIfNeeded();
  expect(await page.locator('video').first().evaluate((el: HTMLVideoElement) => el.paused)).toBeTruthy();
});
test('WebGL unavailable: all content and navigation remain usable', async ({ page }) => {
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(kind: any, ...rest: any[]) { return kind === 'webgl2' ? null : original.call(this, kind, ...rest); } as any; });
  await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('data-gpu', 'fallback');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).color)).not.toBe('rgba(0, 0, 0, 0)');
  await page.getByRole('link', { name: 'Explore AQUA', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('AQUA');
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
  for (const id of ['aqua','ignia','drone-sim-studio','amber-lab','cnt-workbench','firesim','llmwiki']) {
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
  for (const id of ['ignia', 'drone-sim-studio', 'amber-lab', 'cnt-workbench', 'firesim', 'llmwiki']) {
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

test('chirality changes the rendered lattice even with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page);
  await page.locator('#cnt-workbench-scene').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(700);
  const before = await page.locator('canvas.motion-world').screenshot();
  const armchair = page.getByRole('button', { name: '(8, 8)', exact: true });
  await armchair.click();
  await expect(armchair).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(250);
  const after = await page.locator('canvas.motion-world').screenshot();
  expect(after.equals(before)).toBeFalsy();
});
