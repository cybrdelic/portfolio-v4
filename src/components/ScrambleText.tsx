import { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function ScrambleText({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    if (!isInView) return;
    
    let iteration = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    
    interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if (letter === ' ') {
          return letter;
        }
        if (index < iteration) {
          return text[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1;
    }, 22);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [text, isInView, prefersReducedMotion]);

  return <span ref={ref} className={className}>{displayText}</span>;
}
