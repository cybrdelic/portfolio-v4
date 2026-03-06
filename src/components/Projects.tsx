import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects } from '../data';
import ScrambleText from './ScrambleText';

export default function Projects() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
            <ScrambleText text="4.0 / Selected Systems" />
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="font-sans text-lg md:text-xl text-[var(--color-muted)]">
            A selection of active and representative projects.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[var(--color-line)]">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link 
              to={`/project/${project.id}`}
              className="block data-row py-12 group hover:bg-[var(--color-surface)] transition-colors -mx-6 px-6 md:-mx-12 md:px-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-surface)] to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] opacity-50 pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline relative z-10">
              <div className="md:col-span-4">
                <h3 className="font-sans text-2xl font-normal text-[var(--color-ink)] mb-2">
                  {project.title}
                </h3>
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  {project.type}
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="font-sans text-lg text-[var(--color-muted)] group-hover:text-[var(--color-ink)] transition-colors">
                  {project.subtitle}
                </p>
              </div>
              <div className="md:col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-300">
                <ArrowUpRight size={20} className="text-[var(--color-muted)]" />
              </div>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
