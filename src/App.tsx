import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Resume from './pages/Resume';
import ContinuousRoutes from './motion/ContinuousRoutes';
import { allProjects } from './data';
const MotionWorld = lazy(() => import('./motion/MotionWorld'));

export default function App() {
  const location = useLocation();
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('portfolio-motion') !== 'off'; } catch { return true; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [year] = useState(() => new Date().getFullYear());
  useEffect(() => {
    setMenuOpen(false);
    const project = allProjects.find(p => `/project/${p.id}` === location.pathname);
    document.title = `${project ? `${project.title} · ` : ''}Alejandro Figueroa — Graphics, Simulation & Systems`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = project?.overview || 'Alejandro Figueroa builds GPU simulations, rendering systems, developer tools, and production software. Based in Dayton, Ohio. Open to engineering roles.';
  }, [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    addEventListener('keydown', close); return () => removeEventListener('keydown', close);
  }, [menuOpen]);
  const toggleMotion = () => {
    const value = !enabled; setEnabled(value);
    try { localStorage.setItem('portfolio-motion', value ? 'on' : 'off'); } catch { /* Device-local preference is optional. */ }
  };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Suspense fallback={null}><MotionWorld enabled={enabled} /></Suspense>
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Cybrdelic, home">cybrdelic</Link>
      <nav className={menuOpen ? 'navigation navigation-open' : 'navigation'} id="site-navigation" aria-label="Main navigation">
        <Link to="/#work">Selected work</Link>
        <Link to="/#experience">Experience</Link>
        <Link to="/resume">Résumé</Link>
        <a className="nav-contact" href="mailto:alexfigueroa.cybr@gmail.com">Contact ↗</a>
      </nav>
      <button className="menu-toggle" aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? 'Close' : 'Menu'}</button>
    </header>
    <ContinuousRoutes>{displayed => <Routes location={displayed}>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="*" element={<main id="main" className="not-found"><p className="eyebrow">404 / Page not found</p><h1 tabIndex={-1}>Back to the work.</h1><Link className="text-link" to="/">Return home</Link></main>} />
    </Routes>}</ContinuousRoutes>
    <footer className="site-footer" id="contact" data-scene="systems">
      <div className="contact-intro"><p className="eyebrow">Contact</p><h2>Have a role<br/>in mind?</h2></div>
      <div className="contact-details"><p>Open to graphics, simulation, GPU, rendering, developer tooling, and technically ambitious engineering roles.</p><a className="contact-email" href="mailto:alexfigueroa.cybr@gmail.com">alexfigueroa.cybr@gmail.com</a><div className="social-links"><a href="https://x.com/cybrdelic" target="_blank" rel="noreferrer">X / @cybrdelic</a><a href="https://github.com/cybrdelic" target="_blank" rel="noreferrer">GitHub</a><Link to="/resume">Résumé</Link></div></div>
      <div className="footer-bottom"><span>© {year} Alejandro Figueroa</span><span>Dayton, Ohio · Remote</span><button onClick={toggleMotion} aria-pressed={enabled} aria-label={`Motion ${enabled ? 'on' : 'off'}`} className="motion-toggle">Motion {enabled ? 'on' : 'off'}</button></div>
    </footer>
  </>;
}
