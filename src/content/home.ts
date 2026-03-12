export type SectionParagraph = {
  tone?: 'featured' | 'lead' | 'closing';
  text: string;
};

export type EthosBodyParagraph = {
  text: string;
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
  duration: string;
  highlights: ExperienceHighlight[];
  location: string;
  period: string;
  summary: string;
  title: string;
};

export const heroName = 'Alex Figueroa';

export const heroRole = 'Autonomous Systems, Perception & Simulation Engineer';

export const heroTitleLines = [
  'Systems that',
  'perceive,',
  'reason,',
  'and respond.',
] as const;

export const heroDeck =
  'For systems where perception, context, and action have to hold under real constraints.';

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
    text: 'The point is software that carries more of the work: local-first tooling that gathers context before it acts, perceptual systems that model people and space in real time, and simulation infrastructure where performance, interface, and system behavior all have to hold together under load.',
  },
] as const;

export const ethosLead =
  'I make systems legible before I make them clever.';

export const ethosPullQuote =
  'Real constraints come first.';

export const ethosBody: EthosBodyParagraph[] = [
  {
    text: 'I want to know where the cost is, where the uncertainty is, and where the brittleness lives. That usually means decomposing a problem until the real boundaries are explicit: memory movement, render cost, search quality, synchronization overhead, false context, or weak state models.',
  },
  {
    text: 'Most automation fails because it runs on thin or noisy inputs. A recurring part of my work is building the context pipeline first, so downstream reasoning is grounded in something real.',
  },
] as const;

export const ethosClosing =
  'The goal is not abstraction for its own sake. It is software that becomes more capable as the constraints become clearer.';

export const systemDomains = [
  {
    title: 'Autonomous Tooling',
    desc: 'Systems that gather context, orchestrate work, and reduce operator load without hiding the machine.',
  },
  {
    title: 'Perceptual Systems',
    desc: 'Systems that model the relationship between a person, a screen, and surrounding space in real time.',
  },
  {
    title: 'Simulation and Rendering',
    desc: 'GPU-driven systems where behavior and visuals emerge from computation, not asset pipelines.',
  },
  {
    title: 'Systems UX',
    desc: 'Interfaces for technical systems that have to remain precise, legible, and fast under pressure.',
  },
] as const;

export const technicalIntro: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I work across layers, but the throughline is system behavior.',
  },
  {
    text: 'The work spans enterprise SaaS, automation systems, backend services, local-first applications, rendering systems, shader logic, GPU simulation, and interface architecture.',
  },
  {
    tone: 'closing',
    text: 'I am most useful where architecture, implementation, interaction design, and technical framing all need to reinforce each other.',
  },
] as const;

export const experienceIntro: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I have spent the last four-plus years shipping production software at TalentNow while building independent systems work in parallel.',
  },
  {
    text: 'That matters because the portfolio is not just experimentation. It is backed by enterprise analytics, cross-service integration, release discipline, and the operational reality of software people depend on every day.',
  },
  {
    tone: 'closing',
    text: 'The same throughline runs through both: make the system more legible, more capable, and more trustworthy under real constraints.',
  },
] as const;

export const experienceRoles: ExperienceRole[] = [
  {
    title: 'Software Engineer',
    company: 'TalentNow',
    period: 'February 2025 - Present',
    duration: 'Current role',
    location: 'Cincinnati, Ohio / Fully Remote',
    summary:
      'Promoted into a broader engineering role focused on harder analytics problems, deeper investigations, and architecture changes that move reporting and operational visibility closer to real time.',
    highlights: [
      {
        title: 'Real-time analytics migration',
        detail:
          'Migrated a nightly-snapshot time-series reporting system toward a real-time architecture through database modeling changes, query optimization, and timestamp-based rewindable design.',
      },
      {
        title: 'Diversity tracking and RBAC reporting',
        detail:
          'Implemented complex diversity tracking, analytics, and visualization with time-period filtering and role-based access control.',
      },
      {
        title: 'Deep SQL investigations',
        detail:
          'Ran multi-environment SQL investigations across dev, test, and local data to isolate analytics issues and clarify system behavior.',
      },
    ],
  },
  {
    title: 'Associate Software Developer',
    company: 'TalentNow',
    period: 'September 2021 - February 2025',
    duration: '3 years 5 months',
    location: 'Cincinnati, Ohio / Fully Remote',
    summary:
      'Built full-stack features across a remote enterprise SaaS team, contributing heavily to UI flows, gateway logic, internal APIs, database changes, release work, and platform capabilities.',
    highlights: [
      {
        title: '500+ PRs and 100+ releases',
        detail:
          'Shipped features across the full stack and participated directly in release handling and post-release manual validation.',
      },
      {
        title: 'Cross-service auth bridge',
        detail:
          'Reverse-engineered Flask signed-token behavior and reimplemented it in pure TypeScript for cross-language service authentication without a browser context; it ran for years with zero auth failures.',
      },
      {
        title: 'Communications and workflow systems',
        detail:
          'Owned much of the email and communications work: user-flow integration, notifications, templating, and cross-service Celery worker behavior.',
      },
      {
        title: 'AI and product surface work',
        detail:
          'Built a voice-chat feature into the company AI assistant at a hackathon and helped shape Flex Teams early as one of its earliest contributors.',
      },
    ],
  },
] as const;

export const technicalRows: TechnicalRow[] = [
  {
    label: 'Primary languages',
    primary: 'TypeScript and JavaScript for production product surfaces, Python for research and backend workflows, Rust for systems and tooling, GLSL and WGSL for live GPU behavior.',
    detail: 'The point is range without fragmentation: enterprise product work, fast iteration, local-first systems, and rendering logic can all live inside the same problem space.',
    signal: 'From runtime to interface',
  },
  {
    label: 'Systems and infrastructure',
    primary: 'PostgreSQL, SQLite, Redis, Docker, Kubernetes, Celery-style worker systems, and service-to-service integration where durability, queues, and release discipline matter.',
    detail: 'I use infrastructure as part of the product architecture, not an afterthought: state models, background work, data migrations, service boundaries, and operational reliability all have to support the interaction model.',
    signal: 'Operational backbone',
  },
  {
    label: 'Enterprise platform work',
    primary: 'Analytics systems, RBAC, cross-service authentication, email and notification workflows, search infrastructure, and full-stack product delivery inside an enterprise SaaS environment.',
    detail: 'TalentNow is where I learned how to make software hold up in production: multi-tenant constraints, release cadence, operational debugging, and feature work spanning UI, APIs, background jobs, and data design.',
    signal: 'Production credibility',
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
    detail: 'The common thread is software that perceives more, models more context, and carries more of the operational burden without flattening the real constraints.',
    signal: 'Where the work is heading',
  },
] as const;

export const workingStyleLead =
  'I am strongest where architecture, product judgment, and implementation have to move as one system.';

export const workingStylePullQuote =
  'Cross-layer problems are where the real leverage is.';

export const workingStyleBody: EthosBodyParagraph[] = [
  {
    text: 'I do my best work when interface design, systems debugging, and technical framing all need to happen in the same problem space.',
  },
  {
    text: 'I bias toward directness: tighten the state model, expose the real constraint, remove unnecessary ceremony, and make the system easier to reason about.',
  },
] as const;

export const workingStyleClosing =
  'The best projects are technically serious, operationally useful, and built so the interaction model and system model reinforce each other.';
