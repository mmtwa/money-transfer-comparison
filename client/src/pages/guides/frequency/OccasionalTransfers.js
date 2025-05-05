import React from 'react';
import GuideDetail from '../../guides/GuideDetail';
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
import heroImageJpg from '../../../assets/images/guides/occasional-transfers-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/occasional-transfers-hero.webp';

const OccasionalTransfers = () => {
  const sections = {
    'introduction': true,
    'understanding-occasional': true,
    'planning-strategy': true,
    'provider-selection': true,
    'cost-management': true,
    'security-best-practices': true,
    'tracking-and-monitoring': true
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
      title: 'One-Time Transfers Guide',
      description: 'Everything you need to know about making single international money transfers.',
      path: '/guides/frequency/one-time'
    }
  ];

  const content = (
    <>
      <ClickableHeadline 
        id="introduction" 
        isExpanded={expandedSections['introduction']} 
        onClick={toggleSection}
      >
        The Smart Guide to Occasional International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Occasional international transfers require a different approach than regular or one-time transfers. Whether you're sending money for holidays, special occasions, or irregular business needs, this guide will help you make the most of your occasional international payments.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Occasional Transfers Need Special Attention</h3>
            <p className="mb-4 text-left">
              Unlike regular transfers that can be automated or one-time transfers that are carefully planned, occasional transfers require flexibility while maintaining cost-effectiveness and security.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="understanding-occasional" 
        isExpanded={expandedSections['understanding-occasional']} 
        onClick={toggleSection}
      >
        Understanding Occasional Transfers
      </ClickableHeadline>
      {expandedSections['understanding-occasional'] && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Typical Use Cases</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Holiday spending money</li>
                <li className="text-left">Special occasion gifts</li>
                <li className="text-left">Irregular business expenses</li>
                <li className="text-left">Emergency transfers</li>
                <li className="text-left">Seasonal payments</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Key Characteristics</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Irregular timing</li>
                <li className="text-left">Varying amounts</li>
                <li className="text-left">Different recipients</li>
                <li className="text-left">Multiple currencies</li>
                <li className="text-left">Flexible requirements</li>
              </ul>
            </div>
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
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Timing Considerations</h3>
              <p className="mb-4 text-left">
                Plan ahead for known occasions and be prepared for unexpected needs. Consider seasonal exchange rate patterns and processing times.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Amount Planning</h3>
              <p className="mb-4 text-left">
                Estimate your needs and consider setting aside funds for unexpected transfers. Keep track of your transfer history for better planning.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Recipient Management</h3>
              <p className="mb-4 text-left">
                Maintain up-to-date recipient information and verify details before each transfer. Consider saving frequent recipients for quick access.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="provider-selection" 
        isExpanded={expandedSections['provider-selection']} 
        onClick={toggleSection}
      >
        Choosing the Right Provider
      </ClickableHeadline>
      {expandedSections['provider-selection'] && (
        <>
          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Provider Selection Criteria</h3>
            <ul className="list-disc pl-8">
              <li className="text-left">Flexible transfer options</li>
              <li className="text-left">Competitive rates for varying amounts</li>
              <li className="text-left">Quick setup process</li>
              <li className="text-left">Good customer support</li>
              <li className="text-left">Mobile-friendly interface</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cost-management" 
        isExpanded={expandedSections['cost-management']} 
        onClick={toggleSection}
      >
        Managing Costs Effectively
      </ClickableHeadline>
      {expandedSections['cost-management'] && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Cost Optimization Tips</h3>
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left">Compare rates for each transfer</li>
              <li className="mb-2 text-left">Look for special offers</li>
              <li className="mb-2 text-left">Consider transfer speed vs cost</li>
              <li className="mb-2 text-left">Watch for hidden fees</li>
              <li className="mb-2 text-left">Use loyalty programs</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-best-practices" 
        isExpanded={expandedSections['security-best-practices']} 
        onClick={toggleSection}
      >
        Security Best Practices
      </ClickableHeadline>
      {expandedSections['security-best-practices'] && (
        <>
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Essential Security Measures</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Use secure networks</li>
              <li className="text-left">Enable two-factor authentication</li>
              <li className="text-left">Verify recipient details</li>
              <li className="text-left">Keep records of all transfers</li>
              <li className="text-left">Monitor account activity</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tracking-and-monitoring" 
        isExpanded={expandedSections['tracking-and-monitoring']} 
        onClick={toggleSection}
      >
        Tracking and Monitoring
      </ClickableHeadline>
      {expandedSections['tracking-and-monitoring'] && (
        <>
          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 text-left">Monitoring Best Practices</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Track transfer status</li>
              <li className="text-left">Save confirmation details</li>
              <li className="text-left">Monitor exchange rates</li>
              <li className="text-left">Review transfer history</li>
              <li className="text-left">Set up notifications</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="The Smart Guide to Occasional International Money Transfers"
      subtitle="Learn how to handle irregular international payments effectively"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="6"
      relatedGuides={relatedGuides}
    />
  );
};

export default OccasionalTransfers; 