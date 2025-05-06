const { manageAllPageHeroImages } = require('../utils/autoImageManager.cjs');
const path = require('path');

// Define pages that need hero images
const pages = [
  // Main guides
  {
    title: 'Business Purpose Guide',
    subtitle: 'Understanding business purpose for international transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'business-purpose-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/business-purpose-hero-optimized.jpg')
  },
  {
    title: 'Business Transfers Guide',
    subtitle: 'Expert solutions for businesses needing to make international payments',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'business-transfers-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/business-transfers-hero-new.webp')
  },
  {
    title: 'Buying Property Abroad Guide',
    subtitle: 'Everything you need to know about purchasing property overseas',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'property-abroad-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/property-abroad-hero-optimized.jpg')
  },
  {
    title: 'Digital Nomads Guide',
    subtitle: 'Master your finances while working remotely across borders',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'nomad-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/nomad-transfer-hero-optimized.jpg')
  },
  {
    title: 'Exchange Rates Guide',
    subtitle: 'Understanding international exchange rates and currency conversion',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'exchange-rates-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/exchange-rates-hero-new.webp')
  },
  {
    title: 'Family Remittances Guide',
    subtitle: 'Best practices for sending money to family abroad',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'family-remittances-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/family-remittances-hero-new.webp')
  },
  {
    title: 'High Value Transfers Guide',
    subtitle: 'Managing large international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'high-value-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/high-value-transfer-hero-optimized.jpg')
  },
  {
    title: 'Low Value Transfers Guide',
    subtitle: 'Managing small international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'low-value-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/low-value-transfer-hero-optimized.jpg')
  },
  {
    title: 'Micro Transfers Guide',
    subtitle: 'Managing micro international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'micro-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/micro-transfer-hero-optimized.jpg')
  },
  {
    title: 'Mid Value Transfers Guide',
    subtitle: 'Managing medium-sized international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'mid-value-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/mid-value-transfer-hero-optimized.jpg')
  },
  {
    title: 'Security Tips Guide',
    subtitle: 'Keeping your international transfers secure',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'security-tips-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/security-tips-hero-new.webp')
  },
  {
    title: 'Sending Money to Family Guide',
    subtitle: 'Best practices for family remittances',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'family-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/family-transfer-hero-optimized.jpg')
  },
  {
    title: 'Studying Abroad Guide',
    subtitle: 'Managing finances while studying overseas',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'study-abroad-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/study-abroad-hero-optimized.jpg')
  },
  {
    title: 'Transfer Fees Guide',
    subtitle: 'Understanding international transfer fees',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'transfer-fees-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/transfer-fees-hero-new.webp')
  },
  // Corridors
  {
    title: 'Australia Pacific Corridor',
    subtitle: 'Money transfers between Australia and Pacific nations',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'aus-pacific-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/aus-pacific-hero-optimized.jpg')
  },
  {
    title: 'Europe Africa Corridor',
    subtitle: 'Money transfers between Europe and Africa',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'eu-africa-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/eu-africa-hero-optimized.jpg')
  },
  {
    title: 'Gulf Asia Corridor',
    subtitle: 'Money transfers between Gulf countries and Asia',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'gulf-asia-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/gulf-asia-hero-optimized.jpg')
  },
  {
    title: 'UK Asia Corridor',
    subtitle: 'Money transfers between UK and Asia',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'uk-asia-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/uk-asia-hero-optimized.jpg')
  },
  {
    title: 'US Latin America Corridor',
    subtitle: 'Money transfers between US and Latin America',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'us-latam-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/us-latam-hero-optimized.jpg')
  },
  // Criteria
  {
    title: 'Convenience Guide',
    subtitle: 'Finding convenient international money transfer services',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'convenience-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/convenience-hero-optimized.jpg')
  },
  {
    title: 'Cost Optimization Guide',
    subtitle: 'Optimizing costs for international transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'cost-optimizing-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/cost-optimizing-hero-optimized.jpg')
  },
  {
    title: 'Security Guide',
    subtitle: 'Ensuring secure international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'security-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/security-hero-optimized.jpg')
  },
  {
    title: 'Service Quality Guide',
    subtitle: 'Finding quality international money transfer services',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'service-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/service-hero-optimized.jpg')
  },
  // Frequency
  {
    title: 'Occasional Transfers Guide',
    subtitle: 'Managing occasional international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'occasional-transfers-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/occasional-transfers-hero-optimized.jpg')
  },
  {
    title: 'One Time Transfers Guide',
    subtitle: 'Managing one-time international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'one-time-transfers-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/one-time-transfers-hero-optimized.jpg')
  },
  {
    title: 'Periodic Transfers Guide',
    subtitle: 'Managing periodic international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'periodic-transfers-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/periodic-transfers-hero-optimized.jpg')
  },
  {
    title: 'Regular Transfers Guide',
    subtitle: 'Managing regular international money transfers',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'regular-transfers-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/regular-transfers-hero-optimized.jpg')
  },
  // Country-specific guides
  {
    title: 'Send Money to Bangladesh',
    subtitle: 'Complete guide to sending money to Bangladesh',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'bangladesh-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/bangladesh-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Canada',
    subtitle: 'Complete guide to sending money to Canada',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'canada-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/canada-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to China',
    subtitle: 'Complete guide to sending money to China',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'china-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/china-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to India',
    subtitle: 'Complete guide to sending money to India',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'india-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/india-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Mexico',
    subtitle: 'Complete guide to sending money to Mexico',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'mexico-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/mexico-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Morocco',
    subtitle: 'Complete guide to sending money to Morocco',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'morocco-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/morocco-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Nigeria',
    subtitle: 'Complete guide to sending money to Nigeria',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'nigeria-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/nigeria-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Pakistan',
    subtitle: 'Complete guide to sending money to Pakistan',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'pakistan-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/pakistan-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Philippines',
    subtitle: 'Complete guide to sending money to Philippines',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'philippines-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/philippines-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Poland',
    subtitle: 'Complete guide to sending money to Poland',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'poland-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/poland-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Romania',
    subtitle: 'Complete guide to sending money to Romania',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'romania-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/romania-transfer-hero-optimized.jpg')
  },
  {
    title: 'Send Money to Vietnam',
    subtitle: 'Complete guide to sending money to Vietnam',
    imageDir: path.join(__dirname, '../assets/images/guides'),
    imageName: 'vietnam-transfer-hero',
    imagePath: path.join(__dirname, '../assets/images/guides/vietnam-transfer-hero-optimized.jpg')
  }
];

// Main function to manage images
async function main() {
  try {
    console.log('Starting hero image management process...');
    await manageAllPageHeroImages(pages);
    console.log('Hero image management completed successfully');
  } catch (error) {
    console.error('Error in hero image management:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 