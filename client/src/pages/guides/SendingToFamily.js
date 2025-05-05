import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/family-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/family-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to family
 */
const SendingToFamily = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'provider-selection': true,
    'security-considerations': true,
    'cost-optimization': true,
    'transfer-methods': true,
    'required-documentation': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Low-Value Transfers Guide',
      description: 'Essential information for managing small international transfers, including cost optimization and convenience strategies.',
      path: '/guides/low-value'
    },
    {
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
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
        Introduction to Sending Money to Family
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Sending money to family members abroad is a common need that requires careful consideration 
            of various factors. This guide will help you make informed decisions about your family 
            remittances.
          </p>
          
          <p className="mb-8 text-left">
            From regular support payments to emergency funds, learn how to handle your family 
            transfers efficiently and securely.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Considerations</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Regular Transfers</strong>: Setting up recurring payments</li>
              <li className="text-left"><strong>Emergency Funds</strong>: Quick access when needed</li>
              <li className="text-left"><strong>Cost Management</strong>: Minimizing transfer fees</li>
              <li className="text-left"><strong>Security</strong>: Protecting your transfers</li>
              <li className="text-left"><strong>Convenience</strong>: Easy access for recipients</li>
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
            A successful family transfer strategy requires careful planning. Here's what to consider 
            in your planning phase.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Transfer Frequency</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Regular monthly transfers</li>
                <li className="text-left">One-time payments</li>
                <li className="text-left">Emergency transfers</li>
                <li className="text-left">Special occasions</li>
                <li className="text-left">Holiday gifts</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Amount Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Transfer limits</li>
                <li className="text-left">Fee structures</li>
                <li className="text-left">Exchange rates</li>
                <li className="text-left">Recipient needs</li>
                <li className="text-left">Budget planning</li>
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
        Provider Selection
      </ClickableHeadline>
      {expandedSections['provider-selection'] && (
        <>
          <p className="mb-6 text-left">
            Choosing the right provider is crucial for family transfers. Consider these factors 
            when selecting a service.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Provider Considerations</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Transfer Speed</strong>: How quickly funds arrive</li>
              <li className="mb-2 text-left"><strong>Fees</strong>: Total cost of transfers</li>
              <li className="mb-2 text-left"><strong>Exchange Rates</strong>: Competitive rates offered</li>
              <li className="mb-2 text-left"><strong>Recipient Access</strong>: How family can receive funds</li>
              <li className="mb-2 text-left"><strong>Customer Service</strong>: Support availability</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-considerations" 
        isExpanded={expandedSections['security-considerations']} 
        onClick={toggleSection}
      >
        Security Considerations
      </ClickableHeadline>
      {expandedSections['security-considerations'] && (
        <>
          <p className="mb-6 text-left">
            Security is paramount when sending money to family. Here are essential security 
            measures to consider.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Security Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Provider Security</strong>: Choose regulated providers</li>
              <li className="text-left"><strong>Account Protection</strong>: Secure login methods</li>
              <li className="text-left"><strong>Transaction Verification</strong>: Confirm transfer details</li>
              <li className="text-left"><strong>Recipient Verification</strong>: Confirm recipient details</li>
              <li className="text-left"><strong>Fraud Prevention</strong>: Monitor for suspicious activity</li>
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
          <p className="mb-6 text-left">
            Optimizing costs is important for regular family transfers. Here are strategies to 
            minimize fees and maximize value.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Cost-Saving Strategies</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Compare Providers</strong>: Find the best rates</li>
              <li className="text-left"><strong>Batch Transfers</strong>: Combine multiple payments</li>
              <li className="text-left"><strong>Loyalty Programs</strong>: Use provider rewards</li>
              <li className="text-left"><strong>Special Offers</strong>: Look for promotions</li>
              <li className="text-left"><strong>Digital Options</strong>: Lower-cost digital transfers</li>
            </ul>
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
          <p className="mb-4 text-left">
            Different transfer methods offer various benefits for family remittances. Choose the 
            method that best suits your needs.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Bank Transfers</h3>
              <p className="mb-4 text-left">
                Direct transfers to recipient's bank account, offering security and convenience.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Mobile Wallets</h3>
              <p className="mb-4 text-left">
                Digital wallets for quick and easy access to funds.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Cash Pickup</h3>
              <p className="mb-4 text-left">
                Physical pickup locations for recipients without bank accounts.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="required-documentation" 
        isExpanded={expandedSections['required-documentation']} 
        onClick={toggleSection}
      >
        Required Documentation
      </ClickableHeadline>
      {expandedSections['required-documentation'] && (
        <>
          <p className="mb-4 text-left">
            Family transfers require specific documentation. Here's what you'll need to prepare.
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
                  <td className="py-2 px-4 text-left">ID Proof</td>
                  <td className="py-2 px-4 text-left">Sender verification</td>
                  <td className="py-2 px-4 text-left">First transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Address Proof</td>
                  <td className="py-2 px-4 text-left">Residence verification</td>
                  <td className="py-2 px-4 text-left">First transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Recipient Details</td>
                  <td className="py-2 px-4 text-left">Transfer routing</td>
                  <td className="py-2 px-4 text-left">Each transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Source of Funds</td>
                  <td className="py-2 px-4 text-left">Compliance</td>
                  <td className="py-2 px-4 text-left">Large transfers</td>
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
        Best Practices for Family Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure smooth and secure family transfers:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Plan transfers in advance</li>
              <li className="text-left">Monitor exchange rates</li>
              <li className="text-left">Keep emergency funds</li>
              <li className="text-left">Use secure networks</li>
              <li className="text-left">Track all transfers</li>
              <li className="text-left">Maintain documentation</li>
              <li className="text-left">Stay within budget</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Sending money to family requires careful planning and consideration. Take the time to 
            understand your options and make informed decisions.
          </p>
          <p className="text-left">
            Remember that proper planning and cost management can help ensure your family receives 
            the support they need efficiently and securely.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Sending Money to Family: A Complete Guide"
      subtitle="Everything you need to know about sending money to family members abroad, from regular support to emergency transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendingToFamily; 