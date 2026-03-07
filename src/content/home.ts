export type SectionParagraph = {
  tone?: 'lead' | 'closing';
  text: string;
};

export const heroName = 'Alex Figueroa';

export const heroRole = 'Autonomous Systems & Simulation Engineer';

export const heroTitleLines = [
  'Perceptual systems,',
  'recursive tooling,',
  'simulation infrastructure.',
] as const;

export const heroDeck =
  'For products that need to observe, infer, and act.';

export const heroStats = [
  { label: 'Builds', value: 'Perceptual systems, recursive tooling, simulation infrastructure' },
  {
    label: 'Approach',
    value: 'System-first engineering with strong interface judgment',
  },
  {
    label: 'Open to',
    value: 'Senior engineering roles and technically ambitious collaborations',
  },
] as const;

export const thesisParagraphs: SectionParagraph[] = [
  {
    tone: 'lead',
    text: 'I do not build software as isolated screens. I build systems that observe, interpret, and respond.',
  },
  {
    text: 'I am interested in software that carries more of the work: systems that watch state, infer context, model behavior, and drive action in real time.',
  },
  {
    text: 'That shows up in local-first agent tooling, perceptual systems built from gaze and geometry, and simulation infrastructure where behavior matters as much as rendering.',
  },
  {
    text: 'The common thread is operational cognition: products that perceive more, synthesize more, and reduce operator burden without hiding the real constraints.',
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
    text: 'Once those boundaries are visible, the design usually gets simpler. Good systems improve when failure modes are legible instead of hidden behind abstraction.',
  },
  {
    text: 'I also care about context quality. Most automation fails because it runs on thin or noisy inputs. A recurring part of my work is building the context pipeline first so downstream reasoning has something solid to work from.',
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
    text: 'I am most useful when architecture, implementation, interaction design, and technical framing need to reinforce each other.',
  },
] as const;

export const technicalRows = [
  ['Primary languages', 'Rust, Python, TypeScript, JavaScript, GLSL'],
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
    text: 'I do my best work when architecture, implementation, interface design, systems debugging, and product framing all have to happen in the same problem space.',
  },
  {
    text: 'I am especially drawn to systems moving toward perception, simulation, intelligent tooling, and new computational interfaces.',
  },
  {
    tone: 'closing',
    text: 'I care about products that are technically serious, operationally useful, and difficult to forget.',
  },
] as const;
