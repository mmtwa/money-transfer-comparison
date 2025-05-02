import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/nigeria-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/nigeria-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Nigeria
 */
const SendMoneyToNigeriaGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'fx-controls': true,
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
        The UK-Nigeria Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over 200,000 Nigerians living in the UK, the UK-Nigeria remittance corridor is one of the busiest in Europe-Africa relations. 
            Annual remittances from the UK to Nigeria exceed £3 billion, providing critical financial support to families, funding education, 
            healthcare, and business investments. Nigeria has a unique financial landscape that creates both challenges and opportunities when sending money.
          </p>

          <div className="bg-purple-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-purple-800 mb-3 text-left">Key Facts: Nigeria Remittances</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Nigeria is the largest remittance recipient in Sub-Saharan Africa</li>
              <li className="text-left">The UK is one of the top three sources of remittances to Nigeria</li>
              <li className="text-left">The Nigerian Naira (NGN) has experienced significant volatility against the British Pound (GBP)</li>
              <li className="text-left">The Central Bank of Nigeria has implemented various foreign exchange policies that affect remittances</li>
              <li className="text-left">Nigeria's "Naira-4-Dollar" scheme offers recipients additional naira for remittances received through official channels</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Nigeria from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Nigeria:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Offers direct transfers to Nigerian bank accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">WorldRemit</h3>
              <p className="text-left">Extensive coverage across Nigeria with multiple receiving options and competitive rates. Popular among Nigerian diaspora.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with special promotions for first-time users. Offers both economy and express delivery options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">MoneyGram</h3>
              <p className="text-left">Extensive cash pickup network across Nigeria, including in smaller towns. Good option for recipients without bank accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">Western Union</h3>
              <p className="text-left">The most extensive cash pickup network in Nigeria, with thousands of agent locations. A trusted name with decades of experience.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-purple-600 text-left">Azimo</h3>
              <p className="text-left">Strong presence in the UK-Nigeria corridor with competitive rates and various receiving options, including bank deposits and mobile money.</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl my-8 border border-purple-100">
            <h3 className="text-purple-700 mb-4 text-left">Nigeria's Naira-4-Dollar Scheme</h3>
            <p className="mb-0 text-left">
              The Central Bank of Nigeria introduced the "Naira-4-Dollar" scheme to encourage formal remittance channels. Under this initiative, 
              recipients receive additional naira for every dollar/pound received through official channels. This can add significant value to your transfer, 
              making bank deposits more attractive than cash pickup in many cases. Currently, the scheme offers ₦5 for every $1 received, providing an 
              effective bonus on your transfer.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Nigeria
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Nigeria offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Nigerian bank accounts are increasingly popular. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">First Bank of Nigeria</li>
              <li className="text-left">Guaranty Trust Bank (GTBank)</li>
              <li className="text-left">United Bank for Africa (UBA)</li>
              <li className="text-left">Access Bank</li>
              <li className="text-left">Zenith Bank</li>
              <li className="text-left">Ecobank</li>
              <li className="text-left">Union Bank</li>
              <li className="text-left">Wema Bank</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-2 business days, though some services offer same-day delivery for major banks. Bank deposits are eligible for the Naira-4-Dollar incentive.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Money and Digital Wallets</h3>
            <p className="mb-2 text-left">
              Nigeria's digital finance ecosystem has grown significantly:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Paga</strong> - Popular mobile money platform with over 17 million users</li>
              <li className="text-left"><strong>OPay</strong> - Fast-growing digital platform with remittance capabilities</li>
              <li className="text-left"><strong>PalmPay</strong> - Mobile money service with increasing remittance integration</li>
              <li className="text-left"><strong>Kuda Bank</strong> - Digital bank that supports international transfers</li>
            </ul>
            <p className="text-left">
              Mobile money transfers are typically faster than traditional bank transfers and are accessible to those without formal bank accounts.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup remains extremely popular in Nigeria, especially in areas with limited banking access:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Available at most major banks and some independent agents</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Wide network across the country</li>
              <li className="text-left"><strong>Ria Money Transfer locations</strong> - Growing presence in Nigeria</li>
              <li className="text-left"><strong>Bank branches</strong> - Most major Nigerian banks offer cash pickup services for international transfers</li>
              <li className="text-left"><strong>Independent FX bureaus</strong> - Many are authorized agents for international money transfer operators</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it the fastest option for emergency transfers. However, note that cash pickup often does not qualify for the Naira-4-Dollar incentive.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Domiciliary Accounts</h3>
            <p className="mb-2 text-left">
              A unique option in Nigeria is the domiciliary account - a foreign currency account held in Nigeria:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Allows recipients to receive and hold funds in GBP, USD, or EUR</li>
              <li className="text-left">Recipients can choose when to convert to naira based on favorable exchange rates</li>
              <li className="text-left">Available at most major Nigerian banks</li>
              <li className="text-left">Requires additional documentation to open</li>
            </ul>
            <p className="text-left">
              This option is particularly valuable during periods of naira volatility, allowing recipients to manage currency risk.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Nigeria
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Recipients in Lagos, Abuja, Port Harcourt, and other major cities have access to all receiving methods. Banking infrastructure 
              is well-developed, with same-day delivery often available for bank transfers. Digital options like mobile money are widely used in these urban areas.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Cities</h3>
            <p className="text-left">
              For sending money to rural Nigeria, consider services with extensive networks like Western Union, MoneyGram, or those that work with Paga 
              mobile money. Banking infrastructure is more limited in rural areas, so cash pickup and mobile money are often preferred options.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences</h3>
            <p className="mb-2 text-left">
              Different Nigerian regions may have varying preferences for financial services:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-purple-600 text-left">Lagos & Southwest</h4>
                <p className="text-left">Highest banking penetration; GTBank, Access Bank, and First Bank are popular. Digital banking widely adopted.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-purple-600 text-left">Abuja & Central Nigeria</h4>
                <p className="text-left">Good banking infrastructure; UBA, Zenith, and FCMB have strong presence. Mix of digital and traditional banking.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-purple-600 text-left">Eastern Nigeria</h4>
                <p className="text-left">Cash pickup and mobile money popular; First Bank and Union Bank have extensive networks in this region.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-purple-600 text-left">Northern Nigeria</h4>
                <p className="text-left">More limited banking options; Jaiz Bank (Islamic banking) popular in some areas. Mobile money growing rapidly.</p>
              </div>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates for Nigeria Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Nigeria from the UK, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital transfers to £10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 1-4%)</li>
            <li className="text-left"><strong>Bank receiving fees</strong>: Some Nigerian banks charge a small fee (₦500-1,000) to receive international transfers</li>
          </ul>

          <div className="bg-purple-50 p-6 rounded-xl my-8 border border-purple-100">
            <h3 className="text-purple-700 mb-4 text-left">Exchange Rate Complexities in Nigeria</h3>
            <p className="mb-0 text-left">
              Nigeria has had multiple exchange rates in recent years, which can complicate remittances. The Central Bank of Nigeria (CBN) 
              has been working to unify these rates, but it's always worth checking if your provider is giving you the most competitive rate. 
              Some providers may advertise low fees but offer poor exchange rates. Always compare the final naira amount your recipient will 
              receive rather than just looking at the transfer fee.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="fx-controls" 
        isExpanded={expandedSections['fx-controls']} 
        onClick={toggleSection}
      >
        Nigeria's Foreign Exchange Controls
      </ClickableHeadline>
      {expandedSections['fx-controls'] && (
        <>
          <p className="mb-6 text-left">
            Nigeria has implemented various foreign exchange policies that affect remittances. Understanding these can help you choose the best transfer method:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">The Naira-4-Dollar Scheme</h3>
            <p className="text-left">
              This incentive program gives recipients additional naira when they receive remittances through formal banking channels. 
              Currently, recipients get ₦5 for every $1 received through participating banks. This effectively improves your exchange 
              rate and adds significant value to larger transfers. Most major banks participate in this scheme.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Receiving Currencies</h3>
            <p className="text-left">
              The CBN has stipulated that remittances can be paid out in foreign currency (USD, GBP, EUR) or naira, at the recipient's choice. 
              This gives recipients flexibility, especially during periods of currency volatility. If your recipient has a domiciliary account, 
              they can receive the transfer in the original currency and convert it to naira when rates are favorable.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Documentation Requirements</h3>
            <p className="text-left">
              For larger transfers (typically over £1,000 equivalent), both senders and recipients may need to provide additional documentation 
              to comply with Nigeria's Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. This might include proof of source 
              of funds and the purpose of the transfer.
            </p>
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
            International transfers to Nigeria have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Nigeria</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal remittances are generally not taxable in Nigeria when used for personal expenses</li>
              <li className="text-left">Business-related transfers may be subject to income tax</li>
              <li className="text-left">Large transfers (typically over ₦10 million) may trigger additional scrutiny from financial authorities</li>
              <li className="text-left">Recipients should retain transfer documentation for at least 7 years</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Money sent as gifts is generally not tax-deductible in the UK</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering purposes</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">If sending business-related transfers, different tax considerations may apply</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Nigeria have strict anti-money laundering regulations. Using regulated money transfer providers 
            ensures your transfers comply with these regulations and provides better protection for your money.
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Timing Your Transfer for the Best Rates</h3>
            <p className="mb-2 text-left">
              The Nigerian Naira (NGN) can be highly volatile against the British Pound (GBP). To get the best rates:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Track exchange rates over a few weeks before making large transfers</li>
              <li className="text-left">Consider services that allow you to lock in a rate now for a future transfer</li>
              <li className="text-left">Be aware that rates are often better on weekdays than weekends</li>
              <li className="text-left">Avoid sending money during major Nigerian holidays when banking services may be limited</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Nigeria</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check all recipient details, especially account numbers for bank transfers</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Inform your recipient about the expected arrival time and any reference numbers</li>
              <li className="text-left">Consider sending larger amounts less frequently to minimize total fees</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
              <li className="text-left">Ask your recipient if their bank participates in the Naira-4-Dollar scheme</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-purple-800 mb-4 text-left">Nigeria Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare providers based on the total NGN received, not just the transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if the recipient's bank participates in the Naira-4-Dollar scheme</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify your recipient's preferred method (bank, mobile money, cash pickup)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For bank transfers, confirm if the recipient wants it in naira or has a domiciliary account</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Save your receipt and tracking information for future reference</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Complete Guide to Sending Money to Nigeria"
      subtitle="Best providers, lowest fees, and fastest ways to send money from the UK to Nigeria"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 7, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToNigeriaGuide; 