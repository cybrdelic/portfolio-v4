import { projects } from '../data';

export const catalogDomains = [
  {
    key: 'all',
    label: 'All Projects',
    summary: 'Every public GitHub repo plus the systems already surfaced in this portfolio.',
  },
  {
    key: 'autonomous-tooling',
    label: 'Autonomous Tooling',
    summary: 'Context capture, orchestration, automation, and operator-load reduction.',
  },
  {
    key: 'perceptual-systems',
    label: 'Perceptual Systems',
    summary: 'Spatial inference, gaze work, webcam pipelines, and live human-state modeling.',
  },
  {
    key: 'simulation-rendering',
    label: 'Simulation and Rendering',
    summary: 'GPU-heavy experiments, numerical systems, rendering research, and visual computation.',
  },
  {
    key: 'systems-ux',
    label: 'Systems UX',
    summary: 'Interface systems, theme architecture, product shells, and precision-oriented surfaces.',
  },
] as const;

export type CatalogDomainKey = (typeof catalogDomains)[number]['key'];
export type CatalogProjectStatus = 'Showcased' | 'Active' | 'Lab' | 'Legacy' | 'Archived';

export const catalogStatuses = [
  {
    key: 'Showcased',
    summary: 'Primary portfolio systems',
  },
  {
    key: 'Active',
    summary: 'Serious current work',
  },
  {
    key: 'Lab',
    summary: 'Exploratory or incomplete',
  },
  {
    key: 'Legacy',
    summary: 'Older or superseded',
  },
  {
    key: 'Archived',
    summary: 'Intentionally frozen',
  },
] as const;

export type CatalogProject = {
  archived: boolean;
  description: string;
  detailPath?: string;
  domain: Exclude<CatalogDomainKey, 'all'>;
  featured: boolean;
  githubUrl?: string;
  language: string;
  repoName?: string;
  source: 'Featured + GitHub' | 'Portfolio only' | 'Public GitHub';
  status: CatalogProjectStatus;
  techSummary: string;
  title: string;
  updatedAt: string | null;
};

type RepoSnapshotRow = readonly [string, string, string, boolean, string];

