import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/morocco-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/morocco-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Morocco
 */
const SendMoneyToMoroccoGuide = () => {
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
        Sending Money to Morocco: A Mediterranean Money Bridge
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Morocco receives over $7 billion in remittances annually, making it one of North Africa's largest remittance markets. 
            The UK-Morocco corridor has grown steadily as connections between the two countries strengthen through tourism, business, 
            and a growing Moroccan diaspora in the United Kingdom. Whether you're supporting family, investing in property, paying for services, 
            or conducting business, understanding the specific aspects of transferring money to Morocco helps ensure your funds arrive efficiently and cost-effectively.
          </p>

          <div className="bg-orange-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-orange-800 mb-3 text-left">Key Facts: Morocco Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Morocco's currency (Moroccan Dirham - MAD) is a partially convertible currency with exchange controls</li>
              <li className="text-left">The average cost of sending money to Morocco ranges from 2-7% of the transfer amount</li>
              <li className="text-left">Cash pickup is widely available throughout urban and rural Morocco</li>
              <li className="text-left">Morocco has strong banking infrastructure in urban areas but more limited access in rural regions</li>
              <li className="text-left">Annual transfer limits apply to non-residents sending money to Morocco</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Morocco from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Morocco:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Excellent for bank transfers to major Moroccan banks.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">Western Union</h3>
              <p className="text-left">Extensive cash pickup network throughout Morocco, including rural areas. Strong reliability and almost instant availability.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">Azimo</h3>
              <p className="text-left">Competitive rates with good delivery speed to Morocco. Offers both bank transfers and cash pickup options.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">WorldRemit</h3>
              <p className="text-left">Good balance of competitive rates and delivery speed. Offers both bank deposits and cash pickup with strong mobile experience.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">MoneyGram</h3>
              <p className="text-left">Large network of pickup locations in Morocco with real-time transfer tracking and reliable service history.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-orange-600 text-left">Small World</h3>
              <p className="text-left">Specialized in North African corridors with competitive rates and various delivery methods including mobile wallet options.</p>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl my-8 border border-orange-100">
            <h3 className="text-orange-700 mb-4 text-left">Important Note: Currency Controls</h3>
            <p className="mb-0 text-left">
              The Moroccan Dirham (MAD) is subject to exchange controls regulated by Morocco's Office des Changes. These regulations 
              can affect how money is sent and received. While tourists can bring in foreign currency without issue, 
              there are restrictions on taking MAD out of the country. For regular remittances to Morocco, establishing relationships with 
              providers that understand these regulations is valuable. The rates offered can vary significantly between providers, so comparing 
              the actual MAD amount received rather than just the fees is essential for getting the best value.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Morocco
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Morocco offers several ways to receive money from abroad, with options suitable for both urban and rural recipients:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Moroccan bank accounts are common in urban areas. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Attijariwafa Bank</li>
              <li className="text-left">Banque Populaire (Groupe Banque Populaire)</li>
              <li className="text-left">BMCE Bank (Bank of Africa Group)</li>
              <li className="text-left">Société Générale Maroc</li>
              <li className="text-left">Crédit du Maroc</li>
              <li className="text-left">CIH Bank (Crédit Immobilier et Hôtelier)</li>
              <li className="text-left">Al Barid Bank (Postal Bank)</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-3 business days. Recipients will need to provide the sender with their full name as it appears on the bank account, 
              account number, and bank details. Many Moroccan banks also offer special "MRE" (Marocains Résidant à l'Étranger) accounts specifically designed for handling remittances.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              Cash pickup is widely available throughout Morocco and remains very popular:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union</strong> - Extensive network with locations at banks, post offices, and dedicated agents</li>
              <li className="text-left"><strong>MoneyGram</strong> - Available at various partner locations including Wafacash outlets</li>
              <li className="text-left"><strong>Wafacash</strong> - A subsidiary of Attijariwafa Bank with hundreds of locations offering cash services</li>
              <li className="text-left"><strong>Damane Cash</strong> - Another major cash transfer network throughout Morocco</li>
              <li className="text-left"><strong>Cash Plus</strong> - Growing network of transfer locations across the country</li>
            </ul>
            <p className="text-left">
              For cash pickup, recipients typically need their Moroccan national ID card (CIN - Carte Nationale d'Identité) or passport 
              and the transaction reference number. Cash is usually available within minutes of the transfer being sent.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Money and Digital Wallets</h3>
            <p className="mb-2 text-left">
              Morocco's digital payment ecosystem is developing rapidly:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Chaabi Pay</strong> - Mobile payment solution from Banque Populaire</li>
              <li className="text-left"><strong>M-Wallet</strong> - Interoperable mobile wallet system supported by multiple banks</li>
              <li className="text-left"><strong>Wafacash Mobile</strong> - Digital wallet linked to Wafacash services</li>
              <li className="text-left"><strong>Orange Money</strong> - Mobile money service from the telecom provider Orange</li>
            </ul>
            <p className="text-left">
              While these services are growing in popularity, not all international money transfer providers connect directly to Moroccan digital wallets yet. 
              This option is more limited than bank transfers or cash pickup but is expanding rapidly.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Home Delivery</h3>
            <p className="mb-2 text-left">
              A limited but growing option in some parts of Morocco:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Some providers offer cash delivery directly to the recipient's home address</li>
              <li className="text-left">This service is primarily available in major cities and surrounding areas</li>
              <li className="text-left">Typically requires advance scheduling and proper recipient identification</li>
              <li className="text-left">May have higher fees but offers maximum convenience, especially for elderly recipients</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Morocco
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Casablanca, Rabat, Marrakech, Tangier, and Fes have excellent banking infrastructure. All major Moroccan banks have branches in these cities, 
              offering comprehensive international services. Digital banking is increasingly popular in urban areas, with mobile banking adoption growing. 
              Cash pickup locations are abundant, with multiple options within short distances. Most money transfer services operate with extended hours in major cities.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Medium-Sized Cities</h3>
            <p className="text-left">
              Cities like Agadir, Oujda, Meknes, and Tetouan have good banking services with branches of most major banks. 
              Cash pickup services are readily available through Western Union, Wafacash, and bank partnerships. 
              Mobile network coverage is strong, enabling digital banking services, though some services may have limited hours compared to major cities.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Mountain Regions</h3>
            <p className="text-left">
              Banking access in rural Morocco is more limited, though improving. Al Barid Bank (the postal bank) has the most extensive rural presence. 
              For remote areas, cash pickup services like Western Union and Wafacash are often the most reliable options, as they partner with local 
              businesses and post offices. Some rural communities may require travel to the nearest town to access financial services. 
              Mobile money services are expanding in rural areas, leveraging Morocco's good mobile network coverage.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences</h3>
            <p className="mb-2 text-left">
              Different regions of Morocco have preferences for specific financial institutions:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-orange-600 text-left">Northern Morocco & Rif Region</h4>
                <p className="text-left">Strong presence of Banque Populaire and BMCE. Close to Spain, some residents may have accounts in both countries.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-orange-600 text-left">Casablanca & Central Coast</h4>
                <p className="text-left">All major banks have strong presence. Attijariwafa Bank has significant market share in this business hub.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-orange-600 text-left">Southern Regions</h4>
                <p className="text-left">Banque Populaire and Al Barid Bank have extensive networks. Cash services remain important in remote areas.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-orange-600 text-left">Atlas Mountains</h4>
                <p className="text-left">Limited banking infrastructure with postal services and mobile agents being important for financial access.</p>
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
        Understanding Fees and Exchange Rates for Morocco Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Morocco, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Flat fees ranging from £0-£3.99 for digital providers to £10+ for bank transfers</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 1-4% for Morocco)</li>
            <li className="text-left"><strong>Receiving fees</strong>: Some Moroccan banks charge fees to receive international transfers (typically 50-200 MAD)</li>
            <li className="text-left"><strong>Cash pickup fees</strong>: These are usually included in the sending fee but may sometimes apply separately</li>
          </ul>

          <div className="bg-orange-50 p-6 rounded-xl my-8 border border-orange-100">
            <h3 className="text-orange-700 mb-4 text-left">MAD Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Moroccan Dirham (MAD) is pegged to a basket of currencies dominated by the Euro (60%) and US Dollar (40%). 
              This makes its value relatively stable compared to many other currencies but still subject to fluctuations. 
              The official exchange rate is set by Bank Al-Maghrib (Morocco's Central Bank), but money transfer providers may 
              offer rates that differ from this. Due to Morocco's exchange controls, there can sometimes be a difference between 
              official rates and the actual rates offered by transfer services. Always compare the final MAD amount that will be 
              received rather than just looking at the GBP/MAD exchange rate quoted.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        Morocco's Currency and Remittance Regulations
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            Morocco maintains specific regulations around foreign currency that affect international money transfers:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Currency Control System</h3>
            <p className="text-left">
              The Moroccan Dirham is a controlled currency regulated by the Office des Changes (Foreign Exchange Office). 
              This means there are restrictions on moving MAD in and out of the country. While receiving foreign currency is generally 
              straightforward, there are limits on how much physical currency can be taken out of Morocco. For most personal remittances, 
              these controls have minimal impact on the receiving end, but they do affect the overall market and available services.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Documentation Requirements</h3>
            <p className="text-left">
              For most personal transfers up to 100,000 MAD (approximately £8,000), minimal documentation is required beyond standard identification. 
              Recipients typically need to show their Moroccan ID card (CIN) or passport. For larger amounts, especially those exceeding 100,000 MAD, 
              additional verification may be required, including information on the purpose of the transfer and potentially supporting documentation.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">MRE Special Status</h3>
            <p className="text-left">
              Morocco recognizes its diaspora through the MRE (Marocains Résidant à l'Étranger) status, which provides certain financial benefits. 
              MREs can open special accounts that offer advantages for handling international transfers, including some exemptions from documentation requirements 
              for regular remittances. These accounts can be maintained in foreign currencies or in MAD with more flexible conversion options. Many Moroccan banks 
              actively market services to MREs, offering special rates and reduced fees for international transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Considerations for Business Transfers</h3>
            <p className="text-left">
              Business-related transfers to Morocco face additional scrutiny and documentation requirements:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Invoices or contracts showing the business relationship</li>
              <li className="text-left">Compliance with Morocco's Investment Charter for investment-related transfers</li>
              <li className="text-left">Import/export documentation for trade-related payments</li>
              <li className="text-left">Potential approval from the Office des Changes for certain categories of business transfers</li>
              <li className="text-left">Tax documentation for business-related remittances</li>
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
            International transfers to Morocco have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Morocco</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal remittances for family support are generally not subject to income tax in Morocco</li>
              <li className="text-left">If remittances are used for investment (property, business), the resulting income may be taxable</li>
              <li className="text-left">Regular large transfers may trigger scrutiny from tax authorities</li>
              <li className="text-left">MREs (Moroccans living abroad) have certain tax advantages when investing in Morocco</li>
              <li className="text-left">Recipients should maintain records of significant remittances, especially if used for asset purchases</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal gifts are generally not tax-deductible in the UK</li>
              <li className="text-left">Business payments to Morocco may have VAT and corporation tax implications</li>
              <li className="text-left">HMRC may require reporting of significant transfers for anti-money laundering purposes</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">Ensure transfers comply with both UK and Moroccan regulations</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Property Investment Considerations</h3>
            <p className="text-left">
              Morocco is a popular destination for property investment, with many UK residents purchasing holiday homes or retirement properties. 
              If you're sending money for property purchases, be aware that:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Foreign ownership of property is legally recognized, though rural agricultural land has restrictions</li>
              <li className="text-left">Large transfers for property purchases will require documentation and explanation</li>
              <li className="text-left">Property transactions typically involve a notary who may facilitate the international transfer</li>
              <li className="text-left">Property taxes and registration fees apply to property purchases and should be factored into total costs</li>
              <li className="text-left">Converting a large sum to MAD at once may not get the best rate; consider staged transfers</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Morocco have anti-money laundering regulations that affect international transfers. Using established, regulated money 
            transfer providers helps ensure your transfers comply with these regulations. For property investments or business-related transfers, 
            consulting with a financial advisor familiar with Morocco-UK transactions may be beneficial.
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
              Several factors can affect the timing and processing of transfers to Morocco:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Morocco is typically on the same time zone as the UK (GMT/BST) or one hour ahead, simplifying coordination</li>
              <li className="text-left">Moroccan weekends are Saturday and Sunday, with Friday being a shortened day at many institutions</li>
              <li className="text-left">During Ramadan, banking hours are often shortened, which can affect processing times</li>
              <li className="text-left">Major holidays like Eid al-Fitr, Eid al-Adha, and Throne Day may cause delays in banking services</li>
              <li className="text-left">Bank transfers typically take 1-3 business days, while cash pickups are often available within minutes</li>
              <li className="text-left">First-time transfers to a recipient may take longer due to additional verification</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Morocco</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check the spelling of Arabic names, which can have various transliterations in English</li>
              <li className="text-left">For bank transfers, always verify the account details and SWIFT/BIC code carefully</li>
              <li className="text-left">Consider comparing providers before major Moroccan holidays when many people send money home</li>
              <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
              <li className="text-left">Compare at least 3 providers before each transfer, as competitive rates change frequently</li>
              <li className="text-left">For property purchases, work with a Moroccan notary who can advise on the best transfer method</li>
              <li className="text-left">If you're an MRE (Moroccan living abroad), check with Moroccan banks about special account options</li>
            </ul>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-orange-800 mb-4 text-left">Morocco Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare the final MAD amount that will be received, not just the advertised fee</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify if your transfer amount requires additional documentation (generally over 100,000 MAD)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Ensure the recipient's name matches exactly as it appears on their Moroccan ID</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if your transfer will arrive during Moroccan banking hours and avoid Ramadan shortening</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-orange-600">
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
      title="Complete Guide to Sending Money to Morocco"
      subtitle="Navigate exchange controls, find the best providers, and understand the unique aspects of UK to Morocco transfers"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 30, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToMoroccoGuide; 