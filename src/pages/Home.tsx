import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data';
import { motionState } from '../motion/state';

const notes: Record<string, { label: string; description: string; facts: [string, string][]; caption: string }> = {
  aqua: { label: 'GPU spectral ocean', description: 'Three FFT bands, persistent whitewater, and an optical pipeline from sky to seafloor.', facts: [['Simulation', 'Finite-depth spectrum · Ripple and wake interactions'], ['Rendering', 'Fresnel · RGB extinction · Traced caustics']], caption: 'AQUA / Actual renderer recording' },
  ignia: { label: 'Reactive volumetric fire', description: 'A 3D fluid solver transports fuel, heat, and soot. Ray integration turns those fields into visible fire and smoke.', facts: [['Solver', 'Pressure projection · Buoyancy · Vorticity'], ['Volume', 'Refined reactive fields · Extinction and emission']], caption: 'IGNIA / Actual renderer recording' },
  'drone-sim-studio': { label: 'Flight to fabrication', description: 'Parametric frames, physics, controller tuning, and fabrication checks in one browser workbench.', facts: [['Design', 'Frame generation · Assembly · Print layout'], ['Flight', 'Rapier physics · PID assist · Telemetry']], caption: 'Interactive frame geometry study' },
  'amber-lab': { label: 'Translucent material rendering', description: 'Procedural specimens, inclusions, HDRI lighting, and a capture workflow for developing translucent materials.', facts: [['Material', 'WebGPU volume path · Transmission · Inclusions'], ['Workflow', 'Lighting profiles · Backend reporting · Capture comparison']], caption: 'Live shader study / Procedural amber geometry' },
  'cnt-workbench': { label: 'Carbon nanotube geometry', description: 'Chirality parameters become inspectable molecular geometry, finite segments, and periodic simulation exports.', facts: [['Geometry', 'Chiral vector · Rolled graphene lattice · Unit cells'], ['Export', 'ExtXYZ · LAMMPS · POSCAR · JSON']], caption: 'Live rolled graphene lattice / Change chirality below' },
  firesim: { label: 'WebGPU combustion workbench', description: 'A browser solver with field inspection, runtime controls, projected exports, and a staged validation workflow.', facts: [['Compute', 'WebGPU · WGSL · Fire and fluid fields'], ['Inspection', 'Diagnostics · Field exports · Benchmark scaffolds']], caption: 'FireSim / Actual application capture' },
  llmwiki: { label: 'Local project knowledge', description: 'Project folders and repository evidence become authored pages with backlinks and explicit source provenance.', facts: [['Ingest', 'Local roots · Repository metadata · Archives'], ['Publish', 'Canonical pages · Backlinks · Static wiki']], caption: 'Project evidence → authored pages → linked knowledge' },
};

export function ProjectName({ id, title }: { id: string; title: string }) {
  if (id === 'drone-sim-studio') return <>DroneSim<br/>Studio</>;
  if (id === 'cnt-workbench') return <>CNT<br/>Workbench</>;
  return <>{title}</>;
}

function ChiralityControl() {
  const [active, setActive] = useState('10,4');
  return <div className="chirality-control" role="group" aria-label="Nanotube chirality">
    <span>Chirality (n, m)</span>
    {[[10, 4], [8, 8], [12, 0]].map(pair => <button key={pair.join(',')} aria-pressed={active === pair.join(',')} onClick={() => { setActive(pair.join(',')); motionState.chirality = pair; window.dispatchEvent(new Event('portfolio-invalidate')); }}>({pair[0]}, {pair[1]})</button>)}
  </div>;
}

