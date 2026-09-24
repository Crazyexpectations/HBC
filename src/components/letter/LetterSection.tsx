import { useState } from 'react';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import RosePetals from './RosePetals';
import Envelope from './Envelope';
import RoamingCat from '../cats/RoamingCat';
import { LETTER } from '../../content';

export default function LetterSection() {
  const [opened, setOpened] = useState(false);

  return (
    // Closed, this is one centred envelope and deserves the whole viewport.
    // Open, it's the longest thing on the page — `full` would vertically
    // centre a sheet several screens tall and strand the first lines
    // somewhere below the fold.
    <Section
      id="letter"
      tone="inside"
      density={opened ? 'natural' : 'full'}
      label="A letter for you"
    >
      <RosePetals />
      {/* The cat wanders off once the letter is open — it's charming over an
          envelope and a distraction over four screens of reading. */}
      {!opened && <RoamingCat palette="cream" size={38} startDelay={3} />}

      <SectionHeading
        eyebrow={LETTER.eyebrow}
        title={LETTER.title}
        variant="script"
        className="mb-12"
      />

      <Envelope onExpand={() => setOpened(true)} />
    </Section>
  );
}
