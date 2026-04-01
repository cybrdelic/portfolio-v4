import { motion } from 'motion/react';

export type AnimatedLogoPhase = 'logo' | 'compact' | 'targets' | 'hidden';
export type AnimatedLogoTarget = {
  fillPath: string;
  strokePath: string;
  strokeWidth: number;
};
export type AnimatedLogoTargets = Partial<Record<string, AnimatedLogoTarget>>;

type LogoPiece = {
  fillPhasePaths: Record<Exclude<AnimatedLogoPhase, 'hidden'>, string>;
  id: string;
  strokePhasePaths: Record<Exclude<AnimatedLogoPhase, 'hidden'>, string>;
  strokeWidths: Record<Exclude<AnimatedLogoPhase, 'hidden'>, number>;
};

const MORPH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DRAW_STAGGER_MS = 0.1;
const DRAW_DURATION_S = 1.05;

function parseSimpleLine(path: string) {
  const match = path.match(/M\s*([-\d.]+)\s+([-\d.]+)\s+L\s*([-\d.]+)\s+([-\d.]+)/u);
  if (!match) {
    return null;
  }

  return {
    x1: Number(match[1]),
    y1: Number(match[2]),
    x2: Number(match[3]),
    y2: Number(match[4]),
  };
}

function buildCompactFromTarget(target: AnimatedLogoTarget) {
  const line = parseSimpleLine(target.strokePath);
  if (!line) {
    return null;
  }

  const centerX = (line.x1 + line.x2) / 2;
  const centerY = (line.y1 + line.y2) / 2;
  const factor = 0.18;
  const x1 = centerX + (line.x1 - centerX) * factor;
  const y1 = centerY + (line.y1 - centerY) * factor;
  const x2 = centerX + (line.x2 - centerX) * factor;
  const y2 = centerY + (line.y2 - centerY) * factor;
  const strokeWidth = Math.max(target.strokeWidth * 2.1, 9);
  const isVertical = Math.abs(line.x1 - line.x2) < Math.abs(line.y1 - line.y2);
  const fillPath = isVertical
    ? `M ${x1 - strokeWidth / 2} ${y1} L ${x1 + strokeWidth / 2} ${y1} L ${x2 + strokeWidth / 2} ${y2} L ${x2 - strokeWidth / 2} ${y2} Z`
    : `M ${x1} ${y1 - strokeWidth / 2} L ${x2} ${y2 - strokeWidth / 2} L ${x2} ${y2 + strokeWidth / 2} L ${x1} ${y1 + strokeWidth / 2} Z`;

  return {
    fillPath,
    strokePath: `M ${x1} ${y1} L ${x2} ${y2}`,
    strokeWidth,
  };
}

