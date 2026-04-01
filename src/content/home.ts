export type SectionParagraph = {
  tone?: 'featured' | 'lead' | 'closing';
  text: string;
};

export type EthosBodyParagraph = {
  text: string;
};

export type EthosPrinciple = {
  detail: string;
  signal: string;
  title: string;
};

export type TechnicalRow = {
  detail: string;
  label: string;
  primary: string;
  signal: string;
};

export type ExperienceHighlight = {
  detail: string;
  title: string;
};

export type ExperienceRole = {
  company: string;
  highlights: ExperienceHighlight[];
  location: string;
  period: string;
  summary: string;
  title: string;
};

export const heroName = 'Alex Figueroa';

export const heroRole = 'Autonomous Systems & Simulation Engineer';

export const heroTitleLines = [
  'Systems that',
  'perceive,',
  'reason,',
  'and respond.',
] as const;

export const heroDeck =
  'For products where perception, context, and action have to survive real constraints.';

export const heroStats = [
  {
    label: 'Built in',
    value: 'Autonomous tooling, perceptual systems, simulation infrastructure',
  },
  {
    label: 'Bias',
    value: 'Systems that reduce operator effort without hiding the machine',
  },
  {
    label: 'Current',
    value: 'Senior engineering roles and a small number of serious collaborations',
  },
] as const;

export const thesisParagraphs: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I do not build software as isolated screens. I build systems that observe, interpret, and respond.',
  },
  {
    tone: 'featured',
    text: 'The point is software that carries more of the work.',
  },
  {
    tone: 'closing',
    text: 'That shows up in local-first agent tooling, perceptual systems, and simulation infrastructure where architecture, interaction, performance, and reasoning all have to hold together under real constraints.',
  },
] as const;

export const ethosLead =
  'Meaningful autonomy scales with how much of the environment is made legible, assignable, and actionable.';

export const ethosRailNote =
  'Autonomy becomes real when environments expose state, boundaries, and valid intervention surfaces.';

export const ethosPullQuote =
  'Meaningful autonomy scales with how much of the environment is made legible, assignable, and actionable.';

export const ethosPrinciples: EthosPrinciple[] = [
  {
    title: 'Legible',
    signal: 'Expose the real state',
    detail: 'Make constraints, failure modes, and system boundaries visible before asking software to reason over them.',
  },
  {
    title: 'Assignable',
    signal: 'Give the world structure',
    detail: 'Partition the environment into explicit entities, responsibilities, and control surfaces that can be addressed without ambiguity.',
  },
  {
    title: 'Actionable',
    signal: 'Build reliable handles',
    detail: 'Create fixtures, APIs, harnesses, and simulation layers that let a system intervene, validate outcomes, and recover safely.',
  },
] as const;

export const ethosBody: EthosBodyParagraph[] = [
  {
    text: 'My first move is usually to expose the actual operating surface: where the state lives, where the cost hides, where uncertainty enters, and where brittle assumptions are smuggling themselves in as architecture.',
  },
  {
    text: 'That is why so much of my work ends up around fixtures, autonomy APIs, simulation tooling, workflow state, and validation loops. Before agency can compound, the environment has to become something a system can inspect, perturb, and verify.',
  },
] as const;

export const ethosClosing =
  'I build systems that turn software and hardware environments into machine-operable substrates, so autonomous behavior can emerge under real constraints instead of surviving only inside demos.';

export const systemDomains = [
  {
    title: 'Autonomous Tooling',
    desc: 'Systems that gather context, orchestrate work, and steadily reduce operator load.',
  },
  {
    title: 'Perceptual Systems',
    desc: 'Systems that model the relationship between a person, a screen, and surrounding space live.',
  },
  {
    title: 'Simulation and Rendering',
    desc: 'GPU-heavy systems where visuals emerge from computation, not asset pipelines.',
  },
  {
    title: 'Systems UX',
    desc: 'Interfaces for technical systems that must stay precise, legible, and fast under pressure.',
  },
] as const;

export const technicalIntro: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I work across the stack, but the real throughline is system behavior.',
  },
  {
    text: 'The work spans product engineering, automation systems, backend services, local-first applications, rendering systems, shader work, GPU simulation, and interface architecture.',
  },
  {
    tone: 'closing',
    text: 'I am most useful when architecture, implementation, interaction design, and technical framing all need to reinforce each other.',
  },
] as const;

export const experienceIntro: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'My experience sits where ambiguous product direction meets hard systems constraints.',
  },
  {
    text: 'The work tends to span implementation, runtime behavior, interaction design, and the operational machinery needed to make technical systems trustworthy under pressure.',
  },
  {
    tone: 'closing',
    text: 'What matters most is not the stack in isolation, but the ability to turn unstable, high-context problems into systems that can be reasoned about, operated, and extended cleanly.',
  },
] as const;

