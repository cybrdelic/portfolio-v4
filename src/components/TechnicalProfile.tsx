import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import TechAnimation from './animations/TechAnimation';
import ScrambleText from './ScrambleText';

export default function TechnicalProfile() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const rows = [
    { label: "Primary languages", value: "Rust, Python, TypeScript, JavaScript, GLSL" },
    { label: "Systems and infrastructure", value: "PostgreSQL, Redis, Docker, Kubernetes, RabbitMQ, Terraform" },
    { label: "Frontend and interface", value: "React, WebGL, shader systems, interaction architecture, visual systems design" },
    { label: "Current technical interests", value: "Perceptual interfaces, local-first AI tooling, GPU-driven simulation, embodied computing systems" }
  ];

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 border-b border-[var(--color-line)] relative overflow-hidden z-0">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none -z-10 translate-x-1/4 translate-y-1/4"
      >
        <TechAnimation />
      </motion.div>
      <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
            <ScrambleText text="5.0 / Technical Profile" />
          </h2>
        </div>
        <div className="lg:col-span-8 font-sans text-lg md:text-xl leading-relaxed text-[var(--color-muted)]">
          <p className="mb-8 text-[var(--color-ink)]">
            I work across the stack, but the throughline is system behavior.
          </p>
          <p className="mb-8">
            My technical background spans product engineering, automation systems, developer tooling, backend services, local-first application design, rendering systems, shader work, GPU-based simulation, and interface architecture. I am comfortable moving between system design, implementation details, interaction modeling, and visual communication when the product requires it.
          </p>
          <p>
            I have worked extensively in TypeScript, Python, Rust, and frontend-heavy systems, and I am particularly interested in projects where those tools are used to create systems that are unusually capable rather than conventionally packaged.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[var(--color-line)] relative z-10">
        {rows.map((row, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="data-row py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 font-mono text-sm uppercase tracking-widest text-[var(--color-ink)]">
                {row.label}
              </div>
              <div className="md:col-span-8 font-sans text-lg text-[var(--color-muted)]">
                {row.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
