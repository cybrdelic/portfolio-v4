import { motion } from 'motion/react';

const columns = Array.from({ length: 18 }, (_, index) => ({
  x: 24 + index * 24,
  height: 88 + ((index * 17) % 92),
  opacity: 0.08 + ((index * 7) % 10) * 0.018,
}));

const traces = [
  'M 18 198 C 64 170, 114 150, 164 166 S 262 224, 328 210 S 394 164, 462 176',
  'M 18 128 C 86 120, 132 136, 182 126 S 286 86, 346 100 S 408 138, 462 132',
  'M 18 262 C 70 252, 124 220, 174 230 S 268 286, 334 274 S 406 226, 462 236',
];

export default function TechAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative h-full w-full opacity-45" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 480 320" fill="none">
        <defs>
          <linearGradient id="tech-scan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="18" y="18" width="444" height="284" stroke="var(--color-line)" strokeOpacity="0.7" />
        <rect x="42" y="42" width="396" height="236" stroke="var(--color-ink)" strokeOpacity="0.1" />

        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={`h-${index}`}
            x1="18"
            y1={58 + index * 40}
            x2="462"
            y2={58 + index * 40}
            stroke="var(--color-ink)"
            strokeOpacity="0.06"
          />
        ))}

        {columns.map((column) => (
          <line
            key={column.x}
            x1={column.x}
            y1={300}
            x2={column.x}
            y2={300 - column.height}
            stroke="var(--color-ink)"
            strokeWidth="1.2"
            strokeOpacity={column.opacity}
          />
        ))}

        {traces.map((trace, index) => (
          <motion.path
            key={trace}
            d={trace}
            stroke="url(#tech-scan)"
            strokeWidth={index === 1 ? 2.2 : 1.8}
            strokeLinecap="round"
            strokeDasharray="72 240"
            strokeOpacity="0.72"
            animate={
              isActive
                ? {
                    strokeDashoffset: [0, -312],
                  }
                : undefined
            }
            transition={
              isActive
                ? {
                    duration: 11 + index * 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.7,
                  }
                : undefined
            }
          />
        ))}

        <motion.rect
          x="30"
          y="26"
          width="420"
          height="20"
          fill="var(--color-ink)"
          fillOpacity="0.04"
          animate={
            isActive
              ? {
                  y: [26, 274, 26],
                }
              : undefined
          }
          transition={
            isActive
              ? {
                  duration: 18,
                  repeat: Infinity,
                  ease: 'linear',
                }
              : undefined
          }
        />
      </svg>
    </div>
  );
}
