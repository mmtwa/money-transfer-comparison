import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/romania-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/romania-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Romania
 */
const SendMoneyToRomaniaGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'eu-transfers': true,
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
        The UK-Romania Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over 400,000 Romanians living in the UK, the UK-Romania remittance corridor has become one of the most important European transfer routes. 
            Each year, billions of pounds are sent from the UK to Romania, supporting families, funding property investments, and contributing significantly 
            to the Romanian economy. Understanding the specific nuances of transferring money to Romania is essential for ensuring your money reaches its 
            destination efficiently and cost-effectively.
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-3 text-left">Key Facts: UK-Romania Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Romania uses the Romanian Leu (RON), not the Euro, despite being in the EU</li>
              <li className="text-left">The UK is one of the top three sources of remittances to Romania</li>
              <li className="text-left">EU payment regulations provide enhanced protection for UK-Romania transfers</li>
              <li className="text-left">The Romanian banking system is well-developed, with excellent digital options</li>
              <li className="text-left">The average cost of sending money to Romania ranges from 0.7-4% of the transfer amount</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Romania from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Romania:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Particularly strong for GBP to RON conversions.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">Revolut</h3>
              <p className="text-left">Excellent rates with free transfers on weekdays for standard accounts (within limits). Popular among Romanian communities in the UK.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">WorldRemit</h3>
              <p className="text-left">Good balance of digital and cash options with competitive rates and extensive coverage across Romania.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">Azimo</h3>
              <p className="text-left">Specializes in transfers to Eastern Europe with competitive rates and fast delivery to Romanian accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">Western Union</h3>
              <p className="text-left">Extensive cash pickup network throughout Romania, particularly valuable for recipients in rural areas.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-yellow-600 text-left">MoneyGram</h3>
              <p className="text-left">Good option for cash pickup with competitive rates for larger transfers and broad network in Romania.</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl my-8 border border-yellow-100">
            <h3 className="text-yellow-700 mb-4 text-left">Traditional Banks vs. Specialized Providers</h3>
            <p className="mb-0 text-left">
              While major UK banks offer transfers to Romania, they typically charge high fees (£15-25 per transfer) and offer exchange rates 
              3-5% worse than the mid-market rate. For example, sending £500 to Romania could cost £35-50 in combined fees and exchange rate 
              markups through a high street bank, whereas specialized providers might charge only £3-10 for the same transfer. Even with Romania's 
              EU membership, traditional bank transfers remain expensive compared to modern alternatives.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Romania
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Romania offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Romanian bank accounts are the most popular option. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Banca Transilvania</li>
              <li className="text-left">BRD - Groupe Société Générale</li>
              <li className="text-left">CEC Bank</li>
              <li className="text-left">Raiffeisen Bank</li>
              <li className="text-left">BCR (Banca Comercială Română)</li>
              <li className="text-left">ING Bank Romania</li>
              <li className="text-left">UniCredit Bank</li>
              <li className="text-left">Alpha Bank Romania</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 0-2 business days, with many specialized providers offering same-day delivery to Romanian accounts.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Digital Banking and Mobile Wallets</h3>
            <p className="mb-2 text-left">
              Romania has a rapidly developing digital banking ecosystem:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Revolut</strong> - Very popular in Romania, allowing easy transfers between UK and Romanian accounts</li>
              <li className="text-left"><strong>TransferGo</strong> - Widely used by the Romanian diaspora</li>
              <li className="text-left"><strong>PayPal</strong> - Common for smaller transfers and online payments</li>
              <li className="text-left"><strong>Paysera</strong> - Growing in popularity for international transfers</li>
            </ul>
            <p className="text-left">
              Digital transfers are typically faster than traditional bank transfers and often have lower fees.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup remains an important option, especially in rural areas:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Available at partner banks, post offices, and dedicated agencies</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Found at partner banks and currency exchange offices</li>
              <li className="text-left"><strong>Smith & Smith</strong> - Local money transfer company with extensive network</li>
              <li className="text-left"><strong>Meridiana Transfer</strong> - Romanian money transfer operator with many locations</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it a fast option for emergency transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Post Office Delivery</h3>
            <p className="mb-2 text-left">
              Poșta Română (Romanian Post) offers money transfer services:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Western Union services are available at most post offices</li>
              <li className="text-left">Eurogiro postal money orders can be sent to Romania</li>
              <li className="text-left">Particularly valuable in smaller towns and villages where banks are less accessible</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Romania
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Recipients in Bucharest, Cluj-Napoca, Timișoara, Iași, and other major cities have access to all receiving methods. 
              Banking infrastructure is well-developed, with same-day delivery often available for bank transfers. Digital banking has 
              seen significant adoption in urban areas, with services like Revolut and mobile banking widely used.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Towns</h3>
            <p className="text-left">
              Romania has significant rural populations with more limited banking access. In these areas, cash pickup services like 
              Western Union and Poșta Română (post office) locations are very important. If sending money to rural Romania, verify 
              which services are available in your recipient's specific location.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences</h3>
            <p className="mb-2 text-left">
              Different Romanian regions may have varying banking preferences:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-yellow-600 text-left">Bucharest & Southern Romania</h4>
                <p className="text-left">Highest banking penetration; BCR, BRD, and ING Bank have strong presence. Digital banking widely adopted.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-yellow-600 text-left">Transylvania (Cluj, Brașov, Sibiu)</h4>
                <p className="text-left">Banca Transilvania is dominant; good banking infrastructure with multiple options available.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-yellow-600 text-left">Moldova Region (Iași, Bacău)</h4>
                <p className="text-left">More reliance on cash pickup in some areas; BRD and BCR have good coverage in larger cities.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-yellow-600 text-left">Rural Areas Nationwide</h4>
                <p className="text-left">CEC Bank and Poșta Română have the most extensive rural coverage; cash pickup services important.</p>
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
        Understanding Fees and Exchange Rates for Romania Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Romania from the UK, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital transfers to £10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5-3% with specialized providers)</li>
            <li className="text-left"><strong>Bank receiving fees</strong>: Some Romanian banks charge small fees (5-30 RON) to receive international transfers, especially SWIFT transfers</li>
          </ul>

          <div className="bg-yellow-50 p-6 rounded-xl my-8 border border-yellow-100">
            <h3 className="text-yellow-700 mb-4 text-left">Romanian Leu Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Romanian Leu (RON) can fluctuate significantly against the British Pound (GBP). Unlike the Euro, the leu tends to see more 
              volatility in exchange rates. This makes timing your transfer important for larger amounts. Some providers offer rate alerts 
              or the ability to lock in rates for future transfers, which can be valuable when sending money to Romania regularly. For larger 
              transfers, even a 1% improvement in exchange rate can save you significant money.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="eu-transfers" 
        isExpanded={expandedSections['eu-transfers']} 
        onClick={toggleSection}
      >
        EU Payment Frameworks and Regulations
      </ClickableHeadline>
      {expandedSections['eu-transfers'] && (
        <>
          <p className="mb-6 text-left">
            Despite Brexit, transfers to Romania still benefit from certain European payment frameworks:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">SEPA Transfers</h3>
            <p className="text-left">
              The Single Euro Payments Area (SEPA) covers all EU countries, including Romania. While the UK is no longer an EU member, 
              many UK payment providers maintain access to SEPA. If you convert your GBP to EUR first, you can send money via SEPA to a euro-denominated 
              account in Romania (which many Romanian banks offer), often with lower fees than traditional international transfers. Your recipient can then 
              convert to Romanian leu at their bank if needed.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Consumer Protections</h3>
            <p className="text-left">
              Transfers between the UK and EU countries like Romania continue to benefit from strong consumer protections. These include 
              requirements for transparency in fees and exchange rates, as well as dispute resolution mechanisms if something goes wrong with your transfer.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Future Adoption of the Euro</h3>
            <p className="text-left">
              Romania is committed to eventually adopting the euro, though the timeline has been repeatedly delayed. The current target is around 2027-2028. 
              When Romania adopts the euro, transfers from the UK are likely to become even more streamlined and potentially cheaper.
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
            International transfers to Romania have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Romania</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal transfers and gifts are generally not taxable in Romania, regardless of the amount</li>
              <li className="text-left">However, large transfers (typically over €10,000 equivalent) may trigger automatic reporting by banks to Romania's financial intelligence unit</li>
              <li className="text-left">Recipients should keep documentation about the source of funds for significant transfers</li>
              <li className="text-left">Business-related transfers are subject to regular income tax</li>
              <li className="text-left">Regular large transfers that appear to be income might be scrutinized by tax authorities</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Money sent as gifts is generally not tax-deductible in the UK</li>
              <li className="text-left">Regular gifts from your income don't incur UK Inheritance Tax</li>
              <li className="text-left">Larger gifts may be subject to Inheritance Tax if you die within 7 years of making them</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering purposes</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Romania have regulations designed to prevent money laundering and terrorist financing. Using regulated money transfer 
            providers ensures your transfers comply with these regulations and provides better protection for your money.
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
              The Romanian Leu (RON) can fluctuate against the British Pound (GBP). To get the best rates:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Track exchange rates over a few weeks before making large transfers</li>
              <li className="text-left">Consider services that allow you to lock in a rate now for a future transfer</li>
              <li className="text-left">Be aware that rates are often better on weekdays than weekends</li>
              <li className="text-left">Romanian and UK bank holidays can affect processing times, so plan accordingly</li>
              <li className="text-left">The National Bank of Romania occasionally intervenes in currency markets, which can cause volatility</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Romania</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check all recipient details, especially IBAN numbers for bank transfers (Romanian IBANs start with 'RO' followed by 22 digits)</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Consider digital-first providers like Wise, Revolut, or Azimo, which tend to offer the best rates for the UK-Romania corridor</li>
              <li className="text-left">If your recipient has accounts in both RON and EUR, compare rates for both currencies to find the best deal</li>
              <li className="text-left">For recurring transfers, set up a regular payment plan to save time and potentially receive loyalty discounts</li>
              <li className="text-left">For rural recipients, verify availability of cash pickup locations before sending</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 text-left">Romania Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare providers based on the total RON received, not just the transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify if your recipient prefers transfer in lei (RON) or euros (EUR)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if digital-first providers offer better rates than traditional services</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Confirm the recipient's full bank details, including the 24-character IBAN (for bank transfers)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For rural recipients, verify availability of cash pickup locations in their area</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Complete Guide to Sending Money to Romania"
      subtitle="Best providers, lowest fees, and fastest ways to send money from the UK to Romania"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 24, 2025"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToRomaniaGuide; 