export interface Project {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  tech: string;
  animationType: 'network' | 'pipeline' | 'system' | 'timeseries';
  overview: string;
  whyItExists: string;
  coreMechanisms: string[];
  roleInWork: string;
  motif?: 'water' | 'fire' | 'amber' | 'geometry' | 'systems' | 'light' | 'geo' | 'scenes' | 'forest';
  source?: string;
  video?: string;
  poster?: string;
  number?: string;
  gallery?: { label: string; src: string; alt: string; caption: string }[];
}

const previousProjects: Project[] = [
  {
    id: 'aqua', title: 'AQUA', number: '01',
    subtitle: 'Spectral oceans. Persistent whitewater. A world above and below the surface.',
    type: 'Ocean Simulation', tech: 'Three.js · WebGL2 · GLSL · GPU FFT', animationType: 'timeseries', motif: 'water',
    source: 'https://github.com/cybrdelic/aqua-threejs-open', video: '/media/aqua.mp4', poster: '/media/aqua.webp',
    overview: 'A real-time ocean renderer built around three GPU FFT wavelength bands. Directional swell, crossing seas, and shorter wind waves share a continuous surface with persistent foam, spray, and underwater optics.',
    whyItExists: 'Water makes rendering and numerical behavior inseparable. Wave energy, foam transport, surface derivatives, geometry-aware refraction, and camera movement all have to agree for the scene to hold together.',
    coreMechanisms: ['Three GPU FFT wavelength bands with finite-depth dispersion', 'Persistent density, age, and aeration fields for whitewater', 'Fresnel reflection/refraction and RGB extinction', 'Geometry tracing, seafloor caustics, and underwater views', 'Local ripple impulses, rain contacts, and boat wakes', 'Seeded replay, diagnostic views, and reproducible capture tools'],
    roleInWork: 'I built and iterated the simulation, optical pipeline, interaction layer, and capture workflow. This is a spectral ocean with local depth-averaged interactions; volumetric FLIP, overturning breakers, and two-phase air entrainment are separate problems.',
  },
  {
    id: 'ignia', title: 'IGNIA', number: '02',
    subtitle: 'Reactive fields become fire, smoke, and light.',
    type: 'Volumetric Simulation', tech: 'Three.js · WebGL2 · GLSL · Fluid Dynamics', animationType: 'timeseries', motif: 'fire',
    source: 'https://github.com/cybrdelic/ignia-threejs', video: '/media/ignia.mp4', poster: '/media/ignia.webp',
    overview: 'A volumetric fire and smoke simulator built around pressure-projected velocity, transported reactive scalars, refined chemistry fields, and integrated extinction and emission. The visible flames come from simulated fields.',
    whyItExists: 'A convincing flame needs more than a color ramp. Transport, reaction, buoyancy, solid boundaries, and light integration need to reinforce one another while the controls remain useful for experimentation.',
    coreMechanisms: ['Pressure-projected three-dimensional velocity field', 'Transported temperature, fuel, oxygen-like concentration, soot, and reaction', 'Optional 2×/3× refined reactive fields over the base pressure grid', 'Buoyancy, vorticity confinement, wind, and shared solid masks', 'Ray-integrated extinction/emission with cached illumination', '31 authored presets and 43 published native-1080p recordings'],
    roleInWork: 'I built the solver/rendering system and a workbench for authoring, inspecting, and recording its behavior. The combustion model uses normalized graphics-oriented parameters; it is not experimentally calibrated chemistry or a shock solver.',
  },
  {
    id: 'drone-sim-studio',
    number: '03', motif: 'geometry',
    title: 'DroneSim Studio',
    subtitle: 'Flight-to-fabrication engineering bench for quadcopter frames',
    type: 'Engineering Workbench',
    tech: 'React, Three.js, Rapier, TypeScript',
    animationType: 'system',
    overview: 'DroneSim Studio is a browser engineering lab for designing, inspecting, and flying quadcopter frames. It connects geometry, assembly views, fabrication checks, flight telemetry, controller tuning, and debug overlays into one dense operator surface.',
    whyItExists: 'The workbench connects frame geometry to the practical constraints of assembly and fabrication: fit, wiring, prop clearance, control modes, telemetry, and print readiness.',
    coreMechanisms: [
      'Parametric frame generator',
      'Flight-to-fabrication gate',
      'Assembly and print-layout views',
      'Optional PID assist modes',
      'Live telemetry readouts',
      'Local debug-bridge protocol'
    ],
    roleInWork: 'My work connects the parametric geometry, flight controls, telemetry, fabrication checks, and operator interface. The goal is a useful engineering loop from design to inspection to flight.'
  },
  {
    id: 'amber-lab',
    number: '04', motif: 'amber', source: 'https://github.com/cybrdelic/webgpu-amber',
    title: 'AmberLab',
    subtitle: 'WebGPU specimen renderer for translucent amber and material capture',
    type: 'Material Rendering',
    tech: 'Three.js, WebGPU, TSL, TypeScript',
    animationType: 'timeseries',
    overview: 'AmberLab is a material capture and rendering rig for amber-like translucent specimens. It combines procedural nodule geometry, inclusions, HDRI lighting, WebGPU volume materials, fallback reporting, and canvas-to-reference comparison.',
    whyItExists: 'Material development needs a repeatable capture workflow. Capture profiles, lighting state, renderer backend, specimen geometry, and comparison metrics are surfaced together.',
    coreMechanisms: [
      'Procedural amber geometry',
      'WebGPU volume material path',
      'Renderer fallback reporting',
      'HDRI calibration presets',
      'Inclusion and caustic layers',
      'Canvas/reference diff export'
    ],
    roleInWork: 'I built the procedural specimen and rendering workflow, including visible backend state, calibration controls, capture profiles, and reference comparison.'
  },
  {
    id: 'cnt-workbench',
    number: '05', motif: 'geometry',
    title: 'CNTWorkbench',
    subtitle: 'Carbon nanotube geometry builder with simulation export paths',
    type: 'Scientific Tooling',
    tech: 'React, Three.js, TypeScript, Vite',
    animationType: 'pipeline',
    overview: 'CNTWorkbench turns carbon-nanotube chirality and length parameters into inspectable molecular geometry. The useful part is the export path: finite segments, periodic unit cells, ExtXYZ, LAMMPS data, POSCAR, and JSON specs.',
    whyItExists: 'The geometry needs to survive outside the browser. Finite segments and periodic unit cells are exported into formats used by external simulation and analysis pipelines.',
    coreMechanisms: [
      'Chirality-driven geometry',
      'Finite segment generation',
      'Periodic unit-cell export',
      'LAMMPS and POSCAR writers',
      'OVITO-friendly handoff',
      'Cinematic inspection stage'
    ],
    roleInWork: 'I built the parameter-to-geometry pipeline, inspection interface, and exporters. The exported data is the contract between the browser workbench and external analysis tools.'
  },
  {
    id: 'firesim',
    number: '06', motif: 'fire', source: 'https://github.com/cybrdelic/firesim',
    title: 'FireSim',
    subtitle: 'Combustion workbench for browser fire simulation and validation',
    type: 'Simulation Platform',
    tech: 'React, WebGPU, WGSL, Vite',
    animationType: 'timeseries',
    overview: 'FireSim is a WebGPU combustion workbench with a browser fire/fluid solver, runtime controls, debug overlays, projected field exports, and benchmark scaffolds.',
    whyItExists: 'The workbench makes the simulation inspectable: runtime controls, field exports, performance measurement, and a staged benchmark scaffold drawing on NIST, UL FSRI, and RxCADRE sources.',
    coreMechanisms: [
      'WebGPU fluid/fire solver',
      'V2 consumer route',
      'Control deck and diagnostics',
      'Projected field exports',
      'Benchmark sync scaffold',
      'Quality-preserving launcher path'
    ],
    roleInWork: 'I work across the browser solver, diagnostics, controls, field exports, and benchmarking scaffolds. The validation suite is ongoing work, not a claim of experimental physical accuracy.'
  },
  {
    id: 'llmwiki',
    number: '07', motif: 'systems',
    title: 'LLMWiki',
    subtitle: 'Local-first second brain built from project evidence and authored pages',
    type: 'Knowledge System',
    tech: 'Node, Markdown, Static Site',
    animationType: 'network',
    overview: 'LLMWiki is a local-first knowledge system that scans project folders, reads profile/repository metadata, imports archives, and builds a lightweight wiki with authored pages and explicit provenance.',
    whyItExists: 'A directory full of projects does not automatically become useful knowledge. LLMWiki turns local project evidence into durable pages, backlinks, and source panels that explain the work and retain its provenance.',
    coreMechanisms: [
      'Local project root scanning',
      'GitHub/profile metadata ingest',
      'Archive import hooks',
      'Hand-authored canonical pages',
      'Backlinks and source panels',
      'Static browser wiki output'
    ],
    roleInWork: 'I built the local evidence ingestion and publishing workflow. The system keeps canonical authored pages and source provenance explicit so a large project corpus becomes useful knowledge.'
  }
];

