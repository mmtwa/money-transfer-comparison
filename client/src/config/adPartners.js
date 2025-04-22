/**
 * Ad Partners Configuration
 * 
 * This file centralizes all ad partner definitions, making it easy to:
 * - Add new ad partners
 * - Configure campaign dates
 * - Define asset paths for different screen sizes
 * - Set priorities for ad rotation
 */

const adPartners = {
  // Default fallback ad (always available)
  default: {
    name: 'Default Campaign',
    active: true,
    priority: 0, // Lowest priority
    assets: {
      mobile: {
        src: '/mobile-ad.jpg',
        width: 640,
        height: 1200
      },
      tablet: {
        src: '/tablet-ad.jpg',
        width: 1024,
        height: 1200
      },
      desktop: {
        src: '/desktop-ad.jpg',
        width: 1920,
        height: 1080
      }
    },
    // Additional metadata if needed
    metadata: {
      altText: 'Money Transfer Services',
      trackingId: 'default-campaign'
    }
  },
  
  // BA campaign
  ba: {
    name: 'BA',
    active: true,
    startDate: null, // No start date - always active
    endDate: null,   // No end date - always active
    priority: 10,    // Higher priority than default
    assets: {
      mobile: {
        src: '/partners/ba/mobile.webp', 
        width: 640,
        height: 1200
      },
      tablet: {
        src: '/partners/ba/tablet.webp', 
        width: 1024,
        height: 1200
      },
      desktop: {
        src: '/partners/ba/desktop.webp', 
        width: 1920,
        height: 1080
      }
    },
    metadata: {
      altText: 'BA Advertisement',
      trackingId: 'ba-2023'
    }
  },
  
  /* Example template for adding new partners
  ,partner1: {
    name: 'Partner Name',
    active: true,
    startDate: '2023-06-01',
    endDate: '2023-07-01',
    priority: 10,
    assets: {
      mobile: {
        src: '/partners/partner1/mobile.webp',
        width: 640,
        height: 1200
      },
      tablet: {
        src: '/partners/partner1/tablet.webp',
        width: 1024,
        height: 1200
      },
      desktop: {
        src: '/partners/partner1/desktop.webp',
        width: 1920,
        height: 1080
      }
    },
    metadata: {
      altText: 'Partner 1 Campaign',
      linkUrl: 'https://partner1.com',
      trackingId: 'partner1-summer-2023'
    }
  }
  */
};

export default adPartners; 