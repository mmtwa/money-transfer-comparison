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
 * Guide to mid-range international money transfers
 */
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
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'High-Value Transfers Guide',
      description: 'Essential information for managing large international transfers, including security, compliance, and optimization strategies.',
      path: '/guides/high-value'
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
        Introduction to Mid-Range Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Mid-range international money transfers represent a significant portion of global remittances, 
            typically ranging from £1,000 to £50,000. These transfers often serve purposes like education 
            funding, property purchases, or business investments.
          </p>
          
          <p className="mb-8 text-left">
            This guide will help you navigate the complexities of mid-range transfers, from selecting 
            the right provider to optimizing costs and ensuring secure transactions.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">What Constitutes a Mid-Range Transfer?</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Personal transfers</strong>: £1,000 - £50,000</li>
              <li className="text-left"><strong>Education payments</strong>: £5,000 - £30,000</li>
              <li className="text-left"><strong>Property deposits</strong>: £10,000 - £50,000</li>
              <li className="text-left"><strong>Business expenses</strong>: £5,000 - £50,000</li>
              <li className="text-left"><strong>Investment transfers</strong>: £10,000 - £50,000</li>
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
            Effective planning is crucial for mid-range transfers to ensure you get the best value 
            while maintaining security and compliance.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Timing Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Exchange rate trends</li>
                <li className="text-left">Provider processing times</li>
                <li className="text-left">Payment deadlines</li>
                <li className="text-left">Banking hours</li>
                <li className="text-left">Weekend/holiday impacts</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Amount Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Fee structures</li>
                <li className="text-left">Exchange rate tiers</li>
                <li className="text-left">Transfer limits</li>
                <li className="text-left">Documentation requirements</li>
                <li className="text-left">Tax implications</li>
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
            Choosing the right provider for mid-range transfers requires careful consideration of 
            multiple factors to ensure the best combination of cost, speed, and reliability.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Provider Selection Criteria</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Transfer Limits</strong>: Maximum and minimum amounts</li>
              <li className="mb-2 text-left"><strong>Fee Structure</strong>: Fixed vs. percentage-based fees</li>
              <li className="mb-2 text-left"><strong>Exchange Rates</strong>: Rate competitiveness</li>
              <li className="mb-2 text-left"><strong>Transfer Speed</strong>: Processing times</li>
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
            Mid-range transfers require appropriate security measures while maintaining a balance 
            between security and convenience.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Security Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Identity Verification</strong>: Required documentation</li>
              <li className="text-left"><strong>Source of Funds</strong>: Basic verification</li>
              <li className="text-left"><strong>Anti-Fraud Measures</strong>: Security protocols</li>
              <li className="text-left"><strong>Transaction Monitoring</strong>: Suspicious activity detection</li>
              <li className="text-left"><strong>Fund Protection</strong>: Insurance coverage</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tax-implications" 
        isExpanded={expandedSections['tax-implications']} 
        onClick={toggleSection}
      >
        Tax and Legal Considerations
      </ClickableHeadline>
      {expandedSections['tax-implications'] && (
        <>
          <p className="mb-4 text-left">
            Understanding the tax implications of mid-range transfers is essential for compliance 
            and financial planning.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Tax Reporting Requirements</h3>
              <p className="mb-4 text-left">
                Understand reporting thresholds in both sending and receiving countries.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Capital Gains Tax</h3>
              <p className="mb-4 text-left">
                Consider implications of currency gains or losses.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Gift Tax</h3>
              <p className="mb-4 text-left">
                Be aware of gift tax implications for personal transfers.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="exchange-rate-strategy" 
        isExpanded={expandedSections['exchange-rate-strategy']} 
        onClick={toggleSection}
      >
        Exchange Rate Strategy
      </ClickableHeadline>
      {expandedSections['exchange-rate-strategy'] && (
        <>
          <p className="mb-6 text-left">
            For mid-range transfers, exchange rates can significantly impact the final amount received. 
            Understanding how to optimize your exchange rate is crucial.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Exchange Rate Management Tools</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Rate Alerts</strong>: Monitor market movements</li>
              <li className="text-left"><strong>Limit Orders</strong>: Set target rates</li>
              <li className="text-left"><strong>Forward Contracts</strong>: Lock in rates</li>
              <li className="text-left"><strong>Market Analysis</strong>: Understand trends</li>
              <li className="text-left"><strong>Provider Comparison</strong>: Compare rates across providers</li>
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
            Mid-range transfers require specific documentation to satisfy regulatory requirements 
            and ensure smooth processing.
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
                  <td className="py-2 px-4 text-left">Proof of Identity</td>
                  <td className="py-2 px-4 text-left">Verify sender identity</td>
                  <td className="py-2 px-4 text-left">Always</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Proof of Address</td>
                  <td className="py-2 px-4 text-left">Verify residence</td>
                  <td className="py-2 px-4 text-left">Always</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Source of Funds</td>
                  <td className="py-2 px-4 text-left">Verify fund origin</td>
                  <td className="py-2 px-4 text-left">Above £10,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Purpose of Transfer</td>
                  <td className="py-2 px-4 text-left">Verify transfer purpose</td>
                  <td className="py-2 px-4 text-left">Above £10,000</td>
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
        Best Practices for Mid-Range Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure a smooth and successful mid-range transfer:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Plan your transfer in advance</li>
              <li className="text-left">Compare multiple providers</li>
              <li className="text-left">Prepare documentation early</li>
              <li className="text-left">Monitor exchange rates</li>
              <li className="text-left">Use secure payment methods</li>
              <li className="text-left">Keep detailed records</li>
              <li className="text-left">Consider transfer timing</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Mid-range transfers require careful planning and execution, but with the right approach 
            and provider, they can be managed efficiently and securely. Remember to balance cost, 
            speed, and security when making your decision.
          </p>
          <p className="text-left">
            Always verify the credentials of your chosen provider and ensure you understand all 
            fees and exchange rates before proceeding with your transfer.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Mid-Range International Money Transfers: A Complete Guide"
      subtitle="Everything you need to know about managing medium-sized international transfers, from planning and security to optimizing costs and ensuring compliance"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default MidValueTransfers; 