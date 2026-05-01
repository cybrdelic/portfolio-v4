import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';

const layers = [
  { label: 'IO', width: 300, x: 86, y: 84 },
  { label: 'MODEL', width: 340, x: 66, y: 134 },
  { label: 'RUNTIME', width: 280, x: 96, y: 184 },
  { label: 'SURFACE', width: 320, x: 76, y: 234 },
];

function layerPolygon(x: number, y: number, width: number, height = 34) {
  const depthX = 28;
  const depthY = -16;
  return {
    front: `${x},${y} ${x + width},${y} ${x + width},${y + height} ${x},${y + height}`,
    rear: `${x + depthX},${y + depthY} ${x + width + depthX},${y + depthY} ${x + width + depthX},${y + height + depthY} ${x + depthX},${y + height + depthY}`,
    spine: `M ${x} ${y} L ${x + depthX} ${y + depthY} M ${x + width} ${y} L ${x + width + depthX} ${y + depthY} M ${x + width} ${y + height} L ${x + width + depthX} ${y + height + depthY}`,
  };
}

export default function TechAnimation({ isActive }: { isActive: boolean }) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const id = useId();
  const scanId = `tech-scan-${id.replace(/:/g, '')}`;

  return (
    <div className="relative h-full w-full opacity-55" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 480 320" fill="none">
        <defs>
          <linearGradient id={scanId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="48%" stopColor="var(--color-ink)" stopOpacity="0.58" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M 28 280 L 154 34 L 454 34" stroke="var(--color-ink)" strokeOpacity="0.08" strokeDasharray="8 10" />

        {layers.map((layer, index) => {
          const polygon = layerPolygon(layer.x, layer.y, layer.width);
          return (
            <motion.g
              key={layer.label}
              initial={{ opacity: 0.7, x: 0 }}
              animate={
                isActive && !prefersReducedMotion
                  ? { x: [0, index % 2 ? -4 : 5, 0], opacity: [0.54, 0.88, 0.54] }
                  : { x: 0, opacity: 0.7 }
              }
              transition={{ duration: 8 + index, repeat: Infinity, delay: index * 0.35, ease: 'easeInOut' }}
            >
              <polygon points={polygon.rear} fill="var(--color-ink)" opacity="0.02" stroke="var(--color-ink)" strokeOpacity="0.14" strokeDasharray="7 6" />
              <polygon points={polygon.front} fill="transparent" stroke="var(--color-ink)" strokeOpacity="0.22" />
              <path d={polygon.spine} stroke="var(--color-ink)" strokeOpacity="0.13" />
              <text x={layer.x + 14} y={layer.y + 23} fill="var(--color-ink)" fillOpacity="0.42" fontSize="9" letterSpacing="3" fontFamily="monospace">
                {layer.label}
              </text>
            </motion.g>
          );
        })}

        <motion.path
          d="M 78 101 L 392 85 L 112 151 L 430 134 L 104 201 L 386 185 L 90 251 L 418 234"
          stroke={`url(#${scanId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="74 460"
          initial={{ strokeDashoffset: 0 }}
          animate={
            isActive && !prefersReducedMotion
              ? { strokeDashoffset: [0, -534] }
              : { strokeDashoffset: 0 }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {Array.from({ length: 5 }, (_, index) => (
          <motion.circle
            key={index}
            cx={118 + index * 64}
            cy={264 - (index % 2) * 26}
            r="3"
            fill="var(--color-ink)"
            fillOpacity="0.3"
            initial={{ opacity: 0.24, y: 0 }}
            animate={
              isActive && !prefersReducedMotion
                ? { opacity: [0.16, 0.5, 0.16], y: [0, -8, 0] }
                : { opacity: 0.24, y: 0 }
            }
            transition={{ duration: 4.5, repeat: Infinity, delay: index * 0.55, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  );
}
