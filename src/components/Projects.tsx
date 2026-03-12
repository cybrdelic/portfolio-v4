import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { Project, projects } from '../data';

const PROJECT_TRANSITIONS = Math.max(1, projects.length - 1);
const PROJECT_STAGE_VH = 120;
const PROJECT_INTRO =
  'Selected systems where the interaction, architecture, and operating model are part of the same decision.';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ProjectFace({
  isInteractive,
  onOpen,
  project,
}: {
  isInteractive: boolean;
  onOpen?: () => void;
  project: Project;
}) {
  const techList = project.tech.split(',').map((item) => item.trim());
  const mechanismPreview = project.coreMechanisms.slice(0, 3);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive || !onOpen) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      aria-label={isInteractive ? `View project: ${project.title}` : undefined}
      className={`project-face-shell group relative h-full w-full text-[var(--color-ink)] ${isInteractive ? 'is-interactive' : ''}`}
      onClick={isInteractive ? onOpen : undefined}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'link' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="pointer-events-none absolute inset-0 tone-panel opacity-90" />
      <div className="absolute inset-y-0 left-[58.333333%] hidden w-px bg-[var(--color-line-soft)] lg:block" />

      <div className="project-face-grid relative z-10 grid h-full grid-cols-1 lg:grid-cols-12">
        <div className="project-face-primary flex flex-col gap-10 px-6 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28 lg:col-span-7 lg:pr-12">
          <div className="project-face-body space-y-6">
            <h3 className="display-tight max-w-[10ch] text-[clamp(2.8rem,6vw,4.7rem)] leading-[0.92]">
              {project.title}
            </h3>
            <p className="body-premium max-w-[31rem] text-[1.1rem] leading-[1.58] md:text-[1.46rem]">
              {project.subtitle}
            </p>
            <p className="max-w-[36rem] text-[0.98rem] leading-[1.72] text-[var(--color-muted-soft)] md:text-[1.04rem]">
              {project.overview}
            </p>
          </div>

          <div className="project-face-footer mt-auto grid gap-5 border-t border-[var(--color-line-soft)] pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="flex flex-wrap gap-2">
              {mechanismPreview.map((mechanism) => (
                <span key={mechanism} className="signal-chip">
                  {mechanism}
                </span>
              ))}
            </div>
            <div className="project-open-affordance inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              <span>Open dossier</span>
              <ArrowUpRight
                size={18}
                className="text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-ink)]"
              />
            </div>
          </div>
        </div>

        <div className="project-face-secondary flex flex-col gap-10 border-t border-[var(--color-line-soft)] px-6 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28 lg:col-span-5 lg:border-l lg:border-t-0 lg:[border-left-color:var(--color-line-soft)] lg:pl-12">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Stack
            </p>
            <div className="project-meta-stack">
              {techList.map((item) => (
                <span key={item} className="project-meta-pill">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Why it exists
            </p>
            <p className="body-premium max-w-[25rem] text-base md:text-[1.02rem]">
              {project.whyItExists}
            </p>
          </div>

          <div className="mt-auto border-t border-[var(--color-line-soft)] pt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Role in work
            </p>
            <p className="max-w-[25rem] text-[0.98rem] leading-[1.68] text-[var(--color-ink)]">
              {project.roleInWork}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const [baseIndex, setBaseIndex] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const navigate = useNavigate();
  const totalHeightVh = projects.length * PROJECT_STAGE_VH;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncLayout = () => {
      setIsMobileLayout(mediaQuery.matches);
    };

    syncLayout();
    mediaQuery.addEventListener('change', syncLayout);

    return () => {
      mediaQuery.removeEventListener('change', syncLayout);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const phase = useTransform(scrollYProgress, [0, 1], [0, PROJECT_TRANSITIONS]);
  const localProgress = useTransform(phase, (value) => clamp(value - Math.floor(value), 0, 1));
  const rotation = useTransform(phase, (value) => (prefersReducedMotion ? 0 : -90 * value));
  const frontOpacity = useTransform(localProgress, (value) =>
    prefersReducedMotion ? 1 : 1 - value * 0.08
  );
  const nextOpacity = useTransform(localProgress, (value) =>
    prefersReducedMotion ? 1 : 0.84 + value * 0.16
  );
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.018, 0.04]);

  useMotionValueEvent(phase, 'change', (value) => {
    const nextBaseIndex = clamp(Math.floor(value + 0.0001), 0, projects.length - 1);
    setBaseIndex((current) => (current === nextBaseIndex ? current : nextBaseIndex));
  });

  const nextIndex = clamp(baseIndex + 1, 0, projects.length - 1);
  const cubeStyle = {
    transform: useMotionTemplate`translateZ(calc(var(--cube-size) / -2)) rotateY(${rotation}deg)`,
  };

  if (prefersReducedMotion || isMobileLayout) {
    return (
      <section className="bridge-section relative border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <div className="grid grid-cols-1 gap-4 border-b border-[var(--color-line-soft)]/85 pb-5 md:grid-cols-[12rem_minmax(0,1fr)_6rem] md:items-end">
            <div>
              <p className="section-label">3.0 / Selected Systems</p>
            </div>
            <p className="project-stage-intro">
              {PROJECT_INTRO}
            </p>
            <div className="project-stage-counter">
              <p className="project-stage-counter-index">
                {String(projects.length).padStart(2, '0')} systems
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {projects.map((project) => (
              <div key={project.id} className="min-h-[32rem]">
                <ProjectFace
                  isInteractive
                  onOpen={() => navigate(`/project/${project.id}`)}
                  project={project}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="bridge-section project-stage-shell relative border-b border-[var(--color-line)]"
      style={{ height: `${totalHeightVh}vh`, position: 'relative' }}
    >
      <div className="project-stage-sticky sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"
          style={{ opacity: gridOpacity }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-5 md:px-12 md:pt-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 border-b border-[var(--color-line-soft)]/85 pb-5 md:grid-cols-[12rem_minmax(0,1fr)_6rem] md:items-end">
            <div>
              <p className="section-label">3.0 / Selected Systems</p>
            </div>
            <p className="project-stage-intro">
              {PROJECT_INTRO}
            </p>
            <div className="project-stage-counter">
              <p className="project-stage-counter-index">
                {String(baseIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <div className="project-stage-frame relative z-10 mx-auto h-full w-full max-w-7xl px-6 pb-6 pt-28 md:px-12 md:pb-8 md:pt-32">
          <div className="relative h-full w-full">
            <div
              className="project-stage-cube relative h-full w-full"
              style={
                {
                  perspective: '2200px',
                } as CSSProperties
              }
            >
              <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={cubeStyle}>
                <motion.div
                  className="absolute inset-0 z-10 [backface-visibility:hidden]"
                  style={{
                    opacity: frontOpacity,
                    pointerEvents: 'auto',
                    transform: `rotateY(${baseIndex * 90}deg) translateZ(calc(var(--cube-size) / 2))`,
                  }}
                >
                  <ProjectFace
                    isInteractive
                    onOpen={() => navigate(`/project/${projects[baseIndex].id}`)}
                    project={projects[baseIndex]}
                  />
                </motion.div>

                {!prefersReducedMotion && nextIndex !== baseIndex && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 [backface-visibility:hidden]"
                    style={{
                      opacity: nextOpacity,
                      transform: `rotateY(${nextIndex * 90}deg) translateZ(calc(var(--cube-size) / 2))`,
                    }}
                  >
                    <ProjectFace
                      isInteractive={false}
                      project={projects[nextIndex]}
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
