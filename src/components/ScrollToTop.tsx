import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    // Use scrollTo with options for better browser support
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll for route changes
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;