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
      <article className="min-h-screen pt-32 pb-32 px-6 md:px-12 text-[var(--color-ink)]">
        <div className="max-w-7xl mx-auto">
          <Magnetic>
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors mb-16 p-2 -ml-2">
              <ArrowLeft size={16} /> Back to Index
            </Link>
          </Magnetic>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            <div className="lg:col-span-8">
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
            <div className="lg:col-span-4 flex flex-col gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 lg:col-start-5 space-y-24 font-sans text-lg md:text-xl leading-relaxed text-[var(--color-muted)]">
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
