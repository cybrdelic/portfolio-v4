# Cybrdelic — portfolio-v4

Alejandro Figueroa's graphics, simulation, and systems portfolio. This reworks the existing React/Vite repository; it is not a standalone mockup.

The original five project records and URLs remain, with public AQUA and IGNIA renderer recordings added as featured work. Professional engineering experience, contact links, and a printable résumé establish a direct path from project discovery to a hiring conversation.

## Development

```sh
npm ci
npm run dev
```

No API key is needed. The existing package manager and lockfile are preserved.

## Verify

```sh
npx playwright install chromium --only-shell
npm run verify
```

`npm run test:update` deliberately regenerates visual baselines. Review changed screenshots before committing them. The test server serves the production build, not a development placeholder. CI runs the same build, bundle budgets, and browser checks.

See [motion architecture](docs/MOTION-ARCHITECTURE.md) and [media provenance](public/media/PROVENANCE.md) for the rendering system, performance boundaries, and the original project recording sources.

## Routes

- `/` — selected work, production experience, approach, and contact
- `/project/:id` — seven project breakdowns, retaining the original five IDs
- `/resume` — accessible résumé with print / save-PDF support

Static hosting must rewrite application routes to `index.html`. The Sites manifest uses the `dist` build output. The original dependencies remain declared for repository compatibility; the active application no longer imports Motion, Lenis, Lottie, custom-cursor, boot-sequence, or per-route transition components.
