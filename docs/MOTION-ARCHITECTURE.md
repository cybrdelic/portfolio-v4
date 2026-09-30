# Continuous GPU motion

One lazy WebGL2 canvas lives outside the route tree. One animation loop advances time, seven normalized scene weights, scroll velocity, pointer response, and route travel. Routes preserve the context, GPU resources, 32,768 point identities, and clock.

## Visual layers

A full-screen program composites actual project output: AQUA, IGNIA, CYBR LIGHT, CYBR GEO, CYBR SCENES, and CYBR FOREST. Source pixels feed the persistent particle field too. Between sections, the image plane dissolves into displaced, source-colored points before resolving into the next project's output. Scroll and route travel warp the field and typography together. Settled project views use the original images or recordings, with a readability gradient. These transitions are a portfolio rendering effect; they do not reimplement the underlying numerical solvers or native engines.

The previous portfolio-only amber, quadcopter, and nanotube render substitutes are no longer active. Actual assembled/exploded images and finished/unfiltered films remain available in the project galleries.

Typography rasterizes the local font and warps glyph UVs with the shared timeline. The DOM remains authoritative for semantics and accessibility. Visible DOM ink returns on reduced motion, disabled motion, or context loss. Removed headings release their textures.

Section anchors are measured outside the draw path. Adjacent project weights interpolate through the middle portion of each scroll interval. Route travel carries the departing content through the field, swaps the page, restores its hash or top position, and focuses the heading without remounting the canvas.

## Resource constraints

- Maximum 1.7 million-pixel final buffer; adaptive cheaper field buffer; sharp type on top.
- Two image/particle draws plus visible typography layers.
- Mobile/coarse input starts at lower field resolution. Sustained slow frames reduce it further.
- Textures load as their scenes approach; videos update only on changed frames and play only while contributing.
- Hidden documents, reduced motion, disabled motion, and data saving pause video playback.
- Reduced motion redraws only for scene or layout invalidation and media readiness. Real stills remain available with no WebGL.
- Local fonts/media, no runtime CDN or API keys, and no new framework dependencies.
- Initial JavaScript under 120 KB gzip, motion under 25 KB gzip, each video under 1.5 MB, each primary native still under 500 KB.

Browser verification covers visual baselines, selected-work curation, actual render galleries, six narrow-screen scenes, all selected and legacy detail routes, persistent context/clock/history, continuous scene weights, reduced motion, no-WebGL presentation, context restoration, motion persistence, resource budgets, and printable résumé content. Software-GPU timings are not physical-device frame-rate claims.

See `public/media/PROVENANCE.md` for original assets and processing.
