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
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'Business Transfers Guide',
      description: 'Essential information for businesses making international payments, including bulk transfers and corporate accounts.',
      path: '/guides/business-transfers'
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
        Introduction to High-Value Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            High-value international money transfers require special consideration and planning. 
            Whether you're purchasing property abroad, making a business investment, or transferring 
            significant personal funds, understanding the nuances of large transfers is crucial.
          </p>
          
          <p className="mb-8 text-left">
            This guide will walk you through everything you need to know about managing high-value 
            transfers effectively, from selecting the right provider to optimizing exchange rates 
            and ensuring compliance with regulations.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">What Constitutes a High-Value Transfer?</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Personal transfers</strong>: Typically over £50,000</li>
              <li className="text-left"><strong>Business transfers</strong>: Usually over £100,000</li>
              <li className="text-left"><strong>Property purchases</strong>: Often £250,000+</li>
              <li className="text-left"><strong>Investment transfers</strong>: Varies by jurisdiction</li>
              <li className="text-left"><strong>Inheritance transfers</strong>: Can be any significant amount</li>
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
            Successful high-value transfers require careful planning and consideration of multiple factors. 
            The key is to develop a comprehensive strategy that addresses all aspects of your transfer.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Timing Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Market conditions and exchange rates</li>
                <li className="text-left">Provider processing times</li>
                <li className="text-left">Regulatory deadlines</li>
                <li className="text-left">Tax year boundaries</li>
                <li className="text-left">Business quarter ends</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Amount Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Transfer limits and thresholds</li>
                <li className="text-left">Fee structures at different amounts</li>
                <li className="text-left">Exchange rate tiers</li>
                <li className="text-left">Regulatory reporting requirements</li>
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
            Not all money transfer providers are equipped to handle high-value transfers effectively. 
            When selecting a provider, consider these key factors:
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Provider Selection Criteria</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Transfer Limits</strong>: Maximum transfer amounts and any restrictions</li>
              <li className="mb-2 text-left"><strong>Fee Structure</strong>: How fees scale with transfer amount</li>
              <li className="mb-2 text-left"><strong>Exchange Rates</strong>: Rate tiers for large transfers</li>
              <li className="mb-2 text-left"><strong>Security Measures</strong>: Fraud prevention and fund protection</li>
              <li className="mb-2 text-left"><strong>Customer Support</strong>: Dedicated account management</li>
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
            High-value transfers are subject to strict security measures and regulatory requirements. 
            Understanding these requirements is essential for a smooth transfer process.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Security Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Enhanced Due Diligence</strong>: Additional verification steps for large transfers</li>
              <li className="text-left"><strong>Source of Funds</strong>: Documentation requirements</li>
              <li className="text-left"><strong>Anti-Money Laundering</strong>: Compliance with AML regulations</li>
              <li className="text-left"><strong>Fraud Prevention</strong>: Additional security measures</li>
              <li className="text-left"><strong>Fund Protection</strong>: Insurance and guarantees</li>
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
            High-value transfers often have significant tax implications. It's crucial to understand 
            the tax requirements in both the sending and receiving countries.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Tax Reporting Requirements</h3>
              <p className="mb-4 text-left">
                Understand the reporting thresholds and requirements in both jurisdictions.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Capital Gains Tax</h3>
              <p className="mb-4 text-left">
                Consider implications of currency gains or losses on your transfer.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Inheritance Tax</h3>
              <p className="mb-4 text-left">
                Be aware of inheritance tax implications for large transfers.
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
            For high-value transfers, even small changes in exchange rates can have significant impacts. 
            Developing a strategy to manage exchange rate risk is essential.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Exchange Rate Management Tools</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Forward Contracts</strong>: Lock in rates for future transfers</li>
              <li className="text-left"><strong>Limit Orders</strong>: Set target rates for automatic execution</li>
              <li className="text-left"><strong>Rate Alerts</strong>: Monitor market movements</li>
              <li className="text-left"><strong>Hedging Strategies</strong>: Protect against adverse movements</li>
              <li className="text-left"><strong>Market Analysis</strong>: Understand rate trends and patterns</li>
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
            High-value transfers require comprehensive documentation to satisfy regulatory requirements 
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
                  <td className="py-2 px-4 text-left">Large transfers</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Tax Documentation</td>
                  <td className="py-2 px-4 text-left">Tax compliance</td>
                  <td className="py-2 px-4 text-left">As required</td>
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
        Best Practices for High-Value Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure a smooth and successful high-value transfer:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Start planning well in advance of your transfer date</li>
              <li className="text-left">Gather all required documentation early</li>
              <li className="text-left">Consider splitting large transfers if beneficial</li>
              <li className="text-left">Use secure communication channels</li>
              <li className="text-left">Keep detailed records of all transactions</li>
              <li className="text-left">Work with experienced providers</li>
              <li className="text-left">Consider using a dedicated account manager</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            High-value transfers require careful planning and execution, but with the right approach 
            and provider, they can be managed efficiently and securely. Remember that the cheapest 
            option isn't always the best - consider the full range of factors including security, 
            compliance, and service quality.
          </p>
          <p className="text-left">
            Always consult with financial and tax advisors for transfers of significant value to 
            ensure compliance with all relevant regulations and to optimize your transfer strategy.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="High-Value International Money Transfers: A Complete Guide"
      subtitle="Everything you need to know about managing large international transfers, from planning and security to optimizing exchange rates and ensuring compliance"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="10"
      relatedGuides={relatedGuides}
    />
  );
};

export default HighValueTransfers; 