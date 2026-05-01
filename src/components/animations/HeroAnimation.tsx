import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';

function isoPoint(x: number, y: number, z = 0) {
  return {
    x: 240 + (x - y) * 14,
    y: 72 + (x + y) * 7 - z,
  };
}

const ridgePath = [
  [isoPoint(0, 5, -10), isoPoint(4, 2, 18), isoPoint(10, 3, 26), isoPoint(16, 7, 2)],
  [isoPoint(2, 10, -8), isoPoint(7, 7, 16), isoPoint(13, 8, 12)],
]
  .map((points) =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(' ')
  )
  .join(' ');

const signalPath = [
  isoPoint(4, 3, 18),
  isoPoint(7, 2, 22),
  isoPoint(9, 5, 26),
  isoPoint(11, 7, 20),
  isoPoint(12, 8, 14),
]
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
  .join(' ');

const plate = [
  isoPoint(-1, 2, -18),
  isoPoint(7, -4, -18),
  isoPoint(17, 6, -18),
  isoPoint(8, 13, -18),
]
  .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
  .join(' ');

const markerNodes = [
  { base: isoPoint(4, 3, -18), top: isoPoint(4, 3, 18) },
  { base: isoPoint(9, 5, -18), top: isoPoint(9, 5, 26) },
  { base: isoPoint(12, 8, -18), top: isoPoint(12, 8, 14) },
];

const nodeDropPath = markerNodes
  .map(({ base, top }) => `M ${top.x.toFixed(1)} ${top.y.toFixed(1)} L ${base.x.toFixed(1)} ${base.y.toFixed(1)}`)
  .join(' ');

export default function HeroAnimation({ isActive }: { isActive: boolean }) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const id = useId();
  const scanId = `hero-scan-${id.replace(/:/g, '')}`;

  return (
    <div className="relative flex h-full w-full items-center justify-center opacity-70" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 480 320" fill="none">
        <defs>
          <linearGradient id={scanId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g
          animate={
            isActive && !prefersReducedMotion
              ? { x: [-5, 4, -5], y: [3, -4, 3], rotate: [-0.6, 0.8, -0.6] }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '50%', originY: '50%' }}
        >
          <polygon points={plate} fill="var(--color-ink)" opacity="0.04" />
          <polygon points={plate} stroke="var(--color-ink)" strokeOpacity="0.22" />
          <path d={ridgePath} stroke="var(--color-ink)" strokeWidth="0.85" strokeOpacity="0.24" />
          <path d={signalPath} stroke="var(--color-ink)" strokeWidth="0.75" strokeOpacity="0.18" />
          <path d={nodeDropPath} stroke="var(--color-ink)" strokeWidth="0.75" strokeOpacity="0.18" />

          <motion.path
            d={ridgePath}
            stroke={`url(#${scanId})`}
            strokeWidth="1.45"
            strokeDasharray="80 560"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={
              isActive && !prefersReducedMotion
                ? { strokeDashoffset: [0, -640] }
                : { strokeDashoffset: 0 }
            }
            transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
          />

          <motion.path
            d={signalPath}
            stroke={`url(#${scanId})`}
            strokeWidth="0.9"
            strokeDasharray="54 320"
            strokeLinecap="round"
            initial={{ strokeDashoffset: -120 }}
            animate={
              isActive && !prefersReducedMotion
                ? { strokeDashoffset: [-120, -440] }
                : { strokeDashoffset: -120 }
            }
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />

          {markerNodes.map(({ top: point }, index) => (
            <motion.g
              key={`${point.x}-${point.y}`}
              initial={{ opacity: 0.36, scale: 1 }}
              animate={
                isActive && !prefersReducedMotion
                  ? { opacity: [0.24, 0.72, 0.24], scale: [0.9, 1.12, 0.9] }
                  : { opacity: 0.36, scale: 1 }
              }
              transition={{ duration: 5.4, repeat: Infinity, delay: index * 0.9, ease: 'easeInOut' }}
              style={{ originX: point.x, originY: point.y }}
            >
              <circle cx={point.x} cy={point.y} r="3.2" fill="var(--color-ink)" fillOpacity="0.58" />
              <circle cx={point.x} cy={point.y} r="14" stroke="var(--color-ink)" strokeOpacity="0.18" />
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
