import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import ReasonCard from './ReasonCard';
import RoamingCat from '../cats/RoamingCat';
import { REASONS, REASONS_HEADING } from '../../content';

export default function ReasonsSection() {
  return (
    <Section id="reasons" tone="inside" density="natural" label={REASONS_HEADING.title}>
      <RoamingCat palette="ginger" size={40} startDelay={4} />

      <SectionHeading
        eyebrow={REASONS_HEADING.eyebrow}
        title={REASONS_HEADING.title}
        sub={REASONS_HEADING.sub}
        className="mb-14"
      />

      {/* Asymmetric grid: the first card spans two columns on wide screens so
          the block reads as a composed layout rather than a uniform 4×2 tile
          wall — the same fix as the section rhythm, one level down. */}
      <div className="relative z-10 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <ReasonCard key={r.title} index={i} featured={i === 0} {...r} />
        ))}
      </div>
    </Section>
  );
}
