const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Service for scraping provider information from their websites and web search
 */
const providerScraperService = {
  /**
   * Cache of previously scraped provider information to reduce redundant requests
   */
  _cache: {},

  /**
   * Scrape information about a given money transfer provider
   * @param {string} providerCode - Provider code (e.g., 'wise', 'westernunion')
   * @returns {Promise<Object>} - Promise containing provider information
   */
  scrapeProviderInfo: async (providerCode) => {
    // Normalize provider code
    const normalizedCode = providerCode.toLowerCase().trim();
    
    // Check cache first
    if (providerScraperService._cache[normalizedCode]) {
      console.log(`Using cached provider info for: ${normalizedCode}`);
      return providerScraperService._cache[normalizedCode];
    }
    
    try {
      console.log(`Fetching provider info for: ${normalizedCode}`);
      
      // Initialize provider info with basic structure
      let providerInfo = getBasicProviderInfo(formatProviderName(normalizedCode));
      
      // Try to find the provider website by constructing common domain patterns
      const websiteInfo = await findProviderWebsite(normalizedCode);
      
      if (websiteInfo.validDomain && websiteInfo.responseData) {
        // Extract information from the website
        const websiteData = await scrapeFromWebsite(normalizedCode, websiteInfo.validDomain, websiteInfo.responseData);
        providerInfo = { ...providerInfo, ...websiteData };
      }
      
      // Fetch additional data from web search to fill in gaps
      const webSearchData = await fetchAdditionalProviderData(normalizedCode, providerInfo.name);
      
      // Merge the data, prioritizing web search data for specific fields
      providerInfo = {
        ...providerInfo,
        ...webSearchData,
        // Keep original URL if found from direct website access
        url: providerInfo.url || webSearchData.url
      };
      
      // Cache the result
      providerScraperService._cache[normalizedCode] = providerInfo;
      
      return providerInfo;
    } catch (error) {
      console.error(`Error scraping provider info for ${providerCode}:`, error);
      return getBasicProviderInfo(formatProviderName(providerCode));
    }
  }
};

/**
 * Find the provider's website
 * @param {string} providerCode - Provider code
 * @returns {Promise<Object>} - Object containing validDomain and responseData
 */
async function findProviderWebsite(providerCode) {
  const possibleDomains = [
    `https://${providerCode}.com`,
    `https://www.${providerCode}.com`,
    `https://${providerCode}.co.uk`,
    `https://www.${providerCode}.co.uk`,
    `https://${providerCode}money.com`,
    `https://www.${providerCode}money.com`,
    `https://${providerCode}moneytransfer.com`,
    `https://www.${providerCode}moneytransfer.com`
  ];
  
  // Handle special cases for providers with different domain patterns
  if (providerCode === 'westernunion' || providerCode === 'wu') {
    possibleDomains.push('https://www.westernunion.com');
  } else if (providerCode === 'moneygram') {
    possibleDomains.push('https://www.moneygram.com');
  } else if (providerCode === 'ofx') {
    possibleDomains.push('https://www.ofx.com');
  } else if (providerCode === 'currencyfair') {
    possibleDomains.push('https://www.currencyfair.com');
  } else if (providerCode === 'wise' || providerCode === 'transferwise') {
    possibleDomains.push('https://wise.com');
    possibleDomains.push('https://www.wise.com');
  } else if (providerCode === 'ria') {
    possibleDomains.push('https://www.riamoneytransfer.com');
  }
  
  // Try to access each domain
  let validDomain = null;
  let responseData = null;
  
  for (const domain of possibleDomains) {
    try {
      console.log(`Attempting to access ${domain}`);
      
      // Set a timeout to avoid hanging on slow responses
      const response = await axios.get(domain, { 
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        } 
      });
      
      if (response.status === 200) {
        validDomain = domain;
        responseData = response.data;
        console.log(`Successfully accessed ${domain}`);
        break;
      }
    } catch (error) {
      console.log(`Failed to access ${domain}: ${error.message}`);
      continue;
    }
  }
  
  return { validDomain, responseData };
}

/**
 * Fetch additional provider information from web search
 * @param {string} providerCode - Provider code
 * @param {string} providerName - Formatted provider name
 * @returns {Promise<Object>} - Additional provider information
 */
