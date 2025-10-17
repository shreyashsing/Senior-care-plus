// Google Analytics configuration
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (GA_TRACKING_ID && typeof window !== 'undefined') {
    // Load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Configure Google Analytics
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (GA_TRACKING_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (GA_TRACKING_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user interactions
export const trackUserInteraction = (interaction: string, element?: string) => {
  trackEvent(interaction, 'User Interaction', element);
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'Form', formName);
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent('click', 'Button', buttonName);
};

// Track navigation
export const trackNavigation = (destination: string) => {
  trackEvent('navigation', 'Navigation', destination);
};

// Track conversions (for business goals)
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', 'Business', conversionType, value);
};