const publicRepoSnapshot: RepoSnapshotRow[] = [
  ['portfolio-v4', 'TypeScript', '2026-03-06', false, 'newest portfolio lol'],
  ['firesim', 'TypeScript', '2026-03-05', false, 'Real-time 3D fire and fluid simulation powered by WebGPU compute shaders'],
  ['eye-sim', 'TypeScript', '2026-03-05', false, 'an eye simulation for websites/etc'],
  ['outersense', 'HTML', '2026-03-05', false, 'Human Awareness Digital Twin'],
  ['tessellarity', 'TypeScript', '2026-03-05', false, 'Branch of Matsuoka-601\'s WebGPU-Ocean, Introducing A Developer Focused, WebGPU-based Simulation Engine'],
  ['unified-career-app', 'JavaScript', '2026-03-04', false, ''],
  ['drone-sim', 'TypeScript', '2026-03-01', false, 'drone sim'],
  ['space-sim', 'TypeScript', '2026-02-27', false, 'space sim'],
  ['vidbeamer', 'TypeScript', '2026-02-25', false, 'Beam a video through QR code from your PC.'],
  ['web-mls-mpm', 'TypeScript', '2026-02-21', false, 'This is a repo for MLS-MPM for web apps'],
  ['cybrdelic.github.io', 'HTML', '2026-02-19', false, 'Personal landing page portfolio'],
  ['cybrdelic', '', '2026-01-29', false, ''],
  ['twin-engine', 'TypeScript', '2025-12-06', false, 'Engine for CAD and mechanical computational dynamics'],
  ['shadernetics-labs', 'TypeScript', '2025-12-06', false, 'WebGPU Simulation Sandbox'],
  ['4d-ik', 'TypeScript', '2025-12-06', false, '4D Time-Compressed IK Solver'],
  ['photon-surface', 'TypeScript', '2025-12-05', false, 'Fractional Dimension Rendering'],
  ['singularity-caustics', 'TypeScript', '2025-12-03', false, 'Differentiable caustics by modeling them after catastrophe singularities'],
  ['webgpu-compute-cam-filters', 'TypeScript', '2025-12-03', false, 'Fun Filters using Compute Shaders'],
  ['webgpu-globe', 'TypeScript', '2025-12-03', false, 'WebGPU real-time globe'],
  ['camhancer', 'TypeScript', '2025-12-03', false, 'webcam webgpu denoising and upscaling pipeline'],
  ['outersense-webgpu', 'TypeScript', '2025-12-03', false, 'WebGPU rewrite of Outersense a webcam based gaze tracker'],
  ['Fuzzaholic', 'TypeScript', '2025-11-30', false, 'shader fuzzer'],
  ['ggx-gtr-render-comparison', 'TypeScript', '2025-11-30', false, 'A render comparison for obj models using GGX vs GTR'],
  ['webgpu-data-vis-engine', 'TypeScript', '2025-11-29', false, 'Data visualization component library using WebGPU'],
  ['cloth-augmented-vertex-block-descent', 'TypeScript', '2025-11-29', false, 'Cloth sim using the Augmented Vertex Block Descent algorithm'],
  ['webgpu-restir-demo', 'TypeScript', '2025-11-27', false, 'ReSTIR Global Illumination Demo in WebGPU'],
  ['city-dev', 'TypeScript', '2025-11-27', false, '7 million-plus building city with over 8B ray operations per second using WebGPU'],
  ['webGPU-lightning', 'TypeScript', '2025-11-27', false, 'Lightning rendered photorealistically in WebGPU using Schlick GGX'],
  ['heroyk', 'TypeScript', '2025-11-27', false, 'design landing pages with webgpu'],
  ['xela-themes-site', '', '2025-11-21', false, 'A landing page experience for the XELA Themes VS Code extension'],
  ['adaptive-layout-engine', 'JavaScript', '2025-11-13', false, 'Modern JavaScript library for adaptive positioning and layout with collision detection and dynamic repositioning'],
  ['dronesmasher', 'TypeScript', '2025-11-12', false, 'Topology optimization for 3D printing drone frames'],
  ['testing-amazing-animations-and-effects', 'JavaScript', '2025-10-29', false, ''],
  ['cybrdelic-portfolio-v2', 'JavaScript', '2025-09-14', false, 'A personal landing page portfolio, nice design.'],
  ['graphics-experiments', 'HTML', '2025-09-14', false, 'A set of unpolished web graphics experiments'],
  ['demosnap', 'JavaScript', '2025-09-14', false, 'Automated teaser trailer or demo videos using Three.js, user flow identification via element scanning, and video compositioning.'],
  ['shadernetic', 'TypeScript', '2025-08-31', false, ''],
  ['xela-themes', 'JavaScript', '2025-08-25', false, ''],
  ['jjugg-site', 'JavaScript', '2025-06-15', false, 'A landing page for the JJUGG autonomous job hunting platform.'],
  ['commitaura', 'HTML', '2025-06-11', false, 'Uses GPT API to autonomously create commit messages based on your staged changes'],
  ['clippd', 'Python', '2025-05-07', false, 'Video-scene intelligence pipeline: capture spatial physics data from video footage and support intelligent editing workflows.'],
  ['myriad', 'Rust', '2025-04-15', false, 'TUI for chatting with your codebase and autonomously generated project documentation and extrapolations.'],
  ['repotronium', 'TypeScript', '2025-03-23', false, ''],
  ['jjugg', 'TypeScript', '2025-03-19', false, 'Autonomous job tracking via userscripts and email scanning, with a local web app to manage it all.'],
  ['cybrdelic-portfolio', 'CSS', '2025-03-14', false, 'A modern interactive portfolio with project detail pages, a project showcase, career timeline, and more.'],
  ['profile-prism', 'HTML', '2025-03-13', false, ''],
  ['WorkspaceAutomator', 'Python', '2025-03-11', true, 'Streamline your daily workflow with automated desktop setups and positioning.'],
  ['smart_context_reducer', 'Python', '2025-03-11', true, ''],
  ['cybrconsole', 'Python', '2025-03-11', true, ''],
  ['amalgia', 'Go', '2025-03-11', true, 'CLI for resumes, cover letters, GitHub README capture, and document generation.'],
  ['Blitzkrieg', 'Python', '2025-03-11', true, 'Framework for self-writing CLIs, libraries, and applications with continuous refinement.'],
  ['resumatyk', 'Shell', '2025-03-11', false, 'fzf-driven terminal resume editor and compiler with style-system exploration.'],
  ['browsealizer', 'JavaScript', '2025-03-10', false, 'A way to scroll GitHub repos endlessly.'],
  ['cybrdelic-nvim-starter', 'Lua', '2024-10-18', false, 'A heavily reworked personal Neovim starter configuration.'],
  ['AlexFigueroa', '', '2023-12-30', false, 'GitHub profile portfolio and resume repository.'],
  ['WinOrchestrate', 'PowerShell', '2023-10-25', false, 'Automation scripts for setting up a Windows environment.'],
  ['CodebaseSeed', 'Shell', '2023-10-25', false, 'Template-driven Python project creation with automated setup.'],
  ['CodebasedUtils', 'Python', '2023-10-25', false, 'CLI workflow utilities for directory inspection and dev ergonomics.'],
  ['BeatCommerce-Advanced', 'JavaScript', '2023-10-23', false, 'Discontinued e-commerce web application for music producers.'],
  ['cybrvybe.github.io', 'TypeScript', '2023-05-19', false, 'Earlier TypeScript portfolio with Framer Motion and styled-components.'],
];

