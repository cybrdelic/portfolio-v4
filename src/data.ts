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
    id: 'jjugg',
    title: 'JJUGG',
    subtitle: 'Local-first job intelligence and autonomous opportunity pipeline',
    type: 'Autonomous Tooling',
    tech: 'TypeScript, Local-First, Userscripts',
    animationType: 'pipeline',
    overview: 'JJUGG treats the job search as a live local system instead of a pile of tabs and spreadsheets. A browser userscript captures applications as they happen, preserves the job description, and stores the opportunity as structured local data.',
    whyItExists: 'Most job-search tools are passive trackers or shallow automation. JJUGG exists to keep a continuously improving picture of opportunities, profile fit, and search momentum without depending on a SaaS dashboard.',
    coreMechanisms: [
      'Userscript-seeded capture',
      'Local-first storage',
      'Profile contextualization',
      'Role relevance filtering',
      'Job-pipeline analytics',
      'Agent-assisted enrichment'
    ],
    roleInWork: 'JJUGG reflects my interest in turning messy external processes into instrumented, autonomous workflows.'
  },
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
    id: 'tessellarity',
    title: 'Tessellarity',
    subtitle: 'GPU-first simulation substrate for procedural physical systems',
    type: 'Simulation & Rendering',
    tech: 'GLSL, WebGL, TypeScript',
    animationType: 'timeseries',
    overview: 'Tessellarity is a GPU-first simulation substrate for procedural systems, dynamic geometry, and physical behavior. It is intended as reusable runtime infrastructure, not a one-off visual demo.',
    whyItExists: 'Most web visuals rely on fixed assets or pre-baked animation. Tessellarity exists to push more of the behavior to the GPU so procedural generation, large particle counts, and physical interaction can stay live and responsive.',
    coreMechanisms: [
      'GPU simulation',
      'Dynamic remeshing',
      'Procedural geometry',
      'Physical salience',
      'Runtime substrate design',
      'Simulation-first architecture'
    ],
    roleInWork: 'Tessellarity reflects my engine-level interests and my preference for systems built from computational principles rather than content pipelines.'
  },
  {
    id: 'demosnap',
    title: 'DemoSnap',
    subtitle: 'Cinematic presentation system for technical products and interfaces',
    type: 'Systems UX',
    tech: 'React, Framer Motion, WebGL',
    animationType: 'system',
    overview: 'DemoSnap is a presentation system for turning technical products into clear, cinematic software narratives. It treats demos as part of the product surface instead of an afterthought.',
    whyItExists: 'Complex products often fail to explain themselves. DemoSnap exists to provide a programmatic way to orchestrate UI state, motion, and annotation so technical systems can present themselves without flattening the underlying complexity.',
    coreMechanisms: [
      'Visual communication',
      'Product framing',
      'Technical storytelling',
      'Motion-driven interface presentation',
      'State orchestration'
    ],
    roleInWork: 'DemoSnap reflects a core part of my engineering philosophy: if a system cannot present itself clearly, its leverage is limited.'
  }
];
