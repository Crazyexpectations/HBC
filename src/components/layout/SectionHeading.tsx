import Reveal from './Reveal';
import { riseIn, stagger } from '../../lib/motion';

interface Props {
  eyebrow?: string;
  title: string;
  /** Small line under the title. */
  sub?: string;
  /** Optional pill-style nudge ("tap a card"), rendered last. */
  hint?: string;
  align?: 'center' | 'left';
  /** `script` swaps the serif display face for the handwritten one — used to
   *  break up the rhythm so eight sections don't all announce themselves the
   *  same way. */
  variant?: 'display' | 'script';
  className?: string;
  /** Renders as h1 instead of h2 (hero only). */
  as?: 'h1' | 'h2';
}

/**
 * The one heading used by every scene.
 *
 * Previously each section inlined its own eyebrow + <h2> + subtitle block with
 * an identical fade — same size, same glow, same timing, eight times over.
 * Centralising it means the page has a consistent voice, and the `variant` /
 * `align` props give sections a way to differ that is deliberate rather than
 * accidental drift.
 */
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  hint,
  align = 'center',
  variant = 'display',
  className = '',
  as = 'h2',
}: Props) {
  const Tag = as;
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <Reveal
      variants={stagger(0.1)}
      className={`relative z-10 flex flex-col ${alignment} ${className}`}
    >
      {eyebrow && (
        <Reveal variants={riseIn(14)} as="p" className="eyebrow mb-3 text-rose-light/75">
          {eyebrow}
        </Reveal>
      )}

      <Reveal variants={riseIn(22)}>
        {variant === 'script' ? (
          <Tag className="font-script gold-glow text-[length:var(--text-step-3)] leading-[1.05] text-gold-soft">
            {title}
          </Tag>
        ) : (
          <Tag className="heading-section text-glow text-cream">{title}</Tag>
        )}
      </Reveal>

      {sub && (
        <Reveal variants={riseIn(18)} as="p" className="measure mt-4 text-[length:var(--text-step-0)] text-cream/65">
          {sub}
        </Reveal>
      )}

      {hint && (
        <Reveal variants={riseIn(14)}>
          <span className="glass mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-step--1)] font-medium text-rose-light">
            {hint}
          </span>
        </Reveal>
      )}
    </Reveal>
  );
}
