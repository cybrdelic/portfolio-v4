import { useEffect, useRef, useState } from 'react';
import { type Project } from '../data';

/** Only visible footage plays; constrained devices retain a real renderer poster. */
export default function ProjectMedia({ project, detail = false }: { project: Project; detail?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    const synchronize = () => {
      const enabled = document.documentElement.dataset.gpu !== 'disabled';
      if (visible && !document.hidden && !media.matches && !connection?.saveData && enabled) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; synchronize(); }, { threshold: 0.15 });
    observer.observe(video);
    const preference = new MutationObserver(synchronize);
    preference.observe(document.documentElement, { attributes: true, attributeFilter: ['data-gpu'] });
    document.addEventListener('visibilitychange', synchronize); media.addEventListener('change', synchronize);
    return () => { video.pause(); observer.disconnect(); preference.disconnect(); document.removeEventListener('visibilitychange', synchronize); media.removeEventListener('change', synchronize); };
  }, [project.id]);
  if (!project.video) return null;
  return <div className={`project-media${detail ? ' detail-media' : ''}`}>
    {failed ? <img src={project.poster} alt={`${project.title} renderer capture`}/> : <video ref={ref} src={project.video} poster={project.poster} muted loop playsInline preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-label={`${project.title}, recorded renderer footage`}/>}
    {detail && !failed && <button className="media-control" onClick={() => { const video = ref.current; if (video) { if (video.paused) video.play().catch(() => {}); else video.pause(); } }} aria-label={`${playing ? 'Pause' : 'Play'} ${project.title} recording`}>{playing ? 'Pause recording' : 'Play recording'}</button>}
  </div>;
}
