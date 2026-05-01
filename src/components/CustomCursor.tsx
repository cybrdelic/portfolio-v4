import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import useFinePointer from '../hooks/useFinePointer';

type FieldTarget = {
  kind: string;
  label: string;
  rect: DOMRect;
};

type PointerState = {
  x: number;
  y: number;
};

function getFieldTarget(target: EventTarget | null): FieldTarget | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const element = target.closest<HTMLElement>(
    '[data-field-target], a, button, [role="button"]'
  );

  if (!element) {
    return null;
  }

  const label =
    element.dataset.fieldLabel ||
    element.getAttribute('aria-label') ||
    element.textContent?.replace(/\s+/g, ' ').trim() ||
    'target';

  return {
    kind: element.dataset.fieldKind || 'route',
    label,
    rect: element.getBoundingClientRect(),
  };
}

export default function CustomCursor() {
  const canUseFinePointer = useFinePointer();
  const pressureX = useMotionValue(-200);
  const pressureY = useMotionValue(-200);
  const springX = useSpring(pressureX, { stiffness: 320, damping: 34, mass: 0.2 });
  const springY = useSpring(pressureY, { stiffness: 320, damping: 34, mass: 0.2 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pointer, setPointer] = useState<PointerState>({ x: -200, y: -200 });
  const [fieldTarget, setFieldTarget] = useState<FieldTarget | null>(null);

  useEffect(() => {
    if (!canUseFinePointer) {
      setIsVisible(false);
      setFieldTarget(null);
      document.documentElement.style.removeProperty('--field-x');
      document.documentElement.style.removeProperty('--field-y');
      return;
    }

    let frame = 0;
    let nextPointer: PointerState = { x: -200, y: -200 };
    let nextTarget: EventTarget | null = null;

    const flush = () => {
      frame = 0;
      const { x, y } = nextPointer;
      pressureX.set(x);
      pressureY.set(y);
      setPointer({ x, y });
      setFieldTarget(getFieldTarget(nextTarget));
      document.documentElement.style.setProperty('--field-x', `${x}px`);
      document.documentElement.style.setProperty('--field-y', `${y}px`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      nextPointer = { x: event.clientX, y: event.clientY };
      nextTarget = event.target;
      setIsVisible(true);

      if (!frame) {
        frame = window.requestAnimationFrame(flush);
      }
    };

    const handlePointerDown = () => setIsActive(true);
    const handlePointerUp = () => setIsActive(false);
    const handlePointerLeave = () => {
      setIsVisible(false);
      setFieldTarget(null);
    };
    const handlePointerEnter = () => setIsVisible(true);
    const handleWindowBlur = () => {
      setIsVisible(false);
      setIsActive(false);
      setFieldTarget(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', handleWindowBlur);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter);
      document.documentElement.style.removeProperty('--field-x');
      document.documentElement.style.removeProperty('--field-y');
    };
  }, [canUseFinePointer, pressureX, pressureY]);

  if (!canUseFinePointer) {
    return null;
  }

  const rect = fieldTarget?.rect;
  const centerX = rect ? rect.left + rect.width / 2 : 0;
  const centerY = rect ? rect.top + rect.height / 2 : 0;
  const readoutX = Math.min(pointer.x + 18, window.innerWidth - 220);
  const readoutY = Math.min(pointer.y + 18, window.innerHeight - 88);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[96]">
      <motion.div
        className="field-pressure"
        style={{ x: springX, y: springY }}
        animate={{
          opacity: isVisible ? (fieldTarget ? 0.42 : 0.18) : 0,
          scale: isActive ? 0.72 : fieldTarget ? 1.18 : 1,
        }}
        transition={{ duration: 0.18 }}
      />

      {rect && isVisible && (
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <motion.path
            d={`M ${pointer.x} ${pointer.y} L ${rect.left} ${centerY} L ${rect.left} ${rect.top}`}
            className="field-route"
            initial={false}
          />
          <motion.path
            d={`M ${pointer.x} ${pointer.y} L ${rect.right} ${centerY} L ${rect.right} ${rect.bottom}`}
            className="field-route field-route--soft"
            initial={false}
          />
          <motion.rect
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            className="field-frame"
            animate={{ opacity: isActive ? 0.9 : 0.58 }}
          />
        </svg>
      )}

      {fieldTarget && isVisible && (
        <motion.div
          className="field-readout"
          style={{ left: readoutX, top: readoutY }}
          initial={false}
          animate={{ opacity: isActive ? 0.55 : 1, y: isActive ? 2 : 0 }}
        >
          <span>{fieldTarget.kind}</span>
          <strong>{fieldTarget.label}</strong>
        </motion.div>
      )}
    </div>
  );
}
