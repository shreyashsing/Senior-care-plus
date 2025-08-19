import { useState, useEffect } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  startOffset?: number;
  endOffset?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const { threshold = 0.5, startOffset = 0, endOffset = 0 } = options;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress (0 to 1)
      const maxScroll = documentHeight - windowHeight;
      const currentProgress = Math.max(0, Math.min(1, scrollTop / maxScroll));
      
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getElementScrollProgress = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;

    // Calculate when element enters and exits viewport
    const elementStart = windowHeight - startOffset;
    const elementEnd = -elementHeight + endOffset;
    
    // Calculate progress (0 to 1) as element scrolls through viewport
    const progress = Math.max(0, Math.min(1, 
      (elementStart - elementTop) / (elementStart - elementEnd)
    ));

    return progress;
  };

  return {
    scrollProgress,
    isInView,
    getElementScrollProgress,
  };
};
