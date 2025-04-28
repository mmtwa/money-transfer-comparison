import React from 'react';
import GuideDetail from './GuideDetail';

/**
 * Understanding Exchange Rates guide
 */
const ExchangeRates = () => {
  // Define related guides
  const relatedGuides = [
    {
      title: 'Transfer Fees Explained',
      description: 'A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.',
      path: '/guides/transfer-fees'
    },
    {
      title: 'Getting Started with International Transfers',
      description: 'Learn the basics of sending money internationally, including key terminology and processes you should know.',
      path: '/guides/getting-started'
    }
  ];

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">What Are Exchange Rates?</h2>
      <p className="mb-6 text-left">
        At its simplest, an exchange rate is the value of one currency expressed in terms of another currency. 
        For example, if the GBP/USD exchange rate is 1.30, it means £1 is worth $1.30.
      </p>
      
      <p className="mb-8 text-left">
        However, understanding exchange rates goes far beyond this basic definition. 
        Exchange rates fluctuate constantly due to multiple factors, and the rate you see quoted online 
        might not be the rate you'll actually get when transferring money.
      </p>

      <div className="bg-indigo-50 p-6 rounded-lg my-8">
        <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Key Exchange Rate Terminology</h3>
        <ul className="list-disc pl-8 space-y-2">
          <li className="text-left"><strong>Mid-market rate</strong>: The "true" exchange rate, found by taking the midpoint between buy and sell rates on global currency markets</li>
          <li className="text-left"><strong>Exchange rate margin</strong>: The markup added by providers to the mid-market rate</li>
          <li className="text-left"><strong>Spot rate</strong>: The current exchange rate for immediate delivery</li>
          <li className="text-left"><strong>Forward rate</strong>: A rate agreed today for a transaction that will happen in the future</li>
          <li className="text-left"><strong>Currency pair</strong>: The two currencies involved in an exchange rate (e.g., GBP/EUR)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">The Mid-Market Rate vs. Provider Rates</h2>
      
      <p className="mb-4 text-left">
        The mid-market rate (sometimes called the interbank rate) is the midpoint between buying and selling prices 
        on the global currency markets. It's the rate you'll see when you search for a currency pair on Google or 
        financial news sites.
      </p>
      
      <p className="mb-8 text-left">
        However, consumers rarely get the mid-market rate when transferring money internationally. 
        Most providers add a markup to this rate, which is how they make money even when advertising "zero fees" or 
        "fee-free transfers."
      </p>

      <div className="relative bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
          Example
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">The Hidden Cost of Exchange Rate Margins</h3>
        
        <p className="mb-4 text-left">Let's say you want to send £1,000 to a friend in Europe:</p>
        
        <ul className="list-disc pl-8 mb-4">
          <li className="mb-2 text-left">Mid-market rate: £1 = €1.18</li>
          <li className="mb-2 text-left">Bank's exchange rate: £1 = €1.13 (4.2% margin)</li>
          <li className="mb-2 text-left">Specialist provider's rate: £1 = €1.16 (1.7% margin)</li>
        </ul>
        
        <p className="mb-2 text-left"><strong>Bank transfer result:</strong> €1,130 (€50 less than mid-market)</p>
        <p className="text-left"><strong>Specialist provider result:</strong> €1,160 (€20 less than mid-market)</p>
        
        <p className="mt-4 text-indigo-700 text-left">
          In this example, using the specialist provider saves you €30, even if both advertise "zero fees."
        </p>
      </div>

      <img 
        src="/images/guides/exchange-rate-diagram.jpg" 
        alt="Diagram showing how exchange rates work" 
        className="w-full rounded-lg shadow-md my-8" 
      />

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">What Influences Exchange Rates?</h2>
      
      <p className="mb-6 text-left">
        Exchange rates are constantly fluctuating due to numerous economic and political factors.
        Understanding these factors can help you time your transfers better.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-sm rounded p-5">
          <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Economic Factors</h3>
          <ul className="list-disc pl-8">
            <li className="text-left">Interest rates</li>
            <li className="text-left">Inflation rates</li>
            <li className="text-left">Economic growth (GDP)</li>
            <li className="text-left">Trade balances</li>
            <li className="text-left">Government debt</li>
          </ul>
        </div>
        
        <div className="bg-white shadow-sm rounded p-5">
          <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Political & Social Factors</h3>
          <ul className="list-disc pl-8">
            <li className="text-left">Political stability</li>
            <li className="text-left">Elections</li>
            <li className="text-left">Policy changes</li>
            <li className="text-left">Brexit-type events</li>
            <li className="text-left">Market sentiment</li>
          </ul>
        </div>
      </div>
      
      <p className="mb-8 text-left">
        Additionally, major global events like the COVID-19 pandemic can cause significant currency fluctuations.
        During periods of uncertainty, currencies perceived as "safe havens" (like USD, CHF, and JPY) often strengthen.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Exchange Rate Volatility</h2>
      
      <p className="mb-4 text-left">
        Some currency pairs are more volatile than others. Major currency pairs (like GBP/USD or EUR/USD) 
        typically show less dramatic fluctuations than exotic pairs involving emerging market currencies.
      </p>
      
      <p className="mb-8 text-left">
        For large transfers, even small rate changes can have significant impacts. For example, a 1% movement 
        in the exchange rate on a £100,000 transfer equals £1,000 in value.
      </p>

      <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
        <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Managing Exchange Rate Risk</h3>
        <p className="mb-2 text-left">
          If you're planning a large transfer, you have several options to manage exchange rate risk:
        </p>
        <ul className="list-disc pl-8">
          <li className="text-left"><strong>Spot transfer</strong>: Lock in today's rate for immediate transfer</li>
          <li className="text-left"><strong>Forward contract</strong>: Lock in today's rate for a future transfer (useful for property purchases)</li>
          <li className="text-left"><strong>Limit order</strong>: Set your desired rate and transfer automatically when that rate is reached</li>
          <li className="text-left"><strong>Regular transfers</strong>: Use averaging to mitigate volatility over time</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">How to Compare Exchange Rates</h2>
      
      <p className="mb-4 text-left">
        When comparing providers, it's essential to look at the total cost of your transfer, not just the advertised fees.
        Here's how to make a fair comparison:
      </p>

      <div className="relative ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
        <div className="absolute left-[-9px] top-0 h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Check the Mid-Market Rate</h3>
        <p className="mb-4 text-left">
          Look up the current mid-market rate on Google, XE.com, or other financial sites to establish a baseline.
        </p>
        
        <div className="absolute left-[-9px] top-[80px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">2. Calculate the Total Received Amount</h3>
        <p className="mb-4 text-left">
          For each provider, calculate how much the recipient will actually receive after applying the provider's 
          exchange rate and subtracting any fees.
        </p>
        
        <div className="absolute left-[-9px] top-[180px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">3. Compare the Effective Exchange Rate</h3>
        <p className="mb-4 text-left">
          Divide the amount received by the amount sent to calculate the effective exchange rate, which accounts for all costs.
        </p>
        
        <div className="absolute left-[-9px] top-[280px] h-5 w-5 rounded-full bg-indigo-600"></div>
        <h3 className="text-xl font-bold text-gray-700 mb-1 mt-8 text-left">4. Consider Other Factors</h3>
        <p className="text-left">
          Remember to factor in transfer speed, payment methods, and customer service quality in your decision.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">Real-World Example: Comparing Providers</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="py-2 px-4 text-left">Provider</th>
                <th className="py-2 px-4 text-left">Quoted Rate</th>
                <th className="py-2 px-4 text-left">Transfer Fee</th>
                <th className="py-2 px-4 text-left">Amount Received (€)</th>
                <th className="py-2 px-4 text-left">Effective Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-left">Mid-Market</td>
                <td className="py-2 px-4 text-left">1.180</td>
                <td className="py-2 px-4 text-left">N/A</td>
                <td className="py-2 px-4 text-left">1,180.00</td>
                <td className="py-2 px-4 text-left">1.180</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-left">Traditional Bank</td>
                <td className="py-2 px-4 text-left">1.130</td>
                <td className="py-2 px-4 text-left">£15</td>
                <td className="py-2 px-4 text-left">1,108.00</td>
                <td className="py-2 px-4 text-left">1.108</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-left">Online Provider A</td>
                <td className="py-2 px-4 text-left">1.165</td>
                <td className="py-2 px-4 text-left">£3</td>
                <td className="py-2 px-4 text-left">1,154.18</td>
                <td className="py-2 px-4 text-left">1.154</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-left">Online Provider B</td>
                <td className="py-2 px-4 text-left">1.170</td>
                <td className="py-2 px-4 text-left">£5</td>
                <td className="py-2 px-4 text-left">1,152.45</td>
                <td className="py-2 px-4 text-left">1.152</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 text-left">
          *Example based on sending £1,000 from the UK to Europe with a mid-market rate of 1.18.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Tracking Exchange Rates Over Time</h2>
      
      <p className="mb-4 text-left">
        If you're not in a rush to make a transfer, monitoring exchange rates over time can help you identify 
        favourable trends and potentially get more value from your transfer.
      </p>
      
      <p className="mb-6 text-left">
        Many providers offer rate alert services where you can set a target rate and receive notifications 
        when that rate is reached. Our historical rates tool can also help you identify patterns and make 
        informed decisions about timing your transfers.
      </p>

      <div className="bg-indigo-50 p-6 rounded-lg my-8">
        <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Pro Tips for Better Exchange Rates</h3>
        <ul className="list-disc pl-8 space-y-2">
          <li className="text-left">Avoid converting money at airports, hotels, or tourist areas where rates are typically poor</li>
          <li className="text-left">Consider specialist currency providers instead of banks for better rates</li>
          <li className="text-left">For regular transfers, set up a rate alert or a regular transfer plan</li>
          <li className="text-left">For large transfers (£10,000+), consider negotiating with currency brokers for better rates</li>
          <li className="text-left">Always check the total cost (exchange rate + fees) rather than just looking at the fee</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts</h2>
      <p className="mb-6 text-left">
        Understanding exchange rates is essential for making informed decisions about international money transfers. 
        While the topic can seem complex, focusing on the effective exchange rate (the actual amount received 
        divided by the amount sent) provides a simple way to compare providers and get the best value.
      </p>
      <p className="text-left">
        Remember that no single provider offers the best rates for all currency pairs and amounts. Taking a few 
        minutes to compare options before making a transfer can save you significant money, especially for larger amounts.
      </p>
    </>
  );

  return (
    <GuideDetail
      title="Understanding Exchange Rates"
      subtitle="What exchange rates really mean, how to compare them, and why the rate you see might not be what you get."
      content={content}
      heroImage="/images/guides/exchange-rate-diagram.jpg"
      publishDate="May 10, 2024"
      readTime="7"
      relatedGuides={relatedGuides}
    />
  );
};

export default ExchangeRates; 