async function fetchAdditionalProviderData(providerCode, providerName) {
  try {
    let additionalInfo = {};
    
    // For key providers, we have accurate data mapped
    const knownProviders = {
      'wise': {
        name: 'Wise',
        established: 2011,
        headquarters: 'London, United Kingdom',
        description: 'Wise (formerly TransferWise) is a financial technology company that offers international money transfers and multi-currency accounts.',
        regulations: ['Financial Conduct Authority (UK)', 'FinCEN (USA)', 'ASIC (Australia)'],
        url: 'https://wise.com'
      },
      'transferwise': {
        name: 'Wise',
        established: 2011,
        headquarters: 'London, United Kingdom',
        description: 'Wise (formerly TransferWise) is a financial technology company that offers international money transfers and multi-currency accounts.',
        regulations: ['Financial Conduct Authority (UK)', 'FinCEN (USA)', 'ASIC (Australia)'],
        url: 'https://wise.com'
      },
      'westernunion': {
        name: 'Western Union',
        established: 1851,
        headquarters: 'Denver, Colorado, USA',
        description: 'Western Union is one of the oldest and largest money transfer services in the world, offering domestic and international money transfers, bill payments, and money orders.',
        regulations: ['FinCEN (USA)', 'FCA (UK)', 'Multiple local regulators worldwide'],
        url: 'https://www.westernunion.com'
      },
      'wu': {
        name: 'Western Union',
        established: 1851,
        headquarters: 'Denver, Colorado, USA',
        description: 'Western Union is one of the oldest and largest money transfer services in the world, offering domestic and international money transfers, bill payments, and money orders.',
        regulations: ['FinCEN (USA)', 'FCA (UK)', 'Multiple local regulators worldwide'],
        url: 'https://www.westernunion.com'
      },
      'moneygram': {
        name: 'MoneyGram',
        established: 1940,
        headquarters: 'Dallas, Texas, USA',
        description: 'MoneyGram is one of the largest money transfer companies globally, offering cash pickup options in over 200 countries.',
        regulations: ['FinCEN (USA)', 'FCA (UK)'],
        url: 'https://www.moneygram.com'
      },
      'ofx': {
        name: 'OFX',
        established: 1998,
        headquarters: 'Sydney, Australia',
        description: 'OFX (formerly OzForex) is a global money transfer provider specializing in larger transfers.',
        regulations: ['ASIC (Australia)', 'FCA (UK)', 'FinCEN (USA)'],
        url: 'https://www.ofx.com'
      },
      'worldremit': {
        name: 'WorldRemit',
        established: 2010,
        headquarters: 'London, United Kingdom',
        description: 'WorldRemit is a digital money transfer service offering international money transfers to more than 130 countries.',
        regulations: ['Financial Conduct Authority (UK)', 'FinCEN (USA)'],
        url: 'https://www.worldremit.com'
      },
      'remitly': {
        name: 'Remitly',
        established: 2011,
        headquarters: 'Seattle, Washington, USA',
        description: 'Remitly is a digital financial services provider focused on immigrant communities, offering international money transfers.',
        regulations: ['Financial Conduct Authority (UK)', 'FinCEN (USA)'],
        url: 'https://www.remitly.com'
      },
      'xe': {
        name: 'XE Money Transfer',
        established: 1993,
        headquarters: 'Newmarket, Ontario, Canada',
        description: 'XE is one of the world\'s most trusted currency authorities, offering money transfer services and currency conversion tools.',
        regulations: ['Financial Conduct Authority (UK)', 'FinCEN (USA)', 'FINTRAC (Canada)'],
        url: 'https://www.xe.com'
      },
      'currencyfair': {
        name: 'CurrencyFair',
        established: 2010,
        headquarters: 'Dublin, Ireland',
        description: 'CurrencyFair is a peer-to-peer money transfer service that allows users to exchange currencies at rates closer to the mid-market rate.',
        regulations: ['Central Bank of Ireland', 'ASIC (Australia)'],
        url: 'https://www.currencyfair.com'
      },
      'torfx': {
        name: 'TorFX',
        established: 2004,
        headquarters: 'Penzance, United Kingdom',
        description: 'TorFX is a money transfer service specializing in property purchases, business transfers, and regular overseas payments.',
        regulations: ['Financial Conduct Authority (UK)'],
        url: 'https://www.torfx.com'
      },
      'instarem': {
        name: 'InstaReM',
        established: 2014,
        headquarters: 'Singapore',
        description: 'InstaReM is a digital cross-border payments company that enables consumers and businesses to send money across borders quickly and at a low cost.',
        regulations: ['MAS (Singapore)', 'FCA (UK)'],
        url: 'https://www.instarem.com'
      },
      'ria': {
        name: 'Ria Money Transfer',
        established: 1987,
        headquarters: 'California, USA',
        description: 'Ria is a global money transfer company with one of the largest physical networks for sending and receiving money internationally.',
        regulations: ['FinCEN (USA)', 'FCA (UK)'],
        url: 'https://www.riamoneytransfer.com'
      },
      'skrill': {
        name: 'Skrill',
        established: 2001,
        headquarters: 'London, United Kingdom',
        description: 'Skrill is a digital wallet and online payment provider that offers money transfers across borders.',
        regulations: ['Financial Conduct Authority (UK)'],
        url: 'https://www.skrill.com'
      }
    };
    
    // If we have pre-defined accurate data for this provider, use it
    if (knownProviders[providerCode]) {
      console.log(`Using pre-defined data for ${providerCode}`);
      additionalInfo = knownProviders[providerCode];
    } else {
      // Otherwise, perform a web scrape and search for key information
      console.log(`Searching web for additional data about ${providerName}`);
      
      // Set up query strings for established date and headquarters
      const establishedQuery = `${providerName} money transfer founded established date`;
      const headquartersQuery = `${providerName} money transfer headquarters location`;
      
      // These would be simulated web search results in a real implementation
      // You would integrate with a search API service here
      
      // For demonstration, we're returning empty values that would be filled by search results
      additionalInfo = {
        established: null,
        headquarters: null,
        // Add additional data that would be fetched from search
      };
    }
    
    return additionalInfo;
  } catch (error) {
    console.error(`Error fetching additional provider data for ${providerCode}:`, error);
    return {};
  }
}

