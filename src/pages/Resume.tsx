import { Link } from 'react-router-dom';
import { projects } from '../data';
export default function Resume() {
  return <main id="main" className="resume section-shell" data-scene="systems">
    <div className="resume-actions"><Link to="/">Portfolio</Link><button onClick={() => window.print()}>Print / Save PDF</button></div>
    <header><p className="eyebrow">Résumé / September 2026</p><h1 tabIndex={-1}>Alejandro Figueroa</h1><p className="resume-role">Graphics / Simulation / Systems Engineer</p><div className="resume-contact"><span>Dayton, Ohio · Remote</span><a href="mailto:alexfigueroa.cybr@gmail.com">alexfigueroa.cybr@gmail.com</a><a href="https://github.com/cybrdelic">github.com/cybrdelic</a></div></header>
    <section><h2>Profile</h2><p>Software engineer with five years of production experience and a broad independent practice in GPU simulation, rendering, procedural geometry, and developer tooling. I work across the frontend, backend, database, and infrastructure, with an emphasis on performance and system behavior.</p></section>
    <section><h2>Professional experience</h2><div className="resume-job"><h3>TalentNow</h3><span>September 2021—present</span></div><p className="resume-job-role">Software Engineer · Promoted February 2025</p><ul><li>Owned substantial portions of the project management product, working across React/TypeScript, backend services, and PostgreSQL.</li><li>Reduced Progress page loading time from approximately 10 seconds to 2.3 seconds.</li><li>Built TNCLI and read-only database tooling to streamline development and investigation.</li><li>Developed WebdriverIO test orchestration and isolated developer environments using Tilt, Kubernetes namespaces, and separate databases.</li><li>Worked across Flask/Node services, GraphQL/REST, Helm, and NGINX.</li></ul></section>
    <section><h2>Selected independent projects</h2><div className="resume-projects">{projects.map(project => <div key={project.id}><h3><Link to={`/project/${project.id}`}>{project.title}</Link></h3><p>{project.subtitle}</p><span>{project.tech}</span></div>)}</div></section>
    <section><h2>Technical focus</h2><p>GPU simulation and shaders · WebGPU / WGSL · WebGL / GLSL · Three.js · Numerical simulation · Procedural geometry · React / TypeScript · Python · PostgreSQL · Kubernetes · Developer tooling</p></section>
  </main>;
}
