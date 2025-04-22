import React, { useState, useEffect } from 'react';
import adPartners from '../config/adPartners';

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
  const partnerConfig = adPartners[currentAdPartner] || adPartners.default;
  
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
      const asset = partnerConfig.assets[viewportSize];
      if (!asset) return;
      
      // Create image object to preload
      const img = new Image();
      img.src = asset.src;
      img.onload = () => setLoaded(true);
    };
    
    setLoaded(false); // Reset loaded state when changing images
    preloadImage();
  }, [viewportSize, currentAdPartner, partnerConfig]);
  
  // Get assets for each viewport size
  const mobileAsset = partnerConfig.assets.mobile || {};
  const tabletAsset = partnerConfig.assets.tablet || {};
  const desktopAsset = partnerConfig.assets.desktop || {};
  
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
        style={{ backgroundImage: `url('${mobileAsset.src}')` }}
        onClick={handleAdClick}
        role={partnerConfig.metadata?.linkUrl ? 'button' : undefined}
        aria-label={partnerConfig.metadata?.altText || 'Advertisement background'}
      ></div>
        
      {/* Tablet background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block md:hidden transition-opacity duration-300 ${loaded && viewportSize === 'tablet' ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url('${tabletAsset.src}')` }}
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
        <img 
          src={desktopAsset.src}
          alt={partnerConfig.metadata?.altText || 'Advertisement background'} 
          className="w-full h-full object-top object-cover" 
          width={desktopAsset.width}
          height={desktopAsset.height}
          loading="eager" // Load this as a priority
        />
      </div>
    </div>
  );
};

export default AdBackground; 