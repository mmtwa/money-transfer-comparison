import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/bangladesh-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/bangladesh-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Bangladesh
 */
const SendMoneyToBangladeshGuide = () => {
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
        Sending Money to Bangladesh: A Critical Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Bangladesh is one of the world's most remittance-dependent economies, receiving over $22 billion annually from its global diaspora. 
            For the UK-Bangladesh corridor specifically, remittances play a vital role in supporting families, funding education, and enabling small business 
            development across Bangladesh. Whether you're sending money to family members, investing in property, or conducting business, 
            understanding the unique aspects of transferring money to Bangladesh is essential.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3 text-left">Key Facts: Bangladesh Remittances</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Remittances represent approximately 6% of Bangladesh's total GDP</li>
              <li className="text-left">The Bangladeshi government offers a 2% cash incentive on formal remittances to encourage official channels</li>
              <li className="text-left">The average cost of sending money to Bangladesh ranges from 2-6% of the transfer amount</li>
              <li className="text-left">The Bangladesh Taka (BDT) is a managed currency with relatively stable exchange rates</li>
              <li className="text-left">Mobile financial services have revolutionized remittance distribution in Bangladesh</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Bangladesh from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Bangladesh:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Excellent for direct bank deposits to Bangladeshi accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and generous first-time user promotions. Offers both economy and express delivery options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Western Union</h3>
              <p className="text-left">Extensive cash pickup network throughout Bangladesh, including in rural areas. Strong reliability and brand recognition among recipients.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">WorldRemit</h3>
              <p className="text-left">Excellent integration with mobile money services like bKash. Good balance of competitive rates and delivery speed.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Small World</h3>
              <p className="text-left">Specialized in the Bangladesh corridor with competitive rates. Offers both bank deposit and cash pickup options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Lycaremit</h3>
              <p className="text-left">Popular among the British-Bangladeshi community with tailored services for this corridor and competitive rates.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">Bangladesh's 2% Remittance Incentive</h3>
            <p className="mb-0 text-left">
              Since 2019, the Bangladeshi government has offered a 2% cash incentive on all formal remittances received through banking channels. 
              This incentive is automatically added to the amount received, effectively giving recipients an extra 2% on top of the transferred amount. 
              However, this bonus only applies when using official channels like banks and licensed money transfer operators. When comparing providers, 
              check whether their rates already account for this incentive or if it will be added after the transfer arrives in Bangladesh.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Bangladesh
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Bangladesh offers several ways to receive money from abroad, with a growing emphasis on digital options:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Bangladeshi bank accounts remain popular. Major banks that handle international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Sonali Bank</li>
              <li className="text-left">Islami Bank Bangladesh</li>
              <li className="text-left">Dutch-Bangla Bank</li>
              <li className="text-left">BRAC Bank</li>
              <li className="text-left">Eastern Bank</li>
              <li className="text-left">Prime Bank</li>
              <li className="text-left">Pubali Bank</li>
              <li className="text-left">City Bank</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-3 business days. Many Bangladeshi banks also offer special services for expatriate accounts to facilitate regular remittances.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Financial Services</h3>
            <p className="mb-2 text-left">
              Bangladesh has one of the most developed mobile financial services sectors in South Asia, with options including:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>bKash</strong> - The largest mobile financial service in Bangladesh with over 45 million users</li>
              <li className="text-left"><strong>Nagad</strong> - A digital financial service by Bangladesh Post Office</li>
              <li className="text-left"><strong>Rocket</strong> - Dutch-Bangla Bank's mobile banking service</li>
              <li className="text-left"><strong>SureCash</strong> - Partners with multiple banks for mobile money services</li>
            </ul>
            <p className="text-left">
              These services allow recipients to receive money directly to their mobile accounts, which can then be withdrawn as cash at numerous agent points 
              throughout the country or used directly for payments. Many international money transfer operators now connect directly to these services.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup remains a popular option, especially in areas with limited banking access:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Bank branches</strong> - Most major Bangladeshi banks offer cash pickup services for international transfers</li>
              <li className="text-left"><strong>Western Union agents</strong> - Located throughout the country, including in rural areas</li>
              <li className="text-left"><strong>MoneyGram locations</strong> - Available at various banks and exchange houses</li>
              <li className="text-left"><strong>Specialized remittance companies</strong> - Local companies like Merchantrade have extensive networks</li>
            </ul>
            <p className="text-left">
              For cash pickup, recipients typically need their National ID card or passport and the transaction reference number. 
              Cash is usually available within minutes of the transfer being sent.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Agent Banking</h3>
            <p className="mb-2 text-left">
              A growing option in Bangladesh for reaching underserved communities:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Agent banking allows banks to offer services through authorized representatives in areas without full branches</li>
              <li className="text-left">Bank Asia, Dutch-Bangla Bank, and BRAC Bank have extensive agent banking networks</li>
              <li className="text-left">Recipients can collect remittances through these agents using proper identification</li>
              <li className="text-left">This model has dramatically improved financial inclusion in rural Bangladesh</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Bangladesh
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Dhaka, Chittagong, Khulna, and other major cities have excellent banking infrastructure. All banking services, mobile financial services, 
              and cash pickup options are readily available. Digital options like bank transfers and mobile wallets are highly efficient in urban areas, 
              with quick delivery times and multiple collection points. Both private and state-owned banks have strong presence in urban areas with 
              dedicated remittance processing centers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas</h3>
            <p className="text-left">
              Bangladesh has made significant progress in extending financial services to rural areas, but challenges remain. 
              Mobile financial services like bKash and Nagad have revolutionized rural access to remittances, with agent points in 
              almost every village. Agent banking is another important channel in rural areas, providing banking services without full branches. 
              For extremely remote areas, consider providers that partner with Bangladesh Post Office, which has the most extensive rural network.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Preferences and Considerations</h3>
            <p className="mb-2 text-left">
              Different regions of Bangladesh may have specific preferences or circumstances to consider:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Sylhet Division</h4>
                <p className="text-left">High concentration of UK remittances due to strong migration ties. Sonali Bank and Islami Bank are particularly popular in this region.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Chittagong Division</h4>
                <p className="text-left">Strong banking infrastructure. Islami Bank and Social Islami Bank have extensive networks in this region.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Coastal Areas</h4>
                <p className="text-left">Vulnerable to natural disasters; mobile money services provide more resilient remittance access during emergencies.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-blue-600 text-left">Char Areas (River Islands)</h4>
                <p className="text-left">Limited physical infrastructure; mobile financial services and agent banking are critical for these communities.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Banking Hours and Accessibility</h3>
            <p className="text-left">
              Bangladesh banking hours are typically Sunday to Thursday (9:00 AM to 5:00 PM), as Friday and Saturday are weekend days. 
              During Ramadan, banking hours are shortened. Mobile financial services operate 24/7 for electronic transfers, making them 
              more flexible than traditional banking channels. Some banks in urban areas offer evening banking services specifically for 
              remittance collection, recognizing the importance of these transfers.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates for Bangladesh Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Bangladesh, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Fixed fees ranging from £0-£3.99 for digital providers to £10+ for bank transfers</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5-3%)</li>
            <li className="text-left"><strong>Receiving fees</strong>: Some Bangladeshi banks charge a small fee (around 100-300 BDT) to process incoming transfers</li>
            <li className="text-left"><strong>Cash pickup fees</strong>: Usually included in the sending fee but may sometimes apply separately</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">BDT Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Bangladeshi Taka (BDT) is managed by Bangladesh Bank, which intervenes to maintain stability against major currencies. 
              This makes BDT less volatile than many freely floating currencies. However, there are still fluctuations to consider. 
              The official exchange rate set by Bangladesh Bank may differ from the rates offered by money transfer operators. 
              Some operators may offer better-than-market rates for transfers to Bangladesh because of the government's 2% remittance incentive, 
              which they may partially pass on to customers to remain competitive.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        Bangladesh's Remittance Regulations
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            Bangladesh has specific regulations governing international money transfers:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Documentation Requirements</h3>
            <p className="text-left">
              For most personal transfers, the documentation requirements are straightforward. Recipients typically need to provide a government-issued 
              ID like a National Identity Card, passport, or driver's license. For bank deposits, recipients must have a properly KYC (Know Your Customer) 
              verified bank account. For larger amounts (typically over 500,000 BDT or approximately £3,500), additional verification may be required, 
              including information on the source of funds and the purpose of the transfer.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Government Incentives</h3>
            <p className="text-left">
              To encourage formal remittances through official channels, Bangladesh offers a 2% cash incentive on inward remittances. 
              This incentive is automatically added to the amount received when the transfer is processed through authorized channels. 
              To qualify for this incentive, the transfer must:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Be sent through a formal, licensed money transfer operator or bank</li>
              <li className="text-left">Be received by a beneficiary through a Bangladeshi bank account or authorized agent</li>
              <li className="text-left">Not require submission of any documents for the incentive (it's automatic)</li>
              <li className="text-left">Not exceed the maximum eligible amount per transaction (if applicable)</li>
            </ul>
            <p className="text-left">
              This incentive effectively increases the value of your transfer by 2% at no additional cost.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Reporting Requirements</h3>
            <p className="text-left">
              Bangladesh Bank, the central bank of Bangladesh, requires financial institutions to report all international transfers for monitoring purposes. 
              This is primarily handled by the receiving institutions and doesn't typically impact senders or recipients. However, for unusually large transfers 
              or transfers with patterns that differ from a customer's usual activity, additional information may be requested to comply with anti-money laundering regulations.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Considerations for Business Transfers</h3>
            <p className="text-left">
              Business-related transfers to Bangladesh have additional requirements:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Proper documentation including invoices, contracts, or purchase orders</li>
              <li className="text-left">Compliance with Bangladesh's Foreign Exchange Regulation Act</li>
              <li className="text-left">For investment purposes, compliance with Bangladesh Investment Development Authority (BIDA) regulations</li>
              <li className="text-left">Potential need for specific permits depending on the business sector</li>
              <li className="text-left">Proper tax documentation for business-related remittances</li>
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
            International transfers to Bangladesh have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Bangladesh</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal remittances for family support are generally not subject to income tax in Bangladesh</li>
              <li className="text-left">The 2% government incentive on remittances is tax-free</li>
              <li className="text-left">If remittances are used for investment purposes (property, business), the resulting income may be taxable</li>
              <li className="text-left">Recipients should maintain records of remittances received, especially if they plan to use the funds for investments</li>
              <li className="text-left">For very large or frequent transfers, the National Board of Revenue (NBR) may request information on the source of funds</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal remittances are generally not tax-deductible in the UK</li>
              <li className="text-left">Business payments to Bangladesh may have VAT and corporation tax implications</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering compliance</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">Ensure transfers comply with both UK and Bangladeshi regulations</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Bangladesh have anti-money laundering regulations that affect international transfers. Using established, regulated money 
            transfer providers helps ensure your transfers comply with these regulations. For business-related transfers or large amounts, consulting with 
            a financial advisor familiar with UK-Bangladesh transactions may be beneficial.
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
              Several factors can affect the timing and processing of transfers to Bangladesh:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Bangladesh is 5-6 hours ahead of the UK (depending on daylight saving time)</li>
              <li className="text-left">The Bangladeshi work week runs Sunday to Thursday, with Friday and Saturday being weekend days</li>
              <li className="text-left">Major holidays like Eid-ul-Fitr, Eid-ul-Adha, and Durga Puja may cause delays in banking services</li>
              <li className="text-left">Ramadan often sees modified banking hours, which can affect processing times</li>
              <li className="text-left">Digital transfers initiated early in the UK day (morning) often arrive during Bangladesh's business hours</li>
              <li className="text-left">Mobile financial services operate 24/7, making them more time-zone friendly than traditional banks</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Bangladesh</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check the spelling of the recipient's name exactly as it appears on their ID - Bangladeshi names can have various spellings</li>
              <li className="text-left">For bank transfers, always verify the account details and routing number carefully</li>
              <li className="text-left">Consider comparing providers before major Bangladeshi holidays when many people send money home</li>
              <li className="text-left">For first-time transfers, use a smaller amount to verify everything works correctly</li>
              <li className="text-left">Save about 1-2% on larger transfers by comparing at least 3 providers before each transfer</li>
              <li className="text-left">Consider setting up regular transfers if you're sending money monthly for family support</li>
              <li className="text-left">Remember that the 2% government incentive makes the effective exchange rate better than it initially appears</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4 text-left">Bangladesh Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the BDT amount that will be received, accounting for the 2% government incentive</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if your transfer will arrive during Bangladeshi banking hours (Sunday-Thursday)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Ensure the recipient's name matches exactly as it appears on their ID document</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For mobile money transfers, confirm the recipient's phone number is correctly registered</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
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
      title="Send Money to Bangladesh: Complete Guide"
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      metaDescription="Find the best ways to send money to Bangladesh from the UK. Compare providers, understand receiving options and the 2% government incentive on remittances."
      content={content}
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToBangladeshGuide;