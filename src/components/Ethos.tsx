import { motion } from 'motion/react';

export default function Ethos() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest sticky top-12">
            2.0 / Ethos
          </h2>
        </div>
        <div className="lg:col-span-8 font-sans text-lg md:text-xl leading-relaxed text-[var(--color-muted)]">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-[var(--color-ink)]"
          >
            My work is driven by constraint visibility, first-principles decomposition, and aggressive context capture.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            I do not like opaque systems. I want to know where the cost is, where the uncertainty is, and where the brittleness lives. In practice that means decomposing problems until the real constraints become explicit: memory movement, synchronization overhead, render cost, search quality, false context injection, brittle automation paths, or poorly bounded user state.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            When a system becomes legible at that level, the design changes. Many architecture decisions that look complicated from a distance become obvious once the actual failure boundaries are exposed. That applies equally to a local-first job automation platform, a real-time gaze interaction engine, a shader-based material system, or a code-contextualization pipeline.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            I also care deeply about context quality. Most automation and most AI systems fail because they operate on thin, noisy, or badly structured context. A recurring theme in my work is to build better context pipelines: systems that gather the right inputs, preserve useful structure, rank relevance well, and hand downstream reasoning a sharper substrate than a normal prompt ever could.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The objective is not novelty for its own sake. The objective is to make software more capable, more aware, and more useful under real constraints.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
