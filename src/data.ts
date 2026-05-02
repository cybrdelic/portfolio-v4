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
}

export const projects: Project[] = [
  {
    id: 'drone-sim-studio',
    title: 'DroneSim Studio',
    subtitle: 'Flight-to-fabrication engineering bench for quadcopter frames',
    type: 'Engineering Workbench',
    tech: 'React, Three.js, Rapier, TypeScript',
    animationType: 'system',
    overview: 'DroneSim Studio is a browser engineering lab for designing, inspecting, and flying quadcopter frames. It connects geometry, assembly views, fabrication checks, flight telemetry, controller tuning, and debug overlays into one dense operator surface.',
    whyItExists: 'Most drone configurators stop at a static model or a toy flight scene. This project is stronger because the UI treats the drone as an engineering object: fit, wiring, prop clearance, control mode, telemetry, and print readiness all live in the same loop.',
    coreMechanisms: [
      'Parametric frame generator',
      'Flight-to-fabrication gate',
      'Assembly and print-layout views',
      'Optional PID assist modes',
      'Live telemetry readouts',
      'Local debug-bridge protocol'
    ],
    roleInWork: 'This is the strongest portfolio project in the current corpus because it has a believable product surface, a real technical loop, and screenshots that immediately explain the work.'
  },
  {
    id: 'amber-lab',
    title: 'AmberLab',
    subtitle: 'WebGPU specimen renderer for translucent amber and material capture',
    type: 'Material Rendering',
    tech: 'Three.js, WebGPU, TSL, TypeScript',
    animationType: 'timeseries',
    overview: 'AmberLab is a material capture and rendering rig for amber-like translucent specimens. It combines procedural nodule geometry, inclusions, HDRI lighting, WebGPU volume materials, fallback reporting, and canvas-to-reference comparison.',
    whyItExists: 'The interesting part is not just that it renders a pretty object. The project turns material lookdev into a measurable workflow: capture profile, lighting state, renderer backend, specimen geometry, and diff metrics are all surfaced instead of hidden behind a single canvas.',
    coreMechanisms: [
      'Procedural amber geometry',
      'WebGPU volume material path',
      'Renderer fallback reporting',
      'HDRI calibration presets',
      'Inclusion and caustic layers',
      'Canvas/reference diff export'
    ],
    roleInWork: 'This should replace the weaker gemstone/rendering placeholders because it has a specific subject, visible output, and real renderer-state mechanics.'
  },
  {
    id: 'cnt-workbench',
    title: 'CNTWorkbench',
    subtitle: 'Carbon nanotube geometry builder with simulation export paths',
    type: 'Scientific Tooling',
    tech: 'React, Three.js, TypeScript, Vite',
    animationType: 'pipeline',
    overview: 'CNTWorkbench turns carbon-nanotube chirality and length parameters into inspectable molecular geometry. The useful part is the export path: finite segments, periodic unit cells, ExtXYZ, LAMMPS data, POSCAR, and JSON specs.',
    whyItExists: 'A visual nanotech demo is easy to fake. This one is more portfolio-worthy because it exposes the bridge between a browser workbench and real simulation tooling, so the output can leave the UI and survive in external analysis pipelines.',
    coreMechanisms: [
      'Chirality-driven geometry',
      'Finite segment generation',
      'Periodic unit-cell export',
      'LAMMPS and POSCAR writers',
      'OVITO-friendly handoff',
      'Cinematic inspection stage'
    ],
    roleInWork: 'This is a better scientific-project candidate than another generic renderer because the workflow has an external technical contract, not just a scene.'
  },
  {
    id: 'firesim',
    title: 'FireSim',
    subtitle: 'Combustion workbench for browser fire simulation and validation',
    type: 'Simulation Platform',
    tech: 'React, WebGPU, WGSL, Vite',
    animationType: 'timeseries',
    overview: 'FireSim is the combustion platform line in the corpus: a WebGPU fire/fluid simulation with a V2 consumer route, control-deck UI work, debug overlays, field exports, benchmark scaffolds, and a clean launcher path.',
    whyItExists: 'The strongest angle is not the flame visual by itself. It is the attempt to make browser combustion testable: runtime controls, high-quality defaults, field exports, performance measurement, and a staged benchmark suite based on NIST, UL FSRI, and RxCADRE sources.',
    coreMechanisms: [
      'WebGPU fluid/fire solver',
      'V2 consumer route',
      'Control deck and diagnostics',
      'Projected field exports',
      'Benchmark sync scaffold',
      'Quality-preserving launcher path'
    ],
    roleInWork: 'FireSim is worth showing as a platform-in-progress because it combines simulation, UX, performance diagnosis, and validation strategy in one real project line.'
  },
  {
    id: 'llmwiki',
    title: 'LLMWiki',
    subtitle: 'Local-first second brain built from project evidence and authored pages',
    type: 'Knowledge System',
    tech: 'Node, Markdown, Static Site',
    animationType: 'network',
    overview: 'LLMWiki is a local-first personal knowledge system that scans project folders, reads profile/repo metadata, imports archives, and builds a lightweight wiki. The accepted direction is an article-first second brain with authored pages and explicit provenance.',
    whyItExists: 'The portfolio problem itself points at why this matters: a directory full of projects does not automatically become a coherent body of work. LLMWiki exists to turn messy local evidence into durable pages that can explain what is real, what repeats, and what should be extracted next.',
    coreMechanisms: [
      'Local project root scanning',
      'GitHub/profile metadata ingest',
      'Archive import hooks',
      'Hand-authored canonical pages',
      'Backlinks and source panels',
      'Static browser wiki output'
    ],
    roleInWork: 'This is the most honest tooling/project extraction candidate because it directly addresses the recurring problem: making a large local corpus legible without turning it into another generic dashboard.'
  }
];
