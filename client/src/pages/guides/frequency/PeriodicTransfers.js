import React from 'react';
import GuideDetail from '../GuideDetail';
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
import heroImageJpg from '../../../assets/images/guides/periodic-transfers-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/periodic-transfers-hero.webp';
import ResponsiveImage from '../../../components/common/ResponsiveImage';
import SEO from '../../../components/SEO';

const PeriodicTransfers = () => {
  const sections = {
    'introduction': true,
    'types-of-periodic-transfers': true,
    'setting-up': true,
    'cost-optimization': true,
    'security-considerations': true,
    'best-practices': true,
    'common-mistakes': true
  };

  const [expandedSections, toggleSection] = useExpandableSections(sections);

  const relatedGuides = [
    {
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'One-Time Transfers Guide',
      description: 'Everything you need to know about making single international money transfers.',
      path: '/guides/frequency/one-time'
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
        The Complete Guide to Setting Up Periodic International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Whether you're paying for overseas education, supporting family abroad, or managing international business expenses, setting up periodic transfers can save you time and money. This comprehensive guide will help you understand how to set up and optimize your regular international payments.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Periodic Transfers Matter</h3>
            <p className="mb-4 text-left">
              Regular international transfers require careful planning to ensure reliability, cost-effectiveness, and compliance. With the right setup, you can automate your international payments while maintaining control over your finances.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="types-of-periodic-transfers" 
        isExpanded={expandedSections['types-of-periodic-transfers']} 
        onClick={toggleSection}
      >
        Types of Periodic Transfers
      </ClickableHeadline>
      {expandedSections['types-of-periodic-transfers'] && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Common Use Cases</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Monthly rent or mortgage payments</li>
                <li className="text-left">Regular salary payments to overseas employees</li>
                <li className="text-left">Education fee payments</li>
                <li className="text-left">Family support payments</li>
                <li className="text-left">Regular business expenses</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Frequency Options</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Weekly transfers</li>
                <li className="text-left">Monthly transfers</li>
                <li className="text-left">Quarterly transfers</li>
                <li className="text-left">Custom schedules</li>
                <li className="text-left">Date-specific transfers</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="setting-up" 
        isExpanded={expandedSections['setting-up']} 
        onClick={toggleSection}
      >
        Setting Up Your Periodic Transfers
      </ClickableHeadline>
      {expandedSections['setting-up'] && (
        <>
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Choose Your Provider</h3>
              <p className="mb-4 text-left">
                Select a provider that offers reliable periodic transfer services with competitive rates and robust automation features.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Set Up Your Schedule</h3>
              <p className="mb-4 text-left">
                Determine the frequency, amount, and timing of your transfers. Consider time zones and processing times.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Configure Notifications</h3>
              <p className="mb-4 text-left">
                Set up alerts for successful transfers, failed payments, and rate changes to stay informed.
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
        Optimizing Costs for Regular Transfers
      </ClickableHeadline>
      {expandedSections['cost-optimization'] && (
        <>
          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Cost-Saving Strategies</h3>
            <ul className="list-disc pl-8">
              <li className="text-left">Use forward contracts for predictable rates</li>
              <li className="text-left">Consider bulk transfer discounts</li>
              <li className="text-left">Monitor exchange rate trends</li>
              <li className="text-left">Choose the right payment method</li>
              <li className="text-left">Review and adjust your schedule regularly</li>
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
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Essential Security Measures</h3>
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left">Enable two-factor authentication</li>
              <li className="mb-2 text-left">Set up transfer limits</li>
              <li className="mb-2 text-left">Regular security reviews</li>
              <li className="mb-2 text-left">Compliance documentation</li>
              <li className="mb-2 text-left">Audit trail maintenance</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-practices" 
        isExpanded={expandedSections['best-practices']} 
        onClick={toggleSection}
      >
        Best Practices for Periodic Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Success Factors</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Maintain updated recipient information</li>
              <li className="text-left">Regular review of transfer schedules</li>
              <li className="text-left">Monitor exchange rate trends</li>
              <li className="text-left">Keep documentation organized</li>
              <li className="text-left">Have backup payment methods</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="common-mistakes" 
        isExpanded={expandedSections['common-mistakes']} 
        onClick={toggleSection}
      >
        Common Mistakes to Avoid
      </ClickableHeadline>
      {expandedSections['common-mistakes'] && (
        <>
          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 text-left">Pitfalls to Watch Out For</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Not accounting for time zone differences</li>
              <li className="text-left">Forgetting to update expired payment methods</li>
              <li className="text-left">Ignoring exchange rate fluctuations</li>
              <li className="text-left">Missing compliance requirements</li>
              <li className="text-left">Insufficient monitoring of transfers</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <SEO
        title="Periodic Transfers - Money Transfer Guide | MyMoneyTransfers"
        description="Periodic Transfers - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/frequency/periodic-transfers"
      />
      <GuideDetail
        title="Periodic Transfers - Money Transfer Guide"
        subtitle="Optimizing scheduled international payments"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="Updated May 5, 2025"
        readTime="10"
        relatedGuides={relatedGuides}
      />
    </>
  );
};

export default PeriodicTransfers; 