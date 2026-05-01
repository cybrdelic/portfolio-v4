import { useEffect, useState, type CSSProperties } from 'react';
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

type ViewportState = {
  height: number;
  width: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pointer, setPointer] = useState<PointerState>({ x: -200, y: -200 });
  const [fieldTarget, setFieldTarget] = useState<FieldTarget | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({ height: 900, width: 1440 });

  useEffect(() => {
    if (!canUseFinePointer) {
      setIsVisible(false);
      setFieldTarget(null);
      document.documentElement.style.removeProperty('--field-x');
      document.documentElement.style.removeProperty('--field-y');
      return;
    }

    let frame = 0;
    let scrollTimeout = 0;
    let nextPointer: PointerState = { x: -200, y: -200 };

    const flush = () => {
      frame = 0;
      const { x, y } = nextPointer;
      const element =
        x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight
          ? document.elementFromPoint(x, y)
          : null;

      pressureX.set(x);
      pressureY.set(y);
      setPointer({ x, y });
      setFieldTarget(getFieldTarget(element));
      document.documentElement.style.setProperty('--field-x', `${x}px`);
      document.documentElement.style.setProperty('--field-y', `${y}px`);
    };

    const scheduleFlush = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(flush);
      }
    };

    const updateViewport = () => {
      setViewport({ height: window.innerHeight, width: window.innerWidth });
      scheduleFlush();
    };

    const handlePointerMove = (event: PointerEvent) => {
      nextPointer = { x: event.clientX, y: event.clientY };
      setIsVisible(true);
      scheduleFlush();
    };

    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => setIsScrolling(false), 140);
      scheduleFlush();
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

    updateViewport();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('resize', updateViewport);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.clearTimeout(scrollTimeout);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('scroll', handleScroll);
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
  const isLargeSurface = rect
    ? rect.width > viewport.width * 0.62 && rect.height > viewport.height * 0.62
    : false;
  let projectionRect = null;

  if (rect && !isLargeSurface) {
    projectionRect = {
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    };
  }

  if (rect && isLargeSurface) {
    const patchWidth = 220;
    const patchHeight = 124;
    projectionRect = {
      height: patchHeight,
      left: Math.max(24, Math.min(pointer.x - patchWidth / 2, viewport.width - patchWidth - 24)),
      top:
        pointer.y > viewport.height * 0.58
          ? Math.max(24, pointer.y - patchHeight - 34)
          : Math.min(pointer.y + 34, viewport.height - patchHeight - 24),
      width: patchWidth,
    };
  }
  const right = projectionRect ? projectionRect.left + projectionRect.width : 0;
  const bottom = projectionRect ? projectionRect.top + projectionRect.height : 0;
  const centerX = projectionRect ? projectionRect.left + projectionRect.width / 2 : 0;
  const centerY = projectionRect ? projectionRect.top + projectionRect.height / 2 : 0;
  const depthX = projectionRect ? Math.min(34, Math.max(18, projectionRect.width * 0.05)) : 0;
  const depthY = projectionRect ? -Math.min(24, Math.max(14, projectionRect.height * 0.06)) : 0;
  const routeBreakX = projectionRect ? (pointer.x < centerX ? projectionRect.left - depthX : right + depthX) : 0;
  const routeBreakY = projectionRect ? centerY + depthY : 0;
  const cornerLength = projectionRect
    ? Math.min(26, Math.max(14, projectionRect.width * 0.08))
    : 0;
  const nearPlane = projectionRect
    ? `${projectionRect.left},${projectionRect.top} ${right},${projectionRect.top} ${right},${bottom} ${projectionRect.left},${bottom}`
    : '';
  const farPlane = projectionRect
    ? `${projectionRect.left + depthX},${projectionRect.top + depthY} ${right + depthX},${projectionRect.top + depthY} ${right + depthX},${bottom + depthY} ${projectionRect.left + depthX},${bottom + depthY}`
    : '';
  const pressureDepth = isActive ? 0.82 : fieldTarget ? 1.24 : 1;
  const readoutX =
    projectionRect && !isLargeSurface
      ? clamp(
          projectionRect.left < viewport.width * 0.56 ? right + 14 : projectionRect.left - 224,
          18,
          viewport.width - 220
        )
      : clamp(pointer.x - 92, 18, viewport.width - 220);
  const readoutY =
    projectionRect && !isLargeSurface
      ? clamp(projectionRect.top > viewport.height - 220 ? projectionRect.top - 84 : bottom + 14, 18, viewport.height - 92)
      : pointer.y > viewport.height - 128
        ? Math.max(18, pointer.y - 96)
        : Math.min(pointer.y + 18, viewport.height - 88);
  const readoutStyle = {
    left: readoutX,
    top: readoutY,
    '--readout-depth-x': `${depthX || 18}px`,
    '--readout-depth-y': `${depthY || -14}px`,
    '--readout-depth-rise': `${Math.abs(depthY || -14)}px`,
    '--readout-depth-angle': `${Math.atan2(depthY || -14, depthX || 18)}rad`,
    '--readout-edge-length': `${Math.hypot(depthX || 18, depthY || -14)}px`,
  } as CSSProperties;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[96]">
      <motion.div
        className="field-pressure"
        style={{ x: springX, y: springY }}
        animate={{
          opacity: isVisible ? (fieldTarget ? (isScrolling ? 0.36 : 0.5) : 0.18) : 0,
          scale: isScrolling && fieldTarget ? 1.08 : pressureDepth,
        }}
        transition={{ duration: 0.18 }}
      />

      <motion.div
        className={`field-axes${fieldTarget ? ' field-axes--target' : ''}`}
        style={{ x: springX, y: springY }}
        animate={{
          opacity: isVisible ? (fieldTarget ? 0.62 : 0.32) : 0,
          scale: fieldTarget ? 1 : 0.78,
        }}
        transition={{ duration: 0.16 }}
      />

      <motion.div
        className={[
          'field-core',
          fieldTarget ? 'field-core--target' : '',
          isScrolling ? 'field-core--scrolling' : '',
        ].filter(Boolean).join(' ')}
        style={{ x: springX, y: springY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isActive ? 0.78 : fieldTarget ? 1.08 : 0.92,
        }}
        transition={{ duration: 0.14 }}
      />

      {projectionRect && isVisible && (
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <motion.polygon
            points={farPlane}
            className="field-plane field-plane--rear"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.16 : isLargeSurface ? 0.2 : 0.34 }}
          />
          <motion.polygon
            points={nearPlane}
            className="field-plane field-plane--front"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.48 : isLargeSurface ? 0.34 : 0.52 }}
          />
          <line
            x1={projectionRect.left}
            y1={projectionRect.top}
            x2={projectionRect.left + depthX}
            y2={projectionRect.top + depthY}
            className="field-depth-line"
          />
          <line
            x1={right}
            y1={projectionRect.top}
            x2={right + depthX}
            y2={projectionRect.top + depthY}
            className="field-depth-line"
          />
          <line
            x1={right}
            y1={bottom}
            x2={right + depthX}
            y2={bottom + depthY}
            className="field-depth-line"
          />
          <line
            x1={projectionRect.left}
            y1={bottom}
            x2={projectionRect.left + depthX}
            y2={bottom + depthY}
            className="field-depth-line field-depth-line--soft"
          />
          <path
            d={[
              `M ${projectionRect.left} ${projectionRect.top + cornerLength} L ${projectionRect.left} ${projectionRect.top} L ${projectionRect.left + cornerLength} ${projectionRect.top}`,
              `M ${right - cornerLength} ${projectionRect.top} L ${right} ${projectionRect.top} L ${right} ${projectionRect.top + cornerLength}`,
              `M ${right} ${bottom - cornerLength} L ${right} ${bottom} L ${right - cornerLength} ${bottom}`,
              `M ${projectionRect.left + cornerLength} ${bottom} L ${projectionRect.left} ${bottom} L ${projectionRect.left} ${bottom - cornerLength}`,
            ].join(' ')}
            className="field-corners"
          />
          <motion.path
            d={`M ${pointer.x} ${pointer.y} L ${routeBreakX} ${routeBreakY} L ${projectionRect.left + depthX} ${projectionRect.top + depthY}`}
            className="field-route field-route--iso"
            initial={false}
          />
          <motion.path
            d={`M ${pointer.x} ${pointer.y} L ${routeBreakX} ${routeBreakY} L ${right + depthX} ${bottom + depthY}`}
            className="field-route field-route--soft"
            initial={false}
          />
        </svg>
      )}

      {fieldTarget && isVisible && (
        <motion.div
          className="field-readout"
          style={readoutStyle}
          initial={false}
          animate={{ opacity: isActive ? 0.55 : 1, y: isActive ? 2 : 0 }}
        >
          <div className="field-readout-panel">
            <div className="field-readout-surface">
              <span>{isScrolling ? 'resample' : fieldTarget.kind}</span>
              <strong>{fieldTarget.label}</strong>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
