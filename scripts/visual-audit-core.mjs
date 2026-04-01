import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'laptop', width: 1280, height: 800 },
  { label: 'mobile', width: 390, height: 844 },
];

export const routes = [
  { name: 'home', path: '/' },
  { name: 'projects-catalog', path: '/projects' },
  { name: 'project-jjugg', path: '/project/jjugg' },
];

export const defaultThresholds = {
  adjacentLayoutSwitches: 3,
  contentSpread: 10,
  contentTopOffsetSpread: 28,
  diffPixels: 0,
  diffRatio: 0,
  dominantSections: 3,
  dominantTextSpread: 18,
  domainCardHeightSpread: 80,
  essayLeadSpread: 13,
  experienceCardHeightSpread: 120,
  labelSpread: 6,
  labelTopOffsetSpread: 20,
  monoLabelRatio: 0.9,
  railGapSpread: 12,
  ruleSpread: 10,
  ruleTopOffsetSpread: 28,
  uniqueLayoutFamilies: 4,
  uniqueSurfaceModels: 3,
  wideTextBlocks: 0,
};

export function round(value) {
  return Math.round(value * 10) / 10;
}

function range(values) {
  if (!values.length) return 0;
  return Math.max(...values) - Math.min(...values);
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export async function prepareAuditedPage(page, { route, viewport, baseUrl }) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    sessionStorage.setItem('boot-sequence-seen', '1');
  });
  await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' });
}

export async function captureAuditScreenshot(page, screenshotPath) {
  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: screenshotPath,
    timeout: 120000,
  });
}