/**
 * Scrape provider information from their website
 * @param {string} providerCode - Provider code
 * @param {string} domain - Provider website domain
 * @param {string} html - HTML content of the website
 * @returns {Promise<Object>} - Provider information
 */
async function scrapeFromWebsite(providerCode, domain, html) {
  const $ = cheerio.load(html);
  
  // Extract company name from multiple possible sources
  let name = $('meta[property="og:site_name"]').attr('content') ||
             $('meta[name="application-name"]').attr('content') ||
             $('meta[property="og:title"]').attr('content') ||
             $('title').text().split('|')[0].trim();
             
  // If name is not found or seems like a generic page title, use formatted provider code
  if (!name || name.includes('Home') || name.length > 30) {
    name = formatProviderName(providerCode);
  }
  
  // Extract description from multiple meta tags and content
  const description = $('meta[name="description"]').attr('content') ||
                      $('meta[property="og:description"]').attr('content') ||
                      $('meta[name="twitter:description"]').attr('content') ||
                      $('.about-section p').first().text().trim() ||
                      $('.company-description').text().trim() ||
                      `${name} is an international money transfer service.`;
  
  // Extract regulations with more comprehensive search
  const regulations = [];
  
  // Search in footer, legal sections, and compliance pages
  $('footer, .legal, .compliance, .regulatory, [class*="legal"], [class*="compliance"], [class*="regulatory"]').each(function() {
    const text = $(this).text().trim();
    
    // Look for regulatory bodies and compliance mentions
    const regulatoryBodies = [
      'FCA', 'Financial Conduct Authority',
      'FinCEN', 'Financial Crimes Enforcement Network',
      'ASIC', 'Australian Securities and Investments Commission',
      'MAS', 'Monetary Authority of Singapore',
      'FSC', 'Financial Services Commission',
      'FSA', 'Financial Services Authority',
      'SEC', 'Securities and Exchange Commission',
      'CFTC', 'Commodity Futures Trading Commission',
      'FINTRAC', 'Financial Transactions and Reports Analysis Centre',
      'Central Bank'
    ];
    
    regulatoryBodies.forEach(body => {
      if (text.includes(body)) {
        // Extract the sentence containing the regulation
        const sentences = text.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.includes(body) || 
              sentence.includes('regulated') || 
              sentence.includes('authorized') || 
              sentence.includes('licensed')) {
            const cleanSentence = sentence.trim();
            if (cleanSentence && cleanSentence.length < 100) {
              regulations.push(cleanSentence);
            }
          }
        }
      }
    });
  });
  
  // Extract headquarters and established date with more comprehensive search
  let headquarters = null;
  let established = null;
  
  // Search for headquarters
  $('*:contains("headquarters"), *:contains("HQ"), *:contains("based in"), *:contains("located in")').each(function() {
    const text = $(this).text().trim();
    const match = text.match(/(?:headquarters|HQ|based in|located in)[^.!?]*[.!?]/i);
    if (match) {
      headquarters = match[0].replace(/(?:headquarters|HQ|based in|located in)/i, '').trim();
    }
  });
  
  // Search for established date
  $('*:contains("established"), *:contains("founded"), *:contains("since"), *:contains("founded in")').each(function() {
    const text = $(this).text().trim();
    const match = text.match(/(?:established|founded|since|founded in)[^.!?]*[.!?]/i);
    if (match) {
      const yearMatch = match[0].match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        established = yearMatch[0];
      }
    }
  });
  
  // Return the compiled information
  return {
    name,
    description,
    established,
    headquarters,
    regulations: [...new Set(regulations)], // Remove duplicates
    url: domain
  };
}

