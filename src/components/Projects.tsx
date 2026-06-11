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
import type { MotionValue } from 'motion/react';
import { projects } from '../data';
import { DesktopProjectStage, ProjectCubeFacePreview, ProjectMediaStage } from './projects/ProjectStages';

const PROJECT_TRANSITIONS = Math.max(1, projects.length - 1);
const PROJECT_STAGE_VH = 92;

const PROJECT_AMBIENT = [
  'rgba(180, 75, 15, 0.22)',   // firesim — ember
  'rgba(25, 85, 115, 0.22)',   // filelight — steel
  'rgba(90, 45, 160, 0.22)',   // fuzzaholic — violet
  'rgba(15, 70, 140, 0.22)',   // singularity — optical
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ContinuousProjectFace({
  activeIndex,
  index,
  phase,
}: {
  activeIndex: number;
  index: number;
  phase: MotionValue<number>;
}) {
  const opacity = useTransform(phase, (value) => {
    const distance = Math.abs(value - index);
    return clamp(1 - distance * 1.55, 0, 1);
  });
  const y = useTransform(phase, (value) => {
    const delta = index - value;
    return clamp(delta * 260, -320, 320);
  });
  const scale = useTransform(phase, (value) => {
    const distance = Math.abs(value - index);
    return 1 - Math.min(distance, 1) * 0.035;
  });

  return (
    <div className="absolute inset-0">
      <DesktopProjectStage
        index={index}
        isInteractive={activeIndex === index}
        project={projects[index]}
        style={{ opacity, scale, y }}
      />
    </div>
  );
}

function ContinuousCubeFacePreview({
  faceIndex,
  phase,
}: {
  faceIndex: number;
  phase: MotionValue<number>;
}) {
  const opacity = useTransform(phase, (value) => {
    const distance = Math.abs(value - faceIndex);
    return clamp(distance * 0.035, 0, 0.035);
  });

  return <ProjectCubeFacePreview faceIndex={faceIndex} opacity={opacity} project={projects[faceIndex]} />;
}

export default function Projects() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const [baseIndex, setBaseIndex] = useState(0);
  const totalHeightVh = Math.max(260, projects.length * PROJECT_STAGE_VH);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const phase = useTransform(scrollYProgress, [0, 1], [0, PROJECT_TRANSITIONS]);
  const localProgress = useTransform(phase, (value) => clamp(value - Math.floor(value), 0, 1));
  const rotation = useTransform(phase, (value) => (prefersReducedMotion ? 0 : -90 * value));
  const cubePitch = useTransform(localProgress, [0, 0.5, 1], [0, -1.4, 0]);
  const cubeDepthOpacity = useTransform(localProgress, [0, 0.25, 0.5, 0.75, 1], [0.04, 0.1, 0.16, 0.09, 0.04]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.02, 0.035]);
  const ambientBg = useTransform(
    phase,
    PROJECT_AMBIENT.map((_, i) => i),
    PROJECT_AMBIENT
  );

  useMotionValueEvent(phase, 'change', (value) => {
    const nextBaseIndex = clamp(Math.floor(value + 0.0001), 0, projects.length - 1);
    setBaseIndex((current) => (current === nextBaseIndex ? current : nextBaseIndex));
  });

  const cubeStyle = {
    transform: useMotionTemplate`translateZ(calc(var(--cube-size) / -2)) rotateX(${cubePitch}deg) rotateY(${rotation}deg)`,
  };

  return (
    <div id="work">
      <section className="relative border-b border-[var(--color-line)] lg:hidden">
        <div className="px-4 py-10">
          <div className="mb-8 border-b border-[var(--color-line)] pb-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Selected work</p>
            <h2 className="max-w-[10ch] text-5xl leading-[0.92] tracking-[-0.055em]">Selected systems.</h2>
          </div>

          <div className="grid gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                data-field-target
                data-field-kind="inspect"
                data-field-label={`${project.title} mobile case study`}
                className="group block border-b border-[var(--color-line)] pb-8 text-[var(--color-ink)] last:border-b-0"
              >
                <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  <span>{project.type}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="mt-5 grid gap-3">
                  <h3 className="text-4xl leading-[0.94] tracking-[-0.055em]">{project.title}</h3>
                  <p className="text-base leading-relaxed text-[var(--color-muted)]">{project.subtitle}</p>
                  <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                    <span>Open case</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                {project.primaryMedia && (
                  <div className="mt-5">
                    <ProjectMediaStage index={index} project={project} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={ref}
        className="bridge-section relative hidden border-b border-[var(--color-line)] lg:block"
        style={{ height: `${totalHeightVh}vh`, position: 'relative' }}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: ambientBg }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
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
              <motion.div aria-hidden="true" className="absolute inset-0 [transform-style:preserve-3d]" style={cubeStyle}>
                <motion.div className="project-cube-depth-map" style={{ opacity: cubeDepthOpacity }} />
                {projects.map((project, faceIndex) => (
                  <div key={project.id} className="contents">
                    <ContinuousCubeFacePreview faceIndex={faceIndex} phase={phase} />
                  </div>
                ))}
              </motion.div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--color-line)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[var(--color-line)]" />
              <div className="relative z-10 h-full">
                {projects.map((project, index) => (
                  <div key={project.id} className="absolute inset-0">
                    <ContinuousProjectFace
                      activeIndex={baseIndex}
                      index={index}
                      phase={phase}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
