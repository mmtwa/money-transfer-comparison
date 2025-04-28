import React from 'react';
import GuideDetail from './GuideDetail';

/**
 * Getting Started with International Transfers guide
 */
const GettingStarted = () => {
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Introduction to International Money Transfers</h2>
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

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Types of Money Transfer Providers</h2>
      
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

      <img 
        src="/images/guides/money-transfer-providers.jpg" 
        alt="Comparison of different money transfer providers" 
        className="w-full rounded-lg shadow-md my-8" 
      />

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Key Terms to Understand</h2>
      
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

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">The Transfer Process: Step by Step</h2>
      
      <div className="relative ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
        <div className="absolute left-[-9px] top-0 h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Compare Providers</h3>
        <p className="mb-4 text-left">
          Research and compare exchange rates, fees, transfer speeds, and customer reviews across multiple providers.
          Use comparison tools like this website to find the best deal for your specific needs.
        </p>
        
        <div className="absolute left-[-9px] top-[100px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">2. Set Up an Account</h3>
        <p className="mb-4 text-left">
          Register with your chosen provider. You'll typically need to provide identification to comply with anti-money laundering regulations.
          This verification process might take from a few minutes to several days.
        </p>
        
        <div className="absolute left-[-9px] top-[210px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">3. Enter Transfer Details</h3>
        <p className="mb-4 text-left">
          Specify how much money you want to send, the currencies involved, and the recipient's details.
          Double-check all information, especially bank account numbers and recipient names.
        </p>
        
        <div className="absolute left-[-9px] top-[320px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">4. Pay for Your Transfer</h3>
        <p className="mb-4 text-left">
          Fund your transfer via bank transfer, debit card, or credit card. Be aware that some payment methods
          may incur additional fees or take longer to process.
        </p>
        
        <div className="absolute left-[-9px] top-[430px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">5. Track and Confirm</h3>
        <p className="text-left">
          Most providers offer tracking features so you can monitor your transfer's progress.
          Once complete, both you and the recipient should receive confirmation.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Common Pitfalls to Avoid</h2>
      
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
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Neglecting Security</h3>
        <p className="text-left">
          Ensure your provider has proper security measures and regulatory compliance in place.
          Be wary of deals that seem too good to be true, as they often are.
        </p>
      </div>

      <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
        <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Important Note on Large Transfers</h3>
        <p className="text-left">
          For large amounts (typically over £10,000), consider using a specialist currency broker who can offer
          personalised service and potentially better rates. Some providers also offer forward contracts to lock in
          current exchange rates for future transfers.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
      <p className="mb-6 text-left">
        International money transfers don't have to be complicated or expensive. By understanding the basics
        and comparing your options, you can save significantly on fees while ensuring your money arrives safely and promptly.
      </p>
      <p className="text-left">
        Remember that no single provider is best for all situations. Your optimal choice depends on factors like
        transfer amount, speed requirements, sending and receiving countries, and payment method preferences.
      </p>
    </>
  );

  return (
    <GuideDetail
      title="Getting Started with International Transfers"
      subtitle="Learn the basics of sending money internationally, including key terminology and processes you should know."
      content={content}
      heroImage="/images/guides/international-transfers-hero.jpg"
      publishDate="April 28, 2024"
      readTime="8"
      relatedGuides={relatedGuides}
    />
  );
};

export default GettingStarted; 