const catalogDomainTitleMap = {
  'Autonomous Tooling': 'autonomous-tooling',
  'Perceptual Systems': 'perceptual-systems',
  'Simulation and Rendering': 'simulation-rendering',
  'Simulation & Rendering': 'simulation-rendering',
  'Systems UX': 'systems-ux',
  'Developer Tooling': 'autonomous-tooling',
} as const;

const repoDomainOverrides: Record<string, Exclude<CatalogDomainKey, 'all'>> = {
  AlexFigueroa: 'systems-ux',
  Blitzkrieg: 'autonomous-tooling',
  CodebaseSeed: 'autonomous-tooling',
  CodebasedUtils: 'autonomous-tooling',
  Fuzzaholic: 'simulation-rendering',
  WorkspaceAutomator: 'autonomous-tooling',
  'adaptive-layout-engine': 'systems-ux',
  amalgia: 'autonomous-tooling',
  browsealizer: 'systems-ux',
  camhancer: 'perceptual-systems',
  clippd: 'perceptual-systems',
  commitaura: 'autonomous-tooling',
  cybrconsole: 'autonomous-tooling',
  cybrdelic: 'systems-ux',
  'cybrdelic-portfolio': 'systems-ux',
  'cybrdelic-portfolio-v2': 'systems-ux',
  'cybrdelic-nvim-starter': 'autonomous-tooling',
  'cybrdelic.github.io': 'systems-ux',
  'cybrvybe.github.io': 'systems-ux',
  demosnap: 'systems-ux',
  heroyk: 'systems-ux',
  'jjugg-site': 'systems-ux',
  jjugg: 'autonomous-tooling',
  myriad: 'autonomous-tooling',
  'outersense-webgpu': 'perceptual-systems',
  'profile-prism': 'systems-ux',
  repotronium: 'autonomous-tooling',
  resumatyk: 'autonomous-tooling',
  smart_context_reducer: 'autonomous-tooling',
  vidbeamer: 'systems-ux',
  WinOrchestrate: 'autonomous-tooling',
  'xela-themes': 'systems-ux',
  'xela-themes-site': 'systems-ux',
};

const repoTitleOverrides: Record<string, string> = {
  '4d-ik': '4D IK',
  AlexFigueroa: 'AlexFigueroa',
  Blitzkrieg: 'Blitzkrieg',
  Fuzzaholic: 'Fuzzaholic',
  WinOrchestrate: 'WinOrchestrate',
  'cybrdelic.github.io': 'cybrdelic.github.io',
  'webGPU-lightning': 'WebGPU Lightning',
  'xela-themes': 'XELA Themes',
  'xela-themes-site': 'XELA Themes Site',
};

const repoFeaturedAliases: Record<string, string> = {
  commitaura: 'commitaura',
  firesim: 'firesim',
  outersense: 'outersense',
  'unified-career-app': 'jjugg',
  'xela-themes': 'xelathemes',
};

