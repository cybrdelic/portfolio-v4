import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Cpu, GitBranch, Play, Radio, ScanLine, TerminalSquare } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const artifacts = [
  {
    id: 'firesim',
    index: '01',
    title: 'FireSim',
    eyebrow: 'WebGPU combustion workbench',
    repo: 'https://github.com/cybrdelic/firesim',
    contract: '3D voxel grid · WGSL compute · deterministic sweep harness',
    copy: 'A real-time fire and fluid simulator with GPU advection, combustion, pressure projection, quality modes, field exports, and deterministic stability hooks.',
    tags: ['WebGPU', 'WGSL', 'React 19', 'Navier–Stokes'],
    mode: 'fire',
  },
  {
    id: 'drone-sim',
    index: '02',
    title: 'Drone Sim',
    eyebrow: 'Flight-to-fabrication engineering instrument',
    repo: 'https://github.com/cybrdelic/drone-sim',
    contract: 'Parametric frames · telemetry · MCP debug bridge',
    copy: 'A browser engineering lab that connects frame geometry, print layout, assembly checks, flight telemetry, controller tuning, replay inspection, and agent-readable state.',
    tags: ['Three.js', 'Rapier', 'MCP', 'TypeScript'],
    mode: 'drone',
  },
  {
    id: 'amber',
    index: '03',
    title: 'Amber Lab',
    eyebrow: 'WebGPU material capture system',
    repo: 'https://github.com/cybrdelic/webgpu-amber',
    contract: 'Volume material · HDRI calibration · reference diff',
    copy: 'A material-rendering instrument for procedural amber specimens, inclusions, calibrated lighting, WebGPU volume paths, renderer fallback reporting, and visual comparison.',
    tags: ['TSL', 'WebGPU', 'HDRI', 'Material systems'],
    mode: 'amber',
  },
  {
    id: 'eye-sim',
    index: '04',
    title: 'Eye Sim',
    eyebrow: 'Optical and perceptual simulation',
    repo: 'https://github.com/cybrdelic/eye-sim',
    contract: 'Lens model · retinal projection · diagnostic overlays',
    copy: 'An inspectable visual system for experimenting with optics, sensor geometry, perception, and augmented sensory interfaces.',
    tags: ['Optics', 'Simulation', 'WebGPU', 'Research UI'],
    mode: 'eye',
  },
];

const codeLines = [
  'dispatch(advection, velocityField)',
  'dispatch(combustion, temperatureField)',
  'dispatch(divergence, pressureField)',
  'iterate(jacobiPressureSolve, 24)',
  'compose(worldCanvas, fireVolume)',
  'publish(status, telemetry, frameBudget)',
];

