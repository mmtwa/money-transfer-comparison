import React from 'react';
import GuideDetail from '../GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../../assets/images/guides/method/traditional-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/method/traditional-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../../components/common/ResponsiveImage';

/**
 * Guide for traditional users managing international money transfers
 */
const Traditional = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'traditional-methods': true,
    'bank-transfers': true,
    'cash-services': true,
    'documentation': true,
    'security-measures': true,
    'cost-considerations': true,
    'when-to-use': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Digital Adapters Guide',
      description: 'How to transition from traditional banking to digital-first money transfer solutions.',
      path: '/guides/method/digital-adapter'
    },
    {
      title: 'Security Tips for Money Transfers',
      description: 'Essential security measures for protecting your transactions.',
      path: '/guides/security-tips'
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
        The Traditional User's Guide to International Money Transfers: Time-Tested Methods
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            If you prefer traditional banking methods and face-to-face interactions, this guide is for you. We'll explore reliable, established ways to send money internationally while maintaining the personal touch and security you value.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Traditional Methods Still Matter</h3>
            <p className="mb-4 text-left">
              While digital banking has grown in popularity, traditional methods continue to offer unique advantages: personal service, physical documentation, and established security measures that many users find reassuring.
            </p>
            <p className="text-left">
              This guide will help you navigate the world of traditional international transfers, ensuring you can send money safely and efficiently using methods you're comfortable with.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="traditional-methods" 
        isExpanded={expandedSections['traditional-methods']} 
        onClick={toggleSection}
      >
        Understanding Traditional Transfer Methods
      </ClickableHeadline>
      {expandedSections['traditional-methods'] && (
        <>
          <p className="mb-4 text-left">
            Traditional money transfer methods have stood the test of time. Here's what you need to know about the most reliable options.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Bank-Based Methods</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Wire transfers</li>
                <li className="text-left">Bank drafts</li>
                <li className="text-left">International checks</li>
                <li className="text-left">Telegraphic transfers</li>
                <li className="text-left">Correspondent banking</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Money Transfer Services</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Western Union</li>
                <li className="text-left">MoneyGram</li>
                <li className="text-left">Ria Money Transfer</li>
                <li className="text-left">Local exchange offices</li>
                <li className="text-left">Postal money orders</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="bank-transfers" 
        isExpanded={expandedSections['bank-transfers']} 
        onClick={toggleSection}
      >
        Bank-Based International Transfers
      </ClickableHeadline>
      {expandedSections['bank-transfers'] && (
        <>
          <p className="mb-6 text-left">
            Bank transfers remain one of the most secure and reliable methods for sending money internationally. Here's what you need to know.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Types of Bank Transfers</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Wire Transfers</strong>: Fast, secure transfers between banks</li>
              <li className="mb-2 text-left"><strong>SWIFT Transfers</strong>: International bank-to-bank transfers</li>
              <li className="mb-2 text-left"><strong>Bank Drafts</strong>: Physical documents for international payments</li>
              <li className="mb-2 text-left"><strong>Telegraphic Transfers</strong>: Electronic funds transfers</li>
              <li className="mb-2 text-left"><strong>Correspondent Banking</strong>: Using bank partnerships for transfers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cash-services" 
        isExpanded={expandedSections['cash-services']} 
        onClick={toggleSection}
      >
        Cash-Based Transfer Services
      </ClickableHeadline>
      {expandedSections['cash-services'] && (
        <>
          <p className="mb-6 text-left">
            For those who prefer cash transactions or need to send money to recipients without bank accounts, cash-based services offer practical solutions.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Popular Cash Transfer Services</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Western Union</strong>: Global network with cash pickup</li>
              <li className="text-left"><strong>MoneyGram</strong>: Fast cash transfers worldwide</li>
              <li className="text-left"><strong>Ria Money Transfer</strong>: Competitive rates for cash transfers</li>
              <li className="text-left"><strong>Local Exchange Offices</strong>: Often offer better rates than banks</li>
              <li className="text-left"><strong>Postal Services</strong>: International money orders and transfers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="documentation" 
        isExpanded={expandedSections['documentation']} 
        onClick={toggleSection}
      >
        Required Documentation and Paperwork
      </ClickableHeadline>
      {expandedSections['documentation'] && (
        <>
          <p className="mb-4 text-left">
            Traditional transfer methods typically require specific documentation. Here's what you'll need to prepare.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Personal Identification</h3>
              <p className="mb-4 text-left">
                Required documents for sender and recipient verification.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Transfer Forms</h3>
              <p className="mb-4 text-left">
                Understanding and completing transfer documentation correctly.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Receipts and Records</h3>
              <p className="mb-4 text-left">
                Keeping proper documentation of your transfers.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-measures" 
        isExpanded={expandedSections['security-measures']} 
        onClick={toggleSection}
      >
        Security in Traditional Transfers
      </ClickableHeadline>
      {expandedSections['security-measures'] && (
        <>
          <p className="mb-6 text-left">
            Traditional methods offer established security measures. Here's how to ensure your transfers are safe.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Security Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Verification</strong>: Always verify recipient details</li>
              <li className="text-left"><strong>Documentation</strong>: Keep all transfer receipts</li>
              <li className="text-left"><strong>Location</strong>: Use reputable, established locations</li>
              <li className="text-left"><strong>Confirmation</strong>: Get transfer confirmation numbers</li>
              <li className="text-left"><strong>Privacy</strong>: Protect your personal information</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cost-considerations" 
        isExpanded={expandedSections['cost-considerations']} 
        onClick={toggleSection}
      >
        Understanding Costs and Fees
      </ClickableHeadline>
      {expandedSections['cost-considerations'] && (
        <>
          <p className="mb-4 text-left">
            Traditional transfer methods often have different fee structures. Here's how to understand and compare costs.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Transfer Method</th>
                  <th className="py-2 px-4 text-left">Typical Fees</th>
                  <th className="py-2 px-4 text-left">Processing Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Bank Wire Transfer</td>
                  <td className="py-2 px-4 text-left">$15-45 per transfer</td>
                  <td className="py-2 px-4 text-left">1-3 business days</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Money Order</td>
                  <td className="py-2 px-4 text-left">$5-10 per order</td>
                  <td className="py-2 px-4 text-left">5-7 business days</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Cash Transfer Service</td>
                  <td className="py-2 px-4 text-left">2-5% of amount</td>
                  <td className="py-2 px-4 text-left">Minutes to hours</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Bank Draft</td>
                  <td className="py-2 px-4 text-left">$10-30 per draft</td>
                  <td className="py-2 px-4 text-left">3-5 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="when-to-use" 
        isExpanded={expandedSections['when-to-use']} 
        onClick={toggleSection}
      >
        When to Choose Traditional Methods
      </ClickableHeadline>
      {expandedSections['when-to-use'] && (
        <>
          <p className="mb-6 text-left">
            Traditional transfer methods are often the best choice in certain situations. Here's when to use them.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Ideal Scenarios for Traditional Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Large transfers requiring personal verification</li>
              <li className="text-left">Recipients without bank accounts</li>
              <li className="text-left">Countries with limited digital infrastructure</li>
              <li className="text-left">Situations requiring physical documentation</li>
              <li className="text-left">When personal assistance is needed</li>
              <li className="text-left">Emergency transfers requiring immediate cash</li>
              <li className="text-left">Complex international transactions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Making the Right Choice</h2>
          <p className="mb-6 text-left">
            While digital methods are growing in popularity, traditional transfer methods continue to serve important needs. Understanding when and how to use them effectively can help you make the best choice for your situation.
          </p>
          <p className="text-left">
            Remember that the most important factors are security, reliability, and meeting your specific needs. Traditional methods often excel in these areas, making them a valuable option for many international transfers.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="The Traditional User's Guide to International Money Transfers"
      subtitle="Reliable, established methods for sending money internationally with confidence"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="10"
      relatedGuides={relatedGuides}
    />
  );
};

export default Traditional; 