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
    overview: 'JJUGG is a local web application and automation system designed to manage the job search as a live, evolving system rather than as a collection of tabs, copied links, and spreadsheets. Its distinguishing feature is that it seeds its own data by observing real applications through a userscript running in the browser. When an application is submitted, JJUGG captures the relevant details, preserves the associated job description, and stores the opportunity locally as structured data.',
    whyItExists: 'The normal job search is fragmented, repetitive, and low-fidelity. Opportunities are spread across job boards, company sites, recruiter outreach, emails, notes, resumes, and browser tabs. Most tools in the space do not solve the actual problem. They either act as passive trackers or they try to automate discovery without context. JJUGG exists to build an always-on market presence layer: a system that understands the user’s profile, current work, and evolving goals well enough to find better opportunities and continuously improve the search process.',
    coreMechanisms: [
      'Userscript-seeded capture',
      'Local-first storage',
      'Profile contextualization',
      'Role relevance filtering',
      'Job-pipeline analytics',
      'Agent-assisted enrichment'
    ],
    roleInWork: 'JJUGG represents my interest in turning messy external processes into instrumented, autonomous workflows.'
  },
  {
    id: 'outersense',
    title: 'OuterSense',
    subtitle: 'Real-time gaze interaction and spatial digital twin system',
    type: 'Perceptual Systems',
    tech: 'Rust, WebGPU, Python',
    animationType: 'system',
    overview: 'OuterSense is a perceptual computing system that tracks face state, eye state, gaze direction, and the user’s spatial relationship to a screen in real time. It maintains a digital twin of the head, neck, eyes, and display geometry, allowing the system to estimate gaze-ray intersections with the screen, detect off-screen attention, and maintain a richer model of user orientation than traditional webcam interaction systems.',
    whyItExists: 'Traditional interfaces assume a static user. They rely entirely on explicit manual input (mouse, keyboard, touch). OuterSense exists to bridge the gap between human spatial presence and machine state. By modeling the physical geometry of the user relative to the display, the system can infer intent, manage attention-based interactions, and reduce the friction of context switching in complex environments.',
    coreMechanisms: [
      '3D head/screen geometry',
      'Gaze-ray intersection',
      'Continuous calibration',
      'Digital twin maintenance',
      'Attention-state inference',
      'Real-time spatial computation'
    ],
    roleInWork: 'OuterSense expresses the direction I care about most: software that begins to perceive and model the physical context of use.'
  },
  {
    id: 'commitaura',
    title: 'CommitAura',
    subtitle: 'Rust CLI for commit narrative generation and developer workflow compression',
    type: 'Developer Tooling',
    tech: 'Rust, LLMs, CLI',
    animationType: 'network',
    overview: 'CommitAura is a command-line tool that generates high-quality commit messages based on staged changes, but the real value is not the single output. The project reflects a broader interest in compressing repetitive developer effort while preserving clarity and intent. CommitAura interprets code diffs, synthesizes meaningful change narratives, and fits naturally into terminal-driven workflows.',
    whyItExists: 'Writing good commit messages is a high-friction task that developers often skip or rush, leading to degraded repository history. CommitAura exists to remove that friction. It does not just summarize code; it infers the *intent* behind the diff, separating mechanical refactors from architectural shifts, and formats the output to match strict conventional commit standards.',
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
    overview: 'Tessellarity is a broader simulation and runtime concept centered on GPU-driven procedural systems, dynamic simulation logic, and a flexible substrate for modeling physical behavior. The long-term ambition is not a single visual demo but a reusable environment for simulation-heavy work: materials, fields, geometry refinement, dynamic interactions, and systems that can evolve beyond fixed asset pipelines.',
    whyItExists: 'Most visual systems on the web rely on static assets or pre-baked animations. When physical interaction or emergent behavior is required, traditional DOM or canvas approaches hit performance walls. Tessellarity exists to push computation to the GPU, allowing for massive particle counts, fluid dynamics, and procedural generation that reacts in real-time to system state.',
    coreMechanisms: [
      'GPU simulation',
      'Dynamic remeshing',
      'Procedural geometry',
      'Physical salience',
      'Runtime substrate design',
      'Simulation-first architecture'
    ],
    roleInWork: 'Tessellarity represents my engine-level interests and my preference for systems built from computational principles rather than content pipelines.'
  },
  {
    id: 'demosnap',
    title: 'DemoSnap',
    subtitle: 'Cinematic presentation system for technical products and interfaces',
    type: 'Systems UX',
    tech: 'React, Framer Motion, WebGL',
    animationType: 'system',
    overview: 'DemoSnap is a system for turning technical products into high-quality visual narratives. Rather than treating demos as an afterthought, it treats them as part of the product surface: clear, cinematic, legible, and structured enough to communicate the system’s value without flattening the underlying complexity.',
    whyItExists: 'Complex technical products often fail not because the engineering is bad, but because the system cannot explain itself. Screen recordings are messy, and slide decks are static. DemoSnap exists to provide a programmatic, reproducible way to orchestrate UI states, camera movements, and annotations, turning raw software into a comprehensible narrative.',
    coreMechanisms: [
      'Visual communication',
      'Product framing',
      'Technical storytelling',
      'Motion-driven interface presentation',
      'State orchestration'
    ],
    roleInWork: 'DemoSnap reflects an important part of my engineering philosophy: if a system cannot present itself clearly, its leverage is limited.'
  }
];