const logoPieces: LogoPiece[] = [
  {
    fillPhasePaths: {
      compact:
        'M 216 246 C 216 334 216 426 216 544 L 244 544 C 244 426 244 334 244 246 Z',
      logo:
        'M 485 250 C 380 400 300 550 280 640 C 350 580 450 400 485 250 Z',
      targets:
        'M 90 172 C 90 356 90 586 90 842 L 94 842 C 94 586 94 356 94 172 Z',
    },
    id: 'left-leg',
    strokePhasePaths: {
      compact: 'M 230 246 C 230 334 230 426 230 544',
      logo: 'M 485 250 C 380 400 300 550 280 640',
      targets: 'M 92 172 C 92 356 92 586 92 842',
    },
    strokeWidths: {
      compact: 44,
      logo: 60,
      targets: 8,
    },
  },
  {
    fillPhasePaths: {
      compact:
        'M 500 290 C 582 290 664 290 746 290 C 786 290 826 290 866 290 C 902 290 930 290 954 290 L 954 318 C 930 318 902 318 866 318 C 826 318 786 318 746 318 C 664 318 582 318 500 318 Z',
      logo:
        'M 485 250 C 450 400 430 520 440 580 C 445 600 465 590 480 580 C 580 530 680 510 760 500 C 680 505 580 535 470 555 C 455 560 450 540 455 520 C 475 420 490 320 485 250 Z',
      targets:
        'M 544 248 C 632 248 714 248 798 248 C 836 248 870 248 902 248 C 920 248 938 248 956 248 L 956 256 C 938 256 920 256 902 256 C 870 256 836 256 798 256 C 714 256 632 256 544 256 Z',
    },
    id: 'right-leg',
    strokePhasePaths: {
      compact:
        'M 500 304 C 582 304 664 304 746 304 C 786 304 826 304 866 304 C 902 304 930 304 954 304',
      logo:
        'M 485 250 C 450 400 430 520 440 580 C 445 600 465 590 480 580 C 580 530 680 510 760 500',
      targets:
        'M 544 252 C 632 252 714 252 798 252 C 836 252 870 252 902 252 C 920 252 938 252 956 252',
    },
    strokeWidths: {
      compact: 40,
      logo: 60,
      targets: 8,
    },
  },
  {
    fillPhasePaths: {
      compact: 'M 240 246 L 216 468 L 244 468 L 268 246 Z',
      logo: 'M 495 375 L 475 540 L 500 530 L 525 370 Z',
      targets: 'M 118 172 L 114 476 L 122 476 L 126 172 Z',
    },
    id: 'f-stem',
    strokePhasePaths: {
      compact: 'M 242 246 L 242 468',
      logo: 'M 510 370 L 485 540',
      targets: 'M 120 172 L 120 476',
    },
    strokeWidths: {
      compact: 34,
      logo: 50,
      targets: 8,
    },
  },
  {
    fillPhasePaths: {
      compact:
        'M 244 232 C 364 232 484 232 642 232 L 642 260 C 484 260 364 260 244 260 Z',
      logo:
        'M 490 370 C 550 360 600 355 660 350 C 600 365 550 375 510 385 Z',
      targets:
        'M 120 168 C 300 168 474 168 714 168 L 714 176 C 474 176 300 176 120 176 Z',
    },
    id: 'top-bar',
    strokePhasePaths: {
      compact: 'M 244 246 C 364 246 484 246 642 246',
      logo: 'M 490 370 C 550 360 600 355 660 350',
      targets: 'M 120 172 C 300 172 474 172 714 172',
    },
    strokeWidths: {
      compact: 30,
      logo: 40,
      targets: 8,
    },
  },
  {
    fillPhasePaths: {
      compact:
        'M 286 684 C 456 684 626 684 846 684 L 846 712 C 626 712 456 712 286 712 Z',
      logo:
        'M 250 580 C 350 520 450 470 600 435 C 450 490 350 550 255 595 Z',
      targets:
        'M 120 816 C 392 816 658 816 940 816 L 940 824 C 658 824 392 824 120 824 Z',
    },
    id: 'crossbar',
    strokePhasePaths: {
      compact: 'M 286 698 C 456 698 626 698 846 698',
      logo: 'M 250 580 C 350 520 450 470 600 435',
      targets: 'M 120 820 C 392 820 658 820 940 820',
    },
    strokeWidths: {
      compact: 30,
      logo: 40,
      targets: 8,
    },
  },
];

