import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&_.:/-';
const DURATION = 750;

export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(text);
      return;
    }
    if (!isInView) return;

    let start = 0;
    const chars = text.split('');

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / DURATION, 1);
      const lockedCount = Math.round(progress * chars.length);

      setDisplay(
        chars
          .map((ch, i) => {
            if (/[\s\-—&]/.test(ch)) return ch;
            if (i < lockedCount) return ch;
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join(''),
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, text, prefersReducedMotion]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