export default function Home() {
  return <main id="main">
    <section className="hero" data-scene="water">
      <img className="scene-fallback" src="/media/aqua.webp" alt="" />
      <div className="hero-main">
        <p className="hero-role">Graphics / Simulation / Systems Engineer</p>
        <h1 data-gpu-type tabIndex={-1}>Alejandro<br/>Figueroa</h1>
        <p className="hero-description">GPU simulations, rendering systems,<br/>scientific tools, and production software.</p>
      </div>
      <div className="hero-bottom">
        <Link to="/#work" className="hero-work-link">Explore the work <span aria-hidden="true">↓</span></Link>
        <span className="hero-capture">AQUA · GPU FFT ocean</span>
        <a href="mailto:alexfigueroa.cybr@gmail.com" className="availability">Open to engineering roles ↗</a>
      </div>
    </section>
    <nav className="work-index" aria-label="Project index">
      {projects.map(project => <a key={project.id} href={`#${project.id}-scene`}><span>{project.number}</span>{project.title}</a>)}
    </nav>
    {projects.map((project, index) => {
      const note = notes[project.id];
      return <section key={project.id} id={`${project.id}-scene`} className={`project-chapter featured-${project.id}`} data-scene={project.id === 'firesim' ? 'systems' : project.motif} data-geometry={project.id === 'cnt-workbench' ? 'tube' : 'frame'}>
        {index === 0 && <span id="work" className="work-anchor"/>}
        {project.poster && <img className="scene-fallback" src={project.poster} alt="" loading="lazy"/>}
        <div className="chapter-top"><span>{project.number} / {String(projects.length).padStart(2, '0')}</span><span>{note.label}</span><span className="chapter-tech">{project.tech}</span></div>
        {project.id === 'firesim' && <figure className="app-capture"><img src="/media/firesim.webp" alt="FireSim application showing its simulation viewport and field controls" loading="lazy"/></figure>}
        {project.id === 'llmwiki' && <div className="wiki-flow" aria-label="LLMWiki evidence pipeline"><span>Project folders</span><i aria-hidden="true">↗</i><span>Source evidence</span><i aria-hidden="true">↘</i><span>Authored pages</span><i aria-hidden="true">↗</i><span>Linked wiki</span></div>}
        <div className="chapter-body">
          <div className="chapter-title"><p className="eyebrow">{project.type}</p><Link to={`/project/${project.id}`} aria-label={`Explore ${project.title}`}><h2 data-gpu-type><ProjectName id={project.id} title={project.title}/></h2></Link>{project.id === 'cnt-workbench' && <ChiralityControl/>}</div>
          <div className="chapter-info"><p className="chapter-description">{note.description}</p><dl>{note.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="project-actions"><Link className="text-link" to={`/project/${project.id}`}>Technical breakdown ↗</Link>{project.source && <a className="text-link" href={project.source} target="_blank" rel="noreferrer">Source ↗</a>}</div></div>
        </div>
        <div className="chapter-bottom"><span>{note.caption}</span>{index < projects.length - 1 && <a href={`#${projects[index + 1].id}-scene`}>Next / {projects[index + 1].title} ↓</a>}</div>
      </section>;
    })}
    <section className="experience section-shell" id="experience" data-scene="systems">
      <div className="section-label"><span>Production engineering</span><span>TalentNow / 2021—present</span></div>
      <div className="experience-heading"><h2>Five years<br/>in production.</h2><p>Alongside the graphics work, I build B2B product software across the frontend, backend, database, and infrastructure.</p></div>
      <div className="experience-proof"><div className="performance-result"><p>Progress page loading time</p><div><span>~10s</span><i aria-hidden="true">→</i><strong>~2.3s</strong></div><div className="timing-bars" aria-hidden="true"><span/><span/></div></div><div className="production-work"><article><h3>Product ownership</h3><p>Substantial parts of the project management product, from React and TypeScript through backend services and PostgreSQL.</p></article><article><h3>Developer tooling</h3><p>TNCLI, read-only database tooling, and WebdriverIO test orchestration.</p></article><article><h3>Development infrastructure</h3><p>Isolated environments with Tilt, Kubernetes namespaces, and per-developer databases.</p></article></div></div>
      <Link className="text-link" to="/resume">Full résumé ↗</Link>
    </section>
  </main>;
}
