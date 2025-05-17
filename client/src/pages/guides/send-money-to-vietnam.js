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
 * Guide to sending money to Vietnam
 */
const SendMoneyToVietnamGuide = () => {
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
        <p>Best options for sending money to Vietnam from the UK. Includes details on banking infrastructure, cash pickup networks, mobile wallets, and regional considerations.</p>
        <p>This guide is currently being updated with the latest information. Please check back soon for the complete guide.</p>
      </div>
    </>
  );

  return (
    <GuideDetail
      title="Vietnam Money Transfer Guide"
      subtitle="Find the best ways to transfer money to Vietnam - compare fees, exchange rates, and transfer speeds."
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="May 17, 2025"
      readTime="11"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToVietnamGuide;
