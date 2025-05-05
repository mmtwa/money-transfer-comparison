import React from 'react';
import GuideDetail from '../../guides/GuideDetail';
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
import heroImageJpg from '../../../assets/images/guides/one-time-transfers-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/one-time-transfers-hero.webp';

const OneTimeTransfers = () => {
  const sections = {
    'introduction': true,
    'when-to-use': true,
    'transfer-options': true,
    'cost-comparison': true,
    'security-measures': true,
    'timing-strategies': true,
    'common-pitfalls': true
  };

  const [expandedSections, toggleSection] = useExpandableSections(sections);

  const relatedGuides = [
    {
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'Periodic Transfers Guide',
      description: 'Learn how to set up and optimize your regular international payments.',
      path: '/guides/frequency/periodic'
    },
    {
      title: 'Occasional Transfers Guide',
      description: 'Learn how to handle irregular international payments effectively.',
      path: '/guides/frequency/occasional'
    }
  ];

  const content = (
    <>
      <ClickableHeadline 
        id="introduction" 
        isExpanded={expandedSections['introduction']} 
        onClick={toggleSection}
      >
        The Essential Guide to One-Time International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Making a one-time international money transfer can be a significant financial decision. Whether you're purchasing property abroad, paying for a major expense, or sending a large gift, understanding the process is crucial for a successful transfer.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why One-Time Transfers Matter</h3>
            <p className="mb-4 text-left">
              Single international transfers often involve larger amounts and require careful planning to ensure the best rates, security, and timing. This guide will help you navigate the process with confidence.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="when-to-use" 
        isExpanded={expandedSections['when-to-use']} 
        onClick={toggleSection}
      >
        When to Use One-Time Transfers
      </ClickableHeadline>
      {expandedSections['when-to-use'] && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Common Scenarios</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Property purchases</li>
                <li className="text-left">Major business transactions</li>
                <li className="text-left">Large gifts or inheritances</li>
                <li className="text-left">Education payments</li>
                <li className="text-left">Investment transfers</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Key Considerations</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Transfer amount</li>
                <li className="text-left">Time sensitivity</li>
                <li className="text-left">Currency pair</li>
                <li className="text-left">Recipient location</li>
                <li className="text-left">Documentation requirements</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-options" 
        isExpanded={expandedSections['transfer-options']} 
        onClick={toggleSection}
      >
        Transfer Options and Methods
      </ClickableHeadline>
      {expandedSections['transfer-options'] && (
        <>
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Bank Transfers</h3>
              <p className="mb-4 text-left">
                Traditional bank transfers offer security but may have higher fees and slower processing times.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Specialist Providers</h3>
              <p className="mb-4 text-left">
                Currency exchange specialists often offer better rates and dedicated support for large transfers.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Online Platforms</h3>
              <p className="mb-4 text-left">
                Digital platforms can offer competitive rates and convenient tracking, but verify their security measures.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cost-comparison" 
        isExpanded={expandedSections['cost-comparison']} 
        onClick={toggleSection}
      >
        Understanding and Comparing Costs
      </ClickableHeadline>
      {expandedSections['cost-comparison'] && (
        <>
          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Cost Components</h3>
            <ul className="list-disc pl-8">
              <li className="text-left">Exchange rate margin</li>
              <li className="text-left">Transfer fees</li>
              <li className="text-left">Intermediary bank charges</li>
              <li className="text-left">Recipient bank fees</li>
              <li className="text-left">Additional service charges</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-measures" 
        isExpanded={expandedSections['security-measures']} 
        onClick={toggleSection}
      >
        Security and Verification
      </ClickableHeadline>
      {expandedSections['security-measures'] && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Essential Security Steps</h3>
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left">Verify recipient details</li>
              <li className="mb-2 text-left">Use secure payment methods</li>
              <li className="mb-2 text-left">Enable two-factor authentication</li>
              <li className="mb-2 text-left">Keep transaction records</li>
              <li className="mb-2 text-left">Monitor transfer status</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="timing-strategies" 
        isExpanded={expandedSections['timing-strategies']} 
        onClick={toggleSection}
      >
        Timing Your Transfer
      </ClickableHeadline>
      {expandedSections['timing-strategies'] && (
        <>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Strategic Timing Tips</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Monitor exchange rate trends</li>
              <li className="text-left">Consider market volatility</li>
              <li className="text-left">Account for processing times</li>
              <li className="text-left">Plan for time zone differences</li>
              <li className="text-left">Avoid peak periods</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="common-pitfalls" 
        isExpanded={expandedSections['common-pitfalls']} 
        onClick={toggleSection}
      >
        Common Pitfalls to Avoid
      </ClickableHeadline>
      {expandedSections['common-pitfalls'] && (
        <>
          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 text-left">Mistakes to Watch Out For</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Not verifying exchange rates</li>
              <li className="text-left">Missing documentation</li>
              <li className="text-left">Incorrect recipient details</li>
              <li className="text-left">Ignoring transfer limits</li>
              <li className="text-left">Poor timing decisions</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="The Essential Guide to One-Time International Money Transfers"
      subtitle="Everything you need to know about making single international money transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default OneTimeTransfers; 