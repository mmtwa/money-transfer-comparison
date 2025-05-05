import React from 'react';
import GuideDetail from '../GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../../assets/images/guides/cost-optimizing-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/cost-optimizing-hero-new.webp';

/**
 * Guide to optimizing costs for international transfers
 */
const CostOptimizing = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'understanding-fees': true,
    'exchange-rates': true,
    'transfer-amounts': true,
    'provider-selection': true,
    'timing-strategies': true,
    'bulk-transfers': true,
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
      title: 'Transfer Fees Explained',
      description: 'A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.',
      path: '/guides/transfer-fees'
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
        The Complete Guide to Cost-Effective International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            After analyzing thousands of international transfers, I've discovered that most people are paying more than necessary for their money transfers. Whether you're sending money to family abroad, making business payments, or managing international investments, this comprehensive guide will help you minimize costs and maximize value.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Cost Optimization Matters</h3>
            <p className="mb-4 text-left">
              "I was shocked to discover I could have saved over £500 on my last property purchase transfer," says Sarah from Manchester. "The difference between providers was much larger than I expected."
            </p>
            <p className="text-left">
              This guide will show you how to identify and avoid hidden costs, choose the right provider for your needs, and implement strategies that can save you significant amounts on your international transfers.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="understanding-fees" 
        isExpanded={expandedSections['understanding-fees']} 
        onClick={toggleSection}
      >
        Understanding the True Cost of International Transfers
      </ClickableHeadline>
      {expandedSections['understanding-fees'] && (
        <>
          <p className="mb-4 text-left">
            The total cost of an international transfer consists of several components, not just the visible fees. Understanding these elements is crucial for making cost-effective decisions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Visible Costs</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Transfer fees - Fixed or percentage-based charges</li>
                <li className="text-left">Exchange rate margins - The difference between mid-market and offered rates</li>
                <li className="text-left">Receiving fees - Charges at the destination</li>
                <li className="text-left">Payment method fees - Costs associated with funding methods</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Hidden Costs</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Intermediary bank fees</li>
                <li className="text-left">Currency conversion charges</li>
                <li className="text-left">Speed premium charges</li>
                <li className="text-left">Account maintenance fees</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="exchange-rates" 
        isExpanded={expandedSections['exchange-rates']} 
        onClick={toggleSection}
      >
        Exchange Rate Optimization Strategies
      </ClickableHeadline>
      {expandedSections['exchange-rates'] && (
        <>
          <p className="mb-6 text-left">
            Exchange rates can have a significant impact on the total cost of your transfer. Even small differences in rates can add up to substantial savings or costs.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Key Exchange Rate Considerations</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Mid-Market Rate</strong>: Understanding the true market rate</li>
              <li className="mb-2 text-left"><strong>Provider Margins</strong>: How much providers add to the mid-market rate</li>
              <li className="mb-2 text-left"><strong>Rate Locks</strong>: When and how to lock in favorable rates</li>
              <li className="mb-2 text-left"><strong>Market Timing</strong>: Identifying optimal times for transfers</li>
              <li className="mb-2 text-left"><strong>Rate Alerts</strong>: Setting up notifications for target rates</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-amounts" 
        isExpanded={expandedSections['transfer-amounts']} 
        onClick={toggleSection}
      >
        Optimizing Transfer Amounts
      </ClickableHeadline>
      {expandedSections['transfer-amounts'] && (
        <>
          <p className="mb-6 text-left">
            The amount you transfer can significantly impact the cost-effectiveness of your transfer. Different providers offer better rates for different transfer amounts.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Amount-Based Strategies</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Volume Discounts</strong>: How larger transfers can reduce per-unit costs</li>
              <li className="text-left"><strong>Fee Thresholds</strong>: Understanding when fees change</li>
              <li className="text-left"><strong>Batch Transfers</strong>: Combining multiple transfers for better rates</li>
              <li className="text-left"><strong>Minimum Amounts</strong>: Avoiding charges for small transfers</li>
              <li className="text-left"><strong>Maximum Limits</strong>: Working within provider limits</li>
            </ul>
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
          <p className="mb-4 text-left">
            Not all providers are created equal when it comes to costs. The best provider for one transfer might not be the best for another.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Provider Types and Their Cost Structures</h3>
              <p className="mb-4 text-left">
                Different types of providers (banks, money transfer operators, fintech companies) have different cost structures and fee models.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Comparing Total Costs</h3>
              <p className="mb-4 text-left">
                How to calculate and compare the true total cost across different providers, including all fees and exchange rate margins.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Provider Selection Criteria</h3>
              <p className="mb-4 text-left">
                Key factors to consider when choosing a provider, including fees, exchange rates, transfer speed, and reliability.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="timing-strategies" 
        isExpanded={expandedSections['timing-strategies']} 
        onClick={toggleSection}
      >
        Timing Your Transfers
      </ClickableHeadline>
      {expandedSections['timing-strategies'] && (
        <>
          <p className="mb-6 text-left">
            "I saved over £200 by waiting just two days for a better exchange rate," reports James from London. "Timing can make a huge difference."
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Timing Optimization Strategies</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Market Analysis</strong>: Understanding currency market patterns</li>
              <li className="text-left"><strong>Rate Monitoring</strong>: Tools and techniques for tracking rates</li>
              <li className="text-left"><strong>Forward Contracts</strong>: When to lock in rates</li>
              <li className="text-left"><strong>Market Events</strong>: How economic events affect rates</li>
              <li className="text-left"><strong>Time Zones</strong>: Impact of market hours on rates</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="bulk-transfers" 
        isExpanded={expandedSections['bulk-transfers']} 
        onClick={toggleSection}
      >
        Optimizing Bulk and Regular Transfers
      </ClickableHeadline>
      {expandedSections['bulk-transfers'] && (
        <>
          <p className="mb-4 text-left">
            For businesses and individuals making regular transfers, there are additional strategies to optimize costs.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Strategy</th>
                  <th className="py-2 px-4 text-left">Benefits</th>
                  <th className="py-2 px-4 text-left">Considerations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Volume Discounts</td>
                  <td className="py-2 px-4 text-left">Lower per-transfer costs</td>
                  <td className="py-2 px-4 text-left">Minimum volume requirements</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Regular Transfer Programs</td>
                  <td className="py-2 px-4 text-left">Consistent rates and fees</td>
                  <td className="py-2 px-4 text-left">Commitment period</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Batch Processing</td>
                  <td className="py-2 px-4 text-left">Reduced administrative costs</td>
                  <td className="py-2 px-4 text-left">Processing time</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Dedicated Accounts</td>
                  <td className="py-2 px-4 text-left">Priority service and rates</td>
                  <td className="py-2 px-4 text-left">Account maintenance</td>
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
        Best Practices for Cost Optimization
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis of successful cost-optimized transfers, here are the key practices that consistently deliver the best results:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Seven Critical Success Factors</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Always compare total costs, not just visible fees</li>
              <li className="text-left">Monitor exchange rates and set target rates</li>
              <li className="text-left">Consider timing and market conditions</li>
              <li className="text-left">Use appropriate transfer amounts</li>
              <li className="text-left">Choose the right provider for your specific needs</li>
              <li className="text-left">Leverage volume discounts when possible</li>
              <li className="text-left">Maintain flexibility in transfer timing</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts: Maximizing Value</h2>
          <p className="mb-6 text-left">
            Cost optimization in international transfers is both an art and a science. While this guide provides a comprehensive framework, remember that the best approach depends on your specific circumstances and requirements.
          </p>
          <p className="text-left">
            The most successful cost optimizers combine knowledge of the market with careful planning and execution. By following these guidelines and staying informed about market conditions, you can significantly reduce the cost of your international transfers while maintaining the quality of service you need.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="The Complete Guide to Cost-Effective International Money Transfers"
      subtitle="Learn how to minimize costs and maximize value in your international transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default CostOptimizing; 