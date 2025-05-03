import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/canada-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/canada-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Guide to sending money to Canada
 * @lastUpdated 2024-03-19
 * @readingTime 12 minutes
 */
const SendMoneyToCanadaGuide = () => {
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
        Sending Money to Canada: A Modern and Efficient Corridor
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Canada is one of the most popular destinations for international money transfers, with a highly developed financial system and strong economic ties to the UK. 
            Whether you're supporting family members, paying for education, or conducting business, understanding the unique aspects of transferring money to Canada is essential.
          </p>

          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 text-left">Key Facts: Canada Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Canada has one of the most stable and well-regulated banking systems in the world</li>
              <li className="text-left">The Canadian Dollar (CAD) is one of the world's major reserve currencies</li>
              <li className="text-left">The average cost of sending money to Canada ranges from 0.5-3% of the transfer amount</li>
              <li className="text-left">Most transfers to Canada are processed within 1-2 business days</li>
              <li className="text-left">Canada has extensive digital banking infrastructure and mobile payment options</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        Best Providers for Sending Money to Canada from the UK
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis, these providers consistently offer the best combination of exchange rates, fees, and service when sending money from the UK to Canada:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Wise</h3>
              <p className="text-left">Best for transparent mid-market exchange rates with a small upfront fee. Excellent for direct bank deposits to Canadian accounts.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Revolut</h3>
              <p className="text-left">Competitive rates and fee-free transfers for premium users. Great for frequent transfers between UK and Canada.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">CurrencyFair</h3>
              <p className="text-left">Peer-to-peer exchange with excellent rates. Ideal for larger transfers to Canada.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">OFX</h3>
              <p className="text-left">Specialized in larger transfers with dedicated account managers. Good for business transfers to Canada.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">WorldRemit</h3>
              <p className="text-left">Fast transfers with competitive rates and good mobile app experience. Popular for personal transfers.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-blue-600 text-left">Remitly</h3>
              <p className="text-left">Fast transfers with competitive rates and generous first-time user promotions. Good for regular transfers.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">Bank Transfers vs. Specialized Providers</h3>
            <p className="mb-0 text-left">
              While traditional banks can transfer money to Canada, they typically charge higher fees (often £20-30 per transfer) and offer less competitive exchange rates 
              (typically 2-4% worse than the mid-market rate). For example, sending £1,000 to Canada via a high street bank could cost you £40-50 in combined fees and 
              exchange rate markups, whereas specialized providers might charge £3-10 for the same transfer.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        Receiving Options in Canada
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            Canada offers several ways to receive money from abroad, with a strong emphasis on digital banking:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits</h3>
            <p className="mb-2 text-left">
              Direct transfers to Canadian bank accounts are the most popular option. Major banks that handle international transfers include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Royal Bank of Canada (RBC)</li>
              <li className="text-left">Toronto-Dominion Bank (TD)</li>
              <li className="text-left">Bank of Montreal (BMO)</li>
              <li className="text-left">Scotiabank</li>
              <li className="text-left">CIBC</li>
              <li className="text-left">HSBC Canada</li>
              <li className="text-left">National Bank of Canada</li>
              <li className="text-left">Tangerine</li>
            </ul>
            <p className="text-left">
              Bank transfers typically take 1-2 business days. Most Canadian banks offer online banking and mobile apps for easy access to transferred funds.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Digital Payment Services</h3>
            <p className="mb-2 text-left">
              Canada has a growing digital payment ecosystem with several options:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Interac e-Transfer</strong> - Canada's most popular digital payment system</li>
              <li className="text-left"><strong>PayPal</strong> - Widely accepted for personal and business transfers</li>
              <li className="text-left"><strong>Wise</strong> - Borderless accounts for receiving multiple currencies</li>
              <li className="text-left"><strong>Revolut</strong> - Multi-currency accounts with instant transfers</li>
            </ul>
            <p className="text-left">
              These services allow recipients to receive money directly to their digital accounts, which can then be transferred to their bank account or used for payments.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup</h3>
            <p className="mb-2 text-left">
              While less common than bank transfers, cash pickup is available through:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> - Available at various retail locations</li>
              <li className="text-left"><strong>MoneyGram agents</strong> - Found at partner locations</li>
              <li className="text-left"><strong>Bank branches</strong> - Some Canadian banks offer cash pickup services</li>
            </ul>
            <p className="text-left">
              Cash pickup is usually available within minutes of sending, though it typically involves higher fees than bank transfers.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        Regional Considerations in Canada
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Major Urban Centers</h3>
            <p className="text-left">
              Toronto, Vancouver, Montreal, and other major cities have excellent banking infrastructure. All banking services and digital payment options are readily available. 
              Digital options like bank transfers and mobile payments are highly efficient in urban areas, with most transfers processed within 1-2 business days.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural and Remote Areas</h3>
            <p className="text-left">
              While Canada has made significant progress in extending financial services to rural areas, some remote communities may have limited banking access. 
              Digital banking and mobile payment options have helped bridge this gap, but cash pickup services remain important in some areas. 
              Consider providers that offer both digital and cash pickup options when sending to remote locations.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Provincial Banking Hours</h3>
            <p className="text-left">
              Banking hours vary by province and institution, but most banks operate Monday to Friday from 9:30 AM to 4:00 PM local time, with some branches offering 
              extended hours. Digital banking services are available 24/7, making them more flexible than traditional banking channels.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        Understanding Fees and Exchange Rates for Canada Transfers
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            When sending money to Canada, you'll encounter several types of fees:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees</strong>: Fixed fees ranging from £0-£3.99 for digital providers to £20+ for bank transfers</li>
            <li className="text-left"><strong>Exchange rate margins</strong>: The difference between the mid-market rate and the rate you're offered (typically 0.5-2%)</li>
            <li className="text-left"><strong>Receiving fees</strong>: Some Canadian banks charge a small fee (around $10-15 CAD) to process incoming transfers</li>
            <li className="text-left"><strong>Cash pickup fees</strong>: Usually higher than bank transfer fees, often $5-15 CAD</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-xl my-8 border border-blue-100">
            <h3 className="text-blue-700 mb-4 text-left">CAD Exchange Rate Considerations</h3>
            <p className="mb-0 text-left">
              The Canadian Dollar (CAD) is a major currency with relatively stable exchange rates. However, it can be affected by oil prices, interest rate differentials, 
              and economic conditions. When comparing providers, look at the total amount in CAD that will be received, not just the exchange rate or fee. For larger transfers, 
              even small differences in the exchange rate can significantly impact the final amount received.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        Canada's Money Transfer Regulations
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            Canada has specific regulations governing international money transfers:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Documentation Requirements</h3>
            <p className="text-left">
              For most personal transfers, the documentation requirements are straightforward. Recipients typically need to provide their full name as it appears on their 
              government-issued ID and their bank account details. For larger amounts (typically over $10,000 CAD), additional verification may be required under Canada's 
              anti-money laundering regulations.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Reporting Requirements</h3>
            <p className="text-left">
              Financial institutions in Canada are required to report certain transactions to FINTRAC (Financial Transactions and Reports Analysis Centre of Canada). 
              This includes international transfers over $10,000 CAD. While this reporting doesn't typically impact senders or recipients directly, it's important to be 
              aware of these requirements when planning larger transfers.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Special Considerations for Business Transfers</h3>
            <p className="text-left">
              Business-related transfers to Canada have additional requirements:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Proper documentation including invoices, contracts, or purchase orders</li>
              <li className="text-left">Business registration information for the Canadian entity</li>
              <li className="text-left">Tax identification numbers for both sender and recipient</li>
              <li className="text-left">Clear purpose of the transfer</li>
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
            International transfers to Canada have several tax and legal implications to be aware of:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Recipients in Canada</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal gifts from family members are generally not taxable in Canada</li>
              <li className="text-left">Regular support payments may need to be reported for tax purposes</li>
              <li className="text-left">Business-related transfers are subject to normal business taxation</li>
              <li className="text-left">Large transfers may need to be reported to CRA (Canada Revenue Agency)</li>
              <li className="text-left">Recipients should maintain records of significant transfers</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For Senders in the UK</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Personal gifts are generally not tax-deductible in the UK</li>
              <li className="text-left">Business payments to Canada may have VAT and corporation tax implications</li>
              <li className="text-left">HMRC may require reporting of significant transfers</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
              <li className="text-left">Ensure transfers comply with both UK and Canadian regulations</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            Both the UK and Canada have anti-money laundering regulations that affect international transfers. Using established, regulated money transfer providers helps 
            ensure your transfers comply with these regulations. For business-related transfers or large amounts, consulting with a financial advisor familiar with 
            UK-Canada transactions may be beneficial.
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
              Several factors can affect the timing and processing of transfers to Canada:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">Canada is 4-8 hours behind the UK (depending on daylight saving time and province)</li>
              <li className="text-left">Banking hours are typically Monday to Friday, 9:30 AM to 4:00 PM local time</li>
              <li className="text-left">Major holidays like Canada Day and Thanksgiving may cause delays</li>
              <li className="text-left">Digital transfers initiated early in the UK day often arrive during Canada's business hours</li>
              <li className="text-left">Weekend transfers may not be processed until the next business day</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Final Tips for Sending Money to Canada</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Double-check the recipient's bank details, especially the transit number and institution number</li>
              <li className="text-left">For first-time transfers, use a smaller amount to verify everything works correctly</li>
              <li className="text-left">Consider the time difference when expecting funds to arrive</li>
              <li className="text-left">Save about 1-2% on larger transfers by comparing at least 3 providers</li>
              <li className="text-left">Consider setting up regular transfers if you're sending money monthly</li>
              <li className="text-left">Keep records of all transfers for tax and compliance purposes</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4 text-left">Canada Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Verify the CAD amount that will be received, including all fees</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if your transfer will arrive during Canadian banking hours</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Ensure you have the correct bank details, including transit and institution numbers</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Consider the time difference when expecting funds to arrive</p>
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
      title="Send Money to Canada: Complete Guide"
      subtitle="Find the best ways to send money to Canada from the UK. Compare providers, understand receiving options, and learn about exchange rates and fees."
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      metaDescription="Find the best ways to send money to Canada from the UK. Compare providers, understand receiving options, and learn about exchange rates and fees."
      content={content}
      relatedGuides={relatedGuides}
      publishDate="Updated March 19, 2024"
      readTime="12"
    />
  );
};

export default SendMoneyToCanadaGuide; 