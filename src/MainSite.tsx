import ScrollProgressBar from './components/ui/ScrollProgressBar';
import HeroSection from './components/hero/HeroSection';
import MemoriesSection from './components/memories/MemoriesSection';
import LetterSection from './components/letter/LetterSection';
import ReasonsSection from './components/reasons/ReasonsSection';
import GamesSection from './components/games/GamesSection';
import CakeSection from './components/cake/CakeSection';
import SurpriseSection from './components/surprise/SurpriseSection';
import EndingSection from './components/ending/EndingSection';

// The full scrollable story, in order. Section `tone`s run arrival → inside →
// warm → lit → dawn → close, so the background travels from deep night to
// first light as you scroll rather than repeating one gradient eight times.
export default function MainSite() {
  return (
    <>
      <a href="#memories" className="skip-link">
        Skip to the photos
      </a>
      <ScrollProgressBar />
      <main id="main" className="relative w-full">
        <HeroSection />
        <MemoriesSection />
        <LetterSection />
        <ReasonsSection />
        <GamesSection />
        <CakeSection />
        <SurpriseSection />
        <EndingSection />
      </main>
    </>
  );
}
