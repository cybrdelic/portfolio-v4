import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { projects } from '../data';
import PageTransition from '../components/PageTransition';
import Magnetic from '../components/Magnetic';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center font-mono text-sm uppercase tracking-widest">
          <p>System not found.</p>
          <Link to="/" className="ml-4 text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:underline transition-colors">Return Home</Link>
        </div>
      </PageTransition>
    );
  }

  const sections = [
    { body: project.overview, label: '1.0 / Overview' },
    { body: project.whyItExists, label: '2.0 / Why it exists' },
    { body: project.roleInWork, label: '4.0 / Role in my work' },
  ] as const;

  return (
    <PageTransition>
      <article className="min-h-screen px-6 pb-28 pt-28 text-[var(--color-ink)] md:px-12">
        <div className="mx-auto max-w-7xl">
          <Magnetic>
            <Link to="/" className="mb-14 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] md:mb-18 p-2 -ml-2">
              <ArrowLeft size={16} /> Back to Index
            </Link>
          </Magnetic>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <motion.h1 
                className="display-tight max-w-[10ch] text-[clamp(3rem,8vw,5.8rem)] text-[var(--color-ink)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {project.title}
              </motion.h1>
            </div>

            <div className="lg:col-span-8">
              <motion.p 
                className="section-copy-lead max-w-[26rem]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {project.subtitle}
              </motion.p>

              <div className="mt-10 grid gap-6 border-t border-[var(--color-line-strong)] pt-7 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <p className="eyebrow mb-3">Domain</p>
                  <p className="max-w-[18rem] text-[1rem] leading-[1.58] text-[var(--color-ink)] md:text-[1.08rem]">
                    {project.type}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <p className="eyebrow mb-3">Stack</p>
                  <p className="max-w-[22rem] text-[1rem] leading-[1.58] text-[var(--color-ink)] md:text-[1.08rem]">
                    {project.tech}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-[var(--color-line-strong)] pt-10 md:mt-24 md:pt-12">
            <div className="grid grid-cols-1 gap-18 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="section-label lg:sticky lg:top-12">Project dossier</p>
              </div>
              <div className="lg:col-span-8">
                <div className="space-y-18">
                  {sections.slice(0, 2).map((section) => (
                    <section key={section.label}>
                      <h2 className="section-label mb-7">{section.label}</h2>
                      <p className="section-copy-body max-w-[39rem]">{section.body}</p>
                    </section>
                  ))}

                  <section>
                    <h2 className="section-label mb-7">3.0 / Core Mechanisms</h2>
                    <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                  {project.coreMechanisms.map((mechanism, i) => (
                        <li key={i} className="flex gap-4 border-t border-[var(--color-line-soft)] py-4">
                          <span className="hero-stat-index mt-[0.15rem]">{String(i + 1).padStart(2, '0')}</span>
                          <span className="max-w-[18rem] text-[0.98rem] leading-[1.6] text-[var(--color-ink)]">
                            {mechanism}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="section-label mb-7">{sections[2].label}</h2>
                    <p className="section-copy-closing max-w-[35rem]">{sections[2].body}</p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
