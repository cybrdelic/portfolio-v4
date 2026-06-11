import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import RouteTransitionCapture from './components/RouteTransitionCapture';
import SmoothScroll from './components/SmoothScroll';
import SiteNav from './components/SiteNav';

export default function App() {
  const location = useLocation();

  return (
    <div className="relative isolate text-[var(--color-ink)]">
      <SmoothScroll />
      <CustomCursor />
      <RouteTransitionCapture />

      <div className="relative z-10">
        <SiteNav />
        <PageTransition key={location.pathname} pathname={location.pathname}>
          <ScrollToTop hash={location.hash} pathname={location.pathname} />
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </PageTransition>

        <Footer />
      </div>
    </div>
  );
}
