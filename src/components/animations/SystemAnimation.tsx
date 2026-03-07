import { MotionValue, motion, useTransform } from 'motion/react';

const center = 240;

const frameRings = [84, 132, 180];
const guideLines = Array.from({ length: 9 }, (_, index) => 72 + index * 42);
const nodes = [
  { x: 126, y: 142 },
  { x: 210, y: 104 },
  { x: 328, y: 132 },
  { x: 374, y: 222 },
  { x: 316, y: 330 },
  { x: 204, y: 364 },
  { x: 118, y: 302 },
  { x: 96, y: 214 },
];

const signalPaths = [
  `M 92 178 C 146 146, 198 136, 244 152 S 340 214, 390 188`,
  `M 108 296 C 172 274, 218 242, 266 248 S 334 288, 388 266`,
  `M 136 112 C 192 134, 244 200, 316 206 S 370 176, 392 130`,
];

type SystemAnimationProps = {
  isActive: boolean;
  scrollProgress: MotionValue<number>;
};

export default function SystemAnimation({
  isActive,
  scrollProgress,
}: SystemAnimationProps) {
  const backY = useTransform(scrollProgress, [0, 1], [-22, 18]);
  const midY = useTransform(scrollProgress, [0, 1], [-10, 12]);
  const frontY = useTransform(scrollProgress, [0, 1], [18, -18]);
  const backRotate = useTransform(scrollProgress, [0, 1], [-4, 4]);
  const frontRotate = useTransform(scrollProgress, [0, 1], [6, -6]);

  return (
    <div className="relative flex h-full w-full items-center justify-center opacity-50" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 480 480" fill="none">
        <defs>
          <linearGradient id="system-scan-soft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g style={{ y: backY, rotate: backRotate, originX: '50%', originY: '50%' }}>
          {frameRings.map((radius, index) => (
            <circle
              key={radius}
              cx={center}
              cy={center}
              r={radius}
              stroke="var(--color-ink)"
              strokeWidth={index === 0 ? 1.2 : 0.9}
              strokeOpacity={0.08 + index * 0.03}
              strokeDasharray={index === 1 ? '3 14' : '4 18'}
            />
          ))}

          {guideLines.map((position) => (
            <line
              key={`h-${position}`}
              x1="64"
              y1={position}
              x2="416"
              y2={position}
              stroke="var(--color-ink)"
              strokeWidth="0.6"
              strokeOpacity="0.06"
            />
          ))}

          {guideLines.map((position) => (
            <line
              key={`v-${position}`}
              x1={position}
              y1="64"
              x2={position}
              y2="416"
              stroke="var(--color-ink)"
              strokeWidth="0.6"
              strokeOpacity="0.06"
            />
          ))}
        </motion.g>

        <motion.g style={{ y: midY, originX: '50%', originY: '50%' }}>
          {signalPaths.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              stroke="url(#system-scan-soft)"
              strokeWidth={index === 1 ? 2.1 : 1.8}
              strokeLinecap="round"
              strokeDasharray="68 220"
              strokeOpacity="0.7"
              animate={
                isActive
                  ? {
                      strokeDashoffset: [0, -288],
                    }
                  : undefined
              }
              transition={
                isActive
                  ? {
                      duration: 12 + index * 2.5,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.8,
                    }
                  : undefined
              }
            />
          ))}

          <rect
            x="142"
            y="142"
            width="196"
            height="196"
            stroke="var(--color-ink)"
            strokeWidth="1"
            strokeOpacity="0.11"
          />
          <rect
            x="172"
            y="172"
            width="136"
            height="136"
            stroke="var(--color-ink)"
            strokeWidth="0.9"
            strokeOpacity="0.13"
            strokeDasharray="6 16"
          />
        </motion.g>

        <motion.g style={{ y: frontY, rotate: frontRotate, originX: '50%', originY: '50%' }}>
          {nodes.map((node, index) => (
            <motion.g
              key={`${node.x}-${node.y}`}
              animate={
                isActive
                  ? {
                      opacity: [0.28, 0.68, 0.34],
                    }
                  : undefined
              }
              transition={
                isActive
                  ? {
                      duration: 6.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.45,
                    }
                  : undefined
              }
            >
              <circle cx={node.x} cy={node.y} r="3.5" fill="var(--color-ink)" fillOpacity="0.72" />
              <circle cx={node.x} cy={node.y} r="10" stroke="var(--color-ink)" strokeOpacity="0.14" />
            </motion.g>
          ))}

          <path
            d="M 240 104 L 240 376 M 104 240 L 376 240"
            stroke="var(--color-ink)"
            strokeWidth="0.85"
            strokeOpacity="0.12"
          />
          <circle cx={center} cy={center} r="30" stroke="var(--color-ink)" strokeWidth="1.1" strokeOpacity="0.32" />
          <circle cx={center} cy={center} r="8" fill="var(--color-ink)" fillOpacity="0.2" />
        </motion.g>
      </svg>
    </div>
  );
}
