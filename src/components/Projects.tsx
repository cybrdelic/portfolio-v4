import { CSSProperties, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ProjectFace({
  isInteractive,
  index,
  project,
}: {
  isInteractive: boolean;
  index: number;
  project: Project;
}) {
  return (
    <Link
      aria-hidden={!isInteractive}
      tabIndex={isInteractive ? 0 : -1}
      to={`/project/${project.id}`}
      className="group relative block h-full w-full text-[var(--color-ink)]"
    >
      <div className="pointer-events-none absolute inset-0 tone-panel opacity-90" />
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-line-strong)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-line-soft)]" />
      <div className="absolute inset-y-0 left-0 w-px bg-[var(--color-line-strong)]" />
      <div className="absolute inset-y-0 right-0 w-px bg-[var(--color-line-strong)]" />
      <div className="absolute inset-y-0 left-[58.333333%] hidden w-px bg-[var(--color-line-soft)] lg:block" />
      <div className="absolute left-10 right-10 top-10 hidden h-px bg-[var(--color-line-soft)] md:block" />
      <div className="absolute bottom-10 left-10 right-10 hidden h-px bg-[var(--color-line-soft)] md:block" />

      <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 px-6 py-8 md:px-10 md:py-10 lg:col-span-7 lg:pr-12">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            <span>{project.type}</span>
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>

          <div className="space-y-6">
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

          <div className="flex items-center justify-between gap-6 border-t border-[var(--color-line-soft)] pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              View project
            </span>
            <ArrowUpRight
              size={18}
              className="text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-ink)]"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 border-t border-[var(--color-line-soft)] px-6 py-8 md:px-10 md:py-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:[border-left-color:var(--color-line-soft)] lg:pl-12">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Stack
            </p>
            <p className="max-w-[24rem] text-[1.08rem] leading-[1.54] text-[var(--color-ink)] md:text-[1.34rem]">
              {project.tech}
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Why it exists
            </p>
            <p className="body-premium max-w-[25rem] text-base md:text-[1.02rem]">
              {project.whyItExists}
            </p>
          </div>

          <div className="border-t border-[var(--color-line-soft)] pt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Role in work
            </p>
            <p className="max-w-[25rem] text-[0.98rem] leading-[1.68] text-[var(--color-ink)]">
              {project.roleInWork}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const [baseIndex, setBaseIndex] = useState(0);
  const totalHeightVh = projects.length * PROJECT_STAGE_VH;

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
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.025, 0.05]);

  useMotionValueEvent(phase, 'change', (value) => {
    const nextBaseIndex = clamp(Math.floor(value + 0.0001), 0, projects.length - 1);
    setBaseIndex((current) => (current === nextBaseIndex ? current : nextBaseIndex));
  });

  const nextIndex = clamp(baseIndex + 1, 0, projects.length - 1);
  const cubeStyle = {
    transform: useMotionTemplate`translateZ(calc(var(--cube-size) / -2)) rotateY(${rotation}deg)`,
  };

  return (
    <section
      ref={ref}
      className="bridge-section relative border-b border-[var(--color-line)]"
      style={{ height: `${totalHeightVh}vh`, position: 'relative' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]"
          style={{ opacity: gridOpacity }}
        />

        <div className="relative z-10 h-full">
          <div className="relative h-full w-full">
            <div
              className="relative h-full w-full"
              style={
                {
                  perspective: '2200px',
                  ['--cube-size' as string]: '100vw',
                } as CSSProperties
              }
            >
              <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={cubeStyle}>
                <motion.div
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{
                    opacity: frontOpacity,
                    transform: `rotateY(${baseIndex * 90}deg) translateZ(calc(var(--cube-size) / 2))`,
                  }}
                >
                  <div className="absolute inset-y-0 left-0 z-10 w-[2px] bg-[color:rgba(186,186,186,0.92)]" />
                  <div className="absolute inset-y-0 right-0 z-10 w-[2px] bg-[color:rgba(186,186,186,0.92)]" />
                  <ProjectFace
                    isInteractive
                    index={baseIndex}
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
                    <div className="absolute inset-y-0 left-0 z-10 w-[2px] bg-[color:rgba(186,186,186,0.92)]" />
                    <div className="absolute inset-y-0 right-0 z-10 w-[2px] bg-[color:rgba(186,186,186,0.92)]" />
                    <ProjectFace
                      isInteractive={false}
                      index={nextIndex}
                      project={projects[nextIndex]}
                    />
                  </motion.div>
                )}
              </motion.div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--color-line-strong)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[var(--color-line-strong)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
