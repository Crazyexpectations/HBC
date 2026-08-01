import { useEffect, useState } from 'react';

// Matches touch-primary / narrow-viewport devices so we can dial back heavy
// 3D + particle work and swap hover interactions for tap interactions.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse), (max-width: 768px)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