const repoStatusOverrides: Record<string, CatalogProjectStatus> = {
  '4d-ik': 'Lab',
  AlexFigueroa: 'Legacy',
  'BeatCommerce-Advanced': 'Legacy',
  Blitzkrieg: 'Archived',
  CodebaseSeed: 'Legacy',
  CodebasedUtils: 'Legacy',
  Fuzzaholic: 'Lab',
  WinOrchestrate: 'Legacy',
  WorkspaceAutomator: 'Archived',
  'adaptive-layout-engine': 'Active',
  amalgia: 'Archived',
  browsealizer: 'Legacy',
  camhancer: 'Lab',
  clippd: 'Active',
  'cloth-augmented-vertex-block-descent': 'Lab',
  commitaura: 'Showcased',
  cybrconsole: 'Archived',
  cybrdelic: 'Legacy',
  'cybrdelic-portfolio': 'Legacy',
  'cybrdelic-portfolio-v2': 'Legacy',
  'cybrdelic-nvim-starter': 'Active',
  'cybrdelic.github.io': 'Legacy',
  'cybrvybe.github.io': 'Legacy',
  demosnap: 'Active',
  'drone-sim': 'Lab',
  dronesmasher: 'Lab',
  'eye-sim': 'Active',
  firesim: 'Showcased',
  'ggx-gtr-render-comparison': 'Lab',
  'graphics-experiments': 'Lab',
  heroyk: 'Lab',
  'jjugg-site': 'Legacy',
  jjugg: 'Legacy',
  myriad: 'Active',
  outersense: 'Showcased',
  'outersense-webgpu': 'Lab',
  'photon-surface': 'Lab',
  'portfolio-v4': 'Active',
  'profile-prism': 'Legacy',
  repotronium: 'Lab',
  resumatyk: 'Active',
  shadernetic: 'Lab',
  'shadernetics-labs': 'Lab',
  'singularity-caustics': 'Lab',
  smart_context_reducer: 'Archived',
  'space-sim': 'Lab',
  tessellarity: 'Lab',
  'testing-amazing-animations-and-effects': 'Lab',
  'twin-engine': 'Lab',
  'unified-career-app': 'Showcased',
  vidbeamer: 'Active',
  'web-mls-mpm': 'Lab',
  'webGPU-lightning': 'Lab',
  'webgpu-compute-cam-filters': 'Lab',
  'webgpu-data-vis-engine': 'Lab',
  'webgpu-globe': 'Lab',
  'webgpu-restir-demo': 'Lab',
  'xela-themes': 'Showcased',
  'xela-themes-site': 'Active',
  'city-dev': 'Lab',
};

const portfolioOnlyStatusOverrides: Record<string, CatalogProjectStatus> = {
  spectrocity: 'Showcased',
};

