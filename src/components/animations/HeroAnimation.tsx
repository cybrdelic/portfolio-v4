import { motion } from 'motion/react';

export default function HeroAnimation() {
  const gridSize = 45;
  const spacing = 6;
  const points = [];
  
  for (let x = 0; x < gridSize; x++) {
    points[x] = [];
    for (let y = 0; y < gridSize; y++) {
      const cx = x - gridSize / 2;
      const cy = y - gridSize / 2;
      
      // Procedural topological surface (simulating terrain/data mesh)
      const dist = Math.sqrt(cx * cx + cy * cy);
      const z = 
        Math.cos(dist * 0.25) * 12 + 
        Math.sin(cx * 0.3) * Math.cos(cy * 0.3) * 8 -
        (dist * dist * 0.04); 
        
      // Isometric projection
      const isoX = (cx - cy) * Math.cos(Math.PI / 6) * spacing;
      const isoY = (cx + cy) * Math.sin(Math.PI / 6) * spacing - z;
      
      points[x][y] = { x: isoX, y: isoY };
    }
  }

  // Generate wireframe paths
  let pathD = "";
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize - 1; y++) {
      pathD += `M ${points[x][y].x.toFixed(2)},${points[x][y].y.toFixed(2)} L ${points[x][y+1].x.toFixed(2)},${points[x][y+1].y.toFixed(2)} `;
    }
  }
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize - 1; x++) {
      pathD += `M ${points[x][y].x.toFixed(2)},${points[x][y].y.toFixed(2)} L ${points[x+1][y].x.toFixed(2)},${points[x+1][y].y.toFixed(2)} `;
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center opacity-80">
      <svg className="w-full h-full" viewBox="-200 -150 400 300">
        <motion.g
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Base wireframe */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="var(--color-ink)" 
            strokeWidth="0.3" 
            opacity="0.4" 
          />
        </motion.g>
      </svg>
    </div>
  );
}