export async function collectVisualSnapshot(page, { route, viewport, baseUrl, screenshotPath }) {
  await prepareAuditedPage(page, { route, viewport, baseUrl });

  if (screenshotPath) {
    await captureAuditScreenshot(page, screenshotPath);
  }

  return page.evaluate(({ routeName, viewportLabel }) => {
    const roundValue = (value) => Math.round(value * 10) / 10;
    const medianValue = (values) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((left, right) => left - right);
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
    };
    const maxMeasureDesktop = 760;
    const maxMeasureMobile = Math.min(window.innerWidth - 64, 320);
    const maxMeasure = window.innerWidth <= 480 ? maxMeasureMobile : maxMeasureDesktop;
    const dominantTextThreshold = window.innerWidth <= 480 ? 24 : 30;

    const visible = (element) => {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
        return false;
      }

      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const classifySectionLayout = (section) => {
      if (section.matches('.ethos-shell, .working-style-shell') || section.querySelector('.thesis-stage')) {
        return 'editorial-essay';
      }
      if (
        section.matches('.domains-shell, .experience-shell, .technical-profile-shell') ||
        section.querySelector('.domains-matrix, .experience-stack, .technical-reference-list, .project-face-shell')
      ) {
        return 'structured-list';
      }
      if (section.matches('.project-stage-shell') || section.querySelector('.project-stage-frame')) {
        return 'immersive-stage';
      }
      if (section.querySelector('.section-copy-stage')) {
        return 'copy-intro';
      }
      return 'generic';
    };

    const classifySurfaceModel = (layoutFamily, borderedElementCount) => {
      if (layoutFamily === 'immersive-stage') {
        return 'immersive';
      }
      if (borderedElementCount === 0) {
        return 'open';
      }
      if (borderedElementCount <= 3) {
        return 'framed';
      }
      return 'segmented';
    };

    const textSelector = [
      '.section-content p',
      '.ethos-stage p',
      '.working-style-stage p',
      '.domain-card-description',
      '.domain-card-scope',
      '.experience-card-summary',
      '.experience-highlight-detail',
      '.technical-reference-primary',
      '.technical-reference-detail',
      '.project-stage-intro',
      '.catalog-page-deck',
      '.catalog-project-description',
      '.catalog-tech-copy',
      '.catalog-date-copy',
      '.catalog-source-copy',
      '.project-detail-copy',
      '.project-detail-closing',
      '.project-detail-intro',
    ].join(', ');

    const auditedContainers = Array.from(
      document.querySelectorAll(
        'main > section, article.project-detail-shell .project-detail-intro-shell, article.project-detail-shell .project-detail-section, footer.footer-shell'
      )
    );

    const sections = auditedContainers.map((section, index) => {
      const label = section.querySelector('.section-label, .project-detail-section-label');
      const content = section.querySelector(
        '.section-content, .ethos-stage, .working-style-stage, .project-stage-frame, .section-list, .domains-matrix, .experience-stack, .technical-reference-list, .project-detail-intro-content, .project-detail-section-body, .project-detail-copy, .project-detail-closing, .project-detail-intro, .project-detail-cta, .footer-contact-rail'
      );
      const rule = section.querySelector('.section-copy-rule');
      const firstText = content?.querySelector('p, h1, h2, h3, li');
      const layoutFamily = classifySectionLayout(section);
      const dominantCandidates = Array.from(
        section.querySelectorAll(
          '.section-copy-stage .section-copy-lead, .thesis-dominant, .project-face-title, .catalog-page-title, .project-detail-title'
        )
      ).filter((element) => visible(element));
      const dominantTextSizes = dominantCandidates.map((element) =>
        parseFloat(window.getComputedStyle(element).fontSize)
      );
      const dominantTextSize = dominantTextSizes.length ? Math.max(...dominantTextSizes) : 0;
      const borderedElementCount = section.querySelectorAll(
        '.ethos-principle-card, .working-style-principle-card, .domain-card, .experience-card, .experience-highlight-card, .technical-reference-item, .project-face-shell'
      ).length;
      const surfaceModel = classifySurfaceModel(layoutFamily, borderedElementCount);
      const rect = section.getBoundingClientRect();
      const labelRect = label ? label.getBoundingClientRect() : null;
      const contentRect = content ? content.getBoundingClientRect() : null;
      const ruleRect = rule ? rule.getBoundingClientRect() : null;
      const firstTextRect = firstText ? firstText.getBoundingClientRect() : null;

      return {
        borderedElementCount,
        className: section.className,
        contentLeft: contentRect ? roundValue(contentRect.left) : null,
        contentTopOffset: contentRect ? roundValue(contentRect.top - rect.top) : null,
        contentWidth: contentRect ? roundValue(contentRect.width) : null,
        dominantTextCount: dominantTextSizes.filter((value) => value >= dominantTextThreshold).length,
        dominantTextSize: roundValue(dominantTextSize),
        hasDominantVoice: dominantTextSize >= dominantTextThreshold,
        height: roundValue(rect.height),
        index,
        labelLeft: labelRect ? roundValue(labelRect.left) : null,
        labelText: label ? label.textContent?.trim() ?? null : null,
        labelTopOffset: labelRect ? roundValue(labelRect.top - rect.top) : null,
        layoutFamily,
        railGap: labelRect && contentRect ? roundValue(contentRect.left - labelRect.left) : null,
        ruleLeft: ruleRect ? roundValue(ruleRect.left) : null,
        rulePresent: Boolean(rule),
        ruleTopOffset: ruleRect ? roundValue(ruleRect.top - rect.top) : null,
        stickyRail: Boolean(section.querySelector('.section-rail--sticky, .project-stage-sticky')),
        surfaceModel,
        textAfterRuleGap: ruleRect && firstTextRect ? roundValue(firstTextRect.top - ruleRect.bottom) : null,
      };
    });

    const textBlocks = Array.from(document.querySelectorAll(textSelector))
      .filter((element) => visible(element) && (element.textContent || '').trim().length > 24)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          className: element.className,
          text: (element.textContent || '').trim().slice(0, 120),
          width: roundValue(rect.width),
        };
      });

    const wideTextBlocks = textBlocks.filter((item) => item.width > maxMeasure);

    const getHeights = (selector) =>
      Array.from(document.querySelectorAll(selector))
        .filter((element) => visible(element))
        .map((element) => element.getBoundingClientRect().height);

    const domainCardHeights = getHeights('.domain-card');
    const experienceCardHeights = getHeights('.experience-card');
    const monoLabels = document.querySelectorAll(
      '.section-label, .technical-row-signal-label, .eyebrow, .hero-stat-index, .project-face-type, .domain-card-signal, .technical-reference-signal'
    ).length;
    const bodyCopy = document.querySelectorAll('main p').length;
    const sectionHeights = sections.map((section) => section.height).filter((value) => value > 0);

    return {
      bodyCopy,
      domainCardHeightSpread:
        domainCardHeights.length > 1 ? Math.max(...domainCardHeights) - Math.min(...domainCardHeights) : 0,
      experienceCardHeightSpread:
        experienceCardHeights.length > 1 ? Math.max(...experienceCardHeights) - Math.min(...experienceCardHeights) : 0,
      monoLabelRatio: bodyCopy > 0 ? monoLabels / bodyCopy : 0,
      monoLabels,
      routeName,
      sectionHeightMedian: roundValue(medianValue(sectionHeights)),
      sections,
      viewportLabel,
      wideTextBlocks,
    };
  }, { routeName: route.name, viewportLabel: viewport.label });
}

