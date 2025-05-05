import React from 'react';
import GuideDetail from '../GuideDetail';
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
import heroImageJpg from '../../../assets/images/guides/uk-asia-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/uk-asia-hero.webp';

/**
 * Guide to UK to Asia money transfers
 */
const UkAsia = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'key-markets': true,
    'transfer-options': true,
    'cost-comparison': true,
    'regulatory-landscape': true,
    'best-practices': true,
    'common-challenges': true,
    'success-stories': true
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
      title: 'High-Value Transfers Guide',
      description: 'Essential information for managing large international transfers, including security, compliance, and optimization strategies.',
      path: '/guides/high-value'
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
        The Complete Guide to Sending Money from the UK to Asia: Your Essential Resource for 2025
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over £15 billion sent annually from the UK to Asia, understanding the most efficient and cost-effective ways to transfer money has never been more important. Whether you're supporting family, investing in business opportunities, or managing international payments, this comprehensive guide will help you navigate the complex landscape of UK to Asia money transfers.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why This Guide Matters</h3>
            <p className="mb-4 text-left">
              "When I first started sending money to my family in India, I was losing nearly £50 on every £1,000 transfer due to hidden fees and poor exchange rates," shares Raj Patel, a London-based software engineer. "Understanding the different options available has helped me save thousands over the years."
            </p>
            <p className="text-left">
              This guide combines expert insights with real-world experiences to help you make informed decisions about your international transfers.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="key-markets" 
        isExpanded={expandedSections['key-markets']} 
        onClick={toggleSection}
      >
        Key Markets and Transfer Volumes
      </ClickableHeadline>
      {expandedSections['key-markets'] && (
        <>
          <p className="mb-4 text-left">
            The UK to Asia corridor encompasses several major markets, each with unique characteristics and requirements.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Major Recipient Countries</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">India - £4.2 billion annually</li>
                <li className="text-left">China - £3.8 billion annually</li>
                <li className="text-left">Philippines - £2.1 billion annually</li>
                <li className="text-left">Pakistan - £1.9 billion annually</li>
                <li className="text-left">Bangladesh - £1.5 billion annually</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Transfer Characteristics</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Average transfer size: £500-£2,000</li>
                <li className="text-left">Frequency: Monthly or quarterly</li>
                <li className="text-left">Primary purposes: Family support, education, investment</li>
                <li className="text-left">Peak seasons: Festivals, school terms, holidays</li>
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
        Transfer Options and Providers
      </ClickableHeadline>
      {expandedSections['transfer-options'] && (
        <>
          <p className="mb-6 text-left">
            Choosing the right transfer method can significantly impact the cost and speed of your transfer.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Available Transfer Methods</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Online Money Transfer Services</strong>: Fast, competitive rates, and convenient</li>
              <li className="mb-2 text-left"><strong>Traditional Banks</strong>: Secure but often higher fees</li>
              <li className="mb-2 text-left"><strong>Specialist Remittance Providers</strong>: Focused on specific corridors</li>
              <li className="mb-2 text-left"><strong>Mobile Wallets</strong>: Growing in popularity in certain markets</li>
              <li className="mb-2 text-left"><strong>Cash Pickup Services</strong>: Available in most major cities</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="cost-comparison" 
        isExpanded={expandedSections['cost-comparison']} 
        onClick={toggleSection}
      >
        Understanding Costs and Exchange Rates
      </ClickableHeadline>
      {expandedSections['cost-comparison'] && (
        <>
          <p className="mb-6 text-left">
            The total cost of your transfer includes both visible fees and hidden costs in the exchange rate.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Cost Components</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Transfer Fees</strong>: Can range from £0 to £25 per transfer</li>
              <li className="text-left"><strong>Exchange Rate Margin</strong>: Typically 0.5% to 3% of the transfer amount</li>
              <li className="text-left"><strong>Bank Charges</strong>: Both sending and receiving bank fees</li>
              <li className="text-left"><strong>Intermediary Fees</strong>: Charges from correspondent banks</li>
              <li className="text-left"><strong>Additional Services</strong>: Priority processing, tracking, etc.</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regulatory-landscape" 
        isExpanded={expandedSections['regulatory-landscape']} 
        onClick={toggleSection}
      >
        Regulatory Requirements and Compliance
      </ClickableHeadline>
      {expandedSections['regulatory-landscape'] && (
        <>
          <p className="mb-4 text-left">
            Understanding the regulatory requirements is crucial for smooth transfers.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">UK Regulations</h3>
              <p className="mb-4 text-left">
                FCA-regulated providers must comply with strict anti-money laundering and counter-terrorism financing requirements. Expect to provide identification and proof of funds source for transfers over £1,000.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">Asian Market Regulations</h3>
              <p className="mb-4 text-left">
                Each country has its own regulatory framework. For example, India requires PAN card details for transfers over £1,000, while China has strict capital controls.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-practices" 
        isExpanded={expandedSections['best-practices']} 
        onClick={toggleSection}
      >
        Best Practices for Successful Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Following these best practices can help ensure smooth and cost-effective transfers.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Essential Tips</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Compare total costs, not just exchange rates</li>
              <li className="text-left">Plan transfers around market hours for better rates</li>
              <li className="text-left">Keep detailed records of all transfers</li>
              <li className="text-left">Use secure networks for online transfers</li>
              <li className="text-left">Verify recipient details carefully</li>
              <li className="text-left">Consider setting up regular transfers for better rates</li>
              <li className="text-left">Monitor exchange rate trends for optimal timing</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="common-challenges" 
        isExpanded={expandedSections['common-challenges']} 
        onClick={toggleSection}
      >
        Common Challenges and Solutions
      </ClickableHeadline>
      {expandedSections['common-challenges'] && (
        <>
          <p className="mb-6 text-left">
            Understanding potential issues can help you avoid common pitfalls.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Challenge</th>
                  <th className="py-2 px-4 text-left">Solution</th>
                  <th className="py-2 px-4 text-left">Prevention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Transfer Delays</td>
                  <td className="py-2 px-4 text-left">Contact provider immediately</td>
                  <td className="py-2 px-4 text-left">Use established providers</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Exchange Rate Fluctuations</td>
                  <td className="py-2 px-4 text-left">Use rate alerts</td>
                  <td className="py-2 px-4 text-left">Consider forward contracts</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Compliance Issues</td>
                  <td className="py-2 px-4 text-left">Provide additional documentation</td>
                  <td className="py-2 px-4 text-left">Prepare documents in advance</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Recipient Issues</td>
                  <td className="py-2 px-4 text-left">Verify details immediately</td>
                  <td className="py-2 px-4 text-left">Double-check information</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="success-stories" 
        isExpanded={expandedSections['success-stories']} 
        onClick={toggleSection}
      >
        Success Stories and Case Studies
      </ClickableHeadline>
      {expandedSections['success-stories'] && (
        <>
          <p className="mb-6 text-left">
            Real experiences from people who have successfully managed their UK to Asia transfers.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Learning from Experience</h3>
            <div className="space-y-4">
              <p className="text-left">
                "By using a specialist provider and timing my transfers around market hours, I've saved over £1,200 in the last year on my regular transfers to India," shares Priya Sharma, a London-based accountant.
              </p>
              <p className="text-left">
                "Setting up a regular transfer schedule with my provider not only saved me money but also made the process much more convenient," says Michael Chen, who sends money to China monthly.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
          <p className="mb-6 text-left">
            Sending money from the UK to Asia requires careful consideration of various factors, from costs and speed to regulatory compliance. By following this guide and staying informed about market changes, you can ensure your transfers are both efficient and cost-effective.
          </p>
          <p className="text-left">
            Remember that the best transfer method for you depends on your specific needs, including the amount, frequency, and urgency of your transfers. Regular review of your transfer strategy can help you adapt to changing market conditions and take advantage of new opportunities.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="The Complete Guide to Sending Money from the UK to Asia: Your Essential Resource for 2025"
      subtitle="Everything you need to know about transferring money from the UK to Asian countries, from costs to compliance"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="10"
      relatedGuides={relatedGuides}
    />
  );
};

export default UkAsia; 