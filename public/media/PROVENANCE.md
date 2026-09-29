# Renderer recordings

These are recordings of Alejandro Figueroa's public project renderers, not generated artwork.

- `aqua.mp4` and `aqua.webp`: derived with FFmpeg from `https://raw.githubusercontent.com/cybrdelic/aqua-threejs-open/master/docs/media/dawn-swells.gif`. The source repository documents preview capture provenance in `docs/media/manifest.json`.
- `ignia.mp4` and `ignia.webp`: derived from `https://raw.githubusercontent.com/cybrdelic/ignia-threejs/master/docs/media/baseline/catalogue/01_hearth.mp4`. FFmpeg crops the catalogue header/footer and resizes the native 1920×1080 / 24 fps capture to a 1280-pixel-wide preview. The poster is extracted at two seconds.
- `firesim.webp`: a cropped application screenshot from `https://raw.githubusercontent.com/cybrdelic/firesim/main/output/playwright/firesim-app-window.png`. The window chrome is removed; the simulation and controls are unchanged.

AQUA is a spectral ocean surface with local depth-averaged interactions, not FLIP/APIC. IGNIA uses graphics-oriented normalized combustion parameters, not experimentally calibrated chemistry. Preview playback is not a live performance benchmark.

Both source repositories retain GPL-2.0 license text and separate notices for imported source and third-party assets. These excerpts are included with the project owner's portfolio; the complete renderer code and asset notices remain available at their linked source repositories.

The live particle transitions, parametric frame, rolled graphene lattice, and amber shader are portfolio visual studies. Their captions distinguish them from recordings of the original applications. The amber surface deformation follows the public `webgpu-amber/src/App.tsx` geometry formula; its portfolio optical shader is a separate implementation. The lattice is generated from a graphene basis rolled around the selected chiral vector. No generated imagery or fabricated application screenshots are used.
