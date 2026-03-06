import { motion } from 'motion/react';

export default function TechAnimation() {
  const bars = Array.from({ length: 32 });
  
  return (
    <div className="relative w-full h-full flex items-end justify-between px-4 pb-4 opacity-40">
      {bars.map((_, i) => {
        const heightBase = 20 + Math.random() * 30;
        const heightMax = heightBase + 20 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            className="w-1.5 bg-[var(--color-ink)] rounded-t-sm"
            animate={{
              height: [`${heightBase}%`, `${heightMax}%`, `${heightBase}%`],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05
            }}
          />
        );
      })}
      
      {/* Scanning Line */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-ink)] shadow-[0_0_10px_var(--color-ink)]"
        animate={{ left: ['0%', '100%', '0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
