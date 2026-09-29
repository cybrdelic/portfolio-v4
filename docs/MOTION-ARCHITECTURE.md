# Continuous GPU motion system

The application mounts one lazy-loaded full-screen WebGL2 canvas outside the route tree. No route creates a renderer or restarts the clock. This implementation intentionally uses the browser WebGL2 API directly; Three.js, GSAP, and WebGPU are not required to render the portfolio itself.

`src/motion/state.ts` owns time, five normalized motif weights, pointer input, scroll velocity, route travel, quality, and the diagnostic snapshot. `MotionWorld.tsx` owns the sole animation loop and measures section anchors outside the render path. Scroll blends adjacent anchor weights; route changes select the corresponding project motif without replacing the field.

`Renderer.ts` draws an analytically warped signed-distance field with a full-screen triangle. The water, fire, amber, geometry, and systems motifs blend within one field before ray marching, rather than crossfading prerecorded scenes. Normal reconstruction, environment lighting, Fresnel response, and material color/emission create the procedural sculpture. These are portfolio motifs, not embedded replicas of the projects' numerical solvers.

A second program in the same context draws typography from rasterized local fonts. Glyph UVs bend with shared scroll and route state. Accessible DOM headings remain authoritative; their visible ink returns when motion is disabled, reduced motion is requested, or a context is lost. Textures are rebuilt on font/layout changes and deleted when headings leave the route.

`ContinuousRoutes.tsx` retains the departing page during the first part of the shared route travel, then commits the destination, restores its scroll target, and focuses the main heading. History navigation uses the same path. Existing project IDs are retained.

Performance constraints:

- One GPU context and one requestAnimationFrame loop.
- One field draw plus visible typography layers.
- 1.7 million-pixel maximum drawing buffer; lower quality on coarse/mobile input.
- Sustained slow frames lower resolution. Individual startup stalls do not.
- The page-visibility API suspends the loop; reduced motion renders only on invalidation.
- Project videos load on demand and play only in view, with posters on reduced-motion or data-saving devices.
- Local fonts, no remote API keys, no runtime CDN dependencies.
- Initial JS budget: 120 KB gzip; lazy motion chunk: 25 KB gzip; each preview: 1.5 MB.

The Playwright suite covers deterministic desktop/mobile visuals, continuous scroll weights, route/canvas lifetime, history, reduced motion, absent WebGL, context-loss recovery, motion preference persistence, narrow-screen detail routes, pixel/draw-call/CPU budgets, and printable résumé content. SwiftShader test frame times are software-GPU measurements, not physical-device performance claims.
