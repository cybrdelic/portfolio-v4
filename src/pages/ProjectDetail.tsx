import { ArrowLeft, ArrowUpRight, FileText, Image as ImageIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Magnetic from '../components/Magnetic';
import { projects } from '../data';
import {
  FallbackProofPanel,
  getMedia,
  getPrimaryAction,
  getProfile,
  ProjectActions,
  ProofFigure,
} from './project-detail/ProjectDetailPanels';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 font-mono text-sm uppercase tracking-widest">
        <p>System not found.</p>
        <Link
          to="/"
          className="ml-4 text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] hover:underline"
        >
          Return home
        </Link>
      </div>
    );
  }

  const mediaItems = getMedia(project);
  const primaryMedia = mediaItems[0];
  const supportingMedia = mediaItems.slice(1, 4);
  const profile = getProfile(project);
  const primaryAction = getPrimaryAction(project);

  return (
    <article
      className="min-h-screen text-[var(--color-ink)]"
      style={{ ['--project-accent' as string]: profile.accent }}
    >
      <section className="relative overflow-hidden border-b border-[rgba(6,6,6,0.2)] px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <div className="absolute left-[4vw] top-10 h-px w-[42vw] bg-[var(--project-accent)]" />
          <div className="absolute right-[7vw] top-24 h-[28rem] w-px bg-[rgba(6,6,6,0.16)]" />
          <div className="absolute bottom-0 left-[42vw] h-[24rem] w-[24rem] -translate-y-1/4 border border-[rgba(6,6,6,0.08)]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Magnetic>
              <Link
                to="/#work"
                data-field-target
                data-field-kind="route"
                data-field-label="selected work"
                className="-ml-2 inline-flex min-h-11 items-center gap-2 p-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                <ArrowLeft size={16} /> Work
              </Link>
            </Magnetic>

            <ProjectActions className="hidden md:flex" primaryAction={primaryAction} project={project} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] lg:items-end">
            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {project.type} / {project.year}
              </p>
              <h1 className="max-w-5xl text-[clamp(3.75rem,10vw,8.5rem)] font-bold leading-[0.86] tracking-[-0.04em]">
                {project.title}
              </h1>
              <p className="mt-6 max-w-3xl text-2xl leading-snug text-[var(--color-ink)] md:text-3xl">
                {project.detailSummary}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
                {profile.proofLead}
              </p>
            </div>

            <div className="relative">
              <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                <span>{profile.frame}</span>
                <span>{profile.lens}</span>
              </div>
              {primaryMedia ? (
                <ProofFigure
                  item={primaryMedia}
                  priority
                  className={`aspect-[16/10] border border-[rgba(6,6,6,0.24)] shadow-[0_42px_140px_rgba(6,6,6,0.24)] ${profile.surface}`}
                />
              ) : (
                <FallbackProofPanel profile={profile} project={project} />
              )}
            </div>

            <ProjectActions className="md:hidden" primaryAction={primaryAction} project={project} />
          </div>

          <div className="mt-10 grid gap-4 border-t border-[rgba(6,6,6,0.18)] pt-6 md:grid-cols-3">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Stack
              </p>
              <p className="text-base leading-relaxed">{project.tech}</p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Role
              </p>
              <p className="text-base leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Signal
              </p>
              <p className="text-base leading-relaxed">{project.bestFor}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]">
              Evidence
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              {profile.artifactLabel}
            </p>
          </div>

          <div className="grid gap-8">
            {supportingMedia.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {supportingMedia.map((item) => (
                  <div key={item.src}>
                    <ProofFigure
                      item={item}
                      className={`aspect-[16/11] border border-[rgba(6,6,6,0.18)] ${profile.surface}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              {project.proofPoints.map((point, index) => (
                <div
                  key={point}
                  className="relative min-h-[13rem] border-t border-[rgba(6,6,6,0.22)] pt-4"
                >
                  <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    <span>Proof {String(index + 1).padStart(2, '0')}</span>
                    {index === 0 ? <ImageIcon size={14} /> : <FileText size={14} />}
                  </div>
                  <p className="text-xl leading-snug text-[var(--color-ink)]">{point}</p>
                  <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {project.coreMechanisms[index] ?? project.outcomes[index] ?? project.homepageSummary}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-0 border-y border-[rgba(6,6,6,0.2)]">
              {(project.artifactLinks ?? [{ label: 'Repository', href: project.repoUrl, type: 'Source' }]).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid min-h-16 grid-cols-[1fr_auto] items-center gap-4 border-b border-[rgba(6,6,6,0.16)] py-4 text-[var(--color-ink)] last:border-b-0 md:grid-cols-[12rem_1fr_auto]"
                >
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)] md:block">
                    {link.type}
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)] md:hidden">
                      {link.type}
                    </span>
                    {link.label}
                  </span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(6,6,6,0.2)] px-4 py-12 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]">
              Case study
            </h2>
          </div>

          <div className="grid gap-12">
            {[
              ['What it does', project.overview],
              ['Why it exists', project.whyItExists],
              ['Problem', project.challenge],
              ['Approach', project.approach],
            ].map(([label, text], index) => (
              <section key={label} className="grid gap-5 border-t border-[rgba(6,6,6,0.18)] pt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  {String(index + 1).padStart(2, '0')} / {label}
                </p>
                <p className="max-w-4xl text-xl leading-relaxed text-[var(--color-muted)] md:text-2xl">
                  {text}
                </p>
              </section>
            ))}

            <section className="grid gap-6 border-t border-[rgba(6,6,6,0.18)] pt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                05 / Mechanisms
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {project.coreMechanisms.map((mechanism) => (
                  <div key={mechanism} className="border-l-2 border-[var(--project-accent)] pl-4 text-base leading-relaxed">
                    {mechanism}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 border-t border-[rgba(6,6,6,0.18)] pt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                06 / Outcomes
              </p>
              <div className="grid gap-4">
                {project.outcomes.map((outcome) => (
                  <p key={outcome} className="max-w-4xl text-xl leading-relaxed text-[var(--color-ink)]">
                    {outcome}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </article>
  );
}
