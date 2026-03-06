import { motion } from 'motion/react';

export default function Thesis() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest sticky top-12">
            1.0 / Thesis
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
            I do not build software as isolated screens. I build systems that observe, interpret, and respond.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            Most software stops at representation. It stores data, renders a UI, and waits for a user to issue commands. My work is aimed at a different layer. I am interested in systems that actively construct understanding: systems that watch, track, infer, simulate, contextualize, and help drive action in real time.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            That work shows up in several forms. In some projects, it means building local-first agent tooling that continuously absorbs context from files, resumes, browser activity, and external signals to support high-quality decision-making. In others, it means building perceptual systems that translate gaze, head pose, geometry, and screen state into a live spatial model. In others, it means designing simulation and rendering infrastructure capable of expressing dynamic processes instead of static assets.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            Across all of it, the throughline is the same: I care about operational cognition. I want software to carry more of the burden of perception, synthesis, and execution.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            My background is full-stack, but my strongest work emerges where product engineering, systems thinking, interface design, and computational modeling meet. I am most effective when the problem is cross-layer: when architecture, interaction, performance, and reasoning all have to work together instead of being treated as separate concerns.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            I prefer systems whose constraints are visible. Memory ceilings, synchronization boundaries, ambiguity in state transitions, calibration drift, latency budgets, GPU limits, indexing quality, false-positive rates, and interaction failure modes are not implementation details; they are the substance of the work. I build from those realities outward.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
