import Ethos from '../components/Ethos';
import HeroThesisTransition from '../components/HeroThesisTransition';
import PageTransition from '../components/PageTransition';
import Projects from '../components/Projects';
import SystemDomains from '../components/SystemDomains';
import TechnicalProfile from '../components/TechnicalProfile';
import WorkingStyle from '../components/WorkingStyle';

export default function Home({ heroIntroReady = true }: { heroIntroReady?: boolean }) {
  return (
    <PageTransition>
      <main>
        <HeroThesisTransition introReady={heroIntroReady} />
        <Ethos />
        <SystemDomains />
        <Projects />
        <TechnicalProfile />
        <WorkingStyle />
      </main>
    </PageTransition>
  );
}
