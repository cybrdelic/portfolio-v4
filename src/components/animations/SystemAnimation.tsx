import { MotionValue, motion, useReducedMotion, useTransform } from 'motion/react';
import { useId } from 'react';

type SystemAnimationProps = {
  isActive: boolean;
  scrollProgress: MotionValue<number>;
};

const planes = [
  { height: 116, label: 'INPUT', width: 220, x: 110, y: 98 },
  { height: 132, label: 'STATE', width: 256, x: 146, y: 156 },
  { height: 102, label: 'OUTPUT', width: 198, x: 86, y: 226 },
];

const nodes = [
  [154, 132],
  [248, 112],
  [336, 174],
  [304, 266],
  [182, 296],
  [132, 222],
];

function planePath(x: number, y: number, width: number, height: number, depth = 26) {
  const right = x + width;
  const bottom = y + height;
  const dx = depth;
  const dy = -depth * 0.58;

  return {
    connectors: [
      `M ${x} ${y} L ${x + dx} ${y + dy}`,
      `M ${right} ${y} L ${right + dx} ${y + dy}`,
      `M ${right} ${bottom} L ${right + dx} ${bottom + dy}`,
      `M ${x} ${bottom} L ${x + dx} ${bottom + dy}`,
    ].join(' '),
    front: `${x},${y} ${right},${y} ${right},${bottom} ${x},${bottom}`,
    rear: `${x + dx},${y + dy} ${right + dx},${y + dy} ${right + dx},${bottom + dy} ${x + dx},${bottom + dy}`,
  };
}

export default function SystemAnimation({
  isActive,
  scrollProgress,
}: SystemAnimationProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const id = useId();
  const scanId = `system-scan-${id.replace(/:/g, '')}`;
  const y = useTransform(scrollProgress, [0, 1], [-24, 24]);
  const rotate = useTransform(scrollProgress, [0, 1], [-5, 5]);
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [0.94, 1.04, 0.98]);

  return (
    <div className="relative flex h-full w-full items-center justify-center opacity-60" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 480 480" fill="none">
        <defs>
          <linearGradient id={scanId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0.56" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g style={{ y, rotate, scale, originX: '50%', originY: '50%' }}>
          {planes.map((plane, index) => {
            const path = planePath(plane.x, plane.y, plane.width, plane.height);
            return (
              <motion.g
                key={`${plane.x}-${plane.y}`}
                initial={{ opacity: 0.7, x: 0 }}
                animate={
                  isActive && !prefersReducedMotion
                    ? { opacity: [0.55, 0.92, 0.55], x: [0, index % 2 ? -5 : 5, 0] }
                    : { opacity: 0.7, x: 0 }
                }
                transition={{ duration: 9 + index * 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <polygon points={path.rear} fill="var(--color-ink)" opacity="0.022" stroke="var(--color-ink)" strokeOpacity="0.16" strokeDasharray="8 7" />
                <polygon points={path.front} fill="transparent" stroke="var(--color-ink)" strokeOpacity="0.18" />
                <path d={path.connectors} stroke="var(--color-ink)" strokeOpacity="0.12" strokeDasharray="4 6" />
                <path
                  d={`M ${plane.x + 18} ${plane.y + 26} L ${plane.x + plane.width - 22} ${plane.y + 26} M ${plane.x + 18} ${plane.y + plane.height - 24} L ${plane.x + plane.width - 58} ${plane.y + plane.height - 24}`}
                  stroke="var(--color-ink)"
                  strokeOpacity="0.1"
                  strokeDasharray="1 8"
                />
                <text
                  x={plane.x + 18}
                  y={plane.y + 50}
                  fill="var(--color-ink)"
                  fillOpacity="0.34"
                  fontFamily="monospace"
                  fontSize="10"
                  letterSpacing="4"
                >
                  {plane.label}
                </text>
              </motion.g>
            );
          })}

          <motion.path
            d="M 132 222 L 154 132 L 248 112 L 336 174 L 304 266 L 182 296 Z"
            stroke={`url(#${scanId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="76 360"
            initial={{ strokeDashoffset: 0 }}
            animate={
              isActive && !prefersReducedMotion
                ? { strokeDashoffset: [0, -436] }
                : { strokeDashoffset: 0 }
            }
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          {nodes.map(([cx, cy], index) => (
            <motion.g
              key={`${cx}-${cy}`}
              initial={{ opacity: 0.44, y: 0 }}
              animate={
                isActive && !prefersReducedMotion
                  ? { opacity: [0.28, 0.74, 0.28], y: [0, -3, 0] }
                  : { opacity: 0.44, y: 0 }
              }
              transition={{ duration: 5.8, repeat: Infinity, delay: index * 0.42, ease: 'easeInOut' }}
            >
              <circle cx={cx} cy={cy} r="3.4" fill="var(--color-ink)" fillOpacity="0.52" />
              <path d={`M ${cx - 12} ${cy + 8} L ${cx} ${cy} L ${cx + 18} ${cy - 10}`} stroke="var(--color-ink)" strokeOpacity="0.16" />
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
