import { motion } from 'motion/react';

export default function SystemAnimation() {
  const gridSize = 12;
  const spacing = 16;
  const offset = (200 - (gridSize - 1) * spacing) / 2;
  
  const dots = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      dots.push({ x, y });
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center opacity-40">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Network Lines */}
        {dots.map((dot, i) => {
          const cx = offset + dot.x * spacing;
          const cy = offset + dot.y * spacing;
          const distFromCenter = Math.sqrt(Math.pow(dot.x - 5.5, 2) + Math.pow(dot.y - 5.5, 2));
          
          const lines = [];
          if (dot.x < gridSize - 1) {
            lines.push(
              <motion.line
                key={`h-${i}`}
                x1={cx} y1={cy} x2={cx + spacing} y2={cy}
                stroke="var(--color-ink)"
                strokeWidth="0.5"
                initial={{ opacity: 0.05 }}
                animate={{ opacity: [0.05, 0.3, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: distFromCenter * 0.2 }}
              />
            );
          }
          if (dot.y < gridSize - 1) {
            lines.push(
              <motion.line
                key={`v-${i}`}
                x1={cx} y1={cy} x2={cx} y2={cy + spacing}
                stroke="var(--color-ink)"
                strokeWidth="0.5"
                initial={{ opacity: 0.05 }}
                animate={{ opacity: [0.05, 0.3, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: distFromCenter * 0.2 }}
              />
            );
          }
          if (dot.x < gridSize - 1 && dot.y < gridSize - 1 && (dot.x + dot.y) % 2 === 0) {
             lines.push(
              <motion.line
                key={`d-${i}`}
                x1={cx} y1={cy} x2={cx + spacing} y2={cy + spacing}
                stroke="var(--color-ink)"
                strokeWidth="0.5"
                initial={{ opacity: 0.05 }}
                animate={{ opacity: [0.05, 0.2, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: distFromCenter * 0.2 }}
              />
            );
          }
          return lines;
        })}

        {/* Nodes */}
        {dots.map((dot, i) => {
          const cx = offset + dot.x * spacing;
          const cy = offset + dot.y * spacing;
          const distFromCenter = Math.sqrt(Math.pow(dot.x - 5.5, 2) + Math.pow(dot.y - 5.5, 2));
          
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={cx}
              cy={cy}
              r="1.5"
              fill="var(--color-ink)"
              initial={{ opacity: 0.1, r: 1 }}
              animate={{ 
                opacity: [0.1, 0.8, 0.1],
                r: [1, 2.5, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: distFromCenter * 0.2
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
