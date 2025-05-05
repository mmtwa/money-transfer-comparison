import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/business-purpose-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/business-purpose-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide for business purposes international transfers
 */
const BusinessPurpose = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'provider-selection': true,
    'compliance-regulations': true,
    'payment-strategies': true,
    'risk-management': true,
    'cost-optimization': true,
    'required-documentation': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Business Transfers Guide',
      description: 'Essential information for managing business-related international transfers, including compliance and cost optimization.',
      path: '/guides/business-transfers'
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
        Introduction to Business Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Transferring money internationally for business purposes—whether for vendor payments, payroll, or supplier invoices—requires strategic planning and attention to costs, compliance, and timing.
          </p>
          <p className="mb-8 text-left">
            This guide will walk you through key considerations to ensure your business transfers are efficient, secure, and cost-effective.
          </p>
        </>
      )}

      <ClickableHeadline
        id="planning-strategy"
        isExpanded={expandedSections['planning-strategy']}
        onClick={toggleSection}
      >
        Planning Your Business Payment Strategy
      </ClickableHeadline>
      {expandedSections['planning-strategy'] && (
        <>
          <p className="mb-4 text-left">
            A clear payment strategy helps manage cash flow, reduce fees, and optimize timing.
          </p>
          <div className="bg-white shadow-sm rounded p-5 mb-8">
            <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Key Elements</h3>
            <ul className="list-disc pl-8">
              <li className="text-left">Payment schedules</li>
              <li className="text-left">Amount batching</li>
              <li className="text-left">Currency timing</li>
              <li className="text-left">Stakeholder coordination</li>
            </ul>
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
            Choosing a provider with corporate features can streamline transactions and reduce costs.
          </p>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Considerations</h3>
            <ul className="list-disc pl-8 mb-4">
              <li className="text-left"><strong>Bulk payments</strong>: Consolidate multiple invoices</li>
              <li className="text-left"><strong>API integration</strong>: Automate transfers</li>
              <li className="text-left"><strong>Corporate accounts</strong>: Dedicated business features</li>
              <li className="text-left"><strong>Customer support</strong>: Dedicated account managers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline
        id="compliance-regulations"
        isExpanded={expandedSections['compliance-regulations']}
        onClick={toggleSection}
      >
        Compliance & Regulations
      </ClickableHeadline>
      {expandedSections['compliance-regulations'] && (
        <>
          <p className="mb-6 text-left">
            Business transfers often trigger additional regulatory requirements and due diligence.
          </p>
          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Regulatory Requirements</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>KYC/AML</strong>: Customer verification</li>
              <li className="text-left"><strong>Reporting</strong>: Country-specific filings</li>
              <li className="text-left"><strong>Sanctions screening</strong>: Vendor compliance</li>
              <li className="text-left"><strong>Document retention</strong>: Audit trails</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline
        id="payment-strategies"
        isExpanded={expandedSections['payment-strategies']}
        onClick={toggleSection}
      >
        Payment & FX Strategies
      </ClickableHeadline>
      {expandedSections['payment-strategies'] && (
        <>
          <p className="mb-6 text-left">
            Leverage FX tools and payment strategies to hedge risk and optimize rates.
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Strategies</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Forward contracts</strong>: Lock in rates</li>
              <li className="text-left"><strong>Spot transfers</strong>: Immediate execution</li>
              <li className="text-left"><strong>Rate alerts</strong>: Monitor live rates</li>
              <li className="text-left"><strong>Batch conversions</strong>: Consolidate transfers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline
        id="risk-management"
        isExpanded={expandedSections['risk-management']}
        onClick={toggleSection}
      >
        Risk Management
      </ClickableHeadline>
      {expandedSections['risk-management'] && (
        <>
          <p className="mb-6 text-left">
            Identify and mitigate risks related to currency volatility and payment failures.
          </p>
          <div className="bg-white shadow-sm rounded p-5 mb-8">
            <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Key Risks</h3>
            <ul className="list-disc pl-8">
              <li className="text-left">Currency fluctuations</li>
              <li className="text-left">Counterparty risk</li>
              <li className="text-left">Operational delays</li>
              <li className="text-left">Compliance breaches</li>
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
            Minimizing fees and maximizing value is essential for business transfer budgets.
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Tips</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Fee comparison</strong>: Evaluate total cost</li>
              <li className="text-left"><strong>Volume discounts</strong>: Negotiate bulk rates</li>
              <li className="text-left"><strong>Loyalty programs</strong>: Use provider incentives</li>
              <li className="text-left"><strong>Digital channels</strong>: Lower-cost options</li>
            </ul>
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
            Ensure you have the right paperwork for corporate transfers and audits.
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
                  <td className="py-2 px-4 text-left">Corporate ID</td>
                  <td className="py-2 px-4 text-left">Business verification</td>
                  <td className="py-2 px-4 text-left">Initial setup</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Vendor Invoice</td>
                  <td className="py-2 px-4 text-left">Payment authorization</td>
                  <td className="py-2 px-4 text-left">Each transfer</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Contract Documents</td>
                  <td className="py-2 px-4 text-left">Legal compliance</td>
                  <td className="py-2 px-4 text-left">Large transfers</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Tax Certificates</td>
                  <td className="py-2 px-4 text-left">Reporting</td>
                  <td className="py-2 px-4 text-left">Quarterly/Annually</td>
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
        Best Practices for Business Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Implement these best practices to keep your business transfers efficient and compliant:
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Automate where possible</li>
              <li className="text-left">Maintain audit trails</li>
              <li className="text-left">Regularly review FX exposure</li>
              <li className="text-left">Negotiate corporate pricing</li>
              <li className="text-left">Stay updated on regulations</li>
              <li className="text-left">Ensure stakeholder alignment</li>
            </ul>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Business transfers can be complex, but with the right strategies, you can manage costs, mitigate risks, and maintain compliance.
          </p>
          <p className="text-left">
            Focus on automation, documentation, and strategic FX management to support your business objectives.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Money Transfers for Business Purposes: Comprehensive Guide"
      subtitle="Everything you need to know about sending money for business needs, from vendor payments to payroll and compliance"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default BusinessPurpose; 