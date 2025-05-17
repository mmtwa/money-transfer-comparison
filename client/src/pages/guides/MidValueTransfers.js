import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/mid-value-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/mid-value-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Mid Value Transfers guide page
 */
import SEO from '../../components/SEO';
const MidValueTransfers = () => {
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
      title: "High-Value Transfers Guide",
      description: "Learn about options for transferring large sums internationally.",
      path: "/guides/high-value-transfers"
    },
    {
      title: "Security Tips for Money Transfers",
      description: "Essential security practices to protect your money when sending internationally.",
      path: "/guides/security-tips"
    }
  ];

  // Define content
  const content = (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl font-medium mb-8 text-left">
        Mid-value transfers (typically between £1,000 and £50,000) represent a sweet spot where you can achieve significant savings with the right approach. This comprehensive guide explores the best strategies specifically designed for medium-sized international payments.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">Optimal providers for mid-range transfers</li>
          <li className="text-left">How to negotiate better rates for medium amounts</li>
          <li className="text-left">Security considerations for mid-value transfers</li>
          <li className="text-left">Cost-saving strategies specifically for this range</li>
          <li className="text-left">Documentation requirements to prepare for</li>
          <li className="text-left">How to balance speed, cost and convenience</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Why Mid-Value Transfers Deserve Special Attention</h2>
      
      <p className="mb-6 text-left">
        Most transfer guides focus on either small everyday payments or large high-stakes transfers. Mid-value transfers fall into a unique category with their own set of considerations and opportunities. These transfers are significant enough to warrant careful planning but may not trigger the same level of scrutiny as larger amounts.
      </p>
      
      <p className="mb-6 text-left">
        In this range, standard bank transfers become increasingly expensive, while specialized services can offer substantial savings. Understanding the specific dynamics of mid-range transfers is essential for maximizing value while ensuring security and convenience.
      </p>
    </div>
  );

  return (
    <div>
      <SEO
        title="Mid Value Transfers | MyMoneyTransfers"
        description="Mid Value Transfers - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/mid-value-transfers"
      />
      <GuideDetail
        title="Mid-Value Transfers: Optimizing Medium-Sized International Payments"
        subtitle="Expert strategies for the most cost-effective way to send £1,000-£50,000 abroad"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="August 12, 2023"
        readTime="8"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default MidValueTransfers; 