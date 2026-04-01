import { chromium } from '@playwright/test';

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1280, height: 720 },
];

const sections = [
  { key: 'ethos', selector: '.ethos-shell' },
  { key: 'workingStyle', selector: '.working-style-shell' },
  { key: 'projects', selector: '.project-stage-shell' },
];

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => {
    sessionStorage.setItem('boot-sequence-seen', '1');
  });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  console.log(`\nViewport ${viewport.width}x${viewport.height}`);

  for (const section of sections) {
    const data = await page.locator(section.selector).evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const content = node.querySelector('.section-content, .ethos-stage, .working-style-stage, .project-stage-frame');
      const contentRect = content ? content.getBoundingClientRect() : null;
      return {
        height: rect.height,
        top: rect.top,
        contentHeight: contentRect?.height ?? null,
        contentTop: contentRect?.top ?? null,
        scrollHeight: node.scrollHeight,
      };
    });

    console.log(section.key, JSON.stringify(data));
  }
}

await browser.close();
