import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Component to inject structured data (JSON-LD) into the page head
 * Used for rich search results in Google and other search engines
 */
const StructuredData = ({ page = 'home' }) => {
  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'MyMoneyTransfers',
    'url': 'https://www.mymoneytransfers.com/',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.mymoneytransfers.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    'description': 'Compare international money transfer rates from top providers like Wise, Western Union, XE and more.',
    'publisher': {
      '@type': 'Organization',
      'name': 'MyMoneyTransfers',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.mymoneytransfers.com/mmtlogo.png',
        'width': '512',
        'height': '512'
      }
    }
  };

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'MyMoneyTransfers',
    'url': 'https://www.mymoneytransfers.com',
    'logo': 'https://www.mymoneytransfers.com/mmtlogo.png',
    'sameAs': [
      'https://twitter.com/mymoneytransfer',
      'https://www.facebook.com/mymoneytransfers',
      'https://www.linkedin.com/company/mymoneytransfers'
    ]
  };

  // Comparison service schema
  const comparisonServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Money Transfer Comparison',
    'provider': {
      '@type': 'Organization',
      'name': 'MyMoneyTransfers'
    },
    'description': 'Compare international money transfer rates across multiple providers to find the best deal.',
    'areaServed': {
      '@type': 'Country',
      'name': 'Worldwide'
    }
  };

  // Select which schema to use based on page
  let schemaData = websiteSchema;
  
  if (page === 'about') {
    schemaData = organizationSchema;
  } else if (page === 'comparison') {
    schemaData = comparisonServiceSchema;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default StructuredData; 