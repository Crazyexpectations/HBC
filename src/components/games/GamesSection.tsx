import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import Reveal from '../layout/Reveal';
import MemoryMatchGame from './MemoryMatchGame';
import WishList from './WishList';
import { riseIn } from '../../lib/motion';
import { GAMES_HEADING } from '../../content';

// No roaming cat in this section on purpose — it would wander over the game
// cards and get in the way of actually playing.
export default function GamesSection() {
  return (
    <Section id="games" tone="warm" density="natural" label="Games" className="gap-14">
      <SectionHeading
        eyebrow={GAMES_HEADING.eyebrow}
        title={GAMES_HEADING.title}
        sub={GAMES_HEADING.sub}
      />

      {/* Stacked rather than side-by-side. Two dense interactive panels sitting
          shoulder to shoulder made both feel cramped and forced a hard choice
          about which to look at first; in sequence each gets full attention. */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col gap-16">
        <Reveal variants={riseIn(30)}>
          <MemoryMatchGame />
        </Reveal>
        <Reveal variants={riseIn(30)}>
          <WishList />
        </Reveal>
      </div>
    </Section>
  );
}
