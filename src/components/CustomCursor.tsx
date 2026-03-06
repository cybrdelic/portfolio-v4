import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with a fine pointer (mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-interactive="true"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible && mousePosition.x === -100) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-ink)] rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isActive ? 0.5 : isHovering ? 3 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-ink)] rounded-full pointer-events-none z-[99] mix-blend-difference opacity-30"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isActive ? 0.8 : isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
      />
    </>
  );
}
