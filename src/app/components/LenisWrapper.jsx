'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

// Routes where Lenis smooth scroll should be DISABLED.
// Form pages use step-based absolute positioning that confuses
// Lenis's scroll-height calculation, making native scroll stop working.
const DISABLE_LENIS_PREFIXES = [
  '/client-form',
  '/consultant-form',
  '/credit-consultant',
  '/dispute-expert',
];

export default function LenisWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const shouldDisable = DISABLE_LENIS_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (shouldDisable) {
      // Ensure native scroll is not blocked on form routes
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