export function analyzeSnapshot(snapshot, thresholds = defaultThresholds) {
  const issues = [];
  const measuredSections = snapshot.sections.filter((section) => section.labelLeft !== null);
  const labeledSections = snapshot.sections.filter((section) => section.labelText !== null);
  const rhythmSections = measuredSections.filter((section) => !section.className.includes('footer-shell'));
  const labelSpread = range(measuredSections.map((section) => section.labelLeft));
  const contentSpread = range(measuredSections.map((section) => section.contentLeft).filter((value) => value !== null));
  const ruleSpread = range(measuredSections.map((section) => section.ruleLeft).filter((value) => value !== null));
  const railGapSpread = range(measuredSections.map((section) => section.railGap).filter((value) => value !== null));
  const labelTopOffsetSpread = range(rhythmSections.map((section) => section.labelTopOffset).filter((value) => value !== null));
  const contentTopOffsetSpread = range(rhythmSections.map((section) => section.contentTopOffset).filter((value) => value !== null));
  const ruleTopOffsetSpread = range(rhythmSections.map((section) => section.ruleTopOffset).filter((value) => value !== null));
  const layoutFamilies = labeledSections.map((section) => section.layoutFamily);
  const uniqueLayoutFamilies = new Set(layoutFamilies).size;
  const adjacentLayoutSwitches = layoutFamilies.reduce(
    (count, family, index) => (index > 0 && family !== layoutFamilies[index - 1] ? count + 1 : count),
    0
  );
  const surfaceModels = labeledSections.map((section) => section.surfaceModel);
  const uniqueSurfaceModels = new Set(surfaceModels).size;
  const dominantTextSpread = range(
    labeledSections
      .filter((section) => section.hasDominantVoice)
      .map((section) => section.dominantTextSize)
      .filter((value) => value > 0)
  );
  const dominantSections = labeledSections.filter((section) => section.hasDominantVoice).length;
  const essayLeadSpread = range(
    labeledSections
      .filter((section) => section.layoutFamily === 'editorial-essay')
      .map((section) => section.dominantTextSize)
      .filter((value) => value > 0)
  );

  if (labelSpread > thresholds.labelSpread) {
    issues.push(`Section label rail shifts by ${round(labelSpread)}px.`);
  }
  if (contentSpread > thresholds.contentSpread) {
    issues.push(`Primary content left edge shifts by ${round(contentSpread)}px.`);
  }
  if (ruleSpread > thresholds.ruleSpread) {
    issues.push(`Section copy rules are not aligning consistently; spread is ${round(ruleSpread)}px.`);
  }
  if (railGapSpread > thresholds.railGapSpread) {
    issues.push(`Rail-to-content gap varies by ${round(railGapSpread)}px.`);
  }
  if (labelTopOffsetSpread > thresholds.labelTopOffsetSpread) {
    issues.push(`Section label top rhythm varies by ${round(labelTopOffsetSpread)}px.`);
  }
  if (contentTopOffsetSpread > thresholds.contentTopOffsetSpread) {
    issues.push(`Section content top rhythm varies by ${round(contentTopOffsetSpread)}px.`);
  }
  if (ruleTopOffsetSpread > thresholds.ruleTopOffsetSpread) {
    issues.push(`Copy-rule top rhythm varies by ${round(ruleTopOffsetSpread)}px.`);
  }
  if (snapshot.wideTextBlocks.length > thresholds.wideTextBlocks) {
    issues.push(`${snapshot.wideTextBlocks.length} text blocks exceed target measure.`);
  }
  if (snapshot.domainCardHeightSpread > thresholds.domainCardHeightSpread) {
    issues.push(`Domain card heights vary by ${round(snapshot.domainCardHeightSpread)}px.`);
  }
  if (snapshot.experienceCardHeightSpread > thresholds.experienceCardHeightSpread) {
    issues.push(`Experience card heights vary by ${round(snapshot.experienceCardHeightSpread)}px.`);
  }
  if (snapshot.monoLabelRatio > thresholds.monoLabelRatio) {
    issues.push(`Mono/system labels are dense relative to body copy (ratio ${round(snapshot.monoLabelRatio)}).`);
  }
  if (snapshot.routeName === 'home' && uniqueLayoutFamilies > thresholds.uniqueLayoutFamilies) {
    issues.push(`Home uses ${uniqueLayoutFamilies} section archetypes across labeled sections.`);
  }
  if (snapshot.routeName === 'home' && adjacentLayoutSwitches > thresholds.adjacentLayoutSwitches) {
    issues.push(`Home switches composition archetype ${adjacentLayoutSwitches} times across adjacent sections.`);
  }
  if (snapshot.routeName === 'home' && uniqueSurfaceModels > thresholds.uniqueSurfaceModels) {
    issues.push(`Home mixes ${uniqueSurfaceModels} surface models across labeled sections.`);
  }
  if (snapshot.routeName === 'home' && dominantSections > thresholds.dominantSections) {
    issues.push(`${dominantSections} sections assert display-scale dominant text, diluting hierarchy.`);
  }
  if (snapshot.routeName === 'home' && dominantTextSpread > thresholds.dominantTextSpread) {
    issues.push(`Dominant type scale varies by ${round(dominantTextSpread)}px between sections.`);
  }
  if (snapshot.routeName === 'home' && essayLeadSpread > thresholds.essayLeadSpread) {
    issues.push(`Editorial sections diverge in headline scale by ${round(essayLeadSpread)}px.`);
  }
  if (snapshot.routeName === 'project-jjugg' && labeledSections.length < 4) {
    issues.push(`Project detail audit only measured ${labeledSections.length} labeled sections.`);
  }
  if (snapshot.routeName === 'home' && !snapshot.sections.some((section) => section.className.includes('footer-shell'))) {
    issues.push('Footer/contact system was not included in the page audit.');
  }
  if (snapshot.routeName === 'projects-catalog' && labeledSections.length < 2) {
    issues.push(`Catalog audit only measured ${labeledSections.length} labeled sections.`);
  }

  return {
    adjacentLayoutSwitches,
    contentSpread: round(contentSpread),
    contentTopOffsetSpread: round(contentTopOffsetSpread),
    dominantSections,
    dominantTextSpread: round(dominantTextSpread),
    essayLeadSpread: round(essayLeadSpread),
    findings:
      issues.length > 0
        ? issues
        : ['No measurable cross-section consistency violations triggered by the audit thresholds.'],
    issues,
    labelSpread: round(labelSpread),
    labelTopOffsetSpread: round(labelTopOffsetSpread),
    monoLabelRatio: round(snapshot.monoLabelRatio),
    railGapSpread: round(railGapSpread),
    ruleSpread: round(ruleSpread),
    ruleTopOffsetSpread: round(ruleTopOffsetSpread),
    uniqueLayoutFamilies,
    uniqueSurfaceModels,
  };
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function compareScreenshots({ baselinePath, currentPath, diffPath }) {
  const baselineExists = await fileExists(baselinePath);
  if (!baselineExists) {
    return {
      diffPixels: null,
      diffRatio: null,
      status: 'missing',
    };
  }

  const [baselineBuffer, currentBuffer] = await Promise.all([
    fs.readFile(baselinePath),
    fs.readFile(currentPath),
  ]);
  const baselineImage = PNG.sync.read(baselineBuffer);
  const currentImage = PNG.sync.read(currentBuffer);

  if (baselineImage.width !== currentImage.width || baselineImage.height !== currentImage.height) {
    return {
      diffPixels: baselineImage.width * baselineImage.height,
      diffRatio: 1,
      status: 'dimension-mismatch',
    };
  }

  const diffImage = new PNG({ width: baselineImage.width, height: baselineImage.height });
  const diffPixels = pixelmatch(
    baselineImage.data,
    currentImage.data,
    diffImage.data,
    baselineImage.width,
    baselineImage.height,
    { threshold: 0.1 }
  );

  if (diffPixels > 0) {
    await fs.mkdir(path.dirname(diffPath), { recursive: true });
    await fs.writeFile(diffPath, PNG.sync.write(diffImage));
  }

  return {
    diffPixels,
    diffRatio: diffPixels / (baselineImage.width * baselineImage.height),
    status: diffPixels > 0 ? 'diff' : 'match',
  };
}

export function buildMarkdownReport(results) {
  const lines = ['# Portfolio Visual Audit', ''];

  for (const result of results) {
    lines.push(`## ${result.routeName} @ ${result.viewportLabel}`);
    lines.push('');
    lines.push(`- Label spread: ${result.analysis.labelSpread}px`);
    lines.push(`- Content spread: ${result.analysis.contentSpread}px`);
    lines.push(`- Rule spread: ${result.analysis.ruleSpread}px`);
    lines.push(`- Rail gap spread: ${result.analysis.railGapSpread}px`);
    lines.push(`- Label top rhythm spread: ${result.analysis.labelTopOffsetSpread}px`);
    lines.push(`- Content top rhythm spread: ${result.analysis.contentTopOffsetSpread}px`);
    lines.push(`- Rule top rhythm spread: ${result.analysis.ruleTopOffsetSpread}px`);
    lines.push(`- Mono label ratio: ${result.analysis.monoLabelRatio}`);
    lines.push(`- Unique layout families: ${result.analysis.uniqueLayoutFamilies}`);
    lines.push(`- Adjacent layout switches: ${result.analysis.adjacentLayoutSwitches}`);
    lines.push(`- Unique surface models: ${result.analysis.uniqueSurfaceModels}`);
    lines.push(`- Dominant sections: ${result.analysis.dominantSections}`);
    lines.push(`- Dominant text spread: ${result.analysis.dominantTextSpread}px`);
    lines.push(`- Essay lead spread: ${result.analysis.essayLeadSpread}px`);
    lines.push(`- Wide text blocks: ${result.wideTextBlocks.length}`);
    lines.push(`- Domain card height spread: ${round(result.domainCardHeightSpread)}px`);
    lines.push(`- Experience card height spread: ${round(result.experienceCardHeightSpread)}px`);
    if (result.sections.some((section) => section.labelText !== null)) {
      lines.push('- Section signatures:');
      for (const section of result.sections.filter((section) => section.labelText !== null)) {
        lines.push(
          `  - ${section.labelText}: ${section.layoutFamily} / ${section.surfaceModel} / dominant ${section.dominantTextSize}px`
        );
      }
    }
    if (result.baseline) {
      lines.push(`- Baseline status: ${result.baseline.status}`);
      if (typeof result.baseline.diffPixels === 'number') {
        lines.push(`- Diff pixels: ${result.baseline.diffPixels}`);
      }
      if (typeof result.baseline.diffRatio === 'number') {
        lines.push(`- Diff ratio: ${round(result.baseline.diffRatio)}`);
      }
    }
    lines.push('');
    lines.push('Findings:');
    for (const finding of result.analysis.findings) {
      lines.push(`- ${finding}`);
    }
    if (result.baselineFinding) {
      lines.push(`- ${result.baselineFinding}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}