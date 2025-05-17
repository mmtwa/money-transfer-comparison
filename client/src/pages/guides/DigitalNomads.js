import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/nomad-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/nomad-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide for digital nomads managing international money transfers
 */

import SEO from '../../components/SEO';
const DigitalNomads = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'banking-setup': true,
    'income-management': true,
    'tax-considerations': true,
    'currency-strategy': true,
    'payment-methods': true,
    'security-measures': true,
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
      description: 'Essential information for managing business-related international transfers, including compliance and cost optimization.',
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
        Introduction to Digital Nomad Finance
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            As a digital nomad, managing your finances across borders requires a unique approach. 
            This guide will help you optimize your international money management and transfers.
          </p>
          
          <p className="mb-8 text-left">
            Learn how to handle multiple currencies, receive payments efficiently, and maintain 
            financial stability while working remotely across different countries.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Considerations</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Multi-Currency Management</strong>: Handling different currencies</li>
              <li className="text-left"><strong>Payment Reception</strong>: Getting paid internationally</li>
              <li className="text-left"><strong>Banking Access</strong>: Maintaining financial access globally</li>
              <li className="text-left"><strong>Tax Compliance</strong>: Managing international tax obligations</li>
              <li className="text-left"><strong>Emergency Access</strong>: Ensuring access to funds anywhere</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="banking-setup" 
        isExpanded={expandedSections['banking-setup']} 
        onClick={toggleSection}
      >
        International Banking Setup
      </ClickableHeadline>
      {expandedSections['banking-setup'] && (
        <>
          <p className="mb-4 text-left">
            A robust banking setup is crucial for digital nomads. Here's how to create an effective 
            international banking structure.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Primary Accounts</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Home country base account</li>
                <li className="text-left">International digital bank</li>
                <li className="text-left">Multi-currency accounts</li>
                <li className="text-left">Business accounts</li>
                <li className="text-left">Emergency fund account</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Digital Solutions</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Mobile banking apps</li>
                <li className="text-left">Payment platforms</li>
                <li className="text-left">Currency exchange tools</li>
                <li className="text-left">Digital wallets</li>
                <li className="text-left">Crypto options</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="income-management" 
        isExpanded={expandedSections['income-management']} 
        onClick={toggleSection}
      >
        Income Management
      </ClickableHeadline>
      {expandedSections['income-management'] && (
        <>
          <p className="mb-6 text-left">
            Managing income effectively is crucial when working internationally. Consider these 
            strategies for optimal income management.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Strategies
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Income Optimization</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Payment Methods</strong>: Choose optimal payment platforms</li>
              <li className="mb-2 text-left"><strong>Currency Selection</strong>: Select stable billing currencies</li>
              <li className="mb-2 text-left"><strong>Payment Timing</strong>: Consider exchange rate fluctuations</li>
              <li className="mb-2 text-left"><strong>Fee Minimization</strong>: Reduce transfer and exchange costs</li>
              <li className="mb-2 text-left"><strong>Income Diversification</strong>: Multiple currency streams</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tax-considerations" 
        isExpanded={expandedSections['tax-considerations']} 
        onClick={toggleSection}
      >
        Tax Considerations
      </ClickableHeadline>
      {expandedSections['tax-considerations'] && (
        <>
          <p className="mb-6 text-left">
            Understanding and managing tax obligations is crucial for digital nomads working across 
            borders.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Tax Management</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Tax Residency</strong>: Understanding your status</li>
              <li className="text-left"><strong>Income Reporting</strong>: Multi-jurisdiction requirements</li>
              <li className="text-left"><strong>Record Keeping</strong>: Maintaining documentation</li>
              <li className="text-left"><strong>Double Taxation</strong>: Avoiding duplicate taxation</li>
              <li className="text-left"><strong>Local Obligations</strong>: Host country requirements</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="currency-strategy" 
        isExpanded={expandedSections['currency-strategy']} 
        onClick={toggleSection}
      >
        Currency Management Strategy
      </ClickableHeadline>
      {expandedSections['currency-strategy'] && (
        <>
          <p className="mb-6 text-left">
            Effective currency management is essential for digital nomads dealing with multiple 
            currencies.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Currency Strategies</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Base Currency</strong>: Choose a stable primary currency</li>
              <li className="text-left"><strong>Exchange Timing</strong>: Strategic currency conversion</li>
              <li className="text-left"><strong>Rate Monitoring</strong>: Track exchange rates</li>
              <li className="text-left"><strong>Risk Management</strong>: Hedge against volatility</li>
              <li className="text-left"><strong>Emergency Reserves</strong>: Multiple currency backup</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="payment-methods" 
        isExpanded={expandedSections['payment-methods']} 
        onClick={toggleSection}
      >
        Payment Methods
      </ClickableHeadline>
      {expandedSections['payment-methods'] && (
        <>
          <p className="mb-4 text-left">
            Digital nomads need flexible and reliable payment methods. Here are the key options to 
            consider.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Digital Payment Platforms</h3>
              <p className="mb-4 text-left">
                International payment services with multi-currency support.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. International Bank Transfers</h3>
              <p className="mb-4 text-left">
                Traditional banking networks for larger transactions.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Digital Wallets</h3>
              <p className="mb-4 text-left">
                Mobile-first solutions for quick access and transfers.
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
        Security Measures
      </ClickableHeadline>
      {expandedSections['security-measures'] && (
        <>
          <p className="mb-4 text-left">
            Security is crucial when managing finances globally. Here are essential security 
            measures to implement.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Security Aspect</th>
                  <th className="py-2 px-4 text-left">Implementation</th>
                  <th className="py-2 px-4 text-left">Importance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Two-Factor Authentication</td>
                  <td className="py-2 px-4 text-left">All financial accounts</td>
                  <td className="py-2 px-4 text-left">Critical</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">VPN Usage</td>
                  <td className="py-2 px-4 text-left">Financial transactions</td>
                  <td className="py-2 px-4 text-left">Essential</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Backup Access</td>
                  <td className="py-2 px-4 text-left">Alternative methods</td>
                  <td className="py-2 px-4 text-left">Important</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Device Security</td>
                  <td className="py-2 px-4 text-left">Encryption, passwords</td>
                  <td className="py-2 px-4 text-left">Mandatory</td>
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
        Best Practices for Digital Nomads
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Follow these best practices to maintain financial stability while working remotely:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Maintain multiple payment options</li>
              <li className="text-left">Keep detailed financial records</li>
              <li className="text-left">Regular tax planning</li>
              <li className="text-left">Emergency fund in stable currency</li>
              <li className="text-left">Regular security audits</li>
              <li className="text-left">Stay informed on regulations</li>
              <li className="text-left">Network with other nomads</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Success as a digital nomad requires careful attention to financial management. Take time 
            to set up robust systems that work across borders.
          </p>
          <p className="text-left">
            Remember that flexibility and preparation are key to maintaining financial stability 
            while embracing the digital nomad lifestyle.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <div>
      <SEO
        title=" Digital Nomads | MyMoneyTransfers"
        description=" Digital Nomads - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/digital-nomads"
      />
      <GuideDetail
        title="Digital Nomad Finance: Managing Money Across Borders"
        subtitle="First-hand expertise on banking, taxes, and transfers for location-independent professionals"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="September 2, 2023"
        readTime="11"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default DigitalNomads; 