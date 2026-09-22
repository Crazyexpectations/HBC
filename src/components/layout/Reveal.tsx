import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { reduceVariants, riseIn, VIEWPORT } from '../../lib/motion';

interface Props {
  children: ReactNode;
  /** Defaults to the site's standard rise-into-place entrance. */
  variants?: Variants;
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Animate on mount instead of on scroll — for above-the-fold content. */
  immediate?: boolean;
  style?: React.CSSProperties;
}

/**
 * Declarative scroll-reveal wrapper. Every entrance on the page goes through
 * here, which is what makes prefers-reduced-motion a single switch rather
 * than an audit of every `motion.div` in the codebase.
 */
export default function Reveal({
  children,
  variants,
  delay = 0,
  className = '',
  as = 'div',
  immediate = false,
  style,
}: Props) {
  const reduced = useReducedMotion();
  const base = variants ?? riseIn(28, delay);
  const resolved = reduceVariants(base, reduced);
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      variants={resolved}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT })}
    >
      {children}
    </MotionTag>
  );
}
