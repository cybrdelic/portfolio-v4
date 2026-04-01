import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const BOOT_SEQUENCE_STORAGE_KEY = 'boot-sequence-seen';
const SEQUENCE = [
  'INIT_SYSTEM_KERNEL...',
  'LOADING_MODULES [OK]',
  'MOUNTING_VFS [OK]',
  'ESTABLISHING_NEURAL_LINK...',
  'SYNCING_TOPOLOGY_DATA...',
  'CALIBRATING_SENSORS [OK]',
  'SYSTEM_READY.',
];

export default function BootSequence({ onComplete }: { onComplete?: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const completionNotifiedRef = useRef(false);

  const notifyComplete = () => {
    if (completionNotifiedRef.current) return;
    completionNotifiedRef.current = true;
    onComplete?.();
  };

  const close = () => {
    localStorage.setItem(BOOT_SEQUENCE_STORAGE_KEY, '1');
    setIsVisible(false);
    notifyComplete();
  };

  useEffect(() => {
    if (prefersReducedMotion || localStorage.getItem(BOOT_SEQUENCE_STORAGE_KEY) === '1') {
      setLogs(SEQUENCE);
      setIsVisible(false);
      notifyComplete();
      return;
    }

    let currentIndex = 0;
    let exitTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleSkip = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    const interval = setInterval(() => {
      if (currentIndex < SEQUENCE.length) {
        setLogs((prev) => [...prev, SEQUENCE[currentIndex]]);
        currentIndex += 1;
        return;
      }

      clearInterval(interval);
      exitTimeout = setTimeout(close, 400);
    }, 150);

    window.addEventListener('keydown', handleSkip);

    return () => {
      clearInterval(interval);
      if (exitTimeout) {
        clearTimeout(exitTimeout);
      }
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col justify-end p-8 md:p-12 font-mono text-xs md:text-sm text-[var(--color-muted)]"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={close}
        >
          <div className="max-w-3xl">
            {logs.map((log, index) => (
              <motion.div
                key={index}
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
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[var(--color-line)]">
              Click or press Escape to skip
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
