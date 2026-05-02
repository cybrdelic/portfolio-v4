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
    id: 'vdbstream',
    title: 'VDBStream',
    subtitle: 'Browser WebGPU sparse-field runtime with mutable voxel bricks',
    type: 'Simulation Runtime',
    tech: 'TypeScript, WebGPU, WGSL, Vite',
    animationType: 'timeseries',
    overview: 'VDBStream is a runnable browser prototype for a VDB-style game architecture. The world lives in sparse 16x16x16 bricks, streams pages around the player, mutates field values through tools, packs a local 64x64x64 view into a WebGPU 3D texture, and raymarches the result in WGSL.',
    whyItExists: 'Native OpenVDB and NanoVDB do not map cleanly into a normal browser app. This project proves the game-side architecture first: sparse page residency, dirty-brick mutation, local GPU upload, and visible field rendering that can be inspected without a native toolchain.',
    coreMechanisms: [
      'Sparse brick world store',
      'Queued page streaming',
      'Runtime field tools',
      'Heat and smoke simulation',
      'Packed 3D texture upload',
      'WGSL volume raymarching'
    ],
    roleInWork: 'This is the clearest recent simulation artifact to extract: it turns a speculative VDB architecture into a small, runnable WebGPU system with a real code path.'
  },
  {
    id: 'codex-connect',
    title: 'Codex Connect',
    subtitle: 'Native Android and local bridge control surface for Codex sessions',
    type: 'Operator Infrastructure',
    tech: 'Android, Java, Node, Codex CLI',
    animationType: 'network',
    overview: 'Codex Connect is a native Android client plus a local PC bridge for sending prompts from a phone into Codex. The bridge exposes health, command, and job polling routes, persists queued jobs, and can run fresh or resumed Codex CLI work without SMS, tunnels, or third-party relays.',
    whyItExists: 'Codex is powerful but still mostly trapped at the desktop. This project makes the control plane reachable from a phone while keeping the trust boundary local: same machine, local LAN or VPN, shared app secret, and explicit ask/do modes.',
    coreMechanisms: [
      'Local Node bridge',
      'Native Android client',
      'Shared-secret command API',
      'Queued job persistence',
      'Codex CLI execution',
      'Browser fallback console'
    ],
    roleInWork: 'This is a strong portfolio project because it is not a mockup. It reached a live phone-submitted smoke path that returned a real Codex response.'
  },
  {
    id: 'spectrocity',
    title: 'Spectrocity',
    subtitle: 'WebGPU gemstone renderer with diagnostic probe tooling',
    type: 'Rendering Systems',
    tech: 'WebGPU, TypeScript, React, Playwright',
    animationType: 'system',
    overview: 'Spectrocity is a real-time gemstone renderer built around spectral dispersion, procedural gem cuts, and WebGPU compute paths. Recent work made the project more durable by splitting the risky full diamond shader from a safer diamond_preview path and adding probes that classify visible render signal, device loss, and requestDevice traces.',
    whyItExists: 'WebGPU demos often fail as black boxes: a page goes blank and the only feedback is a browser error. Spectrocity treats renderer stability as part of the product by exposing internal renderer state and producing artifacts that survive bad GPU sessions.',
    coreMechanisms: [
      'Spectral ray tracing',
      'Procedural SDF gem cuts',
      'WebGPU renderer lifecycle',
      'Device-loss instrumentation',
      'Visual signal probes',
      'Watchdog/debug protocol'
    ],
    roleInWork: 'Spectrocity shows the renderer/debugging side of my work: not just making a GPU visual, but building the tools to prove when it is actually alive.'
  },
  {
    id: 'eye-sim',
    title: 'EyeSim',
    subtitle: 'Procedural face rig and presentation surface with proof captures',
    type: 'Perceptual Interfaces',
    tech: 'React, Three.js, MediaPipe, TypeScript',
    animationType: 'system',
    overview: 'EyeSim is a React and Three.js digital face rig with procedural eyes, shot-based presentation modes, opt-in tracking, and separated lab routes for material, WebGPU, and asset-conditioning work. The strongest recent slice adds a procedural-head route with generator-backed geometry, mouth shaping, and proof captures for desktop, close-up, and mobile surfaces.',
    whyItExists: 'Face and gaze work gets hard to evaluate when it is buried in renderer experiments. EyeSim keeps the product route, lab routes, tracking adapters, presentation shots, and conditioning scripts separated so the project can be judged as a real interface rather than a pile of demos.',
    coreMechanisms: [
      'Procedural head generation',
      'Shot-based presentation',
      'MediaPipe tracking adapter',
      'Facecap conditioning scripts',
      'Mouth and expression systems',
      'Release proof screenshots'
    ],
    roleInWork: 'EyeSim is the strongest real replacement for the old perceptual-systems placeholder because it has routes, screenshots, source modules, and a proof page already in the repo.'
  },
  {
    id: 'codex-operator-kit',
    title: 'Codex Operator Kit',
    subtitle: 'Local plugin and skill system for repeatable Codex workflows',
    type: 'Codex Tooling',
    tech: 'Codex Plugins, Python, Node, Skills',
    animationType: 'pipeline',
    overview: 'Codex Operator Kit is the local plugin/tooling layer that came out of recent Codex work: harness-forge for discovering measurable project loops, autoresearch-operator for bounded observe/edit/verify cycles, anti-pattern-memory for curated rule packs, ai-slop-audit for explicit PASS/FLAG checks, and codex-theme-forge for Windows app theme generation.',
    whyItExists: 'One-off prompts do not compound unless the workflow becomes callable again. This project turns repeated Codex patterns into local plugins, skills, scripts, static rule packs, and installed operator surfaces that can be reused without harvesting context every time.',
    coreMechanisms: [
      'Plugin scaffolding',
      'Installed skill contracts',
      'Harness generation',
      'Autoresearch loops',
      'Static anti-pattern packs',
      'Audit pass reporting'
    ],
    roleInWork: 'This is the most honest Codex-native portfolio entry: it shows that I am not only using agents, I am building durable operator infrastructure around them.'
  }
];
