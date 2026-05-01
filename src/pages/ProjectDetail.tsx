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

  return (
    <PageTransition>
      <article className="min-h-screen px-6 pb-24 pt-24 text-[var(--color-ink)] md:px-12 md:pb-32 md:pt-28">
        <div className="max-w-7xl mx-auto">
          <Magnetic>
            <Link to="/#work" className="mb-12 inline-flex min-h-10 items-center gap-2 p-2 -ml-2 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] md:mb-16">
              <ArrowLeft size={16} /> Back to selected work
            </Link>
          </Magnetic>

          <div className="mb-20 grid grid-cols-1 items-start gap-10 md:mb-24 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <motion.h1 
                className="font-sans text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {project.title}
              </motion.h1>
              <motion.p 
                className="font-sans text-xl md:text-2xl text-[var(--color-muted)] leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {project.subtitle}
              </motion.p>
            </div>
            <div className="grid gap-6 border-t border-[var(--color-line)] pt-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:border-t-0 lg:pt-2">
              <motion.div 
                className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="mb-2">Domain</p>
                <p className="text-[var(--color-ink)]">{project.type}</p>
              </motion.div>
              <motion.div 
                className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="mb-2">Stack</p>
                <p className="text-[var(--color-ink)]">{project.tech}</p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 border-t border-[var(--color-line)] pt-12 lg:grid-cols-12">
            <div className="hidden font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] lg:col-span-3 lg:block">
              Project dossier
            </div>
            <div className="space-y-16 font-sans text-base leading-relaxed text-[var(--color-muted)] md:text-xl lg:col-span-8 lg:col-start-5">
              <section>
                <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink)] mb-8 border-b border-[var(--color-line)] pb-4">
                  1.0 / Overview
                </h2>
                <p>{project.overview}</p>
              </section>

              <section>
                <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink)] mb-8 border-b border-[var(--color-line)] pb-4">
                  2.0 / Why it exists
                </h2>
                <p>{project.whyItExists}</p>
              </section>

              <section>
                <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink)] mb-8 border-b border-[var(--color-line)] pb-4">
                  3.0 / Core Mechanisms
                </h2>
                <ul className="space-y-4">
                  {project.coreMechanisms.map((mechanism, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-[var(--color-ink)] font-mono text-sm">✦</span>
                      <span>{mechanism}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-ink)] mb-8 border-b border-[var(--color-line)] pb-4">
                  4.0 / Role in my work
                </h2>
                <p>{project.roleInWork}</p>
              </section>
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
