import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

/**
 * SEO component for managing head tags and metadata
 * This helps improve search engine visibility and social sharing
 */
const SEO = ({ 
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  structuredData,
  noIndex = false
}) => {
  // Default values
  const defaultTitle = 'Compare Money Transfer Services – Low Fees, Unbiased Rankings | MyMoneyTransfers';
  const defaultDescription = 'Send money overseas with confidence. MyMoneyTransfers compares international money transfer providers in real-time – 100% independent, no commissions, just the best rates.';
  const defaultKeywords = 'money transfer, international money transfer, currency exchange, exchange rates, Wise, Western Union, money transfer comparison, send money abroad, foreign currency, remittance, transfer fees, unbiased money transfer, independent comparison';
  const defaultOgImage = 'https://www.mymoneytransfers.com/mmtlogo.png';
  const siteUrl = 'https://www.mymoneytransfers.com';
  
  // Use provided values or defaults
  const pageTitle = title ? `${title} | MyMoneyTransfers` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageImage = ogImage || defaultOgImage;
  
  // Build canonical URL
  const canonical = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`) 
    : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Robots Control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph Tags for Social Media */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content="MyMoneyTransfers" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogImage: PropTypes.string,
  structuredData: PropTypes.object,
  noIndex: PropTypes.bool
};

export default SEO; 