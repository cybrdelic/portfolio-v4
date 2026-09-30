import { useParams, Link } from 'react-router-dom';
import { allProjects, projects } from '../data';
import ProjectMedia from '../components/ProjectMedia';
import ProjectGallery from '../components/ProjectGallery';
import { normalizeMotif } from '../motion/state';
import { ProjectName } from './Home';
export default function ProjectDetail() {
  const { id } = useParams();
  const index = projects.findIndex(project => project.id === id);
  const project = allProjects.find(project => project.id === id);
  if (!project) return <main id="main" className="not-found"><p className="eyebrow">Project not found</p><h1 tabIndex={-1}>There’s more to explore.</h1><Link className="text-link" to="/#work">Selected work</Link></main>;
  const next = projects[(index + 1) % projects.length];
  return <main id="main" className={`project-detail detail-${project.motif}`}>
    <header className="detail-hero" data-scene={normalizeMotif(project.motif)}><Link className="back-link" to={index < 0 ? '/#work' : `/#${project.id}-scene`}>All selected work</Link><p className="eyebrow">{index < 0 ? 'Archive' : project.number} / {project.type}</p><h1 data-gpu-type tabIndex={-1}><ProjectName id={project.id} title={project.title}/></h1><p className="detail-subtitle">{project.subtitle}</p><div className="detail-meta"><span>{project.tech}</span><div>{project.source && <a className="text-link" href={project.source} target="_blank" rel="noreferrer">View source</a>}{project.video && <a className="text-link" href={project.video} target="_blank" rel="noreferrer">Watch video</a>}{!project.source && <a className="text-link" href={`mailto:alexfigueroa.cybr@gmail.com?subject=${encodeURIComponent(`${project.title} — technical walkthrough`)}`}>Request a walkthrough</a>}</div></div></header>
    <ProjectGallery project={project}/>
    {project.video && <div className="detail-footage section-shell"><ProjectMedia project={project} detail/><p className="media-provenance">Actual recording from {project.title}. Footage is illustrative; playback speed is not a live performance benchmark.</p></div>}
    {project.id === 'firesim' && <div className="detail-footage section-shell"><img src="/media/firesim.webp" alt="FireSim application viewport and field controls"/><p className="media-provenance">Actual application capture from the FireSim repository.</p></div>}
    <div className="dossier section-shell"><div className="dossier-label"><span className="eyebrow">Technical breakdown</span><span>{project.type}</span></div><div className="dossier-content"><section><h2>The project</h2><p>{project.overview}</p></section><section><h2>The engineering problem</h2><p>{project.whyItExists}</p></section><section><h2>Core mechanisms</h2><ol className="mechanism-list">{project.coreMechanisms.map((mechanism, i) => <li key={mechanism}><span>{String(i + 1).padStart(2, '0')}</span>{mechanism}</li>)}</ol></section><section><h2>My work & scope</h2><p>{project.roleInWork}</p></section></div></div>
    <Link className="next-project section-shell" to={`/project/${next.id}`}><span className="eyebrow">Next project / {next.number}</span><span className="next-title">{next.title}</span><span>{next.type}</span></Link>
  </main>;
}