export default function AnimatedLogo({
  className,
  opacity = 1,
  phase = 'logo',
  targets,
}: {
  className?: string;
  opacity?: number;
  phase?: AnimatedLogoPhase;
  targets?: AnimatedLogoTargets;
}) {
  const resolvedPhase = phase === 'hidden' ? 'targets' : phase;
  const resolvedPieceOpacity =
    phase === 'logo'
      ? 1
      : phase === 'compact'
        ? 0.92
        : phase === 'targets'
          ? 0.44
          : 0;
  const resolvedFillOpacity =
    phase === 'logo'
      ? 1
      : phase === 'compact'
        ? 0.82
        : phase === 'targets'
          ? 0.12
          : 0;
  const resolvedTraceOpacity =
    phase === 'logo'
      ? 0.96
      : phase === 'compact'
        ? 0.3
        : phase === 'targets'
          ? 0.12
          : 0;
  const resolvedTargets = targets;
  const useViewportCompactFrame = phase === 'compact' && Boolean(resolvedTargets);
  const frameTransform =
    phase === 'logo'
      ? {
          height: 'min(24rem, 42vw)',
          left: '50%',
          top: '50%',
          width: 'min(24rem, 42vw)',
          x: '-50%',
          y: '-50%',
        }
      : phase === 'compact'
        ? useViewportCompactFrame
          ? {
              height: '100%',
              left: '0%',
              top: '0%',
              width: '100%',
              x: '0%',
              y: '0%',
            }
          : {
              height: 'min(18rem, 24vw)',
              left: '50%',
              top: '31%',
              width: 'min(30rem, 44vw)',
              x: '-50%',
              y: '-50%',
            }
        : {
            height: '100%',
            left: '0%',
            top: '0%',
            width: '100%',
            x: '0%',
            y: '0%',
          };
  const preserveAspectRatio =
    phase === 'logo' || (phase === 'compact' && !useViewportCompactFrame) ? 'xMidYMid meet' : 'none';
  const logoEntranceTransform =
    phase === 'logo'
      ? {
          clipPath: 'inset(0% 0% 0% 0% round 0rem)',
          rotate: '0deg',
          scale: 1,
          x: '0%',
          y: '0%',
        }
      : phase === 'compact'
        ? useViewportCompactFrame
          ? {
              clipPath: 'inset(0% 0% 0% 0% round 0rem)',
              rotate: '0deg',
              scale: 1,
              x: '0%',
              y: '0%',
            }
          : {
              clipPath: 'inset(5% 12% 20% 12% round 1.5rem)',
              rotate: '0deg',
              scale: 0.94,
              x: '0%',
              y: '0%',
            }
        : phase === 'targets'
          ? {
              clipPath: 'inset(0% 0% 0% 0% round 0rem)',
              rotate: '0deg',
              scale: 1,
              x: '0%',
              y: '0%',
            }
          : {
              clipPath: 'inset(48% 48% 48% 48% round 999px)',
              rotate: '0deg',
              scale: 0.82,
              x: '0%',
              y: '0%',
            };

  return (
    <motion.div
      className={className}
      initial={false}
      animate={frameTransform}
      transition={{
        height: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
        left: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
        top: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
        width: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
        x: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
        y: {
          duration: 1.02,
          ease: MORPH_EASE,
        },
      }}
      style={{ opacity }}
    >
      <motion.div
        className="h-full w-full origin-center overflow-hidden"
        initial={{
          clipPath: 'inset(36% 36% 36% 36% round 999px)',
          rotate: '-14deg',
          scale: 0.72,
          x: '0%',
          y: '4%',
        }}
        animate={logoEntranceTransform}
        transition={{
          clipPath: {
            duration: 1.02,
            ease: MORPH_EASE,
          },
          rotate: {
            duration: 1.02,
            ease: MORPH_EASE,
          },
          scale: {
            duration: 1.02,
            ease: MORPH_EASE,
          },
          x: {
            duration: 1.02,
            ease: MORPH_EASE,
          },
          y: {
            duration: 1.02,
            ease: MORPH_EASE,
          },
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio={preserveAspectRatio}
          className="h-full w-full"
          fill="none"
        >
          <defs>
            {logoPieces.map((piece, index) => (
              <mask id={`mask-${piece.id}`} key={piece.id}>
                {(() => {
                  const target = resolvedTargets?.[piece.id];
                  const compactTarget = target ? buildCompactFromTarget(target) : null;
                  const strokePath =
                    resolvedPhase === 'targets'
                      ? target?.strokePath ?? piece.strokePhasePaths.targets
                      : resolvedPhase === 'compact'
                        ? compactTarget?.strokePath ?? piece.strokePhasePaths.compact
                      : piece.strokePhasePaths[resolvedPhase];
                  const strokeWidth =
                    resolvedPhase === 'targets'
                      ? target?.strokeWidth ?? piece.strokeWidths.targets
                      : resolvedPhase === 'compact'
                        ? compactTarget?.strokeWidth ?? piece.strokeWidths.compact
                      : piece.strokeWidths[resolvedPhase];
                  return (
                <motion.path
                  d={piece.strokePhasePaths.logo}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                  initial={{
                    d: piece.strokePhasePaths.logo,
                    opacity: 0,
                    pathLength: 0,
                    strokeWidth: piece.strokeWidths.logo,
                  }}
                  animate={{
                    d: strokePath,
                    opacity: phase === 'hidden' ? 0 : 1,
                    pathLength: 1,
                    strokeWidth,
                  }}
                  transition={{
                    d: {
                      duration: 1.02,
                      ease: MORPH_EASE,
                    },
                    opacity:
                      phase === 'hidden'
                        ? {
                            duration: 0.2,
                            ease: MORPH_EASE,
                          }
                        : {
                            delay: index * DRAW_STAGGER_MS,
                            duration: 0.01,
                          },
                    pathLength: {
                      bounce: 0,
                      delay: index * DRAW_STAGGER_MS,
                      duration: DRAW_DURATION_S,
                      type: 'spring' as const,
                    },
                    strokeWidth: {
                      duration: 1.02,
                      ease: MORPH_EASE,
                    },
                  }}
                />
                  );
                })()}
              </mask>
            ))}
          </defs>

          <g
            fill="#141414"
            style={{
              filter: phase === 'logo' ? 'drop-shadow(0px 15px 20px rgba(0,0,0,0.2))' : 'none',
            }}
          >
            {logoPieces.map((piece, index) => (
              (() => {
                const target = resolvedTargets?.[piece.id];
                const compactTarget = target ? buildCompactFromTarget(target) : null;
                const fillPath =
                  resolvedPhase === 'targets'
                    ? compactTarget?.fillPath ?? target?.fillPath ?? piece.fillPhasePaths.compact
                    : resolvedPhase === 'compact'
                      ? compactTarget?.fillPath ?? piece.fillPhasePaths.compact
                    : piece.fillPhasePaths[resolvedPhase];
                return (
              <motion.path
                key={piece.id}
                mask={`url(#mask-${piece.id})`}
                d={piece.fillPhasePaths.logo}
                initial={{
                  d: piece.fillPhasePaths.logo,
                  opacity: phase === 'logo' ? 0 : 1,
                }}
                animate={{
                  d: fillPath,
                  opacity: resolvedFillOpacity,
                }}
                transition={{
                  d: {
                    duration: resolvedPhase === 'targets' ? 0.12 : 0.78,
                    ease: MORPH_EASE,
                  },
                  opacity: {
                    delay: phase === 'logo' ? 0.14 + index * 0.05 : 0,
                    duration: phase === 'hidden' ? 0.16 : phase === 'logo' ? 0.42 : 0.18,
                    ease: MORPH_EASE,
                  },
                }}
              />
                );
              })()
            ))}
          </g>

          <g
            fill="none"
            stroke="#161616"
            style={{
              mixBlendMode: phase === 'logo' ? 'multiply' : 'normal',
            }}
          >
            {logoPieces.map((piece, index) => (
              (() => {
                const target = resolvedTargets?.[piece.id];
                const compactTarget = target ? buildCompactFromTarget(target) : null;
                const strokePath =
                  resolvedPhase === 'targets'
                    ? target?.strokePath ?? piece.strokePhasePaths.targets
                    : resolvedPhase === 'compact'
                      ? compactTarget?.strokePath ?? piece.strokePhasePaths.compact
                      : piece.strokePhasePaths[resolvedPhase];
                const strokeWidth =
                  resolvedPhase === 'targets'
                    ? target?.strokeWidth ?? piece.strokeWidths.targets
                    : resolvedPhase === 'compact'
                      ? compactTarget?.strokeWidth ?? piece.strokeWidths.compact
                      : piece.strokeWidths[resolvedPhase];

                return (
                  <motion.path
                    key={`${piece.id}-trace`}
                    d={piece.strokePhasePaths.logo}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{
                      d: piece.strokePhasePaths.logo,
                      opacity: 0,
                      pathLength: 0,
                      strokeWidth: Math.max(piece.strokeWidths.logo * 0.1, 2.6),
                    }}
                    animate={{
                      d: strokePath,
                      opacity: phase === 'hidden' ? 0 : resolvedTraceOpacity,
                      pathLength: 1,
                      strokeWidth: Math.max(strokeWidth * 0.11, phase === 'targets' ? 1.25 : 2.6),
                    }}
                    transition={{
                      d: {
                        duration: 1.02,
                        ease: MORPH_EASE,
                      },
                      opacity:
                        phase === 'hidden'
                          ? {
                              duration: 0.18,
                              ease: MORPH_EASE,
                            }
                          : {
                              delay: index * DRAW_STAGGER_MS,
                              duration: 0.2,
                              ease: MORPH_EASE,
                            },
                      pathLength: {
                        delay: index * DRAW_STAGGER_MS,
                        duration: DRAW_DURATION_S,
                        ease: MORPH_EASE,
                      },
                      strokeWidth: {
                        duration: 1.02,
                        ease: MORPH_EASE,
                      },
                    }}
                  />
                );
              })()
            ))}
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
