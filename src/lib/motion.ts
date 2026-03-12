import type { MotionProps, Transition, Variants } from 'motion/react';

export const EASE_STANDARD = [0.16, 1, 0.3, 1] as const;
export const EASE_FLIP = [0.2, 0.9, 0.24, 1] as const;

export const SPRING_FLIP: Transition = {
  type: 'spring',
  stiffness: 170,
  damping: 22,
  mass: 0.92,
};

export const FLIP_LAYOUT_TRANSITION = {
  layout: SPRING_FLIP,
} satisfies MotionProps['transition'];

export const FLIP_LAYOUT_PROPS = {
  layout: true,
  transition: FLIP_LAYOUT_TRANSITION,
} satisfies Pick<MotionProps, 'layout' | 'transition'>;

export const FLIP_LAYOUT_SCROLL_PROPS = {
  layout: true,
  layoutScroll: true,
  transition: FLIP_LAYOUT_TRANSITION,
} satisfies Pick<MotionProps, 'layout' | 'layoutScroll' | 'transition'>;

export const PAGE_CURTAIN_TRANSITION: Transition = {
  duration: 0.88,
  ease: EASE_FLIP,
};

export const PAGE_CONTENT_TRANSITION: Transition = {
  duration: 0.72,
  ease: EASE_STANDARD,
};

export const REVEAL_ITEM_TRANSITION: Transition = {
  duration: 0.72,
  ease: EASE_STANDARD,
};

export const REVEAL_RULE_TRANSITION: Transition = {
  duration: 0.7,
  ease: EASE_FLIP,
};

export const inViewViewport = {
  once: true,
  margin: '-100px',
} as const;

export const revealGroupVariants: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
};

export const revealItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: REVEAL_ITEM_TRANSITION,
  },
};

export const revealRuleVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0.24,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: REVEAL_RULE_TRANSITION,
  },
};
