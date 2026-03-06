import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import SystemAnimation from './animations/SystemAnimation';
import ScrambleText from './ScrambleText';

export default function SystemDomains() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const domains = [
    {
      title: 'Autonomous Tooling',
      desc: 'I build systems that absorb context, orchestrate workflows, and reduce operator effort over time. These are not simple wrappers around APIs. They are structured operational systems designed to gather information, synthesize it, and push work forward with increasing leverage.'
    },
    {
      title: 'Perceptual Systems',
      desc: 'I build systems that track and model the physical relationship between a person, a screen, and surrounding space. This includes gaze geometry, digital twins of user state, and systems for real-time inference built on top of raw signals.'
    },
    {
      title: 'Simulation and Rendering',
      desc: 'I build GPU-heavy systems for procedural rendering, material behavior, dynamic geometry, and simulation-driven visual interfaces. The emphasis is not on style alone, but on systems whose visuals emerge from computational structure.'
    },
    {
      title: 'Systems UX',
      desc: 'I care about interface quality at a deep level. I want technical systems to feel precise, fast, legible, and operationally serious. A large part of my work is translating complex machinery into interfaces that remain clear under pressure.'
    }
  ];

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 border-b border-[var(--color-line)] relative overflow-hidden z-0">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-1/2 left-0 w-[800px] h-[800px] pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <SystemAnimation />
      </motion.div>
      <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
            <ScrambleText text="3.0 / System Domains" />
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="font-sans text-lg md:text-xl text-[var(--color-muted)]">
            The work currently clusters into four domains.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-[var(--color-line)] relative z-10">
        {domains.map((domain, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="block data-row py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 font-sans text-xl md:text-2xl font-normal text-[var(--color-ink)]">
                {domain.title}
              </div>
              <div className="md:col-span-8 font-sans text-lg leading-relaxed text-[var(--color-muted)]">
                {domain.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
