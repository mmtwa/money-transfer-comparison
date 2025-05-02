import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/poland-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/poland-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Poland
 */
const SendMoneyToPolandGuide = () => {
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
        The UK-Poland Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over 900,000 Polish nationals living in the UK, the UK-Poland remittance corridor is one of the busiest in Europe. Since Poland joined the EU in 2004, 
            this corridor has seen significant growth, with annual remittances estimated at over £2 billion. Whether you're supporting family, paying for property, 
            or managing investments in Poland, understanding the specific aspects of UK to Poland transfers is essential for getting the best value.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3 text-left">Key Facts: UK-Poland Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Poland uses the Polish Złoty (PLN), not the Euro, despite being in the EU</li>
              <li className="text-left">The UK is one of the largest sources of remittances to Poland</li>
              <li className="text-left">EU payment regulations offer added protections for transfers between the UK and Poland</li>
              <li className="text-left">Digital transfers have largely replaced traditional cash methods in this corridor</li>
              <li className="text-left">The average cost of sending money to Poland ranges from 0.5-3% of the transfer amount</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Poland from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Poland:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Particularly strong for GBP to PLN conversions.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Revolut</h3>
              <p className="text-left">Excellent rates with free transfers on weekdays for standard accounts (within limits). Popular among Polish communities in the UK.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Western Union</h3>
              <p className="text-left">Good balance of digital and cash options with extensive network throughout Poland. Competitive rates for the UK-Poland corridor.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Azimo</h3>
              <p className="text-left">Specializes in transfers to Eastern Europe with competitive rates and fast delivery to Polish accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">MoneyGram</h3>
              <p className="text-left">Good option for cash pickup services across Poland, with competitive rates for larger transfers.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Monese</h3>
              <p className="text-left">Popular among Polish workers in the UK with multicurrency accounts and competitive transfer rates.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">Bank SWIFT Transfers: A Costly Option</h3>
            <p className="mb-0 text-left">
              While many UK high street banks offer transfers to Poland, they typically use the SWIFT network, which involves high fees (often £20-25 per transfer) 
              and poor exchange rates (typically 3-5% worse than the mid-market rate). For example, sending £500 to Poland via a high street bank could cost you 
              £40-50 in combined fees and exchange rate markups, whereas specialized providers might charge £3-10 for the same transfer.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Poland
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Poland offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Polish bank accounts are the most popular option. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">PKO Bank Polski</li>
              <li className="text-left">Bank Pekao</li>
              <li className="text-left">Santander Bank Polska</li>
              <li className="text-left">mBank</li>
              <li className="text-left">ING Bank Śląski</li>
              <li className="text-left">Alior Bank</li>
              <li className="text-left">BNP Paribas Bank Polska</li>
              <li className="text-left">Credit Agricole Bank Polska</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 0-2 business days, with many specialized providers offering same-day delivery to Polish accounts.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Digital Wallets and Mobile Banking</h3>
            <p className="mb-2 text-left">
              Poland has a highly advanced digital banking ecosystem:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>BLIK</strong> - Poland's popular mobile payment system, integrated with most Polish banks</li>
              <li className="text-left"><strong>Revolut</strong> - Widely used in Poland, allowing easy transfers between UK and Polish accounts</li>
              <li className="text-left"><strong>N26</strong> - Digital bank with growing presence in Poland</li>
              <li className="text-left"><strong>PayPal</strong> - Commonly used for smaller transfers and online purchases</li>
            </ul>
            <p className="text-left">
              Digital wallet transfers are typically faster than traditional bank transfers and often have lower fees.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              While less common than bank transfers, cash pickup options are available throughout Poland:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Available at Poczta Polska (Polish Post) offices and partner banks</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Found at currency exchange offices (Kantor) and some banks</li>
              <li className="text-left"><strong>Euronet ATMs</strong> - Some money transfer services allow cash pickup via ATM networks</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it a fast option for emergency transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Postal Delivery</h3>
            <p className="mb-2 text-left">
              A traditional option that still exists in some forms:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Poczta Polska (Polish Post) offers money order services</li>
              <li className="text-left">Some transfer providers will deliver funds directly to the recipient's address</li>
              <li className="text-left">This option is generally slower (3-5 business days) and becoming less common</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Poland
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Recipients in Warsaw, Kraków, Wrocław, Łódź, Poznań, and other major cities have access to all receiving methods. 
              Banking infrastructure is highly developed, with same-day delivery often available for bank transfers. Digital banking is widely 
              adopted in urban areas, with services like BLIK and mobile banking being extremely popular.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Towns</h3>
            <p className="text-left">
              Poland has relatively good banking coverage even in rural areas, but some considerations apply. The Polish Post Office 
              (Poczta Polska) has extensive coverage in rural areas and offers Western Union services. For very remote locations, 
              ensure your recipient has access to their preferred pickup method before sending.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences</h3>
            <p className="mb-2 text-left">
              Different Polish regions may have varying banking preferences:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Warsaw & Central Poland</h4>
                <p className="text-left">Highest concentration of international banks; PKO BP, Santander, and mBank have strong presence. Digital banking widely used.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Southern Poland (Kraków, Katowice)</h4>
                <p className="text-left">ING Bank Śląski and Bank Pekao are particularly popular. Good coverage of transfer services.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Western Poland (Poznań, Wrocław)</h4>
                <p className="text-left">Santander Bank Polska has strong presence. Good banking infrastructure with multiple options.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Northern & Eastern Poland</h4>
                <p className="text-left">PKO BP and local cooperative banks are common. Postal services important in more remote areas.</p>
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
        Understanding Fees and Exchange Rates for Poland Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Poland from the UK, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital transfers to £10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5-3% with specialized providers)</li>
            <li className="text-left"><strong>Bank receiving fees</strong>: Some Polish banks charge a small fee (10-20 PLN) to receive international transfers, particularly for SWIFT transfers</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">Złoty Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Polish Złoty (PLN) can be somewhat volatile against the British Pound (GBP). Unlike the Euro, which tends to move in smaller 
              ranges against the GBP, the złoty can see more significant fluctuations. This makes timing your transfer important for larger amounts. 
              Some providers offer rate alerts or the ability to lock in rates for future transfers, which can be valuable for managing currency risk 
              when sending money to Poland regularly.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="eu-transfers" 
        isExpanded={expandedSections['eu-transfers']} 
        onClick={toggleSection}
      >
        EU Payment Regulations and SEPA
      </ClickableHeadline>
      {expandedSections['eu-transfers'] && (
        <>
          <p className="mb-6 text-left">
            Despite Brexit, transfers to Poland still benefit from certain European payment frameworks:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">SEPA Transfers</h3>
            <p className="text-left">
              The Single Euro Payments Area (SEPA) covers all EU countries, including Poland. While the UK is no longer an EU member, 
              many UK payment providers maintain access to SEPA. If you convert your GBP to EUR first, you can send money via SEPA to a euro-denominated 
              account in Poland (which many Polish banks offer), often with lower fees than traditional international transfers. Your recipient can then 
              convert to złoty at their bank if needed.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Consumer Protections</h3>
            <p className="text-left">
              Transfers between the UK and EU countries like Poland continue to benefit from strong consumer protections. These include 
              requirements for transparency in fees and exchange rates, as well as dispute resolution mechanisms if something goes wrong with your transfer.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Future Adoption of the Euro</h3>
            <p className="text-left">
              Poland is legally obligated to adopt the euro eventually, though no date has been set and it remains a politically sensitive topic. 
              If and when Poland adopts the euro, transfers from the UK will likely become even more streamlined and potentially cheaper.
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
            International transfers to Poland have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Poland</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal transfers and gifts up to 36,120 PLN (approximately £7,000) per year from a single sender are generally tax-exempt</li>
              <li className="text-left">Larger gifts may be subject to gift tax (podatek od darowizn) with rates ranging from 3-20% depending on the relationship between sender and recipient</li>
              <li className="text-left">Close family members (spouses, children, parents) can qualify for higher exemption limits or complete exemptions if properly documented</li>
              <li className="text-left">Business-related transfers may be subject to income tax</li>
              <li className="text-left">Recipients should declare significant gifts to the Polish tax authority (Urząd Skarbowy) within 6 months</li>
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
            Both the UK and Poland have regulations designed to prevent money laundering and terrorist financing. Using regulated money transfer 
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
              The Polish Złoty (PLN) can fluctuate against the British Pound (GBP). To get the best rates:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Track exchange rates over a few weeks before making large transfers</li>
              <li className="text-left">Consider services that allow you to lock in a rate now for a future transfer</li>
              <li className="text-left">Be aware that rates are often better on weekdays than weekends</li>
              <li className="text-left">Polish and UK bank holidays can affect processing times, so plan accordingly</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Poland</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check all recipient details, especially IBAN numbers for bank transfers (Polish IBANs start with 'PL' followed by 26 digits)</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Consider digital-first providers like Wise, Revolut, or Azimo, which tend to offer the best rates for the UK-Poland corridor</li>
              <li className="text-left">If your recipient has accounts in both PLN and EUR, compare rates for both currencies to find the best deal</li>
              <li className="text-left">For recurring transfers, set up a regular payment plan to save time and potentially receive loyalty discounts</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4 text-left">Poland Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare providers based on the total PLN received, not just the transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify if your recipient prefers transfer in złoty (PLN) or euro (EUR)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if using a digital-first provider like Wise or Revolut offers better rates</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Confirm the recipient's full bank details, including the 28-character IBAN (for bank transfers)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For larger amounts, consider tax implications for your recipient in Poland</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Complete Guide to Sending Money to Poland"
      subtitle="Best providers, lowest fees, and fastest ways to send money from the UK to Poland"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 19, 2025"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToPolandGuide; 