import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/low-value-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/low-value-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to low-value international money transfers
 */
const LowValueTransfers = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'provider-selection': true,
    'security-considerations': true,
    'cost-optimization': true,
    'transfer-methods': true,
    'documentation': true,
    'best-practices': true
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
      title: 'Mid-Range Transfers Guide',
      description: 'Essential information for managing medium-sized international transfers, including security, compliance, and optimization strategies.',
      path: '/guides/mid-value'
    }
  ];

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <>
      <ClickableHeadline 
        id="introduction" 
        isExpanded={expandedSections['introduction']} 
        onClick={toggleSection}
      >
        Introduction to Low-Value Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Low-value international money transfers, typically under £1,000, are the most common type 
            of international payment. These transfers often serve purposes like family support, 
            small purchases, or regular remittances.
          </p>
          
          <p className="mb-8 text-left">
            This guide will help you navigate the world of small international transfers, focusing on 
            cost-effectiveness, speed, and convenience while maintaining security.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">What Constitutes a Low-Value Transfer?</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Family support</strong>: £100 - £1,000</li>
              <li className="text-left"><strong>Small purchases</strong>: £50 - £500</li>
              <li className="text-left"><strong>Regular remittances</strong>: £200 - £1,000</li>
              <li className="text-left"><strong>Travel money</strong>: £100 - £1,000</li>
              <li className="text-left"><strong>Small gifts</strong>: £50 - £500</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="planning-strategy" 
        isExpanded={expandedSections['planning-strategy']} 
        onClick={toggleSection}
      >
        Planning Your Transfer Strategy
      </ClickableHeadline>
      {expandedSections['planning-strategy'] && (
        <>
          <p className="mb-4 text-left">
            For low-value transfers, the focus is often on speed and convenience while keeping costs low. 
            Here's what to consider when planning your transfer.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Timing Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Transfer speed requirements</li>
                <li className="text-left">Provider processing times</li>
                <li className="text-left">Weekend/holiday impacts</li>
                <li className="text-left">Recipient availability</li>
                <li className="text-left">Urgency of transfer</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Amount Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Fixed vs. percentage fees</li>
                <li className="text-left">Minimum transfer amounts</li>
                <li className="text-left">Fee-free thresholds</li>
                <li className="text-left">Regular transfer discounts</li>
                <li className="text-left">Promotional offers</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="provider-selection" 
        isExpanded={expandedSections['provider-selection']} 
        onClick={toggleSection}
      >
        Selecting the Right Provider
      </ClickableHeadline>
      {expandedSections['provider-selection'] && (
        <>
          <p className="mb-6 text-left">
            For low-value transfers, the provider landscape is diverse, with options ranging from 
            traditional banks to digital-only services. Choose based on your specific needs.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Provider Selection Criteria</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Transfer Speed</strong>: How quickly funds arrive</li>
              <li className="mb-2 text-left"><strong>Fee Structure</strong>: Fixed vs. percentage fees</li>
              <li className="mb-2 text-left"><strong>Exchange Rates</strong>: Rate competitiveness</li>
              <li className="mb-2 text-left"><strong>Ease of Use</strong>: User interface and experience</li>
              <li className="mb-2 text-left"><strong>Customer Support</strong>: Availability and quality</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-considerations" 
        isExpanded={expandedSections['security-considerations']} 
        onClick={toggleSection}
      >
        Security and Compliance
      </ClickableHeadline>
      {expandedSections['security-considerations'] && (
        <>
          <p className="mb-6 text-left">
            Even for small transfers, security remains crucial. Understanding basic security measures 
            helps protect your funds.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Security Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Basic Verification</strong>: Required documentation</li>
              <li className="text-left"><strong>Secure Platforms</strong>: Encrypted transactions</li>
              <li className="text-left"><strong>Fraud Protection</strong>: Basic security measures</li>
              <li className="text-left"><strong>Transaction Limits</strong>: Daily/monthly caps</li>
              <li className="text-left"><strong>Account Security</strong>: Password and 2FA</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cost-optimization" 
        isExpanded={expandedSections['cost-optimization']} 
        onClick={toggleSection}
      >
        Cost Optimization
      </ClickableHeadline>
      {expandedSections['cost-optimization'] && (
        <>
          <p className="mb-4 text-left">
            For low-value transfers, minimizing costs is often a priority. Here's how to optimize 
            your transfer costs.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Fee Structures</h3>
              <p className="mb-4 text-left">
                Compare fixed fees vs. percentage-based fees for your transfer amount.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Exchange Rates</h3>
              <p className="mb-4 text-left">
                Look for providers offering competitive exchange rates.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Promotional Offers</h3>
              <p className="mb-4 text-left">
                Take advantage of first-time user discounts and special promotions.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-methods" 
        isExpanded={expandedSections['transfer-methods']} 
        onClick={toggleSection}
      >
        Transfer Methods
      </ClickableHeadline>
      {expandedSections['transfer-methods'] && (
        <>
          <p className="mb-6 text-left">
            Low-value transfers offer various methods to send money, each with its own advantages 
            and considerations.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Available Transfer Methods</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Digital Wallets</strong>: Fast and convenient</li>
              <li className="text-left"><strong>Bank Transfers</strong>: Traditional and reliable</li>
              <li className="text-left"><strong>Cash Pickup</strong>: Immediate access</li>
              <li className="text-left"><strong>Mobile Money</strong>: Growing in popularity</li>
              <li className="text-left"><strong>Card Transfers</strong>: Direct to recipient's card</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="documentation" 
        isExpanded={expandedSections['documentation']} 
        onClick={toggleSection}
      >
        Required Documentation
      </ClickableHeadline>
      {expandedSections['documentation'] && (
        <>
          <p className="mb-4 text-left">
            Low-value transfers typically require minimal documentation, but it's important to 
            understand what's needed.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Document Type</th>
                  <th className="py-2 px-4 text-left">Purpose</th>
                  <th className="py-2 px-4 text-left">When Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Basic ID</td>
                  <td className="py-2 px-4 text-left">Verify identity</td>
                  <td className="py-2 px-4 text-left">First transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Email/Phone</td>
                  <td className="py-2 px-4 text-left">Contact verification</td>
                  <td className="py-2 px-4 text-left">Always</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Payment Method</td>
                  <td className="py-2 px-4 text-left">Source of funds</td>
                  <td className="py-2 px-4 text-left">Always</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Recipient Details</td>
                  <td className="py-2 px-4 text-left">Transfer destination</td>
                  <td className="py-2 px-4 text-left">Always</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-practices" 
        isExpanded={expandedSections['best-practices']} 
        onClick={toggleSection}
      >
        Best Practices for Low-Value Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure smooth and cost-effective low-value transfers:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Compare multiple providers</li>
              <li className="text-left">Check for promotional offers</li>
              <li className="text-left">Verify recipient details</li>
              <li className="text-left">Use secure networks</li>
              <li className="text-left">Keep transfer records</li>
              <li className="text-left">Consider transfer timing</li>
              <li className="text-left">Review terms and conditions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Low-value transfers can be quick and convenient when done right. Focus on finding the 
            right balance between cost, speed, and convenience for your specific needs.
          </p>
          <p className="text-left">
            Remember that the cheapest option isn't always the best - consider the full package 
            including transfer speed, reliability, and customer support.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Low-Value International Money Transfers: A Complete Guide"
      subtitle="Everything you need to know about managing small international transfers, from cost optimization to security and convenience"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="6"
      relatedGuides={relatedGuides}
    />
  );
};

export default LowValueTransfers; 