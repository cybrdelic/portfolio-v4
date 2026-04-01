import { LayoutGroup, motion } from 'motion/react';
import Footer from '../components/Footer';
import Ethos from '../components/Ethos';
import Experience from '../components/Experience';
import HeroThesisTransition from '../components/HeroThesisTransition';
import Projects from '../components/Projects';
import SystemDomains from '../components/SystemDomains';
import TechnicalProfile from '../components/TechnicalProfile';
import WorkingStyle from '../components/WorkingStyle';

export default function Home({ heroIntroReady = true }: { heroIntroReady?: boolean }) {
  return (
    <LayoutGroup id="home-layout">
      <motion.main className="relative">
        <HeroThesisTransition introReady={heroIntroReady} />
        <Ethos />
        <SystemDomains />
        <Projects />
        <Experience />
        <TechnicalProfile />
        <WorkingStyle />
        <Footer />
      </motion.main>
    </LayoutGroup>
  );
}
