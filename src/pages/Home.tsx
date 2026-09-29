import { Link } from 'react-router-dom';
import { projects } from '../data';
import ProjectMedia from '../components/ProjectMedia';

export default function Home() {
  return <main id="main">
    <section className="hero" data-scene="water">
      <div className="hero-topline"><span className="eyebrow">Alejandro Figueroa</span><span className="availability">Available for engineering roles</span></div>
      <div className="hero-main"><p className="hero-index">Independent work / Production experience</p><h1 data-gpu-type tabIndex={-1}>GRAPHICS.<br/>SIMULATION.<br/>SYSTEMS.</h1></div>
      <div className="hero-bottom"><p>I turn computation into behavior.<br/>GPU worlds, useful tools, and software that ships.</p><Link className="hero-work-link" to="/#work"><span>Explore selected work</span><span className="scroll-mark" aria-hidden="true"/></Link><span className="hero-coordinate">Dayton, OH<br/>39.7589° N / 84.1916° W</span></div>
      <div className="hero-field-label" aria-hidden="true">01 / A continuous field</div>
    </section>
    <section className="work-intro section-shell" id="work">
      <div className="section-label"><span className="eyebrow">01 / Selected work</span><span className="eyebrow">2025—2026</span></div>
      <div className="intro-grid"><h2>From first principles<br/>to <em>something you can feel.</em></h2><p>Simulation, rendering, and systems engineering. Seven projects spanning physical behavior, scientific geometry, and tools that carry more of the work.</p></div>
    </section>
    {projects.slice(0, 2).map(project => <section key={project.id} className={`featured-project featured-${project.id}`} data-scene={project.motif}>
      <div className="project-top"><span className="eyebrow">{project.number} / {project.type}</span><span className="project-stack">{project.tech}</span></div>
      <Link to={`/project/${project.id}`} data-hover-motif={project.motif} className="project-media-link" aria-label={`Explore ${project.title}`}><ProjectMedia project={project}/><span className="media-corner"><span>Recorded from the renderer</span><span>View project</span></span></Link>
      <div className="featured-caption"><Link data-hover-motif={project.motif} to={`/project/${project.id}`}><h3>{project.title}<span> / {project.type === 'Ocean Simulation' ? 'Water in motion' : 'Fire as a field'}</span></h3></Link><div><p>{project.subtitle}</p><div className="project-actions"><Link className="text-link" to={`/project/${project.id}`}>Technical breakdown</Link>{project.source && <a className="text-link" href={project.source} target="_blank" rel="noreferrer">Source</a>}<a className="text-link" href={project.video} target="_blank" rel="noreferrer">Watch video</a></div></div></div>
    </section>)}
    <section className="studies section-shell">
      <div className="section-label"><span className="eyebrow">Beyond the frame</span><span className="eyebrow">Geometry / Tools / Workbenches</span></div>
      <h2 className="studies-heading">The systems<br/><em>behind the spectacle.</em></h2>
      <div className="study-list">{projects.slice(2).map(project => <article key={project.id} className={`study-row study-${project.motif}`} data-scene={project.motif}>
        <span className="study-number">{project.number}</span><div className="study-title"><span className="eyebrow">{project.type}</span><Link data-hover-motif={project.motif} to={`/project/${project.id}`}><h3>{project.title}</h3></Link></div><div className="study-description"><p>{project.subtitle}</p><span className="study-tech">{project.tech}</span></div><Link data-hover-motif={project.motif} className="study-open" to={`/project/${project.id}`} aria-label={`Read about ${project.title}`}>Explore</Link>
      </article>)}</div>
    </section>
    <section className="experience section-shell" id="experience" data-scene="systems">
      <div className="section-label"><span className="eyebrow">02 / Production engineering</span><span className="eyebrow">TalentNow / 2021—present</span></div>
      <div className="experience-heading"><h2>Built to explore.<br/><em>Experienced in shipping.</em></h2><p>Five years building production B2B software. Frontend, backend, databases, infrastructure, performance, and the tools that make teams faster.</p></div>
      <div className="experience-stats"><div><strong>10s <span>to</span> ~2.3s</strong><p>Progress page loading time</p></div><div><strong>2021<span>—</span>2026</strong><p>Professional product engineering</p></div><div><strong>Full stack</strong><p>React · Python · PostgreSQL · Kubernetes</p></div></div>
      <div className="experience-body"><p>At TalentNow, I’ve owned substantial parts of the project management product, improved slow workflows, and built developer tooling for database access, test orchestration, and isolated development environments.</p><div><p>My independent work extends that same approach into GPU simulation, rendering, procedural geometry, and autonomous tooling: understand the constraints, build the mechanism, measure the behavior.</p><Link className="text-link" to="/resume">Read my résumé</Link></div></div>
    </section>
    <section className="approach section-shell" data-scene="geometry"><span className="eyebrow">03 / How I work</span><p className="approach-statement">Make the constraints visible.<br/>Build across the boundaries.<br/><em>Let the behavior prove the work.</em></p><div className="approach-notes"><p>Memory movement. Numerical stability. Render cost. Synchronization. Context quality. The interesting work starts where these things meet.</p><p>I’m looking for teams working on difficult graphics, simulation, systems, and automation problems—where there is room to own the architecture and the implementation.</p></div></section>
  </main>;
}
