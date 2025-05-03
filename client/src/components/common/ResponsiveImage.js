import React from 'react';

/**
 * ResponsiveImage component for optimized image loading
 * 
 * @param {Object} props Component props
 * @param {string|Object} props.src The main image source (jpg/png) - can be a string path or imported module
 * @param {string|Object} props.webp WebP version of the image (optional) - can be a string path or imported module
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
  // Convert imported modules to their default export if needed
  const srcPath = typeof src === 'object' ? src.default : src;
  const webpPath = typeof webp === 'object' ? webp.default : webp;

  // Use the passed webp prop directly if available, otherwise try to derive it
  const webpSrc = webpPath || (
    (typeof srcPath === 'string' && (srcPath?.endsWith('.jpg') || srcPath?.endsWith('.jpeg') || srcPath?.endsWith('.png')))
      ? srcPath.substring(0, srcPath.lastIndexOf('.')) + '.webp' 
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
          src={srcPath}
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
      src={srcPath}
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