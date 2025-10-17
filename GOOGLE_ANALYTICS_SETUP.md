# Google Analytics Setup Guide

## Overview
Google Analytics has been successfully integrated into your SeniorCare+ website. This guide will help you complete the setup.

## What's Been Added

### 1. Analytics Library (`src/lib/analytics.ts`)
- Google Analytics 4 (GA4) integration
- Page view tracking
- Custom event tracking functions
- User interaction tracking
- Form submission tracking
- Conversion tracking

### 2. React Component (`src/components/GoogleAnalytics.tsx`)
- Automatic page view tracking on route changes
- Integration with React Router

### 3. App Integration
- GoogleAnalytics component added to your main App component
- Works alongside your existing Vercel Analytics

## Setup Instructions

### Step 1: Get Your Google Analytics Tracking ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Configure Environment Variable

Create a `.env` file in your project root and add:

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID.

### Step 3: Deploy

1. Add the environment variable to your deployment platform (Vercel, Netlify, etc.)
2. Redeploy your application

## Available Tracking Functions

You can use these functions throughout your app to track specific events:

```typescript
import { 
  trackEvent, 
  trackUserInteraction, 
  trackFormSubmission, 
  trackButtonClick, 
  trackNavigation, 
  trackConversion 
} from '@/lib/analytics';

// Track custom events
trackEvent('purchase', 'E-commerce', 'Premium Plan', 99);

// Track user interactions
trackUserInteraction('click', 'Contact Button');

// Track form submissions
trackFormSubmission('Contact Form');

// Track button clicks
trackButtonClick('Get Started');

// Track navigation
trackNavigation('/pricing');

// Track conversions
trackConversion('Registration', 1);
```

## Example Usage in Components

```typescript
import { trackButtonClick, trackFormSubmission } from '@/lib/analytics';

const ContactForm = () => {
  const handleSubmit = (data) => {
    trackFormSubmission('Contact Form');
    // ... rest of your form logic
  };

  const handleButtonClick = () => {
    trackButtonClick('Contact Submit');
    // ... rest of your button logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={handleButtonClick}>Submit</button>
    </form>
  );
};
```

## What's Tracked Automatically

- **Page Views**: Every route change is automatically tracked
- **User Sessions**: Standard GA4 session tracking
- **User Demographics**: If available
- **Traffic Sources**: Referrers, search terms, etc.
- **Device Information**: Mobile, desktop, tablet usage

## Privacy Considerations

- Google Analytics respects user privacy settings
- Consider adding a cookie consent banner if required by your jurisdiction
- The implementation follows Google's recommended practices

## Testing

1. Set up your tracking ID
2. Deploy your application
3. Visit your website
4. Check Google Analytics Real-Time reports to see if data is being received

## Troubleshooting

- Ensure your tracking ID is correctly set in the environment variable
- Check browser console for any errors
- Verify the tracking ID format (should start with 'G-')
- Make sure the environment variable is available in your deployment environment

## Support

If you need help with Google Analytics setup or have questions about the implementation, refer to the [Google Analytics Help Center](https://support.google.com/analytics/).
