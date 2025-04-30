import React from 'react';

/**
 * ResponsiveImage component for optimized image loading
 * 
 * @param {Object} props Component props
 * @param {string} props.src The main image source (jpg/png)
 * @param {string} props.webp WebP version of the image (optional)
 * @param {string} props.alt Alt text for accessibility
 * @param {string} props.className CSS classes
 * @param {Object} props.sizes Responsive sizes config (optional)
 * @param {string} props.fallback Fallback image URL (optional)
 * @param {boolean} props.lazy Whether to lazy load (default: true)
 * @returns {JSX.Element} Responsive image component
 */
const ResponsiveImage = ({ 
  src, 
  webp, 
  alt, 
  className,
  sizes = '(max-width: 768px) 100vw, 768px',
  fallback,
  lazy = true,
  ...rest
}) => {
  // Use the passed webp prop directly if available, otherwise try to derive it
  const webpSrc = webp || (
    (src?.endsWith('.jpg') || src?.endsWith('.jpeg') || src?.endsWith('.png'))
      ? src.substring(0, src.lastIndexOf('.')) + '.webp' 
      : null
  );

  // Handle image loading error
  const handleError = (e) => {
    if (fallback && e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  // If webp is available, use picture element for better browser support
  if (webpSrc) {
    return (
      <picture>
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
          sizes={sizes}
        />
        <img
          src={src}
          alt={alt}
          className={className}
          loading={lazy ? 'lazy' : undefined}
          onError={handleError}
          sizes={sizes}
          {...rest}
        />
      </picture>
    );
  }

  // Regular image fallback
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : undefined}
      onError={handleError}
      sizes={sizes}
      {...rest}
    />
  );
};

export default ResponsiveImage; 