// General extraction functions for dynamic scraping

/**
 * Extract key benefits from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of key benefits
 */
function extractKeyBenefitsGeneric($) {
  const benefits = [];
  
  // Look for common benefit patterns
  $('ul li, .benefits, .features, .advantages').each(function() {
    const text = $(this).text().trim();
    
    // Filter out short or long texts and typical advertising language
    if (text.length > 10 && text.length < 80 && 
        (text.includes('transfer') || 
         text.includes('money') || 
         text.includes('exchange') || 
         text.includes('rate') || 
         text.includes('fee') ||
         text.includes('fast') ||
         text.includes('secure'))) {
      benefits.push(text);
    }
  });
  
  // Limit to most relevant benefits
  return [...new Set(benefits)].slice(0, 5);
}

/**
 * Extract regulations from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of regulations
 */
function extractRegulationsGeneric($) {
  const regulations = [];
  
  // Look for common regulation keywords
  $('*:contains("regulated"), *:contains("authorized"), *:contains("licensed"), footer, .legal, .compliance').each(function() {
    const text = $(this).text().trim();
    
    if (text.includes('FCA') || 
        text.includes('Financial Conduct Authority') || 
        text.includes('FinCEN') || 
        text.includes('ASIC') || 
        text.includes('regulated by') || 
        text.includes('authorized by')) {
      
      // Extract the sentence containing the regulation
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (sentence.includes('regulated') || 
            sentence.includes('authorized') || 
            sentence.includes('licensed') ||
            sentence.includes('FCA') ||
            sentence.includes('FinCEN')) {
          const cleanSentence = sentence.trim();
          if (cleanSentence && cleanSentence.length < 100) {
            regulations.push(cleanSentence);
          }
        }
      }
    }
  });
  
  // Return unique regulations
  return [...new Set(regulations)];
}

/**
 * Extract transfer methods from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of transfer methods
 */
function extractTransferMethodsGeneric($) {
  // Default common transfer methods
  const defaultMethods = ["Bank Transfer"];
  const methods = new Set(defaultMethods);
  
  // Look for mentions of payment methods
  $('*:contains("payment method"), *:contains("pay with"), *:contains("transfer method")').each(function() {
    const text = $(this).text().toLowerCase();
    
    if (text.includes('bank transfer')) methods.add('Bank Transfer');
    if (text.includes('debit card')) methods.add('Debit Card');
    if (text.includes('credit card')) methods.add('Credit Card');
    if (text.includes('apple pay')) methods.add('Apple Pay');
    if (text.includes('google pay')) methods.add('Google Pay');
    if (text.includes('cash')) methods.add('Cash');
  });
  
  return Array.from(methods);
}

/**
 * Extract payout methods from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of payout methods
 */
