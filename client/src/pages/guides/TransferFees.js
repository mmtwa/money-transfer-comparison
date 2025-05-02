import React from 'react';
import GuideDetail from './GuideDetail';
import { Link } from 'react-router-dom';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/transfer-fees-hero.jpg';
import heroImageWebp from '../../assets/images/guides/transfer-fees-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Transfer Fees Explained guide page
 */
const TransferFees = () => {
  return (
    <GuideDetail
      title="Transfer Fees Explained: The Hidden Costs of Sending Money Abroad"
      subtitle="Uncover the different types of fees providers charge and learn how to calculate the true cost of your international transfers."
      publishDate="Updated April 30, 2025"
      readTime="7"
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      content={
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl font-medium mb-8 text-left">
            When sending money abroad, the advertised fee is rarely the full story. Understanding the true cost of your international transfer can save you significantly over time.
          </p>
          
          <div className="my-12 p-6 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">Key Takeaways:</h3>
            <ul className="list-disc pl-8 space-y-2 text-indigo-900">
              <li className="text-left">Transfer providers charge through fixed fees, percentage-based fees, and exchange rate markups</li>
              <li className="text-left">The largest cost is often hidden in the exchange rate</li>
              <li className="text-left">Comparing the total amount received is more important than looking at advertised fees</li>
              <li className="text-left">Providers advertising "zero fees" typically make their money through exchange rate markups</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 text-left">The Three Types of Transfer Fees</h2>
          
          <div className="flex flex-col md:flex-row gap-6 my-8">
            <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Fixed Fees</h3>
              <p className="text-left">
                These straightforward charges apply regardless of your transfer amount. Typically ranging from £0.99 to £4.99, they're easy to spot but can significantly impact smaller transfers.
              </p>
            </div>
            
            <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Percentage-Based Fees</h3>
              <p className="text-left">
                Calculated as a percentage of your transfer amount, these usually range from 0.5% to 3.5%. They become more substantial as your transfer amount increases.
              </p>
            </div>
            
            <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Exchange Rate Markup</h3>
              <p className="text-left">
                The least transparent fee, providers often add a markup to the mid-market exchange rate, reducing your received amount by 0.5% to 5% or more.
              </p>
            </div>
          </div>

          <blockquote className="italic border-l-4 border-indigo-500 pl-4 my-8 text-gray-700 text-left">
            "The best rate isn't always offered by the provider advertising 'zero fees'. Always compare the final amount your recipient will get."
          </blockquote>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 text-left">How to Calculate the True Cost</h2>
          
          <p className="text-left">
            To understand what you're actually paying, follow these steps:
          </p>
          
          <div className="relative my-8">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="relative pl-12 pb-6">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">1</div>
              <p className="font-medium text-left">Find the mid-market exchange rate</p>
              <p className="text-gray-600 text-left">Check reliable sources like XE.com or Reuters for the current rate.</p>
            </div>
            
            <div className="relative pl-12 pb-6">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">2</div>
              <p className="font-medium text-left">Calculate what you should receive</p>
              <p className="text-gray-600 text-left">Multiply your sending amount by the mid-market rate.</p>
            </div>
            
            <div className="relative pl-12 pb-6">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">3</div>
              <p className="font-medium text-left">Compare to the provider's quote</p>
              <p className="text-gray-600 text-left">Note the difference between your calculation and what's offered.</p>
            </div>
            
            <div className="relative pl-12 pb-6">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">4</div>
              <p className="font-medium text-left">Add any fixed or percentage fees</p>
              <p className="text-gray-600 text-left">Include all explicit fees mentioned by the provider.</p>
            </div>
            
            <div className="relative pl-12">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">5</div>
              <p className="font-medium text-left">Calculate total cost</p>
              <p className="text-gray-600 text-left">The sum of the exchange rate difference and explicit fees is your total cost.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden my-10">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="text-xl font-semibold text-left">Fee Comparison Example</h3>
              <p className="text-left">Sending £1,000 to EUR (mid-market rate: 1 GBP = 1.15 EUR)</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <p className="font-semibold text-left">Expected amount at mid-market:</p>
                <p className="text-lg text-left">€1,150</p>
              </div>
              
              <div className="p-4 flex flex-col md:flex-row">
                <div className="flex-1 mb-4 md:mb-0">
                  <p className="font-semibold text-indigo-700 text-left">Provider A:</p>
                  <p className="text-left">€1,130 + £2.99 fixed fee</p>
                  <p className="mt-2 text-sm text-left">Total cost: <span className="font-semibold">£22.99</span></p>
                  <p className="text-xs text-gray-500 text-left">(£2.99 fixed fee + £20 exchange rate markup)</p>
                </div>
                
                <div className="flex-1 mb-4 md:mb-0">
                  <p className="font-semibold text-indigo-700 text-left">Provider B:</p>
                  <p className="text-left">€1,140 + 0.5% fee (£5)</p>
                  <p className="mt-2 text-sm text-left">Total cost: <span className="font-semibold">£15</span></p>
                  <p className="text-xs text-gray-500 text-left">(£5 percentage fee + £10 exchange rate markup)</p>
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-indigo-700 text-left">Provider C:</p>
                  <p className="text-left">€1,125 with "zero fees"</p>
                  <p className="mt-2 text-sm text-left">Total cost: <span className="font-semibold">£25</span></p>
                  <p className="text-xs text-gray-500 text-left">(£25 hidden in exchange rate markup)</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 text-left">5 Clever Ways to Reduce Transfer Fees</h2>
          
          <ol className="space-y-6 my-8">
            <li className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-lg text-left">Compare final amounts, not advertised fees</p>
              <p className="text-gray-600 text-left">Focus on how much your recipient will actually get, not what the provider claims to charge.</p>
            </li>
            
            <li className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-lg text-left">Transfer larger amounts less frequently</p>
              <p className="text-gray-600 text-left">Fixed fees have less impact on larger transfers. Consider bundling multiple small transfers into one larger one.</p>
            </li>
            
            <li className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-lg text-left">Look for fee-free thresholds</p>
              <p className="text-gray-600 text-left">Some providers waive fees above certain amounts (typically £2,000 or more).</p>
            </li>
            
            <li className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-lg text-left">Leverage new customer promotions</p>
              <p className="text-gray-600 text-left">Many services offer fee-free first transfers or better rates for new customers.</p>
            </li>
            
            <li className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-lg text-left">Use our comparison tool</p>
              <p className="text-gray-600 text-left">Find the most cost-effective provider based on your specific transfer details with our <Link to="/" className="text-indigo-600 hover:text-indigo-800">comparison tool</Link>.</p>
            </li>
          </ol>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-10 flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-indigo-900 mb-2 text-left">Make Your Money Go Further</h3>
              <p className="text-indigo-900 text-left">Ready to save on your next international transfer? Compare providers now to find the best rate.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150">
                Compare Providers
              </Link>
            </div>
          </div>
        </div>
      }
      relatedGuides={[
        {
          title: "Understanding Exchange Rates",
          path: "/guides/exchange-rates"
        },
        {
          title: "Getting Started with International Transfers",
          path: "/guides/getting-started"
        },
        {
          title: "Security Tips for Money Transfers",
          path: "/guides/security-tips"
        }
      ]}
    />
  );
};

export default TransferFees; 