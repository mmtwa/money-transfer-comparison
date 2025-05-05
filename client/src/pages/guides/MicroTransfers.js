import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/micro-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/micro-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to micro international money transfers
 */
const MicroTransfers = () => {
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
      title: 'Low-Value Transfers Guide',
      description: 'Essential information for managing small international transfers, including cost optimization and convenience strategies.',
      path: '/guides/low-value'
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
        Introduction to Micro Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Micro international money transfers, typically under £100, are becoming increasingly common 
            in today's digital economy. These small transfers often serve purposes like digital payments, 
            online purchases, or small remittances.
          </p>
          
          <p className="mb-8 text-left">
            This guide will help you navigate the world of micro transfers, focusing on instant 
            transfers, minimal fees, and digital convenience while maintaining security.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">What Constitutes a Micro Transfer?</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Digital payments</strong>: £1 - £100</li>
              <li className="text-left"><strong>Online purchases</strong>: £5 - £100</li>
              <li className="text-left"><strong>Small remittances</strong>: £10 - £100</li>
              <li className="text-left"><strong>Digital services</strong>: £1 - £50</li>
              <li className="text-left"><strong>Micro-investments</strong>: £5 - £100</li>
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
            For micro transfers, the focus is on instant or near-instant transfers with minimal fees. 
            Here's what to consider when planning your transfer.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Timing Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Instant transfer options</li>
                <li className="text-left">Processing times</li>
                <li className="text-left">24/7 availability</li>
                <li className="text-left">Recipient access</li>
                <li className="text-left">Digital delivery</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Amount Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Fixed fee impact</li>
                <li className="text-left">Minimum amounts</li>
                <li className="text-left">Fee-free options</li>
                <li className="text-left">Bulk transfer discounts</li>
                <li className="text-left">Loyalty rewards</li>
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
            For micro transfers, digital-first providers often offer the best combination of speed, 
            convenience, and low costs. Choose based on your specific needs.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Provider Selection Criteria</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Transfer Speed</strong>: Instant or near-instant options</li>
              <li className="mb-2 text-left"><strong>Fee Structure</strong>: Minimal or no fees</li>
              <li className="mb-2 text-left"><strong>Digital Integration</strong>: App and online access</li>
              <li className="mb-2 text-left"><strong>User Experience</strong>: Simple and intuitive</li>
              <li className="mb-2 text-left"><strong>Recipient Options</strong>: Digital delivery methods</li>
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
            While micro transfers are small, security remains important. Understanding basic security 
            measures helps protect your funds.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Security Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Digital Verification</strong>: Email/phone verification</li>
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
            For micro transfers, fixed fees can significantly impact the total cost. Here's how to 
            optimize your transfer costs.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Fee Structures</h3>
              <p className="mb-4 text-left">
                Look for providers with no or minimal fixed fees for small amounts.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Digital Wallets</h3>
              <p className="mb-4 text-left">
                Consider digital wallet options that often have lower fees for micro transfers.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Special Offers</h3>
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
            Micro transfers offer various digital methods to send money, each with its own advantages 
            and considerations.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Available Transfer Methods</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Digital Wallets</strong>: Instant transfers</li>
              <li className="text-left"><strong>Mobile Apps</strong>: Quick and convenient</li>
              <li className="text-left"><strong>Online Platforms</strong>: Web-based transfers</li>
              <li className="text-left"><strong>P2P Services</strong>: Direct person-to-person</li>
              <li className="text-left"><strong>Digital Cards</strong>: Virtual card transfers</li>
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
            Micro transfers typically require minimal documentation, focusing on digital verification 
            methods.
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
                  <td className="py-2 px-4 text-left">Email/Phone</td>
                  <td className="py-2 px-4 text-left">Basic verification</td>
                  <td className="py-2 px-4 text-left">First transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Digital ID</td>
                  <td className="py-2 px-4 text-left">Identity verification</td>
                  <td className="py-2 px-4 text-left">First transfer</td>
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
        Best Practices for Micro Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure smooth and cost-effective micro transfers:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Use digital-first providers</li>
              <li className="text-left">Check for fee-free options</li>
              <li className="text-left">Verify recipient details</li>
              <li className="text-left">Use secure networks</li>
              <li className="text-left">Keep digital records</li>
              <li className="text-left">Consider transfer timing</li>
              <li className="text-left">Review terms and conditions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Micro transfers are all about speed and convenience. Focus on finding providers that 
            offer instant or near-instant transfers with minimal fees.
          </p>
          <p className="text-left">
            Remember that digital-first providers often offer the best combination of speed, 
            convenience, and low costs for micro transfers.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Micro International Money Transfers: A Complete Guide"
      subtitle="Everything you need to know about managing small digital transfers, from instant payments to cost optimization"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="5"
      relatedGuides={relatedGuides}
    />
  );
};

export default MicroTransfers; 