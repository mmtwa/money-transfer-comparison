# Ad Partners Implementation Guide

This document explains how to manage homepage takeover ads for Money Transfer Comparison's unique funding model.

## Overview

Our homepage uses full-screen background ads from different partners, which are displayed behind the currency search form. This creates an advertising space that doesn't compromise user experience while providing value to partners.

Key features:
- Responsive ads that adapt to mobile, tablet, and desktop screens
- Scheduling system for timed campaigns
- Optimized image loading for performance
- Tracking system for impressions and interactions
- WebP image support for better compression

## Directory Structure

Ad assets are organized as follows:

```
/public
  /mobile-ad.jpg   # Default mobile ad
  /tablet-ad.jpg   # Default tablet ad
  /desktop-ad.jpg  # Default desktop ad
  /partners
    /partner1
      /mobile.jpg  # Partner-specific mobile ad
      /mobile.webp # WebP version (better performance)
      /tablet.jpg  # Partner-specific tablet ad 
      /tablet.webp # WebP version
      /desktop.jpg # Partner-specific desktop ad
      /desktop.webp # WebP version
    /partner2
      ...
```

## Adding a New Ad Partner

### 1. Using the Automated Tool

We've created a tool to streamline the process:

```bash
cd client
npm run create-ad-partner partner-id "Partner Display Name"
```

This will:
- Create necessary directories
- Generate placeholder images
- Update the configuration file

### 2. Manual Process

If you prefer to add partners manually:

1. Create a new directory in `/public/partners/[partner-id]`
2. Add appropriately sized images:
   - Mobile: 640×1200px
   - Tablet: 1024×1200px
   - Desktop: 1920×1080px
3. Update the configuration in `src/config/adPartners.js`

## Converting Images to WebP

For optimal performance, convert your JPG images to WebP format:

```bash
cd client
npm install sharp --save-dev  # First time only
npm run convert-webp partner-id
```

This will:
- Convert all JPG files in the partner's directory to WebP format
- Maintain the optimal quality (80%)
- Handle filename standardization

### Naming Conventions

The converter will automatically handle these naming conversions:
- `desktop-ad.jpg` → `desktop.webp`
- `mobile-ad.jpg` → `mobile.webp`
- `tablet-ad.jpg` → `tablet.webp`

For other files, it simply changes the extension.

## Removing a Partner

To remove a partner and all associated files:

```bash
cd client
npm run remove-ad-partner partner-id
```

This will:
- Delete the partner's directory and all files
- Remove the partner from the configuration file

## Configuration Options

In `src/config/adPartners.js`, each partner has several configuration options:

```javascript
partnerId: {
  name: 'Partner Name',
  active: true,              // Enable/disable this partner
  startDate: '2023-06-01',   // Campaign start date (optional, null for always active)
  endDate: '2023-07-01',     // Campaign end date (optional, null for no end date)
  priority: 10,              // Higher number = higher priority
  assets: {
    // Image assets for each screen size
    mobile: { src: '/partners/partnerId/mobile.webp', width: 640, height: 1200 },
    tablet: { src: '/partners/partnerId/tablet.webp', width: 1024, height: 1200 },
    desktop: { src: '/partners/partnerId/desktop.webp', width: 1920, height: 1080 },
  },
  metadata: {
    altText: 'Partner Advertisement',   // Accessibility text
    linkUrl: 'https://partner.com',     // Optional click-through URL
    trackingId: 'partner-campaign-id',  // For analytics
  }
}
```

## Best Practices

1. **Image Optimization**
   - Use WebP format when possible (with JPG fallback)
   - Compress images appropriately (80% quality is usually sufficient)
   - Ensure correct dimensions for each breakpoint

2. **Design Considerations**
   - Leave space for the currency search form (centered on mobile/tablet, left-aligned on desktop)
   - Use appropriate contrast so the search form remains visible
   - Consider how the ad will look on different screen sizes

3. **Performance**
   - Always convert images to WebP format using the provided tools
   - Keep file sizes as small as possible while maintaining quality
   - Test loading times, especially on mobile devices

4. **Campaign Management**
   - Set appropriate start/end dates and priorities
   - For permanent partners, set both dates to `null`
   - Archive old campaigns by setting `active: false` rather than deleting them
   - Test new campaigns before they go live

## Troubleshooting

### Images Not Displaying

1. Check that the WebP files exist and aren't empty placeholders
2. Verify the file paths in the configuration match the actual files
3. Make sure the partner is marked as `active: true`
4. Ensure the campaign dates are valid or set to `null`
5. Check that the priority is higher than the default (0)

### Using JPG Instead of WebP

If you need to use JPG files temporarily:
1. Update the file paths in `src/config/adPartners.js` to point to your JPG files
2. Convert to WebP when possible for better performance

## Tracking and Analytics

Ad impressions and clicks are automatically tracked in Google Analytics:

- `ad_impression`: Fired when an ad is displayed
- `ad_click`: Fired when a clickable ad is clicked

These events include the `ad_partner` parameter to identify which partner was shown. 