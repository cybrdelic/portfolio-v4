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
    id: 'outersense',
    title: 'OuterSense',
    subtitle: 'Real-time gaze interaction and spatial digital twin system',
    type: 'Perceptual Systems',
    tech: 'Rust, WebGPU, Python',
    animationType: 'system',
    overview: 'OuterSense is a perceptual system that tracks face state, eye state, gaze direction, and screen geometry in real time. It maintains a digital twin of the head, eyes, and display so the system can estimate gaze intersection, detect off-screen attention, and reason about orientation instead of just raw webcam frames.',
    whyItExists: 'Most interfaces assume a static user and wait for explicit input. OuterSense exists to bridge physical presence and machine state so the system can infer attention, reduce interaction friction, and respond to spatial context.',
    coreMechanisms: [
      '3D head/screen geometry',
      'Gaze-ray intersection',
      'Continuous calibration',
      'Digital twin maintenance',
      'Attention-state inference',
      'Real-time spatial computation'
    ],
    roleInWork: 'OuterSense is the clearest expression of the direction I care about most: software that perceives and models the physical context of use.'
  },
  {
    id: 'jjugg',
    title: 'JJUGG',
    subtitle: 'Career command system for opportunity capture, pipeline analytics, and automation',
    type: 'Autonomous Tooling',
    tech: 'Node.js, Express, SQLite, Userscripts',
    animationType: 'pipeline',
    overview: 'JJUGG is my local-first career operating system: a command dashboard for capturing opportunities, tracking the full application pipeline, monitoring automation runs, and keeping profile context, drafts, analytics, and agent-driven job discovery in one coherent system.',
    whyItExists: 'Most job-search tools split capture, tracking, analytics, and automation across too many disconnected products. JJUGG exists to collapse that workflow into one private operating surface where an agent built from my professional context can autonomously hunt, extract, normalize, and rank relevant opportunities instead of leaving me to manually sift through noise.',
    coreMechanisms: [
      'Userscript-seeded capture',
      'SQLite-backed local state',
      'Autonomous opportunity ETL',
      'Pipeline analytics and conversion tracking',
      'Professional-context agent modeling',
      'Role relevance filtering',
      'Automation run monitoring',
      'High-volume opportunity ranking'
    ],
    roleInWork: 'JJUGG reflects my interest in turning a messy real-world process into an instrumented operating system where autonomous job hunts can surface thousands of relevant opportunities, push them through ETL, and make the pipeline legible through live tables, charts, and action queues.'
  },
  {
    id: 'firesim',
    title: 'FireSim',
    subtitle: 'Real-time volumetric fire and fluid simulation in WebGPU',
    type: 'Simulation & Rendering',
    tech: 'React, TypeScript, WebGPU, WGSL',
    animationType: 'timeseries',
    overview: 'FireSim is a real-time 3D fire and fluid simulation that pushes Navier-Stokes-style transport, buoyancy, and volumetric rendering through WebGPU compute shaders in the browser.',
    whyItExists: 'I wanted a simulation that was not just visually convincing but structurally serious: GPU-side transport, controllable combustion behavior, and a runtime stable enough to benchmark and test instead of treating the effect as a one-off demo.',
    coreMechanisms: [
      'WebGPU compute shaders',
      'Fluid transport and buoyancy',
      'Volumetric ray marching',
      'Deterministic stability harness',
      'Interactive parameter control',
      'GPU-first simulation architecture'
    ],
    roleInWork: 'FireSim reflects the part of my work that is closest to engine programming: numerical systems, GPU constraints, rendering architecture, and making technically heavy visuals behave like products.'
  },
  {
    id: 'commitaura',
    title: 'CommitAura',
    subtitle: 'Rust CLI for commit narrative generation and developer workflow compression',
    type: 'Developer Tooling',
    tech: 'Rust, LLMs, CLI',
    animationType: 'network',
    overview: 'CommitAura is a Rust CLI that generates commit messages from staged changes. The point is not novelty; it is reducing repetitive developer effort while preserving clarity, intent, and a repository history worth reading.',
    whyItExists: 'Good commit messages are easy to skip when the workflow is already heavy. CommitAura exists to remove that friction by interpreting the diff, separating mechanical changes from real intent, and formatting the result for strict conventional-commit workflows.',
    coreMechanisms: [
      'CLI ergonomics',
      'LLM-assisted summarization',
      'Diff interpretation',
      'Developer workflow compression',
      'Practical automation'
    ],
    roleInWork: 'CommitAura is the most directly shippable expression of my tooling philosophy: serious utility, low interaction cost, immediate leverage.'
  },
  {
    id: 'spectrocity',
    title: 'Spectrocity',
    subtitle: 'Real-time spectral ray tracing of gemstones in WebGPU',
    type: 'Simulation & Rendering',
    tech: 'React, TypeScript, WebGPU, WGSL',
    animationType: 'system',
    overview: 'Spectrocity is a real-time gemstone renderer built in WebGPU, using spectral ray tracing and compute-driven shading to model chromatic dispersion, internal reflection, and cut-specific light behavior with physically grounded control.',
    whyItExists: 'I built Spectrocity to push browser rendering past generic PBR demos into per-wavelength behavior, procedural gem geometry, and a performance envelope that still holds on consumer GPUs.',
    coreMechanisms: [
      'Per-wavelength spectral dispersion',
      'Fresnel and total internal reflection',
      'Procedural SDF gem geometry',
      'Multi-bounce caustics',
      'Compute-driven quality tiers',
      'Editor-style material controls'
    ],
    roleInWork: 'Spectrocity is the rendering side of my work at full precision: shader architecture, GPU debugging, physically grounded light behavior, and interface design that still has to make the system legible.'
  },
  {
    id: 'xelathemes',
    title: 'XELA Themes',
    subtitle: 'Professional VS Code theme system with automated generation and packaging',
    type: 'Systems UX',
    tech: 'JavaScript, VS Code Extension API, Node.js',
    animationType: 'system',
    overview: 'XELA Themes is a professional-grade VS Code theme collection with a large generated theme catalog, a centralized palette and role system, and packaging automation for shipping and maintaining the extension cleanly.',
    whyItExists: 'Theme packs usually become unmaintainable once they grow. XELA Themes exists to treat visual design like a system: shared primitives, role-based token mapping, build automation, validation, and a distribution workflow instead of hand-edited JSON sprawl.',
    coreMechanisms: [
      'Centralized palette architecture',
      'Role-based token mapping',
      'Automated theme generation',
      'HTML and XML token tuning',
      'Pack-aware theme picker',
      'Marketplace packaging workflow'
    ],
    roleInWork: 'XELA Themes shows a different but important part of my work: building design systems and developer-facing tooling with the same rigor I apply to simulation and systems software.'
  }
];
