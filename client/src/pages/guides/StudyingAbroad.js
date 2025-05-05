import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/study-abroad-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/study-abroad-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to studying abroad
 */
const StudyingAbroad = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'financial-planning': true,
    'transfer-strategy': true,
    'banking-considerations': true,
    'cost-optimization': true,
    'required-documentation': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Mid-Value Transfers Guide',
      description: 'Essential information for managing medium-sized international transfers, including cost optimization and convenience strategies.',
      path: '/guides/mid-value'
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
        Introduction to Studying Abroad
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Studying abroad is an exciting opportunity that requires careful financial planning and 
            understanding of international money transfers. This guide will help you manage your 
            finances effectively while studying overseas.
          </p>
          
          <p className="mb-8 text-left">
            From tuition payments to living expenses, learn how to handle your international 
            transfers efficiently and cost-effectively.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Considerations</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Tuition Payments</strong>: Managing large academic payments</li>
              <li className="text-left"><strong>Living Expenses</strong>: Regular transfers for daily needs</li>
              <li className="text-left"><strong>Banking Setup</strong>: Local and international accounts</li>
              <li className="text-left"><strong>Cost Management</strong>: Minimizing transfer fees</li>
              <li className="text-left"><strong>Documentation</strong>: Required paperwork for transfers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="planning-strategy" 
        isExpanded={expandedSections['planning-strategy']} 
        onClick={toggleSection}
      >
        Planning Your Financial Strategy
      </ClickableHeadline>
      {expandedSections['planning-strategy'] && (
        <>
          <p className="mb-4 text-left">
            A successful study abroad experience requires careful financial planning. Here's what 
            to consider in your planning phase.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Academic Costs</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Tuition fees</li>
                <li className="text-left">Course materials</li>
                <li className="text-left">Academic services</li>
                <li className="text-left">Student insurance</li>
                <li className="text-left">Academic trips</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Living Expenses</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Accommodation</li>
                <li className="text-left">Food and groceries</li>
                <li className="text-left">Transportation</li>
                <li className="text-left">Entertainment</li>
                <li className="text-left">Emergency funds</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="financial-planning" 
        isExpanded={expandedSections['financial-planning']} 
        onClick={toggleSection}
      >
        Financial Planning
      </ClickableHeadline>
      {expandedSections['financial-planning'] && (
        <>
          <p className="mb-6 text-left">
            Proper financial planning is essential for a successful study abroad experience. Consider 
            all costs and funding options.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
              Key Factors
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Financial Requirements</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Budget Planning</strong>: Comprehensive cost assessment</li>
              <li className="mb-2 text-left"><strong>Funding Sources</strong>: Scholarships and loans</li>
              <li className="mb-2 text-left"><strong>Payment Schedule</strong>: Tuition and living expenses</li>
              <li className="mb-2 text-left"><strong>Currency Management</strong>: Exchange rate considerations</li>
              <li className="mb-2 text-left"><strong>Emergency Funds</strong>: Backup financial resources</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-strategy" 
        isExpanded={expandedSections['transfer-strategy']} 
        onClick={toggleSection}
      >
        Transfer Strategy
      </ClickableHeadline>
      {expandedSections['transfer-strategy'] && (
        <>
          <p className="mb-6 text-left">
            Managing international transfers for studying abroad requires careful planning and 
            consideration of various factors.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Transfer Considerations</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Tuition Payments</strong>: Large academic transfers</li>
              <li className="text-left"><strong>Regular Transfers</strong>: Monthly living expenses</li>
              <li className="text-left"><strong>Emergency Funds</strong>: Quick access when needed</li>
              <li className="text-left"><strong>Exchange Rates</strong>: Timing of transfers</li>
              <li className="text-left"><strong>Transfer Limits</strong>: Provider restrictions</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="banking-considerations" 
        isExpanded={expandedSections['banking-considerations']} 
        onClick={toggleSection}
      >
        Banking Considerations
      </ClickableHeadline>
      {expandedSections['banking-considerations'] && (
        <>
          <p className="mb-4 text-left">
            Setting up the right banking arrangements is crucial for managing your finances while 
            studying abroad.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Local Bank Account</h3>
              <p className="mb-4 text-left">
                Consider opening a local bank account for easier access to funds and reduced fees.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. International Cards</h3>
              <p className="mb-4 text-left">
                Use international debit/credit cards with low foreign transaction fees.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Digital Banking</h3>
              <p className="mb-4 text-left">
                Consider digital banking options for convenient money management.
              </p>
            </div>
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
            Optimizing your transfer costs can save significant amounts over your study period.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Cost-Saving Strategies</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Batch Transfers</strong>: Combine multiple payments</li>
              <li className="text-left"><strong>Fee Comparison</strong>: Compare provider fees</li>
              <li className="text-left"><strong>Exchange Rates</strong>: Monitor and time transfers</li>
              <li className="text-left"><strong>Student Discounts</strong>: Special student rates</li>
              <li className="text-left"><strong>Digital Options</strong>: Lower-cost digital transfers</li>
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
            Studying abroad requires various documents for financial transactions. Here's what 
            you'll need to prepare.
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
                  <td className="py-2 px-4 text-left">Student ID</td>
                  <td className="py-2 px-4 text-left">Student verification</td>
                  <td className="py-2 px-4 text-left">Throughout study</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Bank Statements</td>
                  <td className="py-2 px-4 text-left">Proof of funds</td>
                  <td className="py-2 px-4 text-left">Initial setup</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Visa Documents</td>
                  <td className="py-2 px-4 text-left">Legal status</td>
                  <td className="py-2 px-4 text-left">Throughout stay</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Enrollment Proof</td>
                  <td className="py-2 px-4 text-left">Student status</td>
                  <td className="py-2 px-4 text-left">Throughout study</td>
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
        Best Practices for Studying Abroad
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure smooth financial management while 
            studying abroad:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Plan transfers in advance</li>
              <li className="text-left">Monitor exchange rates</li>
              <li className="text-left">Keep emergency funds</li>
              <li className="text-left">Use secure networks</li>
              <li className="text-left">Track all expenses</li>
              <li className="text-left">Maintain documentation</li>
              <li className="text-left">Stay within budget</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Studying abroad is an exciting opportunity that requires careful financial planning. 
            Take the time to understand your options and make informed decisions.
          </p>
          <p className="text-left">
            Remember that proper planning and cost management can help you focus on your studies 
            without financial stress.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="Studying Abroad: A Complete Financial Guide"
      subtitle="Everything you need to know about managing your finances while studying overseas, from tuition payments to living expenses"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 25, 2025"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default StudyingAbroad; 