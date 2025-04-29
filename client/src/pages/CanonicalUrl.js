import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

/**
 * Component to manage canonical URLs and prevent duplicate content issues
 * 
 * @param {Object} props
 * @param {string} props.path - Optional override for the canonical path
 */
const CanonicalUrl = ({ path }) => {
  const location = useLocation();
  
  // Build the canonical URL
  const baseUrl = 'https://www.mymoneytransfers.com';
  
  // Use the provided path or current location path
  const canonicalPath = path || location.pathname;
  
  // Remove trailing slash and ensure leading slash
  const formattedPath = canonicalPath === '/' 
    ? '' 
    : canonicalPath.endsWith('/') 
      ? canonicalPath.slice(0, -1) 
      : canonicalPath;
  
  const canonicalUrl = `${baseUrl}${formattedPath}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalUrl; 