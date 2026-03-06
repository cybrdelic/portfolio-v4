import Hero from '../components/Hero';
import Thesis from '../components/Thesis';
import Ethos from '../components/Ethos';
import SystemDomains from '../components/SystemDomains';
import Projects from '../components/Projects';
import TechnicalProfile from '../components/TechnicalProfile';
import WorkingStyle from '../components/WorkingStyle';
import PageTransition from '../components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <main className="bg-[var(--color-bg)]">
        <Hero />
        <Thesis />
        <Ethos />
        <SystemDomains />
        <Projects />
        <TechnicalProfile />
        <WorkingStyle />
      </main>
    </PageTransition>
  );
}