/** Featured work is curated separately from compatibility routes. */
export const projects: Project[] = [
  {
    id: 'cybr-light', title: 'CYBR LIGHT', number: '01', motif: 'light',
    subtitle: 'A native spectral renderer, from light transport to scene authoring.',
    type: 'Rendering Engine', tech: 'C++ · Python · Spectral transport', animationType: 'pipeline', poster: '/media/light.webp',
    overview: 'CYBR LIGHT is an offline rendering engine with a native C++ core and a Python scene API. It traces wavelength packets through surfaces and volumes, with dispersive glass, anisotropic metals, participating media, and explicit material and camera models.',
    whyItExists: 'A renderer needs a consistent contract between geometry, sampling, materials, and film accumulation. CYBR LIGHT puts those systems behind one scene API, with numerical checks and inspectable render outputs.',
    coreMechanisms: ['Spectral path tracing, multiple importance sampling, and wavelength packets', 'SAH BVH traversal for analytic shapes and triangle meshes', 'Anisotropic GGX conductors, absorbing dielectrics, and nested boundaries', 'Dispersive surface photon mapping and participating-media transport', 'Thin-lens cameras, shutter sampling, and checkpointed film accumulation', 'Material shader compilation, image derivatives, and parameter fitting'],
    roleInWork: 'I work across the C++ transport core, Python authoring layer, optical models, diagnostics, and numerical verification. The default renderer runs on the CPU. Optional GPU paths are separate work; the images here are native CPU renders.',
    gallery: [
      { label: 'Rendered', src: '/media/light.webp', alt: 'Native CYBR LIGHT render of a quartz armillary globe, brass telescope, and sunlit workbench', caption: 'Refractive transport study · Native 720 × 480 · Non-neural guided reconstruction' },
      { label: 'Unfiltered', src: '/media/light-raw.webp', alt: 'Unfiltered Monte Carlo film from the same CYBR LIGHT scene', caption: 'The same native film before reconstruction · Sampling noise retained' },
      { label: 'Dielectrics', src: '/media/light-dielectrics.webp', alt: 'Smooth and rough absorbing glass spheres over a checkerboard, rendered by CYBR LIGHT', caption: 'Nested dielectric example · Native 480 × 320 · 64 packets × 8 wavelengths · Unfiltered' },
    ],
  },
  {
    id: 'cybr-geo', title: 'CYBR GEO', number: '02', motif: 'geo',
    subtitle: 'Reusable CAD, assemblies, kinematics, and technical drawings.',
    type: 'Geometry & CAD System', tech: 'Python · OpenCascade · C++ · STEP / GLB', animationType: 'system',
    source: 'https://github.com/cybrdelic/cybr-geo', poster: '/media/geo.webp',
    overview: 'CYBR GEO turns model recipes into named parts, analytic CAD, assemblies, motion studies, rendered views, and manufacturing-format exports. The same tooling supports mechanisms, robotic assemblies, and larger procedural environments.',
    whyItExists: 'Geometry becomes useful when it survives more than one renderer. Parts need identities, motion needs constraints, and exports and drawings need to agree with the authored assembly.',
    coreMechanisms: ['Shared recipe and named-part APIs across two geometry toolkits', 'Analytic solids, lofted housings, shafts, raceways, and spline conduits', 'STEP, STL, and GLB exports from the same assembly', 'Kinematic motion, service sequences, and reversible assembly animation', 'OpenCascade hidden-line drawings in SVG, PDF, DXF, and PNG', 'Shared native rendering, cameras, materials, and catalogue tooling'],
    roleInWork: 'I built the modelling and delivery pipeline and the assembly studies it supports. ORBIT revision 3 has 148 components and a 331-operation service procedure. These are CAD and prescribed-kinematics studies; contact simulation and manufacturing qualification are separate.',
    gallery: [
      { label: 'ORBIT assembled', src: '/media/geo.webp', alt: 'ORBIT inspection wrist with its parallel gripper, hollow palm, bearing housing, and service conduit', caption: 'ORBIT revision 3 · 148 components · Analytic CAD assembly' },
      { label: 'Exploded assembly', src: '/media/geo-exploded.webp', alt: 'Exploded ORBIT assembly showing separated shafts, housing sections, bearings, and gripper parts', caption: 'ORBIT exploded view · Named components and explicit assembly structure' },
    ],
  },
  {
    id: 'cybr-scenes', title: 'CYBR SCENES', number: '03', motif: 'scenes',
    subtitle: 'Procedural environments with reproducible native render pipelines.',
    type: 'Scene & Environment System', tech: 'Python · C++ · Procedural geometry · Spectral rendering', animationType: 'pipeline',
    source: 'https://github.com/cybrdelic/cybr-scenes', poster: '/media/scenes-sandstone.webp',
    overview: 'CYBR SCENES packages complete environments with their authoring recipes, geometry inputs, material transfer, native rendering code, and delivered frames. Observatory IV sits alongside six landscape scenes, including Sandstone Passage, Basalt Tide, and Fernwater.',
    whyItExists: 'A finished frame should lead back to a recoverable scene. The work joins procedural geometry and materials to executable builds, repeatable camera setups, and preserved raw and reconstructed output.',
    coreMechanisms: ['Scene recipes and named geometry for seven environments', 'Native spectral lighting, anisotropic metals, and quartz refraction', 'Mesh and material transfer with texture and identity preservation', 'Separate direct, indirect, emission, and volume lighting components', 'Geometry- and variance-guided reconstruction with preserved raw films', 'Rebuildable native engines, scene inputs, and verification captures'],
    roleInWork: 'I work across environment authoring, geometry, material transfer, native render integration, and reproducible delivery. Observatory IV was rendered at 1800 × 1200. The landscapes are authored environments; they are not measured terrain reconstructions.',
    gallery: [
      { label: 'Sandstone Passage', src: '/media/scenes-sandstone.webp', alt: 'Procedural sandstone canyon with stratified walls, scattered rocks, and a sunlit passage', caption: 'Sandstone Passage · Original delivered environment render' },
      { label: 'Observatory IV', src: '/media/scenes.webp', alt: 'Observatory IV, a brass and quartz armillary on a wood desk beside a vaulted window', caption: 'Observatory IV · Native 1800 × 1200 original · Resized for this page' },
    ],
  },
  {
    id: 'cybr-forest', title: 'CYBR FOREST', number: '04', motif: 'forest',
    subtitle: 'Native scene traversal, instancing, and moving-camera film capture.',
    type: 'Native Environment Renderer', tech: 'C++20 · Instancing · BVH · Offline film', animationType: 'system',
    source: 'https://github.com/cybrdelic/forest-threejs', poster: '/media/forest.webp', video: '/media/forest.mp4',
    overview: 'CYBR FOREST renders a dense authored woodland through a native C++20 pipeline. Reusable mesh buffers, instanced placement, ray traversal, textured shading, and camera motion produce the delivered forest film.',
    whyItExists: 'A large scene needs to remain tractable across geometry, lighting, and capture. The renderer reuses mesh buffers and instances while preserving the original scene, rather than substituting a screen-space imitation.',
    coreMechanisms: ['25 mesh buffers reused across 9,810 placed instances', 'Native geometry traversal, textures, and scene bounds', 'Cached diffuse illumination with approximate volumetric lighting', 'Two moving-camera shots through static forest geometry', '96 rendered frames at native 1920 × 1080 and 24 fps', 'Scene integrity checks and repeatable capture records'],
    roleInWork: 'I work across the native renderer, geometry import, instancing, scene integrity, and film delivery. The four-second film uses cached diffuse lighting and approximate volumes. Trees are static; it is not a fully converged dynamic path-tracing benchmark.',
  },
];

export const allProjects: Project[] = [...projects, ...previousProjects.filter(project => !projects.some(featured => featured.id === project.id))];
