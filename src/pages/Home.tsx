import Ethos from '../components/Ethos';
import HeroThesisTransition from '../components/HeroThesisTransition';
import Projects from '../components/Projects';
import SystemDomains from '../components/SystemDomains';
import TechnicalProfile from '../components/TechnicalProfile';
import WorkingStyle from '../components/WorkingStyle';

export default function Home() {
  return (
    <main>
      <HeroThesisTransition />
      <Ethos />
      <SystemDomains />
      <Projects />
      <TechnicalProfile />
      <WorkingStyle />
    </main>
  );
}
