import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/mexico-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/mexico-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Mexico
 */
const SendMoneyToMexicoGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'speed': true,
    'security': true,
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
        The US-Mexico Remittance Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            The US-Mexico remittance corridor is one of the largest in the world, with over $50 billion sent annually from the United States to Mexico.
            This guide focuses specifically on this corridor, providing specialized advice for sending money from the US to family, friends, or businesses in Mexico.
          </p>

          <div className="bg-green-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-green-800 mb-3 text-left">US-Mexico Transfer Terminology</h3>
            <p className="mb-0 text-left">
              When searching for the best money transfer services to Mexico, you'll often find both English and Spanish terms. Common Spanish terms include:
            </p>
            <ul className="list-disc pl-8 space-y-2 mt-3">
              <li className="text-left"><strong>Envíos de dinero</strong> - Money transfers</li>
              <li className="text-left"><strong>Tipo de cambio</strong> - Exchange rate</li>
              <li className="text-left"><strong>Comisión</strong> - Fee</li>
              <li className="text-left"><strong>Cobro en efectivo</strong> - Cash pickup</li>
              <li className="text-left"><strong>Depósito bancario</strong> - Bank deposit</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Mexico
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the US to Mexico:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Great for tech-savvy users who want to avoid hidden costs.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and first transfer promotions. Popular for US-to-Mexico transfers.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Xoom (PayPal)</h3>
              <p className="text-left">Quick transfers with extensive pickup network and mobile app. Convenient for PayPal users.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">MoneyGram</h3>
              <p className="text-left">Extensive cash pickup locations throughout Mexico. Good option for sending to rural areas.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Western Union</h3>
              <p className="text-left">Ubiquitous presence in Mexico, available in almost every town. Trusted name with decades of experience.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Ria Money Transfer</h3>
              <p className="text-left">Often offers competitive peso exchange rates. Good balance of cost and convenience.</p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Mexico (Opciones para recibir dinero)
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Mexico offers several ways to receive money from the US. The most common methods include:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits (Depósito bancario)</h3>
            <p className="mb-2 text-left">
              Direct transfers to Mexican bank accounts are becoming increasingly popular. Major banks that can receive international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">BBVA México (formerly Bancomer)</li>
              <li className="text-left">Banorte</li>
              <li className="text-left">Santander México</li>
              <li className="text-left">Citibanamex</li>
              <li className="text-left">Banco Azteca</li>
              <li className="text-left">HSBC México</li>
              <li className="text-left">Scotiabank México</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-2 business days, though some services offer same-day delivery to major banks.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup (Cobro en efectivo)</h3>
            <p className="mb-2 text-left">
              Cash pickup remains extremely popular in Mexico. Major cash pickup networks include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Elektra</strong> - Over 1,200 locations throughout Mexico</li>
              <li className="text-left"><strong>Coppel</strong> - Popular department store with remittance services</li>
              <li className="text-left"><strong>Bodega Aurrera</strong> - Walmart-owned stores with remittance services</li>
              <li className="text-left"><strong>Telecomm Telégrafos</strong> - Government-run telegraph offices that handle remittances</li>
              <li className="text-left"><strong>Farmacias Guadalajara</strong> - Pharmacy chain with remittance services</li>
              <li className="text-left"><strong>Western Union</strong> - Thousands of agent locations across Mexico</li>
              <li className="text-left"><strong>MoneyGram</strong> - Available at banks and retail stores throughout the country</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, making it the fastest option for emergency transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mobile Wallets and Digital Options</h3>
            <p className="mb-2 text-left">
              Mexico's fintech sector is growing rapidly, with several digital options now available:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left"><strong>CoDi</strong> - Mexico's instant payment system linked to bank accounts</li>
              <li className="text-left"><strong>Mercado Pago</strong> - Popular digital wallet in Mexico</li>
              <li className="text-left"><strong>BBVA Wallet</strong> - Digital wallet linked to BBVA accounts</li>
            </ul>
            <p className="text-left">
              Digital transfers are typically faster than traditional bank transfers and often have lower fees.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Mexico
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Recipients in major Mexican cities like Mexico City, Guadalajara, and Monterrey have access to all receiving methods. Digital banking is widely used, and all major transfer providers have extensive networks.
              Competitive rates are available due to high volume in these areas.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Border Regions</h3>
            <p className="mb-2 text-left">
              Border towns like Tijuana, Ciudad Juárez, and Nuevo Laredo have unique characteristics for money transfers:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Some recipients may have access to US bank accounts</li>
              <li className="text-left">Cash pickup locations are abundant</li>
              <li className="text-left">Some services offer USD pickup instead of peso conversion</li>
              <li className="text-left">Transfers can be extremely fast (often within minutes)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Areas and Smaller Cities</h3>
            <p className="mb-2 text-left">
              For sending money to rural Mexico, consider services that partner with:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Telecomm Telégrafos - Government service with presence in remote areas</li>
              <li className="text-left">Banco Azteca/Elektra - Widespread in smaller towns</li>
              <li className="text-left">Coppel - Present in many medium and small cities</li>
              <li className="text-left">Local cooperatives (cajas populares) in some regions</li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl my-8 border border-emerald-100">
            <h3 className="text-emerald-700 mb-4 text-left">Regional Tip: States with High Remittance Volume</h3>
            <p className="mb-0 text-left">
              Certain Mexican states receive significantly more remittances than others, which can affect service availability and competitive rates. 
              The states receiving the highest volume of remittances are Michoacán, Jalisco, Guanajuato, Estado de México, Oaxaca, and Puebla. 
              If sending to these states, you'll find more options and potentially better rates due to higher competition.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates (Comisiones y tipos de cambio)
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Mexico from the US, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees (Comisión de envío)</strong>: Flat fees ranging from $0-$5 for digital transfers to $10+ for cash services</li>
            <li className="text-left"><strong>Exchange rate margins (Margen en el tipo de cambio)</strong>: The difference between the mid-market rate and the rate you're offered (typically 1-3%)</li>
            <li className="text-left"><strong>Receiving fees (Comisión de recepción)</strong>: Some Mexican banks charge a fee to receive international transfers</li>
          </ul>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Exchange Rate Comparison for USD to MXN</h3>
            <p className="mb-2 text-left">
              The exchange rate offered can have a bigger impact than the transfer fee. For example, on a $500 transfer:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">A provider charging no fee but offering 19.5 MXN per USD = 9,750 pesos received</li>
              <li className="text-left">A provider charging a $10 fee but offering 20.0 MXN per USD = 9,800 pesos received ($490 × 20.0)</li>
            </ul>
            <p className="text-left mt-2">
              Always compare the total pesos your recipient will get rather than just looking at the fee.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="speed" 
        isExpanded={expandedSections['speed']} 
        onClick={toggleSection}
      >
        Speed Considerations (Tiempo de entrega)
      </ClickableHeadline>
      {expandedSections['speed'] && (
        <>
          <p className="mb-6 text-left">
            Transfer times to Mexico vary by method:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Cash Pickup</h3>
              <p className="text-left">Available within minutes with most providers</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Bank Deposits</h3>
              <p className="text-left">Same day to 2 business days</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Digital Wallets</h3>
              <p className="text-left">Usually within minutes to a few hours</p>
            </div>
          </div>

          <p className="mb-6 text-left">
            For emergency transfers (<em>envíos urgentes</em>), cash pickup through Western Union, MoneyGram, or Ria is typically the fastest option,
            though you'll often pay a premium for the speed.
          </p>
        </>
      )}

      <ClickableHeadline 
        id="security" 
        isExpanded={expandedSections['security']} 
        onClick={toggleSection}
      >
        Security and Compliance (Seguridad y cumplimiento)
      </ClickableHeadline>
      {expandedSections['security'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Mexico, be aware of these security considerations:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Identification Requirements</h3>
            <p className="mb-2 text-left">
              For transfers to Mexico, senders typically need:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Valid government-issued photo ID</li>
              <li className="text-left">Proof of address (for first-time transactions with some providers)</li>
              <li className="text-left">Recipient's full name as it appears on their ID</li>
              <li className="text-left">For bank deposits: Complete bank account information including CLABE (18-digit standard Mexican bank account number)</li>
            </ul>
            
            <p className="mb-2 text-left">
              Recipients in Mexico usually need to present:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Government-issued photo ID (typically INE/IFE voter card)</li>
              <li className="text-left">Transaction reference number</li>
              <li className="text-left">Sometimes, knowledge of sender's name and transfer amount</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Transfer Limits</h3>
            <p className="mb-2 text-left">
              Remittances to Mexico typically have these limits:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Single transaction limits: Usually $2,999.99 to avoid additional documentation</li>
              <li className="text-left">Monthly limits: Vary by provider, but transfers exceeding $10,000 in a month may require additional verification</li>
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
            Understanding the tax and legal aspects of remittances to Mexico:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Mexico</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Regular remittances for family support are generally not taxable in Mexico</li>
              <li className="text-left">Large transfers (typically over 15,000 MXN) may require documentation of source of funds</li>
              <li className="text-left">Business-related transfers may have different tax implications</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the US</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Money sent as gifts is generally not tax-deductible</li>
              <li className="text-left">Multiple transfers totaling over $10,000 in one year may need to be reported to US authorities</li>
              <li className="text-left">Keep records of all transfers for tax purposes</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="final-tips" 
        isExpanded={expandedSections['final-tips']} 
        onClick={toggleSection}
      >
        Final Tips for Sending Money to Mexico
      </ClickableHeadline>
      {expandedSections['final-tips'] && (
        <>
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left">Compare providers' exchange rates on the day you plan to send, as they fluctuate daily</li>
            <li className="text-left">Consider scheduling transfers when the USD/MXN exchange rate is favorable</li>
            <li className="text-left">Verify the recipient's preferred pickup location is operational (hours, holidays, etc.)</li>
            <li className="text-left">For bank transfers, double-check the CLABE number (18 digits) to avoid delays</li>
            <li className="text-left">For first-time transfers, start with a smaller amount to verify everything works correctly</li>
            <li className="text-left">If sending regular remittances, look for loyalty programs that offer benefits to frequent senders</li>
          </ul>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4 text-left">Mexico Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare total MXN received, not just the advertised fees</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the exact spelling of recipient's name as it appears on their ID</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">For bank transfers, confirm the 18-digit CLABE number</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Consider which method (bank, cash, digital) is most accessible for your recipient</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Save your transaction reference number (número de referencia) and share it with your recipient</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Mexico Remittance Guide"
      subtitle="Fastest and cheapest ways to send money to Mexico from the US"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 5, 2025"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToMexicoGuide; 