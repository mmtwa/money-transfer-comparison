import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/study-abroad-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/study-abroad-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to studying abroad
 */

import SEO from '../../components/SEO';
const StudyingAbroad = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'financial-planning': true,
    'transfer-strategy': true,
    'banking-considerations': true,
    'cost-optimization': true,
    'required-documentation': true,
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

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl font-medium mb-8 text-left">
        Studying abroad is an exciting opportunity, but managing finances across borders can be challenging. This comprehensive guide covers everything you need to know about handling money for international education, from tuition payments to day-to-day expenses.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">How to save money on international tuition payments</li>
          <li className="text-left">Best options for receiving funds from family while studying</li>
          <li className="text-left">Setting up banking in your study destination</li>
          <li className="text-left">Managing currency fluctuations on a student budget</li>
          <li className="text-left">Cost-effective ways to handle day-to-day expenses</li>
          <li className="text-left">Tax considerations for international students</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">The Financial Challenges of International Education</h2>
      
      <p className="mb-6 text-left">
        Studying in another country involves numerous financial considerations beyond tuition. Exchange rates, banking access, transfer fees, and local financial regulations all impact your budget and financial planning. Understanding these factors is essential for a successful and stress-free study abroad experience.
      </p>
      
      <p className="mb-6 text-left">
        Many students and parents lose significant amounts of money through poor exchange rates and unnecessary fees when managing international education finances. This guide will help you navigate these challenges and optimize your financial approach to studying abroad.
      </p>
    </div>
  );

  // Return the GuideDetail component with our content
  return (
    <div>
      <SEO
        title="Studying Abroad | MyMoneyTransfers"
        description="Studying Abroad - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/studying-abroad"
      />
      <GuideDetail
        title="Financial Guide for International Students"
        subtitle="Managing money effectively while studying abroad"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="July 10, 2023"
        readTime="9"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default StudyingAbroad; 