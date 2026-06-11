import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import Ethos from '../components/Ethos';
import HeroThesisTransition from '../components/HeroThesisTransition';
import Projects from '../components/Projects';
import SystemDomains from '../components/SystemDomains';
import TechnicalProfile from '../components/TechnicalProfile';

function RecedingSection({ children, exitStart = 0.65 }: { children: ReactNode; exitStart?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [exitStart, 1], [1, 0.97]);
  const opacity = useTransform(scrollYProgress, [exitStart, 1], [1, 0.7]);

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { scale, opacity, transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main>
      <HeroThesisTransition />
      <Projects />
      <RecedingSection><Ethos /></RecedingSection>
      <RecedingSection><SystemDomains /></RecedingSection>
      <TechnicalProfile />
    </main>
  );
}
