import { expect, test } from '@playwright/test';

type ViewportSpec = {
  height: number;
  label: string;
  width: number;
};

type RouteSpec = {
  name: string;
  path: string;
};

type AuditIssue = {
  detail: string;
  kind:
    | 'horizontal-overflow'
    | 'offscreen'
    | 'clipped-by-ancestor'
    | 'sticky-too-tall'
    | 'overlap';
  target: string;
};

const viewports: ViewportSpec[] = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'laptop', width: 1280, height: 800 },
  { label: 'tablet', width: 1024, height: 1366 },
  { label: 'mobile', width: 390, height: 844 },
];

const routes: RouteSpec[] = [
  { name: 'home', path: '/' },
  { name: 'projects-catalog', path: '/projects' },
  { name: 'project-jjugg', path: '/project/jjugg' },
];

function formatIssues(viewport: ViewportSpec, route: RouteSpec, issues: AuditIssue[]) {
  return [
    `${route.name} @ ${viewport.label} (${viewport.width}x${viewport.height})`,
    ...issues.map((issue) => `- [${issue.kind}] ${issue.target} :: ${issue.detail}`),
  ].join('\n');
}

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${route.name} has no measurable layout violations at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route.path, { waitUntil: 'networkidle' });

      const issues = await page.evaluate<AuditIssue[]>(() => {
        const tolerance = 1;
        const overlapTolerance = 3;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const root = document.documentElement;
        const results: AuditIssue[] = [];

        const skipTags = new Set(['HTML', 'BODY', 'SCRIPT', 'STYLE', 'NOSCRIPT']);
        const textTags = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'BUTTON', 'LI', 'SPAN']);

        const pathFor = (element: Element) => {
          const id = element.id ? `#${element.id}` : '';
          const classes = Array.from(element.classList).slice(0, 3).join('.');
          const classSuffix = classes ? `.${classes}` : '';
          const name = element.nodeName.toLowerCase();
          return `${name}${id}${classSuffix}`;
        };

        const isVisible = (element: Element) => {
          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return false;
          }

          const rect = (element as HTMLElement).getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && Number(style.opacity) > 0;
        };

        const hasMeaningfulText = (element: Element) => {
          if (textTags.has(element.tagName)) {
            return (element.textContent || '').trim().length > 0;
          }

          const directText = Array.from(element.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE && (node.textContent || '').trim().length > 0
          );

          return directText;
        };

        const isDecorative = (element: Element) => {
          const style = window.getComputedStyle(element);
          const rect = (element as HTMLElement).getBoundingClientRect();
          if (rect.width <= 2 || rect.height <= 2) {
            return true;
          }

          if (style.pointerEvents === 'none' && !hasMeaningfulText(element)) {
            return true;
          }

          return false;
        };

        const auditTargets = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter((element) => {
          if (skipTags.has(element.tagName) || !isVisible(element) || isDecorative(element)) {
            return false;
          }

          if (
            element.matches('main, section, article, header, footer, nav, h1, h2, h3, h4, h5, h6, p, a, button, li')
          ) {
            return true;
          }

          const style = window.getComputedStyle(element);
          return style.position === 'sticky' || style.position === 'fixed' || hasMeaningfulText(element);
        });

        if (root.scrollWidth > viewportWidth + tolerance) {
          results.push({
            kind: 'horizontal-overflow',
            target: 'document',
            detail: `scrollWidth ${root.scrollWidth}px exceeds viewport ${viewportWidth}px`,
          });
        }

        for (const element of auditTargets) {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const target = pathFor(element);

          if (style.position === 'sticky' && rect.height > viewportHeight + tolerance) {
            results.push({
              kind: 'sticky-too-tall',
              target,
              detail: `sticky height ${rect.height.toFixed(1)}px exceeds viewport height ${viewportHeight}px`,
            });
          }

          const offscreenHorizontally = rect.left < -tolerance || rect.right > viewportWidth + tolerance;
          const verticallyRelevant = rect.bottom > 0 && rect.top < viewportHeight;
          if (offscreenHorizontally && verticallyRelevant) {
            results.push({
              kind: 'offscreen',
              target,
              detail: `bounds [${rect.left.toFixed(1)}, ${rect.right.toFixed(1)}] escape viewport width ${viewportWidth}px`,
            });
          }

          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const ancestorStyle = window.getComputedStyle(ancestor);
            if (
              ancestorStyle.overflow === 'hidden' ||
              ancestorStyle.overflowX === 'hidden' ||
              ancestorStyle.overflowY === 'hidden' ||
              ancestorStyle.overflow === 'clip'
            ) {
              const ancestorRect = ancestor.getBoundingClientRect();
              const clipsHorizontally =
                rect.left < ancestorRect.left - tolerance || rect.right > ancestorRect.right + tolerance;
              const clipsVertically =
                rect.top < ancestorRect.top - tolerance || rect.bottom > ancestorRect.bottom + tolerance;
              if ((clipsHorizontally || clipsVertically) && hasMeaningfulText(element)) {
                results.push({
                  kind: 'clipped-by-ancestor',
                  target,
                  detail: `content exceeds clipping ancestor ${pathFor(ancestor)}`,
                });
                break;
              }
            }
            ancestor = ancestor.parentElement;
          }
        }

        const overlapTargets = auditTargets.filter((element) => {
          if (!element.matches('h1, h2, h3, h4, h5, h6, p, a, button, li')) {
            return false;
          }
          const rect = element.getBoundingClientRect();
          return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
        });

        for (let i = 0; i < overlapTargets.length; i += 1) {
          for (let j = i + 1; j < overlapTargets.length; j += 1) {
            const a = overlapTargets[i];
            const b = overlapTargets[j];

            if (a.contains(b) || b.contains(a)) {
              continue;
            }

            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            const intersectWidth = Math.min(aRect.right, bRect.right) - Math.max(aRect.left, bRect.left);
            const intersectHeight = Math.min(aRect.bottom, bRect.bottom) - Math.max(aRect.top, bRect.top);

            if (intersectWidth > overlapTolerance && intersectHeight > overlapTolerance) {
              results.push({
                kind: 'overlap',
                target: `${pathFor(a)} <-> ${pathFor(b)}`,
                detail: `intersection ${intersectWidth.toFixed(1)}x${intersectHeight.toFixed(1)}px`,
              });
            }
          }
        }

        const deduped = new Map<string, AuditIssue>();
        for (const issue of results) {
          deduped.set(`${issue.kind}:${issue.target}:${issue.detail}`, issue);
        }

        return Array.from(deduped.values());
      });

      expect(issues, formatIssues(viewport, route, issues)).toEqual([]);
    });
  }
}
