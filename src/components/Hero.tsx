import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import HeroAnimation from './animations/HeroAnimation';
import ScrambleText from './ScrambleText';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="pt-40 pb-24 px-6 md:px-12 border-b border-[var(--color-line)] relative overflow-hidden z-0">
      <motion.div 
        style={{ y: backgroundY, opacity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"
      >
        <HeroAnimation />
      </motion.div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <div className="mb-16">
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="font-mono text-sm text-[var(--color-muted)] mb-6 uppercase tracking-widest"
            >
              <ScrambleText text="Alex Figueroa — Autonomous Systems & Simulation Engineer" />
            </motion.p>
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="font-sans text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight max-w-5xl"
            >
              I build perceptual systems, recursive tooling, and simulation infrastructure that push software beyond static interfaces.
            </motion.h1>
          </div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-[var(--color-line)]"
          >
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">Coordinates</p>
              <p className="font-sans text-sm">Dayton, OH / California roots</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">Focus</p>
              <p className="font-sans text-sm">Perception systems, simulation infrastructure, autonomous tooling</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">Availability</p>
              <p className="font-sans text-sm">Open to high-leverage engineering roles and frontier technical collaborations</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
