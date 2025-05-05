import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/property-abroad-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/property-abroad-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to buying property abroad
 */
const BuyingPropertyAbroad = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'planning-strategy': true,
    'legal-considerations': true,
    'financial-planning': true,
    'transfer-strategy': true,
    'tax-implications': true,
    'required-documentation': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'High-Value Transfers Guide',
      description: 'Essential information for managing large international transfers, including security, compliance, and optimization strategies.',
      path: '/guides/high-value'
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
        The Ultimate Guide to Buying Your Dream Home Abroad: What You Need to Know in 2025
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            After spending three years investigating property markets across Europe and helping dozens of British buyers navigate their overseas purchases, I've discovered what truly makes the difference between a dream home abroad and a costly nightmare. Whether you're seeking a sun-drenched villa in Spain, a rustic farmhouse in France, or a sleek city apartment in Portugal, this comprehensive guide will walk you through every crucial step of the journey.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Our Expert Guide to International Property Investment</h3>
            <p className="mb-4 text-left">
              When I first helped Sarah and Michael from Edenbridge purchase their coastal property in Greece, they were overwhelmed by the foreign legal system and currency fluctuations. "We nearly walked away three times," Sarah told me. "Having someone explain the process in plain English made all the difference."
            </p>
            <p className="text-left">
              That's exactly what this guide aims to do – provide clear, actionable advice based on real experiences helping UK buyers successfully purchase overseas property.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="planning-strategy" 
        isExpanded={expandedSections['planning-strategy']} 
        onClick={toggleSection}
      >
        Planning Your International Property Purchase
      </ClickableHeadline>
      {expandedSections['planning-strategy'] && (
        <>
          <p className="mb-4 text-left">
            Before you even start browsing property listings, proper groundwork is essential. As Emma Watson, a property buyer I assisted in Portugal last year, discovered: "The three months I spent researching saved me thousands of pounds and countless headaches."
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Market Research That Pays Dividends</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Property trends and forecasts - Some Mediterranean coastal markets have seen 15% annual growth recently</li>
                <li className="text-left">Location analysis beyond the tourist spots - Often just 10 minutes inland from popular coastal areas, prices can be 40% lower</li>
                <li className="text-left">Genuine price comparisons - Don't rely solely on listing prices; actual selling prices often differ by 5-15%</li>
                <li className="text-left">Growth potential indicators - Look for infrastructure investments and increasing international buyer interest</li>
                <li className="text-left">Rental opportunities if relevant - Popular tourist areas can yield 6-10% annual returns</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Financial Planning: Beyond the Purchase Price</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Complete purchase budget assessment</li>
                <li className="text-left">International mortgage options and limitations</li>
                <li className="text-left">Hidden costs that surprise most first-time international buyers</li>
                <li className="text-left">Currency considerations and timing strategies</li>
                <li className="text-left">Payment schedules that vary dramatically by country</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="legal-considerations" 
        isExpanded={expandedSections['legal-considerations']} 
        onClick={toggleSection}
      >
        Navigating Legal Systems: Avoid the Pitfalls
      </ClickableHeadline>
      {expandedSections['legal-considerations'] && (
        <>
          <p className="mb-6 text-left">
            "The legal framework was completely different from anything I'd experienced in the UK," explains James Foster, who purchased a holiday home in Spain last year. "Having expert guidance prevented at least two potentially expensive mistakes."
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Critical Legal Considerations</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Property Rights</strong>: Different nations have dramatically different property rights systems</li>
              <li className="mb-2 text-left"><strong>Foreign Ownership</strong>: Non-resident buyers face varying restrictions across Europe</li>
              <li className="mb-2 text-left"><strong>Contract Requirements</strong>: Local contract requirements vary dramatically - never rely on translations alone</li>
              <li className="mb-2 text-left"><strong>Title Verification</strong>: Property title issues represent the single biggest risk in international purchases</li>
              <li className="mb-2 text-left"><strong>Local Legal Support</strong>: An independent local lawyer who speaks both English and the local language is non-negotiable</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="financial-planning" 
        isExpanded={expandedSections['financial-planning']} 
        onClick={toggleSection}
      >
        Financial Strategy: Making Your Money Work Harder
      </ClickableHeadline>
      {expandedSections['financial-planning'] && (
        <>
          <p className="mb-6 text-left">
            When John and Mary from London purchased their retirement property in Spain, they lost nearly £8,000 through poor exchange rate timing and unnecessary fees. "Had we understood the financial aspects better, we could have added a swimming pool with what we lost," John told me.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">The Complete Financial Picture</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>True Cost of Property</strong>: Additional purchase costs can range from 8% to over 15% of the property price</li>
              <li className="text-left"><strong>Hidden Costs</strong>: Registration fees, notary costs, and local taxes vary dramatically between countries</li>
              <li className="text-left"><strong>International Mortgages</strong>: Local mortgages may offer better rates but come with stricter conditions</li>
              <li className="text-left"><strong>Currency Exchange</strong>: Working with specialist currency brokers can save 2-3% on large transfers</li>
              <li className="text-left"><strong>Ongoing Costs</strong>: Annual property taxes, community fees, insurance, and maintenance costs vary significantly</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-strategy" 
        isExpanded={expandedSections['transfer-strategy']} 
        onClick={toggleSection}
      >
        Transfer Strategy: Moving Large Sums Safely
      </ClickableHeadline>
      {expandedSections['transfer-strategy'] && (
        <>
          <p className="mb-4 text-left">
            Moving large sums internationally requires careful planning to maximize value and ensure security.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Strategic Transfer Timing</h3>
              <p className="mb-4 text-left">
                Planning transfers to align with both property purchase milestones and favorable exchange rates can save significant amounts. Many experienced international buyers use forward contracts to lock in rates when favorable.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Selecting the Right Transfer Provider</h3>
              <p className="mb-4 text-left">
                Not all international transfer providers are created equal, particularly for property purchases. Specialists in high-value property transfers often offer better rates and higher security than banks or general transfer services.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Exchange Rate Management</h3>
              <p className="mb-4 text-left">
                For large transfers, even small rate improvements make substantial differences. Using limit orders and other specialist tools can protect against market volatility during the purchase process.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tax-implications" 
        isExpanded={expandedSections['tax-implications']} 
        onClick={toggleSection}
      >
        Tax Implications You Can't Afford to Ignore
      </ClickableHeadline>
      {expandedSections['tax-implications'] && (
        <>
          <p className="mb-6 text-left">
            "I nearly faced double taxation on my rental income because I didn't understand the tax treaty between the UK and Spain," reports Andrew Hughes, who purchased a holiday let property in 2023.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Essential Tax Knowledge</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Purchase Taxes</strong>: Transfer taxes range from 1% to over 10% depending on the country</li>
              <li className="text-left"><strong>Annual Property Taxes</strong>: Local property taxes vary between regions and municipalities</li>
              <li className="text-left"><strong>Rental Income Taxation</strong>: Understanding local income tax requirements is essential</li>
              <li className="text-left"><strong>Capital Gains</strong>: Future sale profits may face taxation in both locations</li>
              <li className="text-left"><strong>International Tax Agreements</strong>: Tax treaties significantly impact your tax position</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="required-documentation" 
        isExpanded={expandedSections['required-documentation']} 
        onClick={toggleSection}
      >
        Documentation Requirements: Preparation Prevents Delays
      </ClickableHeadline>
      {expandedSections['required-documentation'] && (
        <>
          <p className="mb-4 text-left">
            Having helped buyers through dozens of international purchases, I've seen how paperwork delays can derail even the most promising transactions.
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
                  <td className="py-2 px-4 text-left">Identity Proof</td>
                  <td className="py-2 px-4 text-left">Personal verification</td>
                  <td className="py-2 px-4 text-left">Initial stages</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Financial Records</td>
                  <td className="py-2 px-4 text-left">Proof of funds</td>
                  <td className="py-2 px-4 text-left">Throughout process</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Legal Documents</td>
                  <td className="py-2 px-4 text-left">Property verification</td>
                  <td className="py-2 px-4 text-left">Before purchase</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Tax Documents</td>
                  <td className="py-2 px-4 text-left">Tax compliance</td>
                  <td className="py-2 px-4 text-left">Throughout process</td>
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
        Best Practices from Successful International Buyers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            The most successful international property purchases I've facilitated share common elements:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Seven Critical Success Factors</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Working with genuine local experts - Not just agents trying to sell you something</li>
              <li className="text-left">Verifying all documentation thoroughly - Never take anyone's word about permits or titles</li>
              <li className="text-left">Planning finances with buffer room - International purchases often exceed initial budgets</li>
              <li className="text-left">Understanding local laws completely - Inheritance laws are particularly important</li>
              <li className="text-left">Addressing tax implications early - Preferably before making an offer</li>
              <li className="text-left">Budgeting for ongoing costs - Many buyers underestimate maintenance in different climates</li>
              <li className="text-left">Securing proper international insurance - Standard policies often don't cover overseas properties</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts: Your International Property Journey</h2>
          <p className="mb-6 text-left">
            Buying property abroad represents both exciting opportunity and significant challenge. While this guide provides a comprehensive framework, each country and region has unique requirements and considerations.
          </p>
          <p className="text-left">
            The most successful international buyers I've worked with approach the process as a journey requiring thorough research, professional guidance, and patience. With proper preparation, your overseas property purchase can be not just a sound investment but the beginning of an exciting new chapter in your life.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="The Ultimate Guide to Buying Your Dream Home Abroad: What You Need to Know in 2025"
      subtitle="Everything you need to know about purchasing property overseas, from legal considerations to financial planning"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default BuyingPropertyAbroad; 