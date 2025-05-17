import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/high-value-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/high-value-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to high-value international money transfers
 */

import SEO from '../../components/SEO';
const HighValueTransfers = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'provider-selection': true,
    'security-considerations': true,
    'tax-implications': true,
    'exchange-rate-strategy': true,
    'documentation': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: "Business Transfers Guide",
      description: "Learn about options for international business transfers and payments.",
      path: "/guides/business-transfers"
    },
    {
      title: "Security Tips for Money Transfers",
      description: "Essential security practices to protect your money when sending internationally.",
      path: "/guides/security-tips"
    }
  ];

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl font-medium mb-8 text-left">
        When transferring large sums of money internationally, the stakes are considerably higher. Even small percentage differences in exchange rates can mean hundreds or thousands in savings or losses. This comprehensive guide explores the best strategies for high-value international transfers.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">Special considerations for large transfers</li>
          <li className="text-left">How to secure the best exchange rates for large sums</li>
          <li className="text-left">Security protocols for high-value transfers</li>
          <li className="text-left">Tax implications and compliance requirements</li>
          <li className="text-left">Forward contracts and hedging strategies</li>
          <li className="text-left">How to minimize fees on substantial transfers</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Why High-Value Transfers Need Special Attention</h2>
      
      <p className="mb-6 text-left">
        Moving large sums of money across borders involves considerations beyond those of regular transfers. Exchange rate fluctuations have a more significant impact, security risks increase, and regulatory oversight is often more stringent. Understanding these factors is essential for protecting your wealth during international transfers.
      </p>
      
      <p className="mb-6 text-left">
        Most traditional banks and transfer services aren't optimized for high-value transfers, often applying standard fee structures and exchange rates that become prohibitively expensive when dealing with larger amounts. This guide will show you specialized approaches that can save you substantial sums.
      </p>
    </div>
  );

  // Return the GuideDetail component with our content
  return (
    <div>
      <SEO
        title="High Value Transfers - Money Transfer Guide | MyMoneyTransfers"
        description="High Value Transfers - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/high-value-transfers"
      />
      <GuideDetail
        title="High-Value Transfers: Moving Substantial Sums Internationally"
        subtitle="Strategies for efficiently and securely transferring large amounts of money across borders"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="July 25, 2023"
        readTime="10"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default HighValueTransfers; 