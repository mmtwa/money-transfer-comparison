import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/india-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/india-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to India
 */
const SendMoneyToIndiaGuide = () => {
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
        Why Sending Money to India is Different
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            India is one of the world's largest remittance markets, receiving over $87 billion in 2021 alone. The combination of a large diaspora, 
            strong family ties, and India's developing banking infrastructure makes this corridor unique. Whether you're sending money for family 
            support, property investments, or business purposes, understanding the specific nuances of Indian transfers is essential.
          </p>

          <div className="bg-amber-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-amber-800 mb-3 text-left">Key Facts: India Remittances</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">India receives more remittances than any other country globally</li>
              <li className="text-left">The average cost of sending money to India ranges from 2-5% of the transfer amount</li>
              <li className="text-left">Digital transfers now account for over 60% of remittances to India</li>
              <li className="text-left">The Indian Rupee (INR) can be volatile against major currencies</li>
              <li className="text-left">India has specific regulatory requirements for transfers above ₹50,000</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to India
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money to India:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-amber-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Great for tech-savvy users who want to avoid hidden costs.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-amber-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and first transfer promotions. Offers both economy and express delivery options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-amber-600 text-left">Western Union</h3>
              <p className="text-left">Extensive cash pickup network across India, including remote areas. Reliable option for recipients without bank accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-amber-600 text-left">Xoom (PayPal)</h3>
              <p className="text-left">Quick transfers directly to most major Indian bank accounts. Convenient for PayPal users who want fast delivery.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-amber-600 text-left">InstaReM</h3>
              <p className="text-left">Excellent rates for larger transfers (₹50,000+). Provides loyalty points on every transfer that can be redeemed for discounts.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl my-8 border border-amber-100">
            <h3 className="text-amber-700 mb-4 text-left">Key Fact: India's Regulatory Requirements</h3>
            <p className="mb-0 text-left">
              India has specific regulatory requirements for incoming international transfers. For transfers above ₹50,000,
              many providers will require the purpose code (P-CODES) that categorizes the reason for sending money to India.
              Common P-CODES include S0001 (family maintenance) and S0006 (personal gifts).
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in India
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            India offers several ways to receive money from abroad. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Indian bank accounts are the most popular option. Most major Indian banks can receive international transfers, including:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">State Bank of India (SBI)</li>
              <li className="text-left">HDFC Bank</li>
              <li className="text-left">ICICI Bank</li>
              <li className="text-left">Axis Bank</li>
              <li className="text-left">Punjab National Bank</li>
              <li className="text-left">Bank of Baroda</li>
            </ul>
            <p className="text-left">
              Transfers typically take 1-3 business days, though some services offer same-day or next-day delivery.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Wallets and UPI</h3>
            <p className="mb-2 text-left">
              India's digital payment infrastructure has developed rapidly. Some providers now offer transfers directly to:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Paytm Wallet</li>
              <li className="text-left">Amazon Pay</li>
              <li className="text-left">PhonePe</li>
              <li className="text-left">Google Pay (UPI-based)</li>
            </ul>
            <p className="text-left">
              These options are typically faster than bank transfers and can be especially convenient for recipients who may not have traditional bank accounts.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              For recipients who prefer physical cash or don't have bank accounts, cash pickup is available through:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Western Union locations (10,000+ in India)</li>
              <li className="text-left">MoneyGram agents</li>
              <li className="text-left">Ria Money Transfer locations</li>
              <li className="text-left">India Post Offices (particularly valuable in rural areas)</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in India
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Most transfer services work seamlessly in major Indian cities like Delhi, Mumbai, Bangalore, and Chennai. Digital options like bank transfers and mobile wallets are highly efficient,
              with quick delivery times. Competition among providers means better rates in these corridors.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Cities</h3>
            <p className="text-left">
              For sending money to rural India, consider services with extensive cash pickup networks like Western Union or those that work with India Post.
              Some regional and state banks may have limited SWIFT capabilities, so verify with your recipient which banks in their area reliably receive international transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Popular Regional Banks by State</h3>
            <p className="mb-2 text-left">
              Different Indian states often have prominent regional banks that might be preferred by locals:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">Punjab & Northern India</h4>
                <p className="text-left">Punjab National Bank, Punjab & Sind Bank</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">Kerala</h4>
                <p className="text-left">Federal Bank, South Indian Bank</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">Tamil Nadu</h4>
                <p className="text-left">Indian Bank, City Union Bank</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">Gujarat</h4>
                <p className="text-left">Bank of Baroda</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">West Bengal</h4>
                <p className="text-left">United Bank of India</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-amber-600 text-left">Karnataka</h4>
                <p className="text-left">Karnataka Bank</p>
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
        Understanding Fees and Exchange Rates for India Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to India, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from $0-$5 for digital transfers to $10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5%-3%)</li>
            <li className="text-left"><strong>Bank receiving fees</strong>: Some Indian banks charge ₹100-₹300 to receive international transfers</li>
          </ul>

          <div className="bg-orange-50 p-6 rounded-xl my-8 border border-orange-100">
            <h3 className="text-orange-700 mb-4 text-left">Money-Saving Tip</h3>
            <p className="mb-0 text-left">
              Many providers offer better rates for first-time customers or for larger transfers. If you're planning to send a significant amount,
              consider splitting it into a smaller test transfer (to take advantage of new customer promotions) followed by a larger transfer
              that qualifies for premium rates.
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
            International transfers to India have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in India</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Gifts from relatives are tax-exempt in India</li>
              <li className="text-left">Non-relative gifts over ₹50,000 per year may be taxable</li>
              <li className="text-left">Regular remittances above certain thresholds may require declaration on Indian tax returns</li>
              <li className="text-left">Foreign remittance for investment purposes has different tax treatment than family maintenance</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Transfers are generally not tax-deductible</li>
              <li className="text-left">Some countries require reporting of international transfers above certain amounts</li>
              <li className="text-left">Always retain proof of transfer for tax purposes</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            The Indian government has streamlined regulations for inward remittances in recent years, but it's always best to check
            with your provider about any current documentation requirements, especially for larger transfers.
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
              The Indian Rupee (INR) can be volatile against major currencies like the USD, GBP, and EUR. To get the best rates:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Track exchange rates over a few weeks before making large transfers</li>
              <li className="text-left">Consider services that allow you to lock in a rate now for a future transfer</li>
              <li className="text-left">Avoid month-end when many businesses make international payments</li>
              <li className="text-left">Be aware of Indian holidays and banking hours which may affect processing times</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to India</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check all recipient details, especially the IFSC code (Indian Financial System Code) for bank transfers</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Inform your recipient about the expected arrival date and any reference numbers</li>
              <li className="text-left">Consider setting up regular transfers if you're sending money monthly for family support</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-amber-800 mb-4 text-left">India Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare providers based on the total INR amount received, not just the transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the IFSC code for the recipient's bank (each bank branch has a unique code)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if you need a purpose code for transfers above ₹50,000</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Ensure the recipient's name matches exactly as it appears on their bank account</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-amber-600">
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
      title="Complete Guide to Sending Money to India"
      subtitle="Best providers, lowest fees, and fastest ways to send money to your loved ones in India"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 17, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToIndiaGuide; 