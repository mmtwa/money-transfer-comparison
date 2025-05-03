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
 * Guide to sending money to Vietnam
 */
const SendMoneyToVietnamGuide = () => {
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
        Sending Money to Vietnam: A Growing Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Vietnam has become one of Asia's fastest-growing remittance destinations, receiving over $19 billion annually. The UK-Vietnam corridor 
            specifically has seen significant growth, driven by Vietnam's expanding economy, increasing international business relationships, and 
            a growing Vietnamese diaspora in the UK. Whether you're supporting family, investing in business opportunities, or making payments for 
            services, understanding the specific nuances of sending money to Vietnam is essential.
          </p>

          <div className="bg-green-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-green-800 mb-3 text-left">Key Facts: Vietnam Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Vietnam's currency (Vietnamese Dong - VND) is partially controlled by the government</li>
              <li className="text-left">The average cost of sending money to Vietnam ranges from a competitive 1-4% of the transfer amount</li>
              <li className="text-left">Urban areas have excellent banking infrastructure while rural areas may have more limited options</li>
              <li className="text-left">Cash pickups are widely available throughout the country</li>
              <li className="text-left">Transfers above 300 million VND (approximately £9,000) may require additional documentation</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Vietnam from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Vietnam:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Wise</h3>
              <p className="text-left">Best for mid-market exchange rates with transparent fees. Excellent for bank transfers to major Vietnamese banks.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and first-time user promotions. Offers both economy and express delivery options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Western Union</h3>
              <p className="text-left">Extensive cash pickup network throughout Vietnam, including in rural areas. Good option when recipient doesn't have a bank account.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">WorldRemit</h3>
              <p className="text-left">Reliable service with good coverage across Vietnam. Offers both bank deposits and cash pickup with competitive rates.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">MoneyGram</h3>
              <p className="text-left">Large network of pickup locations in Vietnam with real-time transfer tracking. Good option for cash services.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">XendPay</h3>
              <p className="text-left">Pay-what-you-want fee structure that can result in lower costs. Good for bank-to-bank transfers to Vietnam.</p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl my-8 border border-green-100">
            <h3 className="text-green-700 mb-4 text-left">Provider Selection Tip: Exchange Rate Matters Most</h3>
            <p className="mb-0 text-left">
              When sending money to Vietnam, the exchange rate margin often has a bigger impact on the total cost than the transfer fee, 
              especially for larger amounts. Some providers advertise "fee-free" transfers but make their profit on less favorable exchange rates. 
              Always compare the VND amount that will actually be received, not just the advertised fee. For transfers over £1,000, 
              a difference of just 1% in the exchange rate can mean your recipient gets an extra £10 for every £1,000 you send.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Vietnam
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Vietnam offers several ways to receive money from abroad, catering to both urban and rural recipients:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Vietnamese bank accounts are popular in urban areas. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Vietcombank (Vietnam Foreign Trade Bank)</li>
              <li className="text-left">BIDV (Bank for Investment and Development of Vietnam)</li>
              <li className="text-left">Agribank (Vietnam Bank for Agriculture and Rural Development)</li>
              <li className="text-left">Techcombank (Vietnam Technological and Commercial Joint Stock Bank)</li>
              <li className="text-left">VietinBank (Vietnam Joint Stock Commercial Bank for Industry and Trade)</li>
              <li className="text-left">Sacombank (Saigon Thuong Tin Commercial Joint Stock Bank)</li>
              <li className="text-left">ACB (Asia Commercial Bank)</li>
              <li className="text-left">HDBank (Ho Chi Minh City Development Joint Stock Commercial Bank)</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-3 business days. Recipients will usually need to provide the sender with their full name as it appears on the bank account, 
              account number, bank name, and branch details.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Money and Digital Wallets</h3>
            <p className="mb-2 text-left">
              Vietnam's digital payment ecosystem is growing rapidly, with several options for receiving money:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>MoMo</strong> - Vietnam's largest e-wallet with over 20 million users</li>
              <li className="text-left"><strong>ZaloPay</strong> - Integrated with Zalo, Vietnam's popular messaging app</li>
              <li className="text-left"><strong>ViettelPay</strong> - Connected to Viettel, Vietnam's largest telecom provider</li>
              <li className="text-left"><strong>VNPay</strong> - Widely used QR-code payment system</li>
            </ul>
            <p className="text-left">
              Some international transfer providers now connect directly to these wallets, though this option is still emerging. Recipients typically need a Vietnamese phone number and ID for verification.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup is widely available throughout Vietnam and remains popular, especially in rural areas:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Found at banks and post offices across the country</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Available at various banks and service points</li>
              <li className="text-left"><strong>TransFast partners</strong> - Present in major cities and provincial centers</li>
              <li className="text-left"><strong>Ria Money Transfer</strong> - Growing network across Vietnam</li>
            </ul>
            <p className="text-left">
              For cash pickup, recipients typically need their Vietnamese ID card or passport and the transaction reference number. Cash is usually available within minutes of the transfer being sent.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Home Delivery</h3>
            <p className="mb-2 text-left">
              A unique option available in Vietnam is cash delivery directly to the recipient's home:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Some providers partner with local services to deliver cash directly to the recipient's address</li>
              <li className="text-left">This service is particularly useful in areas with limited banking infrastructure</li>
              <li className="text-left">Typically requires accurate address information and recipient ID verification</li>
              <li className="text-left">This option may have higher fees but offers maximum convenience</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Vietnam
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Ho Chi Minh City, Hanoi, Da Nang, and other major cities have excellent banking infrastructure. All major Vietnamese 
              banks operate here, and international banking services are widely available. Digital payment options are increasingly 
              popular in urban areas, with high smartphone penetration enabling mobile wallet usage. Cash pickup locations are plentiful, 
              with multiple options within short distances.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Provincial Cities</h3>
            <p className="text-left">
              Medium-sized cities like Can Tho, Hai Phong, Nha Trang, and Hue have good banking services with branches of most major banks. 
              Cash pickup services are readily available through Western Union and bank partnerships. Mobile network coverage is strong, 
              enabling digital wallet usage, though some older recipients may still prefer traditional banking methods.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural and Remote Areas</h3>
            <p className="text-left">
              In rural Vietnam, banking access has improved but remains less comprehensive. Agribank has the most extensive rural presence, 
              designed specifically to serve agricultural communities. For truly remote areas, consider providers with home delivery options 
              or extensive cash pickup networks like Western Union, which partners with Vietnam Post. Mobile money services are expanding in rural areas, 
              leveraging Vietnam's strong mobile network coverage.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences</h3>
            <p className="mb-2 text-left">
              Different regions of Vietnam have preferences for specific banks:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Northern Vietnam (Hanoi region)</h4>
                <p className="text-left">BIDV and VietinBank have strong presence. Agribank serves rural northern provinces effectively.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Southern Vietnam (Ho Chi Minh City region)</h4>
                <p className="text-left">Sacombank, ACB and Techcombank are particularly popular. Vietcombank has excellent service in HCMC.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Central Vietnam (Da Nang, Hue)</h4>
                <p className="text-left">Vietcombank and BIDV have strong networks. SHB (Saigon-Hanoi Bank) also has good coverage.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Mekong Delta Region</h4>
                <p className="text-left">Agribank has extensive coverage in this agricultural region. Kien Long Bank serves local communities.</p>
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
        Understanding Fees and Exchange Rates for Vietnam Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Vietnam, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital providers to £10+ for bank transfers</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5-3%)</li>
            <li className="text-left"><strong>Receiving fees</strong>: Some Vietnamese banks charge 0.05-0.1% of the received amount (often with a minimum fee of 80,000-100,000 VND)</li>
            <li className="text-left"><strong>Cash pickup fees</strong>: These are usually included in the sending fee but may sometimes be passed to the recipient</li>
          </ul>

          <div className="bg-green-50 p-6 rounded-xl my-8 border border-green-100">
            <h3 className="text-green-700 mb-4 text-left">VND Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Vietnamese Dong (VND) is managed by the State Bank of Vietnam, which sets a daily reference rate and allows trading 
              within a narrow band of that rate. This "managed float" system means exchange rates are less volatile than fully floating 
              currencies but can still fluctuate. The VND has historically shown a gradual depreciation against major currencies like GBP, 
              EUR and USD. When sending larger amounts, tracking the rate for a few days before your transfer can help you identify a favorable time.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        Vietnam's Remittance Regulations
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            Vietnam has specific regulations governing international money transfers that you should be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Documentation Requirements</h3>
            <p className="text-left">
              For most personal transfers under 300 million VND (approximately £9,000), minimal documentation is required beyond 
              the recipient's ID and basic sender information. For larger amounts, Vietnamese banks may request information on the purpose 
              of the transfer and the relationship between sender and recipient. Business-related transfers typically require invoices, 
              contracts, or other supporting documentation.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Purpose Requirements</h3>
            <p className="text-left">
              All international transfers to Vietnam should include a clear purpose. Common acceptable purposes include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Family support</li>
              <li className="text-left">Gift</li>
              <li className="text-left">Education expenses</li>
              <li className="text-left">Payment for goods or services (with supporting documentation)</li>
              <li className="text-left">Investment (subject to additional regulations)</li>
            </ul>
            <p className="text-left">
              The stated purpose affects how the transfer is processed and what documentation may be required.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Currency Conversion Requirements</h3>
            <p className="text-left">
              When money is sent to a Vietnamese bank account, it typically arrives in the original currency (GBP, USD, EUR, etc.) 
              and is then converted to VND upon receipt, unless the recipient has a foreign currency account. By law, most domestic 
              transactions in Vietnam must be conducted in VND. Recipients can sometimes hold the funds in a foreign currency account 
              temporarily, but will need to convert to VND for local use.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Considerations for Business Transfers</h3>
            <p className="text-left">
              Business-related transfers to Vietnam face additional scrutiny:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Commercial transfers may require business registration documents</li>
              <li className="text-left">Invoices or contracts showing the business relationship are often needed</li>
              <li className="text-left">Transfers for capital investment have specific requirements under Vietnam's foreign investment laws</li>
              <li className="text-left">Regular business transfers may need to be reported for tax purposes</li>
              <li className="text-left">Some industries have additional restrictions or requirements</li>
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
            International transfers to Vietnam have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Vietnam</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal remittances (family support, gifts) under 100 million VND per transaction are generally not taxable</li>
              <li className="text-left">Regular large transfers may be subject to income tax if deemed income rather than gifts</li>
              <li className="text-left">Business remittances are subject to corporate income tax and may incur VAT depending on the nature of the transaction</li>
              <li className="text-left">Recipients should maintain clear records of all international transfers for possible tax verification</li>
              <li className="text-left">Property investments using foreign funds have specific registration requirements and may incur property taxes</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal gifts are generally not tax-deductible in the UK</li>
              <li className="text-left">Business payments may have VAT and corporation tax implications depending on the nature of the transaction</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering purposes</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">Ensure transfers comply with both UK and Vietnamese regulations</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Vietnam have anti-money laundering regulations that affect international transfers. Using established, regulated money 
            transfer providers helps ensure your transfers comply with these regulations. If you're sending money for business purposes or in large amounts, 
            consulting with a financial advisor familiar with Vietnam-UK transactions may be beneficial.
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
              Several factors can affect the timing and processing of transfers to Vietnam:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Vietnamese holidays, especially Tet (Lunar New Year, typically in January or February), may delay processing by several days</li>
              <li className="text-left">Vietnam is 6-7 hours ahead of the UK (depending on daylight saving time), so transfers initiated in the UK morning may be processed during Vietnam's afternoon</li>
              <li className="text-left">Weekends and Vietnamese public holidays can delay bank transfers, though cash pickup services often remain available</li>
              <li className="text-left">First-time transfers to a recipient typically take longer due to additional verification</li>
              <li className="text-left">Bank transfers usually take 1-3 business days, while cash pickups are often available within minutes after sending</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Vietnam</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check the recipient's name spelling exactly as it appears on their ID - Vietnamese names can be challenging for non-Vietnamese speakers</li>
              <li className="text-left">For bank transfers, always verify the SWIFT/BIC code and account details carefully</li>
              <li className="text-left">Inform your recipient about the expected delivery time and any reference numbers</li>
              <li className="text-left">For first-time transfers, use a smaller amount to verify everything works correctly</li>
              <li className="text-left">Consider setting up regular transfers if you're sending money monthly for family support</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
              <li className="text-left">Be aware that typing "dong" into search engines may return adult content; use "VND" instead</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-green-800 mb-4 text-left">Vietnam Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the recipient's full name exactly as it appears on their Vietnamese ID</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare the total VND amount received, not just the advertised transfer fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if your transfer amount requires additional documentation (generally over 300 million VND)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Be prepared to provide the purpose of the transfer (family support, business, etc.)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
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
      title="Complete Guide to Sending Money to Vietnam"
      subtitle="Navigate regulations, find the best providers, and understand the unique aspects of UK to Vietnam transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 1, 2025"
      readTime="9"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToVietnamGuide;