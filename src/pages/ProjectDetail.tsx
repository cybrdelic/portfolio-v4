import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutGroup, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects } from '../data';
import Magnetic from '../components/Magnetic';
import {
  EASE_STANDARD,
  FLIP_LAYOUT_PROPS,
  FLIP_LAYOUT_SCROLL_PROPS,
  SPRING_FLIP,
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
} from '../lib/motion';

export default function ProjectDetail() {
  const { id } = useParams();
  const projectIndex = projects.findIndex((projectItem) => projectItem.id === id);
  const project = projectIndex === -1 ? undefined : projects[projectIndex];

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — Alex Figueroa`;
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm uppercase tracking-widest">
        <p>System not found.</p>
        <Link
          preventScrollReset
          to="/"
          className="ml-4 text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] hover:underline"
        >
          Back Home
        </Link>
      </div>
    );
  }

  const sections = [
    { body: project.whyItExists, label: '1.0 / Why it exists' },
    { body: project.roleInWork, label: '3.0 / Role in my work' },
  ] as const;
  const techList = project.tech.split(',').map((item) => item.trim());
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <LayoutGroup id={`project-detail-${project.id}`}>
      <motion.article
        className="project-detail-shell min-h-screen px-6 pb-28 pt-28 text-[var(--color-ink)] md:px-12"
        {...FLIP_LAYOUT_SCROLL_PROPS}
      >
        <motion.div className="mx-auto max-w-7xl" {...FLIP_LAYOUT_PROPS}>
          <Magnetic>
            <Link preventScrollReset to="/projects" className="catalog-back-link mb-14 md:mb-18">
              <ArrowLeft size={16} /> Back to Project Index
            </Link>
          </Magnetic>

          <motion.div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start" {...FLIP_LAYOUT_PROPS}>
            <motion.div
              className="lg:col-span-5"
              layout
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
              variants={revealGroupVariants}
              transition={{ layout: SPRING_FLIP }}
            >
              <motion.p className="eyebrow mb-5" variants={revealItemVariants}>
                System dossier / {String(projectIndex + 1).padStart(2, '0')}
              </motion.p>
              <motion.h1
                className="display-tight max-w-[10ch] text-[clamp(3rem,8vw,5.8rem)] text-[var(--color-ink)]"
                variants={revealItemVariants}
              >
                {project.title}
              </motion.h1>
            </motion.div>

            <motion.div
              className="lg:col-span-7"
              layout
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
              variants={revealGroupVariants}
              transition={{ layout: SPRING_FLIP }}
            >
              <motion.p className="project-detail-subtitle" variants={revealItemVariants}>
                {project.subtitle}
              </motion.p>

              <motion.p className="project-detail-intro mt-8 max-w-[39rem]" variants={revealItemVariants}>
                {project.overview}
              </motion.p>

              <motion.div
                className="mt-10 grid gap-6 border-t border-[var(--color-line-strong)] pt-7 md:grid-cols-3"
                {...FLIP_LAYOUT_PROPS}
              >
                <motion.div variants={revealItemVariants} layout transition={{ layout: SPRING_FLIP }}>
                  <p className="eyebrow mb-3">Domain</p>
                  <p className="project-detail-meta-value max-w-[18rem]">{project.type}</p>
                </motion.div>
                <motion.div variants={revealItemVariants} layout transition={{ layout: SPRING_FLIP }}>
                  <p className="eyebrow mb-3">Stack</p>
                  <p className="project-detail-meta-value max-w-[22rem]">{project.tech}</p>
                </motion.div>
                <motion.div variants={revealItemVariants} layout transition={{ layout: SPRING_FLIP }}>
                  <p className="eyebrow mb-3">Mechanisms</p>
                  <p className="project-detail-meta-value max-w-[22rem]">
                    {String(project.coreMechanisms.length).padStart(2, '0')} active building blocks in the current system.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="project-detail-chip-row mt-8"
                layout
                initial="hidden"
                whileInView="visible"
                viewport={inViewViewport}
                variants={revealGroupVariants}
                transition={{ layout: SPRING_FLIP }}
              >
                {techList.map((item) => (
                  <motion.span
                    key={item}
                    layout
                    variants={revealItemVariants}
                    transition={{ layout: SPRING_FLIP }}
                    className="project-meta-pill"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="mt-20 border-t border-[var(--color-line-strong)] pt-10 md:mt-24 md:pt-12" {...FLIP_LAYOUT_PROPS}>
            <motion.div className="grid grid-cols-1 gap-18 lg:grid-cols-12" {...FLIP_LAYOUT_PROPS}>
              <div className="lg:col-span-4">
                <p className="section-label lg:sticky lg:top-12">Project dossier</p>
              </div>
              <div className="lg:col-span-8">
                <motion.div className="space-y-18" {...FLIP_LAYOUT_PROPS}>
                  {sections.slice(0, 1).map((section) => (
                    <section key={section.label} className="project-detail-section">
                      <motion.h2
                        className="section-label mb-7"
                        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={inViewViewport}
                        transition={{ duration: 0.56, ease: EASE_STANDARD }}
                      >
                        {section.label}
                      </motion.h2>
                      <motion.p
                        className="project-detail-copy"
                        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={inViewViewport}
                        transition={{ duration: 0.6, delay: 0.04, ease: EASE_STANDARD }}
                      >
                        {section.body}
                      </motion.p>
                    </section>
                  ))}

                  <section className="project-detail-section">
                    <motion.h2
                      className="section-label mb-7"
                      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={inViewViewport}
                      transition={{ duration: 0.56, ease: EASE_STANDARD }}
                    >
                      2.0 / Core Mechanisms
                    </motion.h2>
                    <motion.p
                      className="mb-7 max-w-[34rem] text-[0.96rem] leading-[1.7] text-[var(--color-muted-soft)]"
                      initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={inViewViewport}
                      transition={{ duration: 0.56, delay: 0.02, ease: EASE_STANDARD }}
                    >
                      The system is organized around the mechanisms below. They are the parts doing the actual work, not interface garnish.
                    </motion.p>
                    <motion.ul className="grid gap-4 md:grid-cols-2" {...FLIP_LAYOUT_PROPS}>
                      {project.coreMechanisms.map((mechanism, i) => (
                        <motion.li
                          key={mechanism}
                          layout
                          className="project-detail-card flex gap-4"
                          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          viewport={inViewViewport}
                          transition={{ duration: 0.52, delay: i * 0.03, ease: EASE_STANDARD, layout: SPRING_FLIP }}
                        >
                          <span className="hero-stat-index mt-[0.15rem]">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <p className="text-[1rem] leading-[1.55] text-[var(--color-ink)]">{mechanism}</p>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </section>

                  <section className="project-detail-section">
                    <motion.h2
                      className="section-label mb-7"
                      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={inViewViewport}
                      transition={{ duration: 0.56, ease: EASE_STANDARD }}
                    >
                      {sections[1].label}
                    </motion.h2>
                    <motion.p
                      className="project-detail-closing"
                      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={inViewViewport}
                      transition={{ duration: 0.6, delay: 0.04, ease: EASE_STANDARD }}
                    >
                      {sections[1].body}
                    </motion.p>
                  </section>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="mt-20 border-t border-[var(--color-line-strong)] pt-10 md:mt-24 md:pt-12" {...FLIP_LAYOUT_PROPS}>
            <motion.div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" {...FLIP_LAYOUT_PROPS}>
              <motion.div {...FLIP_LAYOUT_PROPS}>
                <Link preventScrollReset to={`/project/${previousProject.id}`} className="detail-nav-card group">
                  <p className="eyebrow">Previous system</p>
                  <div className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <p className="display-tight text-[clamp(1.8rem,3.5vw,2.6rem)]">{previousProject.title}</p>
                      <p className="mt-3 max-w-[24rem] text-[0.98rem] leading-[1.68] text-[var(--color-muted-soft)]">
                        {previousProject.subtitle}
                      </p>
                    </div>
                    <ArrowLeft className="mt-1 text-[var(--color-muted)] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                  </div>
                </Link>
              </motion.div>

              <motion.div {...FLIP_LAYOUT_PROPS}>
                <Link preventScrollReset to={`/project/${nextProject.id}`} className="detail-nav-card group">
                  <p className="eyebrow">Next system</p>
                  <div className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <p className="display-tight text-[clamp(1.8rem,3.5vw,2.6rem)]">{nextProject.title}</p>
                      <p className="mt-3 max-w-[24rem] text-[0.98rem] leading-[1.68] text-[var(--color-muted-soft)]">
                        {nextProject.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="mt-14 border-t border-[var(--color-line-strong)] pt-10" {...FLIP_LAYOUT_PROPS}>
            <motion.div className="project-detail-cta" {...FLIP_LAYOUT_PROPS}>
              <div>
                <p className="eyebrow">Interested in work like this?</p>
                <p className="mt-4 project-detail-closing max-w-[30rem]">
                  The strongest opportunities are technical products that need system design, product judgment, and implementation quality to reinforce each other.
                </p>
              </div>
              <a href="mailto:alexfigueroa.cybr@gmail.com" className="cta-link group inline-flex items-center gap-3 self-start">
                <span className="meta-rule text-[0.95rem] tracking-[-0.02em]">alexfigueroa.cybr@gmail.com</span>
                <ArrowUpRight size={16} className="text-[var(--color-muted)] transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.article>
    </LayoutGroup>
  );
}
