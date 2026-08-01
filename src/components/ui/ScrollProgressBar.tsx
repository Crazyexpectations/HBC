import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Thin progress bar across the very top of the page, tracking how far
// through the story the reader has scrolled.
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[500] h-[3px] w-full bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-rose via-rose-light to-gold"
        style={{ scaleX: progress, transformOrigin: 'left' }}
      />
    </div>
  );
}
