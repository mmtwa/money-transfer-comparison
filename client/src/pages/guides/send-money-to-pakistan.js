import React from 'react';
import GuideDetail from './GuideDetail';
// Import any necessary components or hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import hero image (use correct paths that exist)
import heroImageJpg from '../../assets/images/guides/international-transfers-hero.jpg';
import heroImageWebp from '../../assets/images/guides/international-transfers-hero.webp';
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Pakistan
 */
const SendMoneyToPakistanGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'tax-legal': true,
    'final-tips': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'Family Remittances',
      description: 'How to support your family abroad with regular money transfers - best practices and considerations.',
      path: '/guides/family-remittances'
    }
  ];

  // Content rendered as JSX for proper HTML structure
  const content = (
    <>
      <div className="guide-container">
        <p>Best providers, lowest fees, and fastest ways to send money from the UK to Pakistan. Includes PRI benefits, bank deposits, and cash pickup options.</p>
        <p>This guide is currently being updated with the latest information. Please check back soon for the complete guide.</p>
      </div>
    </>
  );

  return (
    <GuideDetail
      title="Pakistan Money Transfer Guide"
      subtitle="Find the best ways to transfer money to Pakistan - compare fees, exchange rates, and transfer speeds."
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="May 17, 2025"
      readTime="12"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToPakistanGuide;