function titleFromRepoName(repoName: string) {
  if (repoTitleOverrides[repoName]) {
    return repoTitleOverrides[repoName];
  }

  return repoName
    .split(/[-_.]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferDomain(repoName: string, description: string) {
  if (repoDomainOverrides[repoName]) {
    return repoDomainOverrides[repoName];
  }

  const haystack = `${repoName} ${description}`.toLowerCase();

  if (
    /eye|gaze|webcam|camera|cam|percept|twin|human awareness|spatial|video-scene/.test(haystack)
  ) {
    return 'perceptual-systems';
  }

  if (
    /sim|render|shader|webgpu|wgsl|gpu|globe|caustic|cloth|fire|lightning|photon|ik|ocean|ray|mls|mpm|city|drone|space|graphics/.test(
      haystack
    )
  ) {
    return 'simulation-rendering';
  }

  if (
    /theme|portfolio|site|landing|layout|ux|ui|design|extension|brand|surface|video|profile/.test(
      haystack
    )
  ) {
    return 'systems-ux';
  }

  return 'autonomous-tooling';
}

function normalizeProjectDomain(type: string): Exclude<CatalogDomainKey, 'all'> {
  return catalogDomainTitleMap[type as keyof typeof catalogDomainTitleMap] ?? 'autonomous-tooling';
}

function inferStatus(repoName: string, archived: boolean, featuredProject?: (typeof projects)[number]) {
  if (repoStatusOverrides[repoName]) {
    return repoStatusOverrides[repoName];
  }

  if (archived) {
    return 'Archived';
  }

  if (featuredProject) {
    return 'Showcased';
  }

  return 'Active';
}

const featuredProjectsById = new Map(projects.map((project) => [project.id, project]));

const catalogFromPublicRepos: CatalogProject[] = publicRepoSnapshot.map(
  ([repoName, language, updatedAt, archived, description]) => {
    const featuredId = repoFeaturedAliases[repoName];
    const featuredProject = featuredId ? featuredProjectsById.get(featuredId) : undefined;
    const domain = featuredProject
      ? normalizeProjectDomain(featuredProject.type)
      : inferDomain(repoName, description);

    let title = titleFromRepoName(repoName);
    let normalizedDescription = description || 'Public repository in the broader systems portfolio.';
    let techSummary = language || 'Mixed stack';
    let detailPath: string | undefined;
    let source: CatalogProject['source'] = 'Public GitHub';
    let status = inferStatus(repoName, archived, featuredProject);

    if (featuredProject) {
      title = featuredProject.title;
      normalizedDescription = featuredProject.subtitle;
      techSummary = featuredProject.tech;
      detailPath = `/project/${featuredProject.id}`;
      source = 'Featured + GitHub';
    }

    if (repoName === 'jjugg') {
      title = 'JJUGG Legacy Repo';
      normalizedDescription =
        'Earlier public JJUGG repository before the current unified-career-app branch became the main operating surface.';
    }

    return {
      archived,
      description: normalizedDescription,
      detailPath,
      domain,
      featured: Boolean(featuredProject),
      githubUrl: `https://github.com/cybrdelic/${repoName}`,
      language: language || 'Mixed stack',
      repoName,
      source,
      status,
      techSummary,
      title,
      updatedAt,
    };
  }
);

const existingRepoNames = new Set(catalogFromPublicRepos.map((project) => project.repoName));

const portfolioOnlyCatalog: CatalogProject[] = projects
  .filter((project) => {
    const aliases = Object.entries(repoFeaturedAliases)
      .filter(([, projectId]) => projectId === project.id)
      .map(([repoName]) => repoName);

    if (aliases.length === 0) {
      return !existingRepoNames.has(project.id);
    }

    return !aliases.some((repoName) => existingRepoNames.has(repoName));
  })
  .map((project) => ({
    archived: false,
    description: project.subtitle,
    detailPath: `/project/${project.id}`,
    domain: normalizeProjectDomain(project.type),
    featured: true,
    githubUrl: undefined,
    language: project.tech.split(',')[0]?.trim() || 'Mixed stack',
    repoName: undefined,
    source: 'Portfolio only',
    status: portfolioOnlyStatusOverrides[project.id] ?? 'Showcased',
    techSummary: project.tech,
    title: project.title,
    updatedAt: null,
  }));

export const catalogProjects: CatalogProject[] = [...catalogFromPublicRepos, ...portfolioOnlyCatalog]
  .sort((left, right) => {
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    if (left.updatedAt && right.updatedAt && left.updatedAt !== right.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    if (left.updatedAt && !right.updatedAt) {
      return -1;
    }

    if (!left.updatedAt && right.updatedAt) {
      return 1;
    }

    return left.title.localeCompare(right.title);
  });

export function isCatalogDomain(value: string | null): value is CatalogDomainKey {
  return catalogDomains.some((domain) => domain.key === value);
}

export function getCatalogDomainLabel(domainKey: Exclude<CatalogDomainKey, 'all'>) {
  return catalogDomains.find((domain) => domain.key === domainKey)?.label ?? 'All Projects';
}

export function getCatalogPath(domainKey?: Exclude<CatalogDomainKey, 'all'>) {
  return domainKey ? `/projects?domain=${domainKey}` : '/projects';
}

export function getCatalogStatusClassName(status: CatalogProjectStatus) {
  return `status-${status.toLowerCase()}`;
}

export const homeDomainLinks = {
  'Autonomous Tooling': 'autonomous-tooling',
  'Perceptual Systems': 'perceptual-systems',
  'Simulation and Rendering': 'simulation-rendering',
  'Systems UX': 'systems-ux',
} as const;
