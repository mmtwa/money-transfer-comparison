import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/china-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/china-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to China
 */
const SendMoneyToChinaGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'regulations': true,
    'tax-legal': true,
    'timing-tips': true
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
        Sending Money to China: A Unique Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            The UK-China remittance corridor is among the most significant in the world, with an estimated £3 billion sent annually from the UK to China. 
            Whether you're supporting family, paying for education, investing in property, or conducting business, sending money to China involves navigating 
            a distinctive financial landscape with specific regulations and considerations that differ significantly from other international corridors.
          </p>

          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 text-left">Key Facts: UK-China Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">China maintains strict capital controls that affect all international money transfers</li>
              <li className="text-left">Chinese Yuan Renminbi (CNY) is not freely convertible internationally</li>
              <li className="text-left">Annual transfer limits apply to individuals receiving money in China</li>
              <li className="text-left">Documentation requirements are more extensive than for many other countries</li>
              <li className="text-left">The average cost of sending money to China ranges from 1-5% of the transfer amount</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to China from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to China:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Particularly strong for bank transfers to China.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">TorFX</h3>
              <p className="text-left">Good for larger transfers with competitive rates and specialized service for the China corridor.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">WorldRemit</h3>
              <p className="text-left">Reliable service with good coverage across China and strong compliance expertise for navigating Chinese regulations.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">OFX</h3>
              <p className="text-left">Excellent rates for larger transfers (£5,000+) with specialist knowledge of Chinese banking requirements.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">Western Union</h3>
              <p className="text-left">Extensive network with cash pickup options and long-standing relationship with Chinese banks.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-red-600 text-left">Bank of China UK</h3>
              <p className="text-left">Direct bank-to-bank transfers with specialized knowledge of compliance requirements and good rates for customers.</p>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl my-8 border border-red-100">
            <h3 className="text-red-700 mb-4 text-left">Choosing a Provider: Compliance Expertise Matters</h3>
            <p className="mb-0 text-left">
              When sending money to China, a provider's familiarity with Chinese regulations is as important as their rates and fees. 
              Providers with established relationships with Chinese banks can help ensure your transfer isn't delayed due to compliance issues. 
              For transfers above £5,000, look for providers with specific experience in the China corridor, as these larger transfers often 
              face more scrutiny and may require additional documentation.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in China
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            China offers several ways to receive money from abroad, though options are more limited than in many other countries due to regulations:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Chinese bank accounts are the most common and widely accepted method. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Bank of China (中国银行)</li>
              <li className="text-left">Industrial and Commercial Bank of China (ICBC / 中国工商银行)</li>
              <li className="text-left">China Construction Bank (CCB / 中国建设银行)</li>
              <li className="text-left">Agricultural Bank of China (ABC / 中国农业银行)</li>
              <li className="text-left">Bank of Communications (交通银行)</li>
              <li className="text-left">China Merchants Bank (招商银行)</li>
              <li className="text-left">HSBC China</li>
              <li className="text-left">Standard Chartered China</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-4 business days. Chinese banks generally require more information for incoming transfers than banks in other countries, including the purpose of the transfer.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Digital Payment Platforms</h3>
            <p className="mb-2 text-left">
              China's domestic digital payment ecosystem is highly advanced, but international integration is limited:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Alipay (支付宝)</strong> - Limited international transfer options, typically requiring a Chinese bank account</li>
              <li className="text-left"><strong>WeChat Pay (微信支付)</strong> - Primarily for domestic transfers, with limited international capabilities</li>
              <li className="text-left"><strong>UnionPay International</strong> - Card-based transfers to linked Chinese accounts</li>
            </ul>
            <p className="text-left">
              Most digital platforms require the recipient to have a Chinese bank account and Chinese ID for verification, making them less accessible for direct international transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup options in China are more limited than in many other countries:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Available at some bank branches and partner locations</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Limited network, mainly in major cities</li>
              <li className="text-left"><strong>Bank branches</strong> - Some Chinese banks offer cash pickup for international transfers</li>
            </ul>
            <p className="text-left">
              For cash pickup, recipients typically need their Chinese ID card (居民身份证) and the transaction reference number. Regulations may limit the amount that can be collected in cash.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Dual-Currency Accounts</h3>
            <p className="mb-2 text-left">
              A specialized option for those with established banking relationships:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Many Chinese banks offer accounts that can hold both foreign currency (usually USD or EUR) and CNY</li>
              <li className="text-left">These accounts allow recipients to receive foreign currency directly and convert to CNY when exchange rates are favorable</li>
              <li className="text-left">Typically requires the recipient to have a formal banking relationship and possibly additional documentation</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in China
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Tier 1 Cities</h3>
            <p className="text-left">
              Recipients in Beijing, Shanghai, Guangzhou, Shenzhen, and other major metropolitan areas have access to the full range of receiving options. 
              International banks like HSBC and Standard Chartered have branches in these cities, and all major Chinese banks offer comprehensive international 
              services. Digital banking is highly advanced in urban centers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Tier 2 and 3 Cities</h3>
            <p className="text-left">
              Medium-sized cities have good banking infrastructure, but fewer international banking options. The "Big Four" Chinese banks 
              (ICBC, Bank of China, China Construction Bank, and Agricultural Bank of China) have extensive branch networks in these cities 
              and can handle international transfers effectively. Cash pickup services may have limited availability.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas</h3>
            <p className="text-left">
              Banking access in rural China has improved significantly but remains less comprehensive. The Agricultural Bank of China 
              has the most extensive rural presence. When sending money to rural areas, bank transfers to a major national bank are typically 
              the most reliable option, as the recipient can then access funds through local branches or ATMs.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Administrative Regions</h3>
            <p className="mb-2 text-left">
              Hong Kong and Macau operate under different financial systems:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-red-600 text-left">Hong Kong</h4>
                <p className="text-left">Operates as a separate financial jurisdiction with fewer restrictions. Transfers to Hong Kong banks are subject to different regulations than mainland China.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-red-600 text-left">Macau</h4>
                <p className="text-left">Also operates as a separate financial system with its own regulatory framework. Banking connections to mainland China are strong but distinct.</p>
              </div>
            </div>
            <p className="text-left">
              Note that transferring money to these regions and then to mainland China is subject to separate sets of regulations and scrutiny.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates for China Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to China from the UK, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£5 for digital transfers to £15-30 for bank transfers</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 1-4%)</li>
            <li className="text-left"><strong>Intermediary bank fees</strong>: Additional charges by correspondent banks that may handle your transfer (£10-20)</li>
            <li className="text-left"><strong>Receiving bank fees</strong>: Chinese banks often charge recipients ¥50-200 to receive international transfers</li>
          </ul>

          <div className="bg-red-50 p-6 rounded-xl my-8 border border-red-100">
            <h3 className="text-red-700 mb-4 text-left">CNY Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Chinese Yuan (CNY) is partially managed by the People's Bank of China, which sets a daily reference rate and allows trading 
              within a set band. This means exchange rates can be less volatile than fully floating currencies but can also move suddenly 
              in response to policy changes. Additionally, there are two yuan markets: the onshore yuan (CNY) and offshore yuan (CNH), which 
              can trade at slightly different rates. Most international transfers use the CNH rate, which can be more favorable at times.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        China's Unique Regulations
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            China maintains strict capital controls that significantly impact international money transfers:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Annual Limits and Documentation</h3>
            <p className="text-left">
              Chinese citizens can receive up to USD $50,000 (or equivalent) per person per year from abroad without special approval. 
              Amounts exceeding this limit may require documentation explaining the purpose and source of funds. Each transaction typically 
              requires a clear stated purpose that falls within acceptable categories, such as family support, education expenses, or legitimate business activities.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Purpose Requirements</h3>
            <p className="text-left">
              All international transfers to China must include a clear purpose code. Common acceptable purposes include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Family support / living expenses</li>
              <li className="text-left">Education-related expenses</li>
              <li className="text-left">Payment for goods (with supporting documentation)</li>
              <li className="text-left">Services and consulting fees (with contracts)</li>
              <li className="text-left">Investment in approved channels (subject to additional regulations)</li>
            </ul>
            <p className="text-left">
              The stated purpose must match the actual use of funds, as Chinese banks may request verification or supporting documentation.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Considerations for Business Transfers</h3>
            <p className="text-left">
              Business-related transfers to China face additional scrutiny and documentation requirements:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Contracts or invoices showing the business relationship</li>
              <li className="text-left">Tax documentation and business licenses</li>
              <li className="text-left">For larger amounts, prior approval from the State Administration of Foreign Exchange (SAFE) may be required</li>
              <li className="text-left">Special regulations apply for capital investments, real estate purchases, and certain industry sectors</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tax-legal" 
        isExpanded={expandedSections['tax-legal']} 
        onClick={toggleSection}
      >
        Tax and Legal Considerations
      </ClickableHeadline>
      {expandedSections['tax-legal'] && (
        <>
          <p className="mb-6 text-left">
            International transfers to China have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in China</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Genuine family support and gifts generally aren't taxable, but documentation may be required</li>
              <li className="text-left">Business-related transfers are likely subject to income tax or business tax</li>
              <li className="text-left">Transfers for property investment may be subject to restrictions and taxes</li>
              <li className="text-left">Regular large transfers may trigger scrutiny from tax authorities</li>
              <li className="text-left">Recipients should maintain clear records of all international transfers for possible verification</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Money sent as gifts is generally not tax-deductible in the UK</li>
              <li className="text-left">Business-related transfers may have VAT and income tax implications</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering purposes</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">Ensure transfers comply with both UK and Chinese regulations</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and China have robust anti-money laundering regulations. Using established, regulated money transfer 
            providers is essential to ensure your transfers comply with these regulations and aren't delayed or rejected.
          </p>
        </>
      )}

      <ClickableHeadline 
        id="timing-tips" 
        isExpanded={expandedSections['timing-tips']} 
        onClick={toggleSection}
      >
        Timing and Final Tips
      </ClickableHeadline>
      {expandedSections['timing-tips'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Timing Your Transfer</h3>
            <p className="mb-2 text-left">
              Several factors can affect the timing and processing of transfers to China:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Chinese holidays, especially Chinese New Year (typically January-February), may delay processing by several days</li>
              <li className="text-left">Transfers initiated early in the UK business day may be processed on the same China business day</li>
              <li className="text-left">First-time transfers to a recipient typically take longer due to additional verification</li>
              <li className="text-left">Larger transfers (over £5,000 equivalent) often face more scrutiny and may take 3-5 business days</li>
              <li className="text-left">Policy changes can temporarily affect processing times, especially for larger amounts</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to China</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Always include the recipient's name exactly as it appears on their Chinese ID or passport</li>
              <li className="text-left">Provide a clear, specific purpose for the transfer that matches acceptable categories</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Be prepared to provide additional documentation for larger transfers</li>
              <li className="text-left">Consider using providers with specific expertise in the China corridor, especially for amounts over £5,000</li>
              <li className="text-left">Inform your recipient that they may need to answer questions from their bank about the transfer's purpose</li>
              <li className="text-left">Keep all transaction records and supporting documentation for at least five years</li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-red-800 mb-4 text-left">China Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the recipient's full name exactly as it appears on their Chinese ID</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Confirm the purpose of the transfer matches acceptable categories</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if the transfer amount fits within the annual limit (under $50,000 equivalent)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Gather any supporting documentation that may be required</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Choose a provider with specific expertise in transfers to China</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Complete Guide to Sending Money to China"
      subtitle="Navigate regulations, find the best providers, and understand the unique aspects of UK to China transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 15, 2025"
      readTime="9"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToChinaGuide; 