import ScrollProgressBar from './components/ui/ScrollProgressBar';
import HeroSection from './components/hero/HeroSection';
import LetterSection from './components/letter/LetterSection';
import MemoriesSection from './components/memories/MemoriesSection';
import VideoSection from './components/video/VideoSection';
import ReasonsSection from './components/reasons/ReasonsSection';
import GamesSection from './components/games/GamesSection';
import CakeSection from './components/cake/CakeSection';
import SurpriseSection from './components/surprise/SurpriseSection';
import EndingSection from './components/ending/EndingSection';

// The full scrollable story, in order. Section `tone`s run arrival → inside →
// warm → lit → dawn → close, so the background travels from deep night to
// first light as you scroll rather than repeating one gradient nine times.
//
// The letter comes first, before the photos: it's the reason the page exists,
// and it's what the rest of the page is written around. The photos read as
// what she's just been told about, rather than as a preamble to it.
export default function MainSite() {
  return (
    <>
      <a href="#letter" className="skip-link">
        Skip to the letter
      </a>
      <ScrollProgressBar />
      <main id="main" className="relative w-full">
        <HeroSection />
        <LetterSection />
        <MemoriesSection />
        <VideoSection />
        <ReasonsSection />
        <GamesSection />
        <CakeSection />
        <SurpriseSection />
        <EndingSection />
      </main>
    </>
  );
}
