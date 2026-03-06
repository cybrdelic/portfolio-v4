import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BootSequence() {
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "INIT_SYSTEM_KERNEL...",
      "LOADING_MODULES [OK]",
      "MOUNTING_VFS [OK]",
      "ESTABLISHING_NEURAL_LINK...",
      "SYNCING_TOPOLOGY_DATA...",
      "CALIBRATING_SENSORS [OK]",
      "SYSTEM_READY."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        setLogs(prev => [...prev, sequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsVisible(false), 400);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col justify-end p-8 md:p-12 font-mono text-xs md:text-sm text-[var(--color-muted)]"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-3xl">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1"
              >
                {`> ${log}`}
              </motion.div>
            ))}
            <motion.div 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-[var(--color-ink)] mt-2"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
