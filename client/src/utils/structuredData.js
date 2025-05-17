/**
 * Utility functions for generating structured data (JSON-LD) for SEO
 * These help search engines understand your content and can enhance search results
 */

// Website schema for the main website 
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'MyMoneyTransfers',
  'url': 'https://www.mymoneytransfers.com/',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': 'https://www.mymoneytransfers.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  },
  'description': 'MyMoneyTransfers is a 100% independent comparison service for international money transfers. We compare rates from providers like Wise, Western Union, and more with no commissions or sponsored rankings.',
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
});

// Organization schema for about pages
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'MyMoneyTransfers',
  'url': 'https://www.mymoneytransfers.com',
  'logo': 'https://www.mymoneytransfers.com/mmtlogo.png',
  'description': 'An independent money transfer comparison service with no affiliate commissions. We compare international transfer providers objectively to help users find the best rates.',
  'slogan': '100% Independent Money Transfer Comparisons',
  'sameAs': [
    'https://twitter.com/mymoneytransfer',
    'https://www.facebook.com/mymoneytransfers',
    'https://www.linkedin.com/company/mymoneytransfers'
  ]
});

// Comparison service schema for comparison pages
export const getComparisonServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Money Transfer Comparison',
  'provider': {
    '@type': 'Organization',
    'name': 'MyMoneyTransfers'
  },
  'description': 'Compare international money transfer rates across multiple providers to find the best deal. Unlike other sites, our results are 100% unbiased with no sponsored rankings or affiliate commissions.',
  'areaServed': {
    '@type': 'Country',
    'name': 'Worldwide'
  }
});

// Historical Rates schema for exchange rate monitoring
export const getHistoricalRatesSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  'name': 'Historical Exchange Rates & Currency Trends',
  'description': 'Monitor real-time and historical exchange rates with interactive currency charts. Track trends, analyze volatility, and make informed decisions for international money transfers. Unbiased data with no hidden agenda.',
  'provider': {
    '@type': 'Organization',
    'name': 'MyMoneyTransfers'
  },
  'category': 'Exchange Rates',
  'feesAndCommissionsSpecification': 'Free currency rate information with no fees',
  'additionalType': 'Financial Information Service',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock',
    'url': 'https://www.mymoneytransfers.com/historical-rates'
  }
});

// FAQ schema for FAQ pages
export const getFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer
    }
  }))
});

// Article schema for guides and blog posts
export const getArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': article.title,
  'description': article.description,
  'image': article.image || 'https://www.mymoneytransfers.com/mmtlogo.png',
  'datePublished': article.publishedDate,
  'dateModified': article.updatedDate || article.publishedDate,
  'author': {
    '@type': 'Organization',
    'name': 'MyMoneyTransfers',
    'description': 'An independent money transfer comparison service with no affiliate commissions.'
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'MyMoneyTransfers',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://www.mymoneytransfers.com/mmtlogo.png',
      'width': '512',
      'height': '512'
    }
  },
  'mainEntityOfPage': {
    '@type': 'WebPage',
    '@id': article.url
  }
});

// BreadcrumbList schema for navigation hierarchy
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url
  }))
});

// Product schema for comparing money transfer services
export const getProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  'name': product.name,
  'description': product.description,
  'image': product.image,
  'brand': {
    '@type': 'Brand',
    'name': product.brand
  },
  'offers': {
    '@type': 'Offer',
    'price': product.price || '0',
    'priceCurrency': product.currency || 'USD',
    'url': product.url
  },
  'aggregateRating': product.rating ? {
    '@type': 'AggregateRating',
    'ratingValue': product.rating.value,
    'ratingCount': product.rating.count,
    'bestRating': '5',
    'worstRating': '1'
  } : undefined,
  'review': {
    '@type': 'Review',
    'reviewRating': {
      '@type': 'Rating',
      'ratingValue': product.rating?.value || '4.5',
      'bestRating': '5'
    },
    'author': {
      '@type': 'Organization',
      'name': 'MyMoneyTransfers'
    },
    'reviewBody': 'This review is provided by MyMoneyTransfers, a 100% independent service with no affiliate commissions or sponsored rankings.'
  }
});

// Default schema selector based on page type
export const getSchemaByPageType = (pageType, data = {}) => {
  switch (pageType) {
    case 'home':
      return getWebsiteSchema();
    case 'about':
      return getOrganizationSchema();
    case 'comparison':
      return getComparisonServiceSchema();
    case 'historical-rates':
      return getHistoricalRatesSchema();
    case 'faq':
      return getFAQSchema(data.faqs || []);
    case 'article':
    case 'guide':
      return getArticleSchema(data);
    default:
      return getWebsiteSchema();
  }
}; 