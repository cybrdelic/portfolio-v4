export interface Project {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  status: 'Featured' | 'Research' | 'Active';
  year: string;
  tech: string;
  role: string;
  bestFor: string;
  repoUrl: string;
  homepageSummary: string;
  detailSummary: string;
  primaryMedia?: {
    src: string;
    alt: string;
    caption: string;
  };
  media?: {
    src: string;
    alt: string;
    caption: string;
  }[];
  artifactLinks?: {
    label: string;
    href: string;
    type: string;
  }[];
  proofPoints: string[];
  overview: string;
  whyItExists: string;
  challenge: string;
  approach: string;
  coreMechanisms: string[];
  outcomes: string[];
}

export const projects: Project[] = [
  {
    id: 'firesim-native',
    title: 'FireSim Native',
    subtitle: 'CUDA-native fire simulation engine with validation-oriented tooling and systems UX',
    type: 'Simulation Platform',
    status: 'Featured',
    year: '2026',
    tech: 'CUDA, C++, Python, Native tooling',
    role: 'Native simulation architecture, CUDA implementation, validation workflow, product framing',
    bestFor: 'Native GPU systems work, simulation-engine architecture, and validation-oriented product thinking.',
    repoUrl: 'https://github.com/cybrdelic/firesim',
    homepageSummary: 'CUDA fire simulation with native tooling, validation gates, worker isolation, and inspection artifacts.',
    detailSummary: 'A native fire-simulation system built around GPU computation, crash isolation, diagnostics, and validation evidence.',
    primaryMedia: {
      src: '/projects/firesim/live-fire-window.png',
      alt: 'FireSim Native live fire render in the native Windows viewport',
      caption: 'Live native FireSim render captured from the CUDA/native UI path.',
    },
    artifactLinks: [
      {
        label: 'Lab-grade readiness JSON',
        href: '/projects/firesim/lab-grade-readiness.json',
        type: 'Validation artifact',
      },
      {
        label: 'Repository',
        href: 'https://github.com/cybrdelic/firesim',
        type: 'Source',
      },
    ],
    proofPoints: [
      'CUDA-native simulation work rather than browser-only rendering',
      'Validation-oriented workflow beyond the render itself',
      'Engine framing that supports diagnostics, tooling, and iteration',
    ],
    overview: 'FireSim Native is a CUDA-based fire-simulation system shaped around iteration, diagnostics, validation thinking, and the supporting interfaces needed to make heavy compute work usable instead of opaque.',
    whyItExists: 'The goal is a native simulation system that can be tested, tuned, inspected, and extended under real computational constraints.',
    challenge: 'Simulation work can look serious while still being hard to operate, hard to validate, and hard to iterate on. The risk is ending up with a technically impressive core that has weak tooling, weak observability, and no product surface around it.',
    approach: 'I have been treating FireSim Native as both an engine problem and a systems-UX problem: building the CUDA-side simulation core while also thinking about diagnostics, iteration loops, validation hooks, and the operator-facing surfaces that make the system legible.',
    coreMechanisms: [
      'CUDA-native simulation core',
      'Diagnostics and iteration workflow',
      'Validation-oriented engine framing',
      'Supporting tooling for inspection and tuning',
      'Operator-surface product thinking',
      'Native-system architecture decisions'
    ],
    outcomes: [
      'Positions the project as native systems work with visible runtime evidence',
      'Shows I can connect heavy GPU engineering with usability and validation concerns',
      'Connects the simulation case study to concrete runtime and validation evidence',
    ],
  },
  {
    id: 'filelight-explorer',
    title: 'Filelight Explorer',
    subtitle: 'Native Windows file explorer focused on preview depth, evidence, and safer local file work',
    type: 'Native Systems UX',
    status: 'Featured',
    year: '2026',
    tech: 'C, Win32, Direct2D, D3D11, WIC, CMake',
    role: 'Native app architecture, preview pipeline, systems UX, Direct2D/D3D integration',
    bestFor: 'Native Windows product engineering, local-first tooling, and precise interfaces for messy real-world files.',
    repoUrl: 'https://github.com/cybrdelic/filelight-explorer',
    homepageSummary: 'Native Windows file explorer with preview-first inspection for images, code, archives, executables, SQLite, WAV, and GLB models.',
    detailSummary: 'A native file browser that keeps the Explorer mental model and makes each selected file easier to inspect before acting.',
    primaryMedia: {
      src: '/projects/filelight/filelight-preview-loop.gif',
      alt: 'Animated Filelight Explorer preview loop showing file inspection states',
      caption: 'Preview loop across local file types in the native app.',
    },
    media: [
      {
        src: '/projects/filelight/filelight-shell.png',
        alt: 'Filelight Explorer shell with sidebar, command bar, file list, and preview pane',
        caption: 'Explorer-shaped native shell with the preview pane treated as first-class workspace.',
      },
      {
        src: '/projects/filelight/filelight-model-preview.png',
        alt: 'Filelight Explorer 3D model preview with embedded texture support',
        caption: 'D3D11 GLB preview path with orbit inspection and embedded texture rendering.',
      },
      {
        src: '/projects/filelight/filelight-ui-polish-check.png',
        alt: 'Filelight Explorer polish check screenshot',
        caption: 'Current native UI polish pass captured from the local app.',
      },
    ],
    artifactLinks: [
      {
        label: 'Preview loop GIF',
        href: '/projects/filelight/filelight-preview-loop.gif',
        type: 'Media',
      },
      {
        label: 'Repository',
        href: 'https://github.com/cybrdelic/filelight-explorer',
        type: 'Source',
      },
    ],
    proofPoints: [
      'Native Windows app built around real file inspection workflows',
      'Preview stack covers images, shell thumbnails, source text, archives, audio, executables, SQLite, and GLB models',
      'Clear product constraint: keep Explorer familiar while making file evidence faster to inspect',
    ],
    overview: 'Filelight Explorer is a native Windows file explorer built around preview depth and local evidence. It keeps the familiar Explorer shape, then improves the parts that slow people down: file previews, project context, inspection, and safer file operations.',
    whyItExists: 'Local files are still where a lot of real work lives, but the default file browser often hides the evidence needed to act confidently. Filelight exists to make file inspection faster without turning the browser into a dashboard or chat shell.',
    challenge: 'A file explorer can easily become either too plain to be useful or too overloaded to trust. The challenge is adding power only where the selected file or folder justifies it, while preserving a calm native workflow.',
    approach: 'I treated the app as a native systems-UX problem: keep the base shell predictable, then build deeper preview paths for the file types that benefit from immediate inspection. The app consumes the sibling native UI engine and uses native rendering paths instead of a web wrapper.',
    coreMechanisms: [
      'Native Win32 application shell',
      'Direct2D-driven interface rendering',
      'WIC-backed image previews',
      'Shell thumbnail integration',
      'Native code and structured-text preview panels',
      'D3D11 GLB model preview with orbit controls'
    ],
    outcomes: [
      'Adds a concrete native product with real preview and inspection workflows',
      'Shows systems UX judgment around familiar workflows and selective power features',
      'Connects the native UI engine work to a visible app with real screenshots and proof media',
    ],
  },
  {
    id: 'fuzzaholic',
    title: 'Fuzzaholic',
    subtitle: 'Shader-fuzzing lab with health scoring, repair loops, and invariant-safe WGSL generation',
    type: 'Shader Toolchain',
    status: 'Featured',
    year: '2025',
    tech: 'React, WebGPU, WGSL, TypeScript',
    role: 'Shader tooling, generator design, heuristic analysis, graphics R&D',
    bestFor: 'Graphics-tooling instincts, shader diagnostics, and original technical framing.',
    repoUrl: 'https://github.com/cybrdelic/Fuzzaholic',
    homepageSummary: 'Shader fuzzing workbench that scores visual health, mutates WGSL under guardrails, and exports usable shader results.',
    detailSummary: 'A WebGPU shader-generation lab that treats visual usefulness as a first-class quality signal, not just compilation success.',
    primaryMedia: {
      src: '/projects/fuzzaholic/desktop-discover.png',
      alt: 'Fuzzaholic desktop discovery lane screenshot',
      caption: 'Desktop discovery lane from the local visual verification pass.',
    },
    media: [
      {
        src: '/projects/fuzzaholic/desktop-effects.png',
        alt: 'Fuzzaholic desktop effects lane screenshot',
        caption: 'Effects lane showing shader variation controls.',
      },
      {
        src: '/projects/fuzzaholic/desktop-export.png',
        alt: 'Fuzzaholic desktop export lane screenshot',
        caption: 'Export lane for moving generated shader work out of the lab.',
      },
      {
        src: '/projects/fuzzaholic/contact-sheet.png',
        alt: 'Fuzzaholic visual check contact sheet',
        caption: 'Contact sheet from the local visual verification pass.',
      },
    ],
    artifactLinks: [
      {
        label: 'Visual contact sheet',
        href: '/projects/fuzzaholic/contact-sheet.png',
        type: 'Proof media',
      },
      {
        label: 'Repository',
        href: 'https://github.com/cybrdelic/Fuzzaholic',
        type: 'Source',
      },
    ],
    proofPoints: [
      'Shader health scoring beyond compile success',
      'Repair loop for blank, static, or unstable outputs',
      'Invariant-safe builders and frozen-zone AST mutation',
    ],
    overview: 'Fuzzaholic is a shader-generation and fuzzing lab built around the question "does this output stay visually useful?" It generates, mutates, stores, and evaluates WGSL programs while tracking whether the output is likely blank, static, cursor-only, unstable, or visually dead.',
    whyItExists: 'The generator encodes visual failure modes and recovery policy directly into the loop, turning shader exploration into a bounded search problem instead of random noise.',
    challenge: 'Generated shader systems usually fail in one of two ways: they produce illegal code, or they produce legal code that is visually useless. Standard tooling rarely helps with the second category, which is often the harder product problem.',
    approach: 'I framed the project around visual-health policy. Instead of only validating syntax, the system scores probable failure modes, mutates the AST under guardrails, and repairs unhealthy outputs so the generator explores useful parts of shader space more often.',
    coreMechanisms: [
      'Shader health analysis',
      'Repair loop for unhealthy outputs',
      'Invariant-safe WGSL builders',
      'Frozen-zone AST mutation policy',
      'Local shader persistence and export',
      'Reflection-aware fuzzing workflow'
    ],
    outcomes: [
      'Shows custom reasoning about generated-program quality, not just syntax',
      'Makes graphics tooling feel like a product system instead of a raw experiment',
      'Adds a specific shader-tooling angle with visible verification artifacts',
    ],
  },
  {
    id: 'singularity-caustics',
    title: 'Singularity Caustics',
    subtitle: 'WebGPU optics study modeling caustics through catastrophe singularities',
    type: 'Optical Rendering Research',
    status: 'Research',
    year: '2025',
    tech: 'React, WebGPU, TypeScript, Gemini API',
    role: 'Rendering research, interaction design, mathematical framing',
    bestFor: 'Rendering research, theory-backed visualization, and distinctive visual computation.',
    repoUrl: 'https://github.com/cybrdelic/singularity-caustics',
    homepageSummary: 'WebGPU optics study for fold, cusp, and caustic structures with a specific catastrophe-theory frame.',
    detailSummary: 'A compact rendering-research surface for studying caustic singularities as interactive visual structures.',
    artifactLinks: [
      {
        label: 'Repository',
        href: 'https://github.com/cybrdelic/singularity-caustics',
        type: 'Source',
      },
    ],
    proofPoints: [
      'Catastrophe-theory framing for optical caustics',
      'Real-time visualization of fold and cusp structures',
      'Specific optical structure beyond material or lighting presets',
    ],
    overview: 'Singularity Caustics is a WebGPU rendering study focused on optical caustics through the language of catastrophe theory. It treats folds, cusps, and umbilic-like structures as first-class visual objects.',
    whyItExists: 'The study connects mathematical singularity structure, interactive rendering, and real-time visual intuition in one compact research surface.',
    challenge: 'The challenge was to anchor the visuals in a specific theoretical lens so the project communicates structure, not just surface beauty.',
    approach: 'I used catastrophe singularities as the conceptual backbone for the interaction and rendering language. That gives the project a clearer research identity and makes the visuals legible as an exploration of structure, not just an aesthetic effect.',
    coreMechanisms: [
      'Catastrophe-theory caustic framing',
      'Real-time singularity visualization',
      'Fold, cusp, and umbilic exploration',
      'Interactive WebGPU optics surface',
      'Research-oriented parameter study',
      'Cinematic light-structure inspection'
    ],
    outcomes: [
      'Introduces a clear rendering-research voice',
      'Shows mathematical framing and visual-system design working together',
      'Broadens the project set beyond product surfaces into rendering inquiry',
    ],
  }
];
