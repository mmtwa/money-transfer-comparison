import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/philippines-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/philippines-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to the Philippines
 */
const SendMoneyToPhilippinesGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'ofw-benefits': true,
    'tax-legal': true,
    'final-tips': true
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
      title: 'Family Remittances',
      description: 'How to support your family abroad with regular money transfers - best practices and considerations.',
      path: '/guides/family-remittances'
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
        The Filipino Diaspora and the Importance of Remittances
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over 10 million Filipinos living and working overseas, remittances are a crucial lifeline for families back home in the Philippines.
            In 2021, Overseas Filipino Workers (OFWs) sent over $31 billion back to the Philippines, accounting for nearly 10% of the country's GDP.
            Finding the most efficient and cost-effective way to send money can make a significant difference to both senders and recipients.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3 text-left">Quick Facts: Philippine Remittances</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">The Philippines is one of the world's top remittance destinations</li>
              <li className="text-left">Over 10 million Filipinos work abroad as OFWs (Overseas Filipino Workers)</li>
              <li className="text-left">Remittances account for approximately 10% of the Philippines' GDP</li>
              <li className="text-left">The majority of remittances come from the US, Saudi Arabia, UAE, UK, Japan, and Singapore</li>
              <li className="text-left">The average OFW sends home $300-500 monthly to support family</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to the Philippines
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money to the Philippines:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Great for tech-savvy users who want to avoid hidden costs.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and first transfer promotions. Popular among Filipino communities abroad.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">WorldRemit</h3>
              <p className="text-left">Excellent for mobile wallet transfers and cash pickup options. Strong presence in the Philippine market.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Xoom (PayPal)</h3>
              <p className="text-left">Quick transfers with extensive pickup network. Convenient for PayPal users who want fast delivery.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Western Union</h3>
              <p className="text-left">Widest cash pickup network across the Philippines, including remote areas. A trusted name with decades of experience.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">Key Fact: Peso Exchange Rate</h3>
            <p className="mb-0 text-left">
              The Philippine Peso (PHP) can be volatile against major currencies. The exchange rate you're offered can vary by as much as 5-7% between providers.
              This hidden cost often exceeds the upfront fee, so always compare the actual PHP amount your recipient will get, not just the advertised fee.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in the Philippines
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            The Philippines offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Philippine bank accounts are convenient and secure. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">BDO (Banco de Oro)</li>
              <li className="text-left">BPI (Bank of the Philippine Islands)</li>
              <li className="text-left">Metrobank</li>
              <li className="text-left">PNB (Philippine National Bank)</li>
              <li className="text-left">Landbank</li>
              <li className="text-left">Security Bank</li>
              <li className="text-left">UnionBank</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-3 business days, though some services offer same-day delivery to major banks.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Wallets</h3>
            <p className="mb-2 text-left">
              The Philippines has embraced digital finance, with several mobile wallets that can receive international transfers:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>GCash</strong> - The largest mobile wallet in the Philippines with over 60 million users</li>
              <li className="text-left"><strong>PayMaya</strong> - Popular digital wallet that also offers a virtual card</li>
              <li className="text-left"><strong>Coins.ph</strong> - Cryptocurrency-based wallet that supports traditional remittances</li>
            </ul>
            <p className="text-left">
              Mobile wallet transfers are typically instant and have lower fees than traditional bank transfers. They're ideal for recipients in areas with limited banking access.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup remains extremely popular in the Philippines, especially in rural areas. Major cash pickup networks include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Cebuana Lhuillier</strong> - Over 2,500 branches nationwide</li>
              <li className="text-left"><strong>M Lhuillier</strong> - More than 2,000 locations across the Philippines</li>
              <li className="text-left"><strong>Palawan Pawnshop</strong> - Extensive network with over 3,000 branches</li>
              <li className="text-left"><strong>LBC</strong> - Popular courier service with remittance capabilities</li>
              <li className="text-left"><strong>SM Malls</strong> - Many SM department stores have dedicated remittance centers</li>
              <li className="text-left"><strong>Western Union</strong> - Available at banks and pawnshops throughout the country</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it the fastest option for emergency transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Door-to-Door Delivery</h3>
            <p className="mb-2 text-left">
              Some providers offer cash delivery directly to the recipient's home address. This service is particularly valuable for elderly recipients or those in remote areas:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left"><strong>LBC Peso Padala</strong> - Door-to-door cash delivery service</li>
              <li className="text-left"><strong>iRemit</strong> - Offers home delivery in select areas</li>
            </ul>
            <p className="text-left">
              Door-to-door delivery typically takes 1-2 days and may have geographic limitations.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in the Philippines
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Metro Manila and Major Cities</h3>
            <p className="text-left">
              Recipients in urban areas like Metro Manila, Cebu, and Davao have access to all receiving methods. Digital options like bank transfers and mobile wallets are highly efficient,
              with most banks offering real-time fund transfers through InstaPay or PESONet systems.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Provincial and Rural Areas</h3>
            <p className="text-left">
              For sending money to rural Philippines, consider services with extensive cash pickup networks like Palawan Pawnshop, Cebuana Lhuillier, or M Lhuillier.
              These pawnshops and remittance centers often serve as de facto financial institutions in areas with limited banking presence.
            </p>
          </div>

          <div className="bg-cyan-50 p-6 rounded-xl my-8 border border-cyan-100">
            <h3 className="text-cyan-700 mb-4 text-left">Cultural Insight: Padala System</h3>
            <p className="mb-0 text-left">
              "Padala" (meaning "to send" in Tagalog) is deeply ingrained in Filipino culture. Beyond just financial support, regular remittances are seen as
              an expression of care and family responsibility. Many OFWs send money monthly to coincide with bill payments and household expenses, often with
              additional amounts during special occasions like Christmas, graduations, and fiestas.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to the Philippines, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from $0-$5 for digital transfers to $10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 1-4%)</li>
            <li className="text-left"><strong>Receiving fees</strong>: Some Philippine banks charge PHP 100-250 to receive international transfers</li>
            <li className="text-left"><strong>Cash pickup fees</strong>: Some remittance centers charge a small fee to the recipient</li>
          </ul>

          <div className="bg-white shadow-sm rounded p-4 mb-6">
            <h3 className="font-bold text-blue-600 text-left">Example Comparison</h3>
            <p className="text-left">For a $500 transfer to the Philippines:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Provider A: $5 fee, exchange rate of 55.00 PHP/USD = 27,225 pesos received (after fees)</li>
              <li className="text-left">Provider B: $0 fee, exchange rate of 54.50 PHP/USD = 27,250 pesos received</li>
              <li className="text-left">Provider C: $3 fee, exchange rate of 55.20 PHP/USD = 27,474 pesos received (after fees)</li>
            </ul>
            <p className="text-left mt-2">This example shows how a provider with a higher fee but better exchange rate (Provider C) can deliver more pesos to your recipient.</p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="ofw-benefits" 
        isExpanded={expandedSections['ofw-benefits']} 
        onClick={toggleSection}
      >
        Special Considerations for Filipino Workers Abroad
      </ClickableHeadline>
      {expandedSections['ofw-benefits'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">OFW Benefits and Discounts</h3>
            <p className="mb-4 text-left">
              Many remittance providers offer special benefits for Overseas Filipino Workers (OFWs), including:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Discounted or waived fees for OFWs with proper documentation</li>
              <li className="text-left">Higher transfer limits</li>
              <li className="text-left">Loyalty programs with rewards for regular senders</li>
              <li className="text-left">Special exchange rates during Philippine holidays</li>
            </ul>
            <p className="text-left">
              To qualify for these benefits, you may need to provide your Overseas Employment Certificate (OEC) or OWWA membership.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Setting Up Regular Remittances</h3>
            <p className="mb-2 text-left">
              For OFWs sending monthly support to their families, consider these options:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Scheduled transfers through digital providers to save time and sometimes receive loyalty discounts</li>
              <li className="text-left">Direct deposit arrangements with your employer, where a portion of your salary is automatically remitted</li>
              <li className="text-left">Using a single provider consistently to benefit from loyalty programs and simplified verification</li>
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
            Understanding the tax and legal aspects of remittances to the Philippines:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in the Philippines</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Remittances received as gifts or family support are generally tax-exempt in the Philippines</li>
              <li className="text-left">Recipients don't need to report remittances on their Philippine tax returns if used for personal/family expenses</li>
              <li className="text-left">Large transfers (usually over PHP 500,000) may trigger anti-money laundering checks</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Keep records of all transfers for tax purposes in your country of residence</li>
              <li className="text-left">Some countries require reporting of international transfers above certain amounts</li>
              <li className="text-left">Verify if your remittances qualify for tax benefits (some countries offer deductions for supporting dependent family members)</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="final-tips" 
        isExpanded={expandedSections['final-tips']} 
        onClick={toggleSection}
      >
        Final Tips for Supporting Family in the Philippines
      </ClickableHeadline>
      {expandedSections['final-tips'] && (
        <>
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left">Send money during weekdays rather than weekends to avoid processing delays</li>
            <li className="text-left">Be aware of Philippine holidays when banks and remittance centers may be closed</li>
            <li className="text-left">Double-check all recipient details, especially for bank transfers (account numbers and full names)</li>
            <li className="text-left">Consider opening accounts at banks with international partnerships for potentially better rates (e.g., BDO-Remit)</li>
            <li className="text-left">Explore "hybrid" receiving options where money is sent to a bank but can be withdrawn as cash from partner ATMs without a card</li>
            <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4 text-left">Philippines Remittance Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare the total PHP amount received, not just transfer fees</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify if your recipient prefers bank deposit, mobile wallet, or cash pickup</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if you qualify for OFW discounts or benefits</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For recurring transfers, look for loyalty programs or scheduling options</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Save your transaction reference number and share it with your recipient</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Philippines Money Transfer Guide"
      subtitle="How to support family back home with optimal remittance options, lowest fees, and fastest delivery"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 9, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToPhilippinesGuide; 