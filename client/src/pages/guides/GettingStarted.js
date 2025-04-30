import React from 'react';
import GuideDetail from './GuideDetail';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/international-transfers-hero.jpg';
import providersImageJpg from '../../assets/images/guides/wu-phone-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/international-transfers-hero.webp';
import providersImageWebp from '../../assets/images/guides/wu-phone.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';

/**
 * Getting Started with International Transfers guide
 */
const GettingStarted = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'provider-types': true,
    'key-terms': true,
    'transfer-process': true,
    'common-pitfalls': true
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
        Introduction to International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Whether you're supporting family abroad, purchasing an overseas property, or paying international invoices, 
            sending money across borders is now easier than ever. However, with countless providers and options available,
            choosing the right service can be overwhelming.
          </p>
          
          <p className="mb-6 text-left">
            This guide will help newcomers understand the basics of international transfers, explain key terminology,
            and outline the process from start to finish.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Quick Facts: International Money Transfers</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Approximately £21 billion is sent from the UK to overseas destinations annually</li>
              <li className="text-left">Traditional banks often charge 3-7% in hidden fees and exchange rate markups</li>
              <li className="text-left">Specialist transfer providers can save you up to 90% on transfer costs</li>
              <li className="text-left">Transfer speeds range from minutes to several business days</li>
              <li className="text-left">Most countries have regulations limiting the amount you can send without additional verification</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="provider-types" 
        isExpanded={expandedSections['provider-types']} 
        onClick={toggleSection}
      >
        Types of Money Transfer Providers
      </ClickableHeadline>
      {expandedSections['provider-types'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Traditional Banks</h3>
            <p className="mb-2 text-left">
              High street banks offer international transfers as one of many services. While convenient for existing customers,
              they typically charge higher fees and offer less competitive exchange rates.
            </p>
            <div className="bg-white shadow-sm rounded p-4 my-3">
              <div className="text-left"><strong className="text-indigo-700">Pros:</strong> Familiar, secure, convenient for existing customers</div>
              <div className="text-left"><strong className="text-indigo-700">Cons:</strong> Higher fees, poor exchange rates, slower processing</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Online Money Transfer Specialists</h3>
            <p className="mb-2 text-left">
              Companies like Wise, Revolut, and Currencies Direct focus exclusively on international transfers,
              offering competitive rates, lower fees, and faster service.
            </p>
            <div className="bg-white shadow-sm rounded p-4 my-3">
              <div className="text-left"><strong className="text-indigo-700">Pros:</strong> Better rates, lower fees, faster transfers, user-friendly platforms</div>
              <div className="text-left"><strong className="text-indigo-700">Cons:</strong> May require setting up a new account</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Money Transfer Operators (MTOs)</h3>
            <p className="mb-2 text-left">
              Companies like Western Union and MoneyGram have physical locations worldwide, making them suitable
              for sending cash that can be picked up in person.
            </p>
            <div className="bg-white shadow-sm rounded p-4 my-3">
              <div className="text-left"><strong className="text-indigo-700">Pros:</strong> Cash pickup option, wide global network, no bank account needed</div>
              <div className="text-left"><strong className="text-indigo-700">Cons:</strong> Higher fees for small transfers, less competitive exchange rates</div>
            </div>
          </div>

          <ResponsiveImage 
            src={providersImageJpg} 
            webp={providersImageWebp}
            alt="Comparison of different money transfer providers" 
            className="w-full rounded-lg shadow-md my-8"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </>
      )}

      <ClickableHeadline 
        id="key-terms" 
        isExpanded={expandedSections['key-terms']} 
        onClick={toggleSection}
      >
        Key Terms to Understand
      </ClickableHeadline>
      {expandedSections['key-terms'] && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">Exchange Rate</h3>
              <p className="text-left">The value of one currency compared to another. Be aware of the difference between the mid-market rate and the rate providers offer.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">Transfer Fee</h3>
              <p className="text-left">The upfront fee charged for processing your transfer. May be fixed, percentage-based, or a combination.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">Exchange Rate Margin</h3>
              <p className="text-left">The markup providers add to the mid-market exchange rate, a hidden cost often not clearly disclosed.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">Transfer Time</h3>
              <p className="text-left">How long it takes for money to reach the recipient. Can range from minutes to several business days.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">SWIFT</h3>
              <p className="text-left">Society for Worldwide Interbank Financial Telecommunication. A network used by banks to send money internationally.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-indigo-600 text-left">IBAN/BIC</h3>
              <p className="text-left">International Bank Account Number and Bank Identifier Code. Important for transfers to and from Europe.</p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-process" 
        isExpanded={expandedSections['transfer-process']} 
        onClick={toggleSection}
      >
        The Transfer Process: Step by Step
      </ClickableHeadline>
      {expandedSections['transfer-process'] && (
        <>
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Compare Providers</h3>
              <p className="text-left">
                Research and compare exchange rates, fees, transfer speeds, and customer reviews across multiple providers.
                Use comparison tools like this website to find the best deal for your specific needs.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Set Up an Account</h3>
              <p className="text-left">
                Register with your chosen provider. You'll typically need to provide identification to comply with anti-money laundering regulations.
                This verification process might take from a few minutes to several days.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Enter Transfer Details</h3>
              <p className="text-left">
                Specify how much money you want to send, the currencies involved, and the recipient's details.
                Double-check all information, especially bank account numbers and recipient names.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">4. Pay for Your Transfer</h3>
              <p className="text-left">
                Fund your transfer via bank transfer, debit card, or credit card. Be aware that some payment methods
                may incur additional fees or take longer to process.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">5. Track and Confirm</h3>
              <p className="text-left">
                Most providers offer tracking features so you can monitor your transfer's progress.
                Once complete, both you and the recipient should receive confirmation.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="common-pitfalls" 
        isExpanded={expandedSections['common-pitfalls']} 
        onClick={toggleSection}
      >
        Common Pitfalls to Avoid
      </ClickableHeadline>
      {expandedSections['common-pitfalls'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Ignoring the Total Cost</h3>
            <p className="text-left">
              Don't be fooled by "fee-free" transfers. Always calculate the total cost by considering both the upfront fee
              and the exchange rate offered compared to the mid-market rate.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Overlooking Transfer Speed</h3>
            <p className="text-left">
              If timing matters, check the estimated delivery time. The cheapest option isn't always helpful if the money
              arrives days later than needed.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Failing to Verify Recipient Details</h3>
            <p className="text-left">
              Double-check all recipient information. Transfers sent to incorrect accounts can be difficult or impossible
              to recover.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Not Considering Security</h3>
            <p className="text-left">
              Ensure the provider has robust security measures, particularly for large transfers. Look for providers
              with regulatory approval from authorities like the FCA in the UK.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Forgetting About Regular Transfers</h3>
            <p className="text-left">
              If you send money regularly, look for providers offering recurring transfer options with reduced fees
              or preferential rates.
            </p>
          </div>
        </>
      )}

      <div className="bg-indigo-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-indigo-800 mb-4 text-left">Your First International Transfer: A Checklist</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-left">Compare at least three providers based on the total amount received</p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-left">Gather all recipient information including full legal name, address, and bank details</p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-left">Check if your transfer requires any documentation (for large amounts)</p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-left">Understand the estimated delivery time and any potential delays</p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-left">Save your receipt and tracking information</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <GuideDetail
      title="Getting Started with International Money Transfers"
      subtitle="Learn the basics of sending money abroad, including key terminology and step-by-step processes"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated April 2, 2023"
      readTime="6"
      relatedGuides={relatedGuides}
    />
  );
};

export default GettingStarted; 