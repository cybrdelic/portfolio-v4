import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import useFinePointer from '../hooks/useFinePointer';

export default function CustomCursor() {
  const canUseFinePointer = useFinePointer();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 1000, damping: 40, mass: 0.1 });
  const cursorY = useSpring(mouseY, { stiffness: 1000, damping: 40, mass: 0.1 });
  const ringX = useSpring(mouseX, { stiffness: 250, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 250, damping: 20, mass: 0.5 });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsEnabled(canUseFinePointer);

    if (!canUseFinePointer) {
      document.body.classList.remove('has-custom-cursor');
      setIsHovering(false);
      setIsVisible(false);
      setIsActive(false);
      return;
    }

    document.body.classList.add('has-custom-cursor');
    setIsVisible(true);

    const updateMousePosition = (event: PointerEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setIsHovering(
        target.tagName.toLowerCase() === 'a' ||
          target.tagName.toLowerCase() === 'button' ||
          Boolean(
            target.closest('a') ||
            target.closest('button') ||
            target.closest('[data-interactive="true"]')
          )
      );
    };

    const handlePointerDown = () => setIsActive(true);
    const handlePointerUp = () => setIsActive(false);
    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);
    const handleWindowBlur = () => {
      setIsVisible(false);
      setIsActive(false);
    };
    const handleWindowFocus = () => setIsVisible(true);

    window.addEventListener('pointermove', updateMousePosition, { passive: true });
    window.addEventListener('pointerover', handlePointerOver);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', updateMousePosition);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [canUseFinePointer, mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-ink)] rounded-full pointer-events-none z-[100] will-change-transform"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isActive ? 0.65 : isHovering ? 2.1 : 1,
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40, mass: 0.1 }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-muted)] rounded-full pointer-events-none z-[99] opacity-30 will-change-transform"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isActive ? 0.8 : isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      />
    </>
  );
}
