import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/pakistan-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/pakistan-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Pakistan
 */
const SendMoneyToPakistanGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
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
        The UK-Pakistan Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            With over 1.2 million British Pakistanis in the UK, the UK-Pakistan remittance corridor is one of the most significant for both countries. 
            Annual remittances from the UK to Pakistan exceed £1.7 billion, providing crucial financial support to families, funding property investments, 
            and supporting education and healthcare expenses. Understanding the nuances of this corridor is essential for making efficient transfers.
          </p>

          <div className="bg-emerald-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-emerald-800 mb-3 text-left">Quick Facts: Pakistan Remittances</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Pakistan receives over $30 billion in remittances annually, making it a top global recipient</li>
              <li className="text-left">The UK is the third-largest source of remittances to Pakistan (after Saudi Arabia and UAE)</li>
              <li className="text-left">The Pakistani Rupee (PKR) can be volatile against the British Pound (GBP)</li>
              <li className="text-left">The average cost of sending money to Pakistan ranges from 2-4% of the transfer amount</li>
              <li className="text-left">Pakistan's central bank offers incentives for formal remittance channels through the Pakistan Remittance Initiative (PRI)</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Pakistan from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Pakistan:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Great for tech-savvy users who want to avoid hidden costs.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and first transfer promotions. Popular among Pakistani communities in the UK.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">WorldRemit</h3>
              <p className="text-left">Good balance of speed and cost with extensive delivery networks throughout Pakistan.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">MoneyGram</h3>
              <p className="text-left">Extensive cash pickup locations in Pakistan, including in smaller towns and rural areas.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">Western Union</h3>
              <p className="text-left">Widest network of agent locations throughout Pakistan, including remote areas. A trusted name with decades of experience.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-emerald-600 text-left">ACE Money Transfer</h3>
              <p className="text-left">Specialized in transfers to Pakistan with competitive rates and promotions specifically for the UK-Pakistan corridor.</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl my-8 border border-emerald-100">
            <h3 className="text-emerald-700 mb-4 text-left">PRI Benefits: Fee-Free Transfers</h3>
            <p className="mb-0 text-left">
              The Pakistan Remittance Initiative (PRI) has partnered with many transfer providers to offer fee-free or reduced-fee transfers to Pakistan. Look for 
              providers advertising "PRI" or "Pakistan Remittance Initiative" services, as they often waive transfer fees for amounts over £200 or equivalent. This 
              can save you £10-15 per transfer.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Pakistan
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Pakistan offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Pakistani bank accounts are increasingly popular. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Habib Bank Limited (HBL)</li>
              <li className="text-left">United Bank Limited (UBL)</li>
              <li className="text-left">MCB Bank</li>
              <li className="text-left">Allied Bank</li>
              <li className="text-left">Bank Alfalah</li>
              <li className="text-left">Meezan Bank (Islamic banking)</li>
              <li className="text-left">National Bank of Pakistan</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-2 business days, though some services offer same-day delivery for major banks.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Wallets and Digital Options</h3>
            <p className="mb-2 text-left">
              Pakistan's digital payment infrastructure has grown considerably in recent years:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>JazzCash</strong> - One of Pakistan's largest mobile wallets with over 14 million users</li>
              <li className="text-left"><strong>Easypaisa</strong> - Widely used mobile wallet and payment service</li>
              <li className="text-left"><strong>SadaPay</strong> - Fast-growing digital banking platform</li>
              <li className="text-left"><strong>Raast</strong> - Pakistan's new instant payment system (compatible with some remittance services)</li>
            </ul>
            <p className="text-left">
              Mobile wallet transfers are typically instant and have lower fees than traditional bank transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup remains extremely popular in Pakistan, especially in rural areas:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>HBL Express</strong> - Extensive network throughout Pakistan</li>
              <li className="text-left"><strong>Faysal Bank</strong> - Many branches offer remittance services</li>
              <li className="text-left"><strong>UBL Omni</strong> - Digital branch network with cash pickup</li>
              <li className="text-left"><strong>Pakistan Post</strong> - Government postal service with 12,000+ locations</li>
              <li className="text-left"><strong>Western Union agents</strong> - Available at banks and exchange companies</li>
              <li className="text-left"><strong>MoneyGram locations</strong> - Wide coverage across the country</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it the fastest option for emergency transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Home Delivery</h3>
            <p className="mb-2 text-left">
              Some providers offer cash delivery directly to the recipient's home address:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left"><strong>HBL ExpressPay</strong> - Door-to-door delivery service</li>
              <li className="text-left"><strong>ACE Money Transfer</strong> - Home delivery in major cities</li>
            </ul>
            <p className="text-left">
              Home delivery is particularly valuable for elderly recipients or those in areas with limited transportation options.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Pakistan
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Recipients in major Pakistani cities like Karachi, Lahore, Islamabad, and Rawalpindi have access to all receiving methods. Digital options like bank transfers 
              and mobile wallets are highly efficient, with same-day delivery often available. Most transfer providers have extensive coverage in these urban areas.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Cities</h3>
            <p className="text-left">
              For sending money to rural Pakistan, consider services with extensive networks like Western Union, MoneyGram, or those that work with Pakistan Post. 
              Mobile wallets like JazzCash and Easypaisa have also expanded significantly into rural areas and can be excellent options for regions with limited banking infrastructure.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Provincial Considerations</h3>
            <p className="mb-2 text-left">
              Different Pakistani provinces may have varying levels of financial infrastructure:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-emerald-600 text-left">Punjab</h4>
                <p className="text-left">Best banking infrastructure with numerous options for cash pickup and bank deposits in cities like Lahore, Faisalabad, and Multan.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-emerald-600 text-left">Sindh</h4>
                <p className="text-left">Good coverage in Karachi and Hyderabad, with both digital and traditional options widely available.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-emerald-600 text-left">Khyber Pakhtunkhwa</h4>
                <p className="text-left">Mobile wallets and Pakistan Post may offer better coverage than traditional banks in some areas.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-emerald-600 text-left">Balochistan</h4>
                <p className="text-left">More limited options; consider Western Union, Pakistan Post, or JazzCash for better coverage in remote areas.</p>
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
        Understanding Fees and Exchange Rates for Pakistan Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Pakistan from the UK, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital transfers to £10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5%-3%)</li>
            <li className="text-left"><strong>Bank receiving fees</strong>: Some Pakistani banks charge a small fee (100-300 PKR) to receive international transfers</li>
          </ul>

          <div className="bg-emerald-50 p-6 rounded-xl my-8 border border-emerald-100">
            <h3 className="text-emerald-700 mb-4 text-left">Money-Saving Tip: PRI Benefits</h3>
            <p className="mb-0 text-left">
              Due to the Pakistan Remittance Initiative (PRI), many providers offer fee-free transfers for amounts over £200. Always check if your 
              provider participates in this program. Additionally, some providers offer better rates for first-time users or for larger transfers. 
              Compare the total PKR amount your recipient will receive rather than just the transfer fee.
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
            International transfers to Pakistan have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Pakistan</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Remittances received from abroad are generally tax-exempt in Pakistan</li>
              <li className="text-left">The State Bank of Pakistan encourages formal channels through the PRI program</li>
              <li className="text-left">Recipients don't need to declare remittances on tax returns when used for personal/family expenses</li>
              <li className="text-left">Large transfers (typically over 10 million PKR) may require documentation or explanation</li>
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
            Both the UK and Pakistan have taken measures to encourage the use of formal remittance channels. Following proper channels 
            ensures your transfers comply with regulations in both countries and provides better protection for your money.
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
              The Pakistani Rupee (PKR) can be volatile against the British Pound (GBP). To get the best rates:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Track exchange rates over a few weeks before making large transfers</li>
              <li className="text-left">Consider services that allow you to lock in a rate now for a future transfer</li>
              <li className="text-left">Be aware that rates are often better on weekdays than weekends</li>
              <li className="text-left">National holidays in both the UK and Pakistan can affect processing times</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Pakistan</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check all recipient details, especially IBAN numbers for bank transfers</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Inform your recipient about the expected arrival time and any reference numbers</li>
              <li className="text-left">Consider setting up regular transfers if you're sending money monthly for family support</li>
              <li className="text-left">Look for special promotions during Eid, Ramadan, and other significant holidays</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 text-left">Pakistan Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare providers based on the total PKR received, not just the transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if the service participates in the Pakistan Remittance Initiative (PRI)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify your recipient's preferred method (bank, mobile wallet, cash pickup)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Ensure the recipient's name matches exactly as it appears on their ID or bank account</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-600">
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
      title="Complete Guide to Sending Money to Pakistan"
      subtitle="Best providers, lowest fees, and fastest ways to send money from the UK to Pakistan"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 29, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToPakistanGuide; 