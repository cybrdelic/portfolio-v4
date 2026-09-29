# Continuous GPU motion

One lazy WebGL2 canvas lives outside the route tree. One animation loop advances time, normalized scene weights, scroll velocity, pointer response, geometry selection, and route travel. Routes keep the context, GPU resources, point identities, and clock alive.

## Visual layers

`Renderer.ts` uses a full-screen program to sample the real AQUA and IGNIA recordings and render the separate procedural amber study. During transitions, the recordings dissolve as one 32,768-point field interpolates between screen-space water, a fire vortex, amber, parametric frame geometry, a rolled graphene lattice, and a systems lattice. These are designed transition geometries, not embedded numerical fluid solvers. Source recordings retain their own simulation clocks; the portfolio field and typography share the site's timeline.

The amber silhouette follows the public project's procedural specimen formula. Its optical approximation is a portfolio shader, not the original Three.js volume renderer. `nanotube.ts` generates a graphene basis, projects it onto the chiral vector and perpendicular axis, rolls it into a cylinder, identifies nearest-neighbor bonds, and samples those bonds for the shared point field. Chirality changes rebuild the geometry buffer outside the draw loop.

A typography program rasterizes the local font and warps glyph UVs with scroll and route travel. The DOM remains authoritative for semantics and accessibility. Visible DOM ink returns on reduced motion, disabled motion, or context loss. Removed route headings release their textures.

`MotionWorld.tsx` measures section anchors outside the draw path and blends adjacent visual states through the scroll. `ContinuousRoutes.tsx` carries the departing content through the field's travel, swaps the page, restores the hash or top position, and focuses its heading. The field never remounts during navigation.

## Resource constraints

- A maximum 1.7 million-pixel final buffer, with a cheaper field buffer and sharp type on top.
- Two field/particle draws, plus visible typography layers.
- Lower initial resolution for mobile/coarse input; sustained slow frames reduce quality further.
- Media textures update only when their video frame changes. Videos play only while their scene contributes, and pause with hidden documents, reduced motion, disabled motion, or data saving.
- Reduced motion renders immediately at the requested scene and redraws only for invalidation, including chirality changes. Actual still captures remain available with no WebGL.
- Local fonts and media; no runtime CDN, API keys, or new framework dependencies.
- Initial JavaScript below 120 KB gzip, lazy motion below 25 KB gzip, each video below 1.5 MB.

The browser suite covers desktop/mobile visual baselines, seven narrow-screen project routes and scenes, persistent context/clock/history, continuous scroll weights, reduced motion, chirality redraws, no-WebGL presentation, context restoration, motion preference persistence, resource budgets, and printable résumé content. Software-GPU test frame times do not establish physical-device frame rates.

Recording and screenshot provenance is in `public/media/PROVENANCE.md`. The screenshot and scene captions distinguish actual applications from portfolio studies.
