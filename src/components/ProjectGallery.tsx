import { useEffect, useState } from 'react';
import type { Project } from '../data';

export default function ProjectGallery({ project }: { project: Project }) {
  const [selected, setSelected] = useState(0);
  useEffect(() => { setSelected(0); }, [project.id]);
  if (!project.gallery?.length) return null;
  const frame = project.gallery[selected] || project.gallery[0];
  return <section className="render-gallery section-shell" aria-label={`${project.title} rendered output`}>
    <div className="gallery-tabs" role="group" aria-label="Choose a render">
      {project.gallery.map((image, index) => <button key={image.src} aria-pressed={selected === index} onClick={() => setSelected(index)}>{image.label}</button>)}
    </div>
    <figure><img src={frame.src} alt={frame.alt}/><figcaption>{frame.caption}</figcaption></figure>
  </section>;
}