export const experienceRoles: ExperienceRole[] = [
  {
    title: 'Autonomous Systems Engineering',
    company: 'Local-first tooling, execution systems, and operator-facing automation',
    period: 'Current focus',
    location: 'Software systems',
    summary: 'I build systems that capture context, expose action surfaces, and reduce operator burden without flattening the actual machine beneath the interface.',
    highlights: [
      {
        title: 'Context-rich workflows',
        detail: 'Designing systems that gather the right state before acting so downstream automation is grounded instead of decorative.',
      },
      {
        title: 'Operable interfaces',
        detail: 'Building fixtures, APIs, and control layers that let software be inspected, driven, and validated with repeatable behavior.',
      },
    ],
  },
  {
    title: 'Perceptual and Spatial Computing',
    company: 'Gaze, geometry, and screen-aware interaction systems',
    period: 'Ongoing',
    location: 'Human-machine boundary',
    summary: 'I work on systems that infer relationships between a person, a device, and surrounding space in real time, where UX quality depends on geometry, latency, and model discipline all holding at once.',
    highlights: [
      {
        title: 'Real-time inference',
        detail: 'Combining geometry, state estimation, and interface design so perceptual behavior stays legible and useful while the system is live.',
      },
      {
        title: 'Embodied interaction',
        detail: 'Treating the screen, camera, and user as one coupled environment rather than separate implementation layers.',
      },
    ],
  },
  {
    title: 'Simulation, Rendering, and Systems UX',
    company: 'GPU-heavy visual systems and technical product surfaces',
    period: 'Across recent projects',
    location: 'Runtime to interface',
    summary: 'I build interfaces and rendering systems that have to remain precise under load, where performance, clarity, and behavioral correctness are part of the same design problem.',
    highlights: [
      {
        title: 'Computation as medium',
        detail: 'Using rendering and simulation as active system components, not just presentation layers pasted on at the end.',
      },
      {
        title: 'Cross-layer product judgment',
        detail: 'Resolving architecture, interaction, and technical framing as one system so the product stays coherent under real constraints.',
      },
    ],
  },
] as const;

export const technicalRows: TechnicalRow[] = [
  {
    label: 'Primary languages',
    primary: 'Rust for systems and tooling, Python for research and automation, TypeScript and JavaScript for product surfaces, GLSL for live GPU behavior.',
    detail: 'The point is range without fragmentation: low-level systems work, fast iteration, production interfaces, and rendering logic can all live inside the same problem space.',
    signal: 'From runtime to interface',
  },
  {
    label: 'Systems and infrastructure',
    primary: 'PostgreSQL, Redis, Docker, Kubernetes, RabbitMQ, and Terraform where durability, orchestration, queues, and deployment discipline matter.',
    detail: 'I use infrastructure as part of the product architecture, not an afterthought: state models, background work, service boundaries, and operational reliability all have to support the interaction model.',
    signal: 'Operational backbone',
  },
  {
    label: 'Frontend and interface',
    primary: 'React, WebGL, shader systems, interaction architecture, and visual systems design for interfaces that need to stay precise under load.',
    detail: 'I care about frontend work that behaves like an instrument: clear state, deliberate motion, legible structure, and enough performance headroom that the interface still feels calm when the system underneath is not.',
    signal: 'Precision at the surface',
  },
  {
    label: 'Current technical interests',
    primary: 'Perceptual interfaces, local-first AI tooling, GPU-driven simulation, and embodied computing systems.',
    detail: 'The common thread is software that perceives more, models more context, and takes on more of the operational burden without flattening the real constraints.',
    signal: 'Where the work is heading',
  },
] as const;

export const workingStyleLead =
  'I am strongest where architecture, product judgment, and implementation have to move as one system.';

export const workingStyleRailNote =
  'The work is best when interface decisions, systems constraints, and execution strategy can be resolved in the same frame.';

export const workingStylePullQuote =
  'Cross-layer problems are where the real leverage is.';

export const workingStylePrinciples: EthosPrinciple[] = [
  {
    title: 'Resolve the real constraint',
    signal: 'No ornamental complexity',
    detail: 'Expose the actual bottleneck first, then remove layers that only disguise it as sophistication.',
  },
  {
    title: 'Keep judgment cross-layer',
    signal: 'Architecture to surface',
    detail: 'Product behavior, interface tone, and runtime design should reinforce one another instead of being handed off blindly.',
  },
  {
    title: 'Prefer operable clarity',
    signal: 'Systems that can be used',
    detail: 'The best work is precise enough to reason about, useful enough to operate, and strong enough to survive real constraints.',
  },
] as const;

export const workingStyleBody: EthosBodyParagraph[] = [
  {
    text: 'I do my best work when interface design, systems debugging, and technical framing all need to happen in the same problem space.',
  },
  {
    text: 'I bias toward directness: tighten the state model, expose the real constraint, remove unnecessary ceremony, and make the system easier to reason about.',
  },
] as const;

export const workingStyleClosing =
  'The best projects are technically serious, operationally useful, and difficult to forget.';
