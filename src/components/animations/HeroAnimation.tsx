import { motion } from 'motion/react';

const gridSize = 45;
const spacing = 6;
const points: Array<Array<{ x: number; y: number }>> = [];

for (let x = 0; x < gridSize; x += 1) {
  points[x] = [];
  for (let y = 0; y < gridSize; y += 1) {
    const cx = x - gridSize / 2;
    const cy = y - gridSize / 2;
    const dist = Math.sqrt(cx * cx + cy * cy);
    const z =
      Math.cos(dist * 0.25) * 12 +
      Math.sin(cx * 0.3) * Math.cos(cy * 0.3) * 8 -
      (dist * dist * 0.04);
    const isoX = (cx - cy) * Math.cos(Math.PI / 6) * spacing;
    const isoY = (cx + cy) * Math.sin(Math.PI / 6) * spacing - z;

    points[x][y] = { x: isoX, y: isoY };
  }
}

let pathD = '';

for (let x = 0; x < gridSize; x += 1) {
  for (let y = 0; y < gridSize - 1; y += 1) {
    pathD += `M ${points[x][y].x.toFixed(2)},${points[x][y].y.toFixed(2)} L ${points[x][y + 1].x.toFixed(2)},${points[x][y + 1].y.toFixed(2)} `;
  }
}

for (let y = 0; y < gridSize; y += 1) {
  for (let x = 0; x < gridSize - 1; x += 1) {
    pathD += `M ${points[x][y].x.toFixed(2)},${points[x][y].y.toFixed(2)} L ${points[x + 1][y].x.toFixed(2)},${points[x + 1][y].y.toFixed(2)} `;
  }
}

export default function HeroAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center opacity-55" aria-hidden="true">
      <svg className="w-full h-full" viewBox="-200 -150 400 300">
        <motion.g
          animate={
            isActive
              ? {
                  x: [-4, 4, -4],
                  y: [-2, 2, -2],
                  opacity: [0.24, 0.34, 0.24],
                }
              : { x: 0, y: 0, opacity: 0.28 }
          }
          transition={
            isActive
              ? { duration: 18, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.3"
            opacity="0.34"
          />
        </motion.g>
      </svg>
    </div>
  );
}
