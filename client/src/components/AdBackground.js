import React, { useState, useEffect } from 'react';
import { getAdPartners } from '../services/adService';

/**
 * AdBackground Component - Handles loading and displaying homepage ad backgrounds
 * 
 * Features:
 * - Lazy loading of images
 * - Preloads appropriate image size based on viewport
 * - Supports dynamic ad rotation for different partners
 * - Adapts to different screen sizes
 * - Uses WebP format when available for better performance
 */
const AdBackground = ({ currentAdPartner, adMetadata }) => {
  const [loaded, setLoaded] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  
  // Get the partner config or fall back to default
  const partners = getAdPartners();
  const partnerConfig = adMetadata || partners[currentAdPartner] || partners.default || {};
  
  // Determine viewport size on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setViewportSize('mobile');
      } else if (window.innerWidth < 768) {
        setViewportSize('tablet');
      } else {
        setViewportSize('desktop');
      }
    };
    
    // Set initial size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Preload the appropriate image when viewport size or partner changes
  useEffect(() => {
    const preloadImage = () => {
      // Safety check to ensure assets exist
      if (!partnerConfig.assets || !partnerConfig.assets[viewportSize]) {
        console.warn(`Missing assets for partner ${currentAdPartner} and viewport ${viewportSize}`);
        setLoaded(true); // Mark as loaded to avoid infinite loading
        return;
      }
      
      const asset = partnerConfig.assets[viewportSize];
      if (!asset || !asset.src) {
        console.warn(`Missing source for partner ${currentAdPartner} and viewport ${viewportSize}`);
        setLoaded(true); // Mark as loaded to avoid infinite loading
        return;
      }
      
      // Create image object to preload
      const img = new Image();
      img.src = asset.src;
      img.onload = () => setLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load image: ${asset.src}`);
        setLoaded(true); // Mark as loaded even on error to show something
      };
    };
    
    setLoaded(false); // Reset loaded state when changing images
    preloadImage();
  }, [viewportSize, currentAdPartner, partnerConfig]);
  
  // Safety check if no assets available
  if (!partnerConfig.assets) {
    return <div className="absolute inset-0 bg-gray-100"></div>;
  }
  
  // Get assets for each viewport size
  const mobileAsset = partnerConfig.assets?.mobile || {};
  const tabletAsset = partnerConfig.assets?.tablet || {};
  const desktopAsset = partnerConfig.assets?.desktop || {};
  
  // Handle click if ad is clickable
  const handleAdClick = () => {
    const linkUrl = partnerConfig.metadata?.linkUrl;
    if (linkUrl) {
      // Track click before navigation
      if (window.gtag) {
        window.gtag('event', 'ad_click', {
          ad_partner: currentAdPartner,
          page: 'homepage',
        });
      }
      
      // Open in new tab
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="absolute inset-0">
      {/* Mobile background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat block sm:hidden transition-opacity duration-300 ${loaded && viewportSize === 'mobile' ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: mobileAsset.src ? `url('${mobileAsset.src}')` : 'none' }}
        onClick={handleAdClick}
        role={partnerConfig.metadata?.linkUrl ? 'button' : undefined}
        aria-label={partnerConfig.metadata?.altText || 'Advertisement background'}
      ></div>
        
      {/* Tablet background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block md:hidden transition-opacity duration-300 ${loaded && viewportSize === 'tablet' ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: tabletAsset.src ? `url('${tabletAsset.src}')` : 'none' }}
        onClick={handleAdClick}
        role={partnerConfig.metadata?.linkUrl ? 'button' : undefined}
        aria-label={partnerConfig.metadata?.altText || 'Advertisement background'}
      ></div>
        
      {/* Desktop background */}
      <div 
        className={`absolute inset-0 hidden md:block overflow-hidden transition-opacity duration-300 ${loaded && viewportSize === 'desktop' ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleAdClick}
        role={partnerConfig.metadata?.linkUrl ? 'button' : undefined}
        aria-label={partnerConfig.metadata?.altText || 'Advertisement background'}
      >
        {desktopAsset.src ? (
          <img 
            src={desktopAsset.src}
            alt={partnerConfig.metadata?.altText || 'Advertisement background'} 
            className="w-full h-full object-top object-cover" 
            width={desktopAsset.width || 1920}
            height={desktopAsset.height || 1080}
            loading="eager" // Load this as a priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100"></div>
        )}
      </div>
    </div>
  );
};

export default AdBackground; 