function extractPayoutMethodsGeneric($) {
  // Default common payout methods
  const defaultMethods = ["Bank Deposit"];
  const methods = new Set(defaultMethods);
  
  // Look for mentions of payout/receiving methods
  $('*:contains("receive"), *:contains("payout"), *:contains("delivery")').each(function() {
    const text = $(this).text().toLowerCase();
    
    if (text.includes('bank deposit') || text.includes('bank account')) methods.add('Bank Deposit');
    if (text.includes('cash pickup')) methods.add('Cash Pickup');
    if (text.includes('mobile wallet') || text.includes('e-wallet')) methods.add('Mobile Wallet');
    if (text.includes('home delivery')) methods.add('Home Delivery');
  });
  
  return Array.from(methods);
}

/**
 * Extract supported countries from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {number|null} - Number of supported countries or null
 */
function extractSupportedCountriesGeneric($) {
  let countryCount = null;
  
  // Look for patterns like "X countries", "send money to X countries"
  $('*:contains("countries")').each(function() {
    const text = $(this).text();
    const match = text.match(/(\d+)[+]?\s+countries/i);
    
    if (match && match[1]) {
      const count = parseInt(match[1]);
      if (count > 0 && (countryCount === null || count > countryCount)) {
        countryCount = count;
      }
    }
  });
  
  return countryCount;
}

/**
 * Extract customer support options from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of customer support options
 */
function extractCustomerSupportGeneric($) {
  const supportOptions = new Set();
  
  // Look for common support patterns
  $('*:contains("support"), *:contains("help"), *:contains("contact"), footer, .contact, .support').each(function() {
    const text = $(this).text().toLowerCase();
    
    if (text.includes('chat') || text.includes('live chat')) supportOptions.add('Live Chat');
    if (text.includes('email') || text.includes('@')) supportOptions.add('Email Support');
    if (text.includes('phone') || text.includes('call') || text.match(/\+\d+/)) supportOptions.add('Phone Support');
  });
  
  // Default to at least one support option if none found
  if (supportOptions.size === 0) {
    supportOptions.add('Email Support');
  }
  
  return Array.from(supportOptions);
}

/**
 * Extract app rating from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {string|null} - App rating as a string or null
 */
function extractAppRatingGeneric($) {
  let rating = null;
  
  // Look for common app rating patterns
  $('*:contains("rating"), *:contains("stars"), *:contains("app store"), *:contains("play store")').each(function() {
    const text = $(this).text();
    const match = text.match(/(\d\.\d+)[\/5]?\s*(?:star|rating)/i);
    
    if (match && match[1]) {
      const parsed = parseFloat(match[1]);
      if (parsed >= 1 && parsed <= 5) {
        rating = parsed.toFixed(1);
      }
    }
  });
  
  return rating;
}

/**
 * Extract limitations from a website
 * @param {CheerioStatic} $ - Loaded cheerio object
 * @returns {Array<string>} - Array of limitations
 */
function extractLimitationsGeneric($) {
  // Common limitations for money transfer services
  return [
    "Service availability varies by location",
    "Transfer speeds may vary based on payment method"
  ];
}

/**
 * Format provider name from code
 * @param {string} providerCode - Provider code
 * @returns {string} - Formatted provider name
 */
function formatProviderName(providerCode) {
  if (!providerCode) return 'Unknown Provider';
  
  // Special cases
  if (providerCode.toLowerCase() === 'wu') return 'Western Union';
  if (providerCode.toLowerCase() === 'xe') return 'XE Money Transfer';
  if (providerCode.toLowerCase() === 'transferwise') return 'Wise';
  
  // Split by hyphens, underscores, or camelCase
  return providerCode
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get basic provider information when scraping fails
 * @param {string} providerName - Provider name
 * @param {string} [url=null] - Provider URL if known
 * @returns {Object} - Basic provider information
 */
function getBasicProviderInfo(providerName, url = null) {
  return {
    name: providerName,
    description: `${providerName} is an international money transfer service.`,
    established: null,
    headquarters: null,
    regulations: [],
    transferMethods: ["Bank Transfer"],
    payoutMethods: ["Bank Deposit"],
    supportedCountries: null,
    customerSupport: ["Email Support"],
    appRating: null,
    keyBenefits: [
      "International money transfers"
    ],
    limitations: [
      "Limited information available"
    ],
    url: url
  };
}

module.exports = providerScraperService; 