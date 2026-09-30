import { Link } from 'react-router-dom';
import { projects } from '../data';

const notes: Record<string, { label: string; description: string; facts: [string, string][]; caption: string }> = {
  'cybr-light': { label: 'Native spectral renderer', description: 'A C++ transport core and Python scene API. Spectral paths, dispersive glass, anisotropic metals, and participating media.', facts: [['Transport', 'Wavelength packets · MIS · Photon mapping'], ['Engine', 'SAH BVH · Material shaders · Checkpointed film']], caption: 'CYBR LIGHT / Native CPU render' },
  'cybr-geo': { label: 'Geometry, CAD, and assemblies', description: 'Model recipes become analytic CAD, named assemblies, motion studies, technical drawings, and portable exports.', facts: [['ORBIT', '148 components · 331-operation service sequence'], ['Pipeline', 'OpenCascade · STEP / STL / GLB · Hidden-line drawings']], caption: 'CYBR GEO / ORBIT revision 3' },
  'cybr-scenes': { label: 'Procedural scene pipelines', description: 'Complete environments with recoverable geometry, materials, native render builds, and preserved output.', facts: [['Scenes', 'Observatory IV · Six procedural landscapes'], ['Delivery', 'Native spectral rendering · Raw films · Reproducible builds']], caption: 'CYBR SCENES / Sandstone Passage' },
  'cybr-forest': { label: 'Native environment rendering', description: '9,810 placed instances. Native C++ scene traversal, textured shading, and moving-camera film capture.', facts: [['Geometry', '25 shared mesh buffers · Instance reuse'], ['Film', '96 native 1080p frames · Two camera shots']], caption: 'CYBR FOREST / Actual native renderer recording' },
};

export function ProjectName({ id, title }: { id: string; title: string }) {
  if (title.startsWith('CYBR ')) return <>CYBR<br/>{title.slice(5)}</>;
  if (id === 'drone-sim-studio') return <>DroneSim<br/>Studio</>;
  if (id === 'cnt-workbench') return <>CNT<br/>Workbench</>;
  return <>{title}</>;
}

export default function Home() {
  return <main id="main">
    <section className="hero" data-scene="geo">
      <img className="scene-fallback" src="/media/geo.webp" alt="" />
      <div className="hero-main">
        <p className="hero-role">Graphics / Simulation / Systems Engineer</p>
        <h1 data-gpu-type tabIndex={-1}>Alejandro<br/>Figueroa</h1>
        <p className="hero-description">Rendering engines, procedural geometry,<br/>GPU simulations, and production software.</p>
      </div>
      <div className="hero-bottom">
        <Link to="/#work" className="hero-work-link">Explore the work <span aria-hidden="true">↓</span></Link>
        <span className="hero-capture">CYBR GEO · ORBIT inspection wrist</span>
        <a href="mailto:alexfigueroa.cybr@gmail.com" className="availability">Open to engineering roles ↗</a>
      </div>
    </section>
    <nav className="work-index" aria-label="Project index">
      {projects.map(project => <a key={project.id} href={`#${project.id}-scene`}><span>{project.number}</span>{project.title}</a>)}
    </nav>
    {projects.map((project, index) => {
      const note = notes[project.id];
      return <section key={project.id} id={`${project.id}-scene`} className={`project-chapter featured-${project.id}`} data-scene={project.motif} data-framed={project.gallery ? true : undefined}>
        {index === 0 && <span id="work" className="work-anchor"/>}
        {project.poster && <img className="scene-fallback" src={project.poster} alt="" loading="lazy"/>}
        <div className="chapter-top"><span>{project.number} / {String(projects.length).padStart(2, '0')}</span><span>{note.label}</span><span className="chapter-tech">{project.tech}</span></div>
        {project.gallery && <figure className="chapter-render"><img src={project.poster} alt={project.gallery[0].alt} loading="lazy"/><figcaption>{project.gallery[0].caption}</figcaption></figure>}
        <div className="chapter-body">
          <div className="chapter-title"><p className="eyebrow">{project.type}</p><Link to={`/project/${project.id}`} aria-label={`Explore ${project.title}`}><h2 data-gpu-type><ProjectName id={project.id} title={project.title}/></h2></Link></div>
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
