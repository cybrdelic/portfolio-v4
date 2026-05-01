import { MouseEvent, ReactElement, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import useFinePointer from '../hooks/useFinePointer';

interface MagneticProps {
  children: ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.2 }: MagneticProps) {
  const canUseFinePointer = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canUseFinePointer) return;
    if (!ref.current) return;

    const { clientX, clientY } = event;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{
        position: 'relative',
        display: 'inline-block',
        x: canUseFinePointer ? springX : 0,
        y: canUseFinePointer ? springY : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
