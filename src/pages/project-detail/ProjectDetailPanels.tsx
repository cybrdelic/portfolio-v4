import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Project } from '../../data';

export type VisualProfile = {
  accent: string;
  artifactLabel: string;
  frame: string;
  isDark?: boolean;
  lens: string;
  proofLead: string;
  surface: string;
};

const visualProfiles: Record<string, VisualProfile> = {
  'firesim-native': {
    accent: '#d66a22',
    artifactLabel: 'Native simulation evidence',
    frame: 'Lab viewport',
    lens: 'GPU compute / validation / operator tooling',
    proofLead: 'A native runtime, debug surface, and validation frame sit behind the fire render.',
    surface: 'bg-[#17120f]',
  },
  'filelight-explorer': {
    accent: '#3b82f6',
    artifactLabel: 'Native product evidence',
    frame: 'Explorer workflow',
    isDark: false,
    lens: 'Win32 / preview pipeline / file inspection',
    proofLead: 'A familiar file browser shell gains deeper previews and native inspection before action.',
    surface: 'bg-[#f2f5f7]',
  },
  fuzzaholic: {
    accent: '#19c99a',
    artifactLabel: 'Shader toolchain evidence',
    frame: 'Generator workbench',
    lens: 'WebGPU / WGSL / visual-health policy',
    proofLead: 'Generated-program quality is treated as a product problem with visible health checks.',
    surface: 'bg-[#050807]',
  },
  'singularity-caustics': {
    accent: '#8b5cf6',
    artifactLabel: 'Research surface evidence',
    frame: 'Optics study',
    lens: 'WebGPU / caustics / catastrophe structure',
    proofLead: 'The page centers optical structure, interaction, and mathematical specificity.',
    surface: 'bg-[#111017]',
  },
};

export function getProfile(project: Project) {
  return visualProfiles[project.id] ?? visualProfiles['firesim-native'];
}

export function getMedia(project: Project) {
  const supporting = project.media ?? [];
  const primary = project.primaryMedia ? [project.primaryMedia] : [];
  const combined = [...primary, ...supporting];
  return combined.filter((item, index) => combined.findIndex((candidate) => candidate.src === item.src) === index);
}

export function getPrimaryAction(project: Project) {
  const artifact = project.artifactLinks?.[0];
  return artifact ?? { href: project.repoUrl, label: 'Open repo', type: 'Source' };
}

export function ProjectActions({
  className = '',
  primaryAction,
  project,
}: {
  className?: string;
  primaryAction: ReturnType<typeof getPrimaryAction>;
  project: Project;
}) {
  const showRepository = primaryAction.href !== project.repoUrl;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={primaryAction.href}
        target="_blank"
        rel="noreferrer"
        data-field-target
        data-field-kind="external"
        data-field-label={`${project.title} primary artifact`}
        className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
      >
        {primaryAction.label} <ArrowUpRight size={14} />
      </a>
      {showRepository && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          data-field-target
          data-field-kind="external"
          data-field-label={`${project.title} repository`}
          className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
        >
          Repository <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

export function FallbackProofPanel({ profile, project }: { profile: VisualProfile; project: Project }) {
  const dark = profile.isDark !== false;
  const t = {
    base: dark ? 'text-white' : 'text-[var(--color-ink)]',
    muted: dark ? 'text-white/55' : 'text-[var(--color-muted)]',
    body: dark ? 'text-white/70' : 'text-[var(--color-muted)]',
    strong: dark ? 'text-white/82' : 'text-[var(--color-ink)]',
    faint: dark ? 'text-white/45' : 'text-[var(--color-muted)]',
    border: dark ? 'border-white/16' : 'border-[var(--color-line)]',
    decor: dark ? 'border-white/10' : 'border-[var(--color-line)]',
  };

  return (
    <div
      className={`relative min-h-[22rem] overflow-hidden border border-[rgba(6,6,6,0.24)] p-6 shadow-[0_42px_140px_rgba(6,6,6,0.2)] md:min-h-[28rem] md:p-8 ${t.base} ${profile.surface}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--project-accent)]" />
      <div className={`absolute right-6 top-6 h-24 w-24 border ${t.decor}`} />
      <div className="relative grid h-full content-between gap-8">
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.24em] ${t.muted}`}>
            {profile.artifactLabel}
          </p>
          <h2 className="mt-4 max-w-md text-4xl leading-none md:text-6xl">
            {profile.frame}
          </h2>
          <p className={`mt-5 max-w-lg text-base leading-relaxed ${t.body}`}>
            {project.homepageSummary}
          </p>
        </div>
        <div className="grid gap-3">
          {project.proofPoints.slice(0, 3).map((point, index) => (
            <div key={point} className={`grid gap-2 border-t ${t.border} pt-3 md:grid-cols-[4rem_1fr]`}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${t.faint}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className={`text-sm leading-relaxed ${t.strong}`}>{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProofFigure({
  className = '',
  item,
  priority = false,
}: {
  className?: string;
  item: NonNullable<Project['media']>[number];
  priority?: boolean;
}) {
  return (
    <figure className={`group relative overflow-hidden bg-[#070707] ${className}`}>
      <a href={item.src} target="_blank" rel="noreferrer" aria-label={`Open ${item.alt}`} className="block h-full">
        <img
          src={item.src}
          alt={item.alt}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
      </a>
      <figcaption className="absolute inset-x-0 bottom-0 bg-black/72 px-4 py-3 text-sm leading-relaxed text-white backdrop-blur-sm">
        {item.caption}
      </figcaption>
    </figure>
  );
}
