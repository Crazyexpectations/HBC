import ScrollProgressBar from './components/ui/ScrollProgressBar';
import HeroSection from './components/hero/HeroSection';
import MemoriesSection from './components/memories/MemoriesSection';
import LetterSection from './components/letter/LetterSection';
import ReasonsSection from './components/reasons/ReasonsSection';
import CakeSection from './components/cake/CakeSection';
import SurpriseSection from './components/surprise/SurpriseSection';
import EndingSection from './components/ending/EndingSection';

// The full scrollable story, in order. Lenis (mounted in App via
// LenisProvider) smooth-scrolls through all of it.
export default function MainSite() {
  return (
    <main className="relative w-full">
      <ScrollProgressBar />
      <HeroSection />
      <MemoriesSection />
      <LetterSection />
      <ReasonsSection />
      <CakeSection />
      <SurpriseSection />
      <EndingSection />
    </main>
  );
}
