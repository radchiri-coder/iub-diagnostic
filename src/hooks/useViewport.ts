import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 640;

export function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    isMobile: width < MOBILE_BREAKPOINT,
    isDesktop: width >= MOBILE_BREAKPOINT,
  };
}
