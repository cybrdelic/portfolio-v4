export type SectionParagraph = {
  tone?: 'lead' | 'closing';
  text: string;
};

export const heroIdentity =
  'Alex Figueroa — Autonomous Systems & Simulation Engineer';

export const heroTitle =
  'I build perceptual systems, recursive tooling, and simulation infrastructure that push software beyond static interfaces.';

export const heroTagline = 'Simulation engines, tooling, and systems UX.';

export const heroMobileSubtitle =
  'CUDA fire simulation, native file inspection, shader generation, and WebGPU rendering studies.';

export const heroStats = [
  {
    label: 'Simulation',
    value: 'CUDA fire simulation and native validation tooling',
  },
  {
    label: 'Focus',
    value: 'GPU systems, graphics tooling, operator-facing systems UX',
  },
] as const;

export const thesisParagraphs: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I build systems that observe, interpret, and respond under real constraints.',
  },
  {
    text: 'That shows up most clearly in native simulation work, graphics tooling, and interface-heavy technical products where diagnostics, control, and usability matter as much as the rendering.',
  },
  {
    tone: 'closing',
    text: 'The work is strongest when architecture, interaction, performance, and reasoning all have to hold together at once.',
  },
] as const;

export const ethosParagraphs: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'My work is driven by constraint visibility, first-principles decomposition, and aggressive context capture.',
  },
  {
    text: 'I want to know where the cost is, where the uncertainty is, and where the brittleness lives. That usually means decomposing a problem until the real boundaries are explicit: memory movement, render cost, search quality, synchronization overhead, false context, or weak state models.',
  },
  {
    tone: 'closing',
    text: 'The objective is not novelty. It is software that becomes more capable and more useful under real constraints.',
  },
] as const;

export const systemDomains = [
  {
    title: 'Autonomous Tooling',
    desc: 'Systems that gather context, orchestrate work, and reduce operator effort over time.',
  },
  {
    title: 'Perceptual Systems',
    desc: 'Systems that model the relationship between a person, a screen, and surrounding space in real time.',
  },
  {
    title: 'Simulation and Rendering',
    desc: 'GPU-heavy systems where the visuals emerge from computation, not asset pipelines.',
  },
  {
    title: 'Systems UX',
    desc: 'Interfaces for technical systems that need to stay precise, legible, and fast under pressure.',
  },
] as const;

export const technicalIntro: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I work across the stack, but the throughline is system behavior.',
  },
  {
    text: 'My background spans product engineering, automation systems, backend services, local-first applications, rendering systems, shader work, GPU simulation, and interface architecture.',
  },
  {
    tone: 'closing',
    text: 'I am most useful when a product needs architecture, implementation, interaction design, and technical framing to reinforce each other.',
  },
] as const;

export const technicalRows = [
  ['Primary languages', 'Rust, Python, TypeScript, JavaScript, WGSL, CUDA'],
  ['Systems and infrastructure', 'PostgreSQL, Redis, Docker, Kubernetes, RabbitMQ, Terraform'],
  ['Frontend and interface', 'React, WebGL, shader systems, interaction architecture, visual systems design'],
  ['Current technical interests', 'Perceptual interfaces, local-first AI tooling, GPU-driven simulation, embodied computing systems'],
] as const;

export const workingStyleParagraphs: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I am strongest on cross-layer problems that do not fit neatly inside one engineering box.',
  },
  {
    text: 'I do my best work when architecture, implementation, interface design, systems debugging, and product framing all need to happen in the same problem space.',
  },
  {
    text: 'I am especially drawn to systems that move toward perception, simulation, intelligent tooling, and new computational interfaces.',
  },
  {
    tone: 'closing',
    text: 'I care about products that are technically serious, operationally useful, and difficult to forget.',
  },
] as const;
