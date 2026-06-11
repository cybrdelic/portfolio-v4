import { ArrowUpRight } from 'lucide-react';
import type { MotionStyle, MotionValue } from 'motion/react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Project } from '../../data';

export function getProjectMedia(project: Project) {
  const primary = project.primaryMedia ? [project.primaryMedia] : [];
  const supporting = project.media ?? [];
  const combined = [...primary, ...supporting];
  return combined.filter((item, index) => combined.findIndex((candidate) => candidate.src === item.src) === index).slice(0, 4);
}

export function ProjectCubeFacePreview({
  faceIndex,
  opacity,
  project,
}: {
  faceIndex: number;
  opacity?: MotionValue<number> | number;
  project: Project;
}) {
  const primary = getProjectMedia(project)[0];

  return (
    <div
      className="project-cube-shell-face absolute inset-0 overflow-hidden p-[6vw] [backface-visibility:hidden]"
      style={{ transform: `rotateY(${faceIndex * 90}deg) translateZ(calc(var(--cube-size) / 2))` }}
    >
      <motion.div className="grid h-full place-items-center" style={{ opacity }}>
        <div className="relative w-[48vw] max-w-[48rem] overflow-hidden bg-[#080808] shadow-[0_28px_90px_rgba(6,6,6,0.1)]">
          {primary ? (
            <img
              src={primary.src}
              alt=""
              className="aspect-[16/10] h-full w-full object-cover saturate-0"
              loading="lazy"
            />
          ) : (
            <div className="grid aspect-[16/10] h-full content-between p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {project.type}
              </p>
              <p className="max-w-sm text-base leading-tight text-[var(--color-ink)]">
                {project.proofPoints[0]}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectMediaStage({ index, project }: { index: number; project: Project }) {
  const mediaItems = getProjectMedia(project);
  const primary = mediaItems[0];
  const secondary = mediaItems.slice(1);

  if (!primary) return null;

  return (
    <motion.div
      key={project.id}
      layout
      className="project-artifact-stage relative grid aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[34rem]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-4 text-white mix-blend-normal">
        <p className="bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur">
          {project.status} / {project.year}
        </p>
        <p className="hidden max-w-[17rem] bg-black/60 px-2 py-1 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-white/65 backdrop-blur sm:block">
          {project.tech}
        </p>
      </div>

      <motion.figure
        layout
        className="relative min-h-0 overflow-hidden bg-[#070707]"
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-full min-h-[24rem] md:min-h-[34rem]">
          <img
            src={primary.src}
            alt={primary.alt}
            className="h-full w-full object-cover object-bottom"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>

        {secondary.length > 0 && (
          <div className="absolute bottom-20 right-4 grid w-[34%] gap-2 md:w-[28%]">
            {secondary.slice(0, 2).map((media) => (
              <motion.figure
                key={media.src}
                layout
                className="overflow-hidden border border-white/20 bg-[#080808] shadow-[0_12px_42px_rgba(0,0,0,0.34)]"
                transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="aspect-[16/9]">
                  <img
                    src={media.src}
                    alt={media.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.figure>
            ))}
          </div>
        )}
        <figcaption className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black via-black/78 to-transparent px-4 pb-4 pt-12 text-sm leading-relaxed text-white sm:block md:px-5 md:pb-5">
          {primary.caption}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export function DesktopProjectStage({
  isInteractive = true,
  project,
  index,
  style,
}: {
  isInteractive?: boolean;
  project: Project;
  index: number;
  style?: MotionStyle;
}) {
  return (
    <motion.div
      key={project.id}
      className="grid h-full grid-cols-12 gap-10 px-10 py-9 xl:px-14"
      style={style}
    >
      <Link
        to={`/project/${project.id}`}
        aria-hidden={!isInteractive}
        tabIndex={isInteractive ? 0 : -1}
        data-field-target
        data-field-kind="inspect"
        data-field-label={`${project.title} case study`}
        className={`group col-span-4 flex h-full flex-col justify-between gap-8 text-[var(--color-ink)] focus-visible:outline-none ${isInteractive ? '' : 'pointer-events-none'}`}
      >
        <div className="space-y-7">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
            <span>{project.type}</span>
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>

          <h3 className="max-w-4xl text-5xl font-normal leading-[0.9] tracking-[-0.045em] transition-transform duration-300 ease-out group-hover:-translate-y-1 xl:text-6xl">
            {project.title}
          </h3>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-ink)]">
            {project.subtitle}
          </p>
        </div>

        <div className="grid gap-5">
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-ink)]">{project.homepageSummary}</p>
          <div className="flex items-center justify-between gap-6 border-t border-[var(--color-line)] pt-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Open case</span>
            <ArrowUpRight size={18} className="text-[var(--color-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--color-ink)]" />
          </div>
        </div>
      </Link>

      <div className="col-span-8 flex items-center">
        <ProjectMediaStage index={index} project={project} />
      </div>
    </motion.div>
  );
}