function FieldCanvas({ mode = 'fire', active = true }: { mode?: string; active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    const particles = Array.from({ length: 90 }, (_, i) => ({
      phase: (i * 1.618) % Math.PI,
      radius: 0.08 + ((i * 17) % 23) / 120,
      speed: 0.0018 + ((i * 13) % 11) / 5000,
      offset: ((i * 37) % 100) / 100,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      resize();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050606';
      ctx.fillRect(0, 0, w, h);

      const grid = 34;
      ctx.strokeStyle = 'rgba(184,255,61,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const time = reduced || !active ? 1600 : t;
      if (mode === 'drone') {
        ctx.save();
        ctx.translate(w * 0.55, h * 0.52);
        ctx.rotate(Math.sin(time * 0.0005) * 0.08);
        ctx.strokeStyle = '#b8ff3d';
        ctx.lineWidth = 2;
        [[-75,-45],[75,-45],[-75,45],[75,45]].forEach(([x,y]) => {
          ctx.beginPath(); ctx.arc(x,y,28,0,Math.PI*2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(x,y); ctx.stroke();
        });
        ctx.strokeRect(-24,-18,48,36);
        ctx.restore();
      } else if (mode === 'amber') {
        const g = ctx.createRadialGradient(w*.53,h*.48,10,w*.53,h*.48,Math.min(w,h)*.38);
        g.addColorStop(0,'rgba(255,246,184,.98)');
        g.addColorStop(.22,'rgba(255,171,44,.9)');
        g.addColorStop(.62,'rgba(136,51,5,.78)');
        g.addColorStop(1,'rgba(20,8,0,0)');
        ctx.fillStyle=g; ctx.beginPath();
        for(let i=0;i<40;i++){
          const a=(i/40)*Math.PI*2;
          const r=Math.min(w,h)*(.24+Math.sin(a*5+time*.0005)*.035);
          const x=w*.53+Math.cos(a)*r; const y=h*.48+Math.sin(a)*r*.82;
          i?ctx.lineTo(x,y):ctx.moveTo(x,y);
        }
        ctx.closePath(); ctx.fill();
      } else if (mode === 'eye') {
        const cx=w*.52, cy=h*.5;
        for(let r=170;r>12;r-=18){
          ctx.strokeStyle=`rgba(184,255,61,${0.04+(170-r)/1000})`;
          ctx.beginPath(); ctx.ellipse(cx,cy,r,r*.58,Math.sin(time*.0002)*.15,0,Math.PI*2); ctx.stroke();
        }
        ctx.fillStyle='#b8ff3d'; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill();
      } else {
        particles.forEach((p,i) => {
          const y = h - ((time*p.speed + p.offset*h) % (h*1.25));
          const x = w*.54 + Math.sin(time*.0012+p.phase)*w*p.radius;
          const size = 8 + (i%9)*2.4;
          const g=ctx.createRadialGradient(x,y,0,x,y,size*2.4);
          g.addColorStop(0,'rgba(255,250,190,.95)');
          g.addColorStop(.2,'rgba(255,142,26,.85)');
          g.addColorStop(.7,'rgba(255,47,8,.16)');
          g.addColorStop(1,'rgba(255,0,0,0)');
          ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,size*2.4,0,Math.PI*2); ctx.fill();
        });
      }

      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(220,255,190,.65)';
      ctx.fillText(`MODE / ${mode.toUpperCase()}`, 18, 26);
      ctx.fillText(`FRAME / ${String(frame++).padStart(6,'0')}`, 18, 44);
      ctx.fillText('INSTRUMENT / LIVE', 18, h - 20);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mode, active, reduced]);

  return <canvas ref={canvasRef} className="proof-canvas" aria-label={`${mode} visual instrument`} />;
}

function ArtifactCard({ artifact, active, onActivate }: { artifact: typeof artifacts[number]; active: boolean; onActivate: () => void }) {
  return (
    <button className={`artifact-row ${active ? 'is-active' : ''}`} onClick={onActivate}>
      <span className="artifact-index">{artifact.index}</span>
      <span className="artifact-title"><strong>{artifact.title}</strong><small>{artifact.eyebrow}</small></span>
      <span className="artifact-contract">{artifact.contract}</span>
      <ArrowUpRight size={18} />
    </button>
  );
}

function PipelineTrace() {
  return (
    <div className="pipeline-trace">
      {['observe', 'decompose', 'execute', 'evaluate', 'repair', 'publish'].map((item, i) => (
        <motion.div
          key={item}
          className="pipeline-node"
          initial={{ opacity: 0.2, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <span>{String(i + 1).padStart(2, '0')}</span>
          <strong>{item}</strong>
          <i />
        </motion.div>
      ))}
    </div>
  );
}

export default function ProofEverywhere() {
  const [activeId, setActiveId] = useState('firesim');
  const active = useMemo(() => artifacts.find((a) => a.id === activeId) || artifacts[0], [activeId]);

  return (
    <main className="proof-site">
      <header className="proof-nav">
        <a href="#top" className="proof-mark"><span>CYBR</span><strong>DELIC</strong></a>
        <nav>
          <a href="#systems">Systems</a>
          <a href="#evidence">Evidence</a>
          <a href="#engage">Engage</a>
        </nav>
        <a href="#engage" className="proof-nav-cta">Commission a system <ArrowUpRight size={15}/></a>
      </header>

      <section id="top" className="proof-hero">
        <div className="proof-hero-copy">
          <div className="proof-kicker"><Radio size={14}/> AUTONOMOUS SYSTEMS FOUNDRY / LIVE BUILD 2026</div>
          <h1>Proof first.<br/><em>Claims last.</em></h1>
          <p>Research engineering, simulation, WebGPU, agent infrastructure, and product systems—shown as working instruments, not represented by decorative agency copy.</p>
          <div className="proof-hero-actions">
            <a href="#systems">Enter the systems map <ArrowUpRight size={16}/></a>
            <a href="https://github.com/cybrdelic" target="_blank" rel="noreferrer">Inspect the repositories</a>
          </div>
          <div className="proof-hero-status">
            <span><i className="status-dot"/> CURRENT INSTRUMENT</span>
            <strong>{active.title}</strong>
            <small>{active.contract}</small>
          </div>
        </div>
        <div className="proof-hero-instrument">
          <FieldCanvas mode={active.mode}/>
          <div className="instrument-hud hud-top"><span>GPU PIPELINE</span><strong>ACTIVE</strong></div>
          <div className="instrument-hud hud-bottom"><span>OUTPUT</span><strong>INSPECTABLE</strong></div>
          <div className="instrument-scan"/>
        </div>
      </section>

      <section id="systems" className="proof-systems">
        <div className="proof-section-label"><span>01</span><strong>Systems map</strong><small>Select an artifact. The primary instrument updates in place.</small></div>
        <div className="systems-layout">
          <div className="artifact-list">
            {artifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} active={activeId===artifact.id} onActivate={()=>setActiveId(artifact.id)}/>) }
          </div>
          <div className="artifact-detail">
            <div className="artifact-detail-visual"><FieldCanvas mode={active.mode}/></div>
            <div className="artifact-detail-copy">
              <div><span>{active.eyebrow}</span><h2>{active.title}</h2></div>
              <p>{active.copy}</p>
              <div className="artifact-tags">{active.tags.map(t=><span key={t}>{t}</span>)}</div>
              <a href={active.repo} target="_blank" rel="noreferrer">Open source evidence <ArrowUpRight size={16}/></a>
            </div>
          </div>
        </div>
      </section>

      <section id="evidence" className="proof-evidence">
        <div className="proof-section-label"><span>02</span><strong>Execution evidence</strong><small>Architecture, state, and failure handling remain visible.</small></div>
        <div className="evidence-grid">
          <article className="evidence-panel evidence-code">
            <header><TerminalSquare size={17}/><span>firesim / solver-pass.ts</span><i>WGSL</i></header>
            <pre>{codeLines.map((line,i)=><code key={line}><b>{String(i+81).padStart(3,'0')}</b>{line}</code>)}</pre>
            <footer><span>DETERMINISTIC SWEEP</span><strong>READY</strong></footer>
          </article>
          <article className="evidence-panel evidence-telemetry">
            <header><ScanLine size={17}/><span>flight telemetry</span><i>LIVE</i></header>
            <div className="telemetry-stage">
              <div className="telemetry-drone"><i/><i/><i/><i/><b/></div>
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C40 10 70 110 110 54 S180 22 210 62 S275 95 310 38 S360 18 400 66"/></svg>
            </div>
            <div className="telemetry-values"><span>ALT <b>12.4m</b></span><span>ROLL <b>-2.1°</b></span><span>THRUST <b>63%</b></span><span>LINK <b>MCP</b></span></div>
          </article>
          <article className="evidence-panel evidence-graph">
            <header><GitBranch size={17}/><span>agent execution graph</span><i>TRACE</i></header>
            <PipelineTrace/>
            <footer><span>Every mutation attributable</span><strong>6 / 6 NODES</strong></footer>
          </article>
          <article className="evidence-panel evidence-bench">
            <header><Cpu size={17}/><span>performance contract</span><i>MEASURED</i></header>
            <div className="bench-bars">
              {[['advection',72],['pressure solve',89],['volume compose',57],['UI + telemetry',24]].map(([n,v])=><div key={n as string}><span>{n}</span><i><b style={{width:`${v}%`}}/></i><strong>{v}%</strong></div>)}
            </div>
            <p>Budget visualization is generated from the instrument model. Production values must be bound to recorded benchmark output before public claims are enabled.</p>
          </article>
        </div>
      </section>

      <section className="proof-case">
        <div className="case-title"><span>03 / FLAGSHIP CASE</span><h2>Fire is not the demo.<br/>The testable simulation system is.</h2></div>
        <div className="case-sequence">
          {[
            ['INPUT','Scene presets, voxel grid, smoke state, deterministic frame count'],
            ['COMPUTE','Advection, combustion, divergence, Jacobi pressure projection'],
            ['OBSERVE','Debug overlays, frame budget, field exports, automation hooks'],
            ['VERIFY','Fuzz sweeps, visual snapshots, deterministic readiness reporting'],
          ].map(([a,b],i)=><article key={a}><span>{String(i+1).padStart(2,'0')}</span><strong>{a}</strong><p>{b}</p></article>)}
        </div>
        <a className="case-link" href="https://github.com/cybrdelic/firesim" target="_blank" rel="noreferrer"><Play size={16}/> Inspect FireSim source and stability harness</a>
      </section>

      <section id="engage" className="proof-engage">
        <div><span>04 / ENGAGEMENT</span><h2>Bring a difficult system.</h2></div>
        <p>Best fit: technically ambitious products where simulation, agentic workflows, high-performance interfaces, or unusual infrastructure are central—not decorative.</p>
        <a href="mailto:alex@cybrdelic.com">Send the technical brief <ArrowUpRight size={18}/></a>
      </section>
    </main>
  );
}
