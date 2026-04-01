import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import {
  analyzeSnapshot,
  buildMarkdownReport,
  collectVisualSnapshot,
  compareScreenshots,
  defaultThresholds,
  routes,
  viewports,
} from './visual-audit-core.mjs';

const PORT = 42743;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.join(process.cwd(), 'output', 'playwright', 'visual-audit');
const BASELINE_DIR = path.join(process.cwd(), 'tests', 'visual-baselines');
const DIFF_DIR = path.join(OUTPUT_DIR, 'diff');

const args = new Set(process.argv.slice(2));
const updateBaseline = args.has('--update-baseline');
const assertClean = args.has('--assert-clean');

function waitForServer(proc) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timed out waiting for dist server'));
    }, 15000);

    const handleReady = (data) => {
      const text = data.toString();
      if (text.includes('dist server ready')) {
        clearTimeout(timeout);
        proc.stdout.off('data', handleReady);
        resolve();
      }
    };

    proc.stdout.on('data', handleReady);
    proc.stderr.on('data', (data) => {
      const text = data.toString();
      if (text.trim()) {
        clearTimeout(timeout);
        reject(new Error(text));
      }
    });
    proc.on('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`dist server exited early with code ${code}`));
    });
  });
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(BASELINE_DIR, { recursive: true });

  const server = spawn(process.execPath, ['scripts/serve-dist.mjs', String(PORT)], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForServer(server);
    const browser = await chromium.launch({ headless: true });
    const results = [];

    try {
      for (const viewport of viewports) {
        for (const route of routes) {
          const page = await browser.newPage();
          const fileName = `${route.name}-${viewport.label}.png`;
          const currentPath = path.join(OUTPUT_DIR, fileName);
          const baselinePath = path.join(BASELINE_DIR, fileName);
          const diffPath = path.join(DIFF_DIR, fileName);

          try {
            const snapshot = await collectVisualSnapshot(page, {
              baseUrl: BASE_URL,
              route,
              screenshotPath: currentPath,
              viewport,
            });

            let baseline;
            let baselineFinding = null;

            if (updateBaseline) {
              await fs.copyFile(currentPath, baselinePath);
              baseline = {
                diffPixels: 0,
                diffRatio: 0,
                status: 'updated',
              };
            } else {
              baseline = await compareScreenshots({
                baselinePath,
                currentPath,
                diffPath,
              });

              if (baseline.status === 'missing') {
                baselineFinding = `Baseline screenshot missing for ${fileName}.`;
              } else if (baseline.status === 'dimension-mismatch') {
                baselineFinding = `Baseline dimensions changed for ${fileName}.`;
              } else if (
                baseline.status === 'diff' &&
                ((baseline.diffPixels ?? 0) > defaultThresholds.diffPixels ||
                  (baseline.diffRatio ?? 0) > defaultThresholds.diffRatio)
              ) {
                baselineFinding = `Visual diff detected for ${fileName}: ${baseline.diffPixels} pixels changed.`;
              }
            }

            results.push({
              ...snapshot,
              analysis: analyzeSnapshot(snapshot),
              baseline,
              baselineFinding,
            });
          } finally {
            await page.close();
          }
        }
      }
    } finally {
      await browser.close();
    }

    const reportPath = path.join(OUTPUT_DIR, 'report.json');
    const markdownPath = path.join(OUTPUT_DIR, 'report.md');
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    await fs.writeFile(markdownPath, buildMarkdownReport(results));

    console.log(`Visual audit report written to ${reportPath}`);
    console.log(`Visual audit summary written to ${markdownPath}`);

    const hasProblems = results.some(
      (result) => result.analysis.issues.length > 0 || result.baselineFinding !== null
    );

    if (assertClean && hasProblems) {
      process.exitCode = 1;
    }
  } finally {
    server.kill();
  }
}

await run();