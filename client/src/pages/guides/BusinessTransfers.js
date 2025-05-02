import React from 'react';
import GuideDetail from './GuideDetail';
import { Link } from 'react-router-dom';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/business-transfers-hero.jpg';
import heroImageWebp from '../../assets/images/guides/business-transfers-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Business Transfers guide page
 */
const BusinessTransfers = () => {
  return (
    <GuideDetail
      title="Business Transfers: The Ultimate Guide to International Payments"
      subtitle="Expert solutions for businesses needing to make international payments, manage currency risk, and optimise bulk transfers."
      publishDate="Updated April 28, 2025"
      readTime="9"
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      content={
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl font-medium mb-8 text-left">
            International business payments present unique challenges and opportunities compared to personal transfers. With the right approach, your business can save significantly on costs while managing currency risks effectively.
          </p>
          
          <div className="bg-indigo-50 rounded-lg p-6 my-10">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-indigo-900 pl-8">
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Business payment solution comparison</span>
                </li>
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Currency risk management strategies</span>
                </li>
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Bulk payment optimisation</span>
                </li>
              </ul>
              <ul className="space-y-2 text-indigo-900 pl-8">
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Software integration solutions</span>
                </li>
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Regulatory compliance requirements</span>
                </li>
                <li className="flex items-start gap-2 text-left">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Cost optimisation techniques</span>
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Essential Business Payment Solutions</h2>
          
          <p className="mb-6 text-left">
            Business international payments require more robust solutions than personal transfers. The ideal solution should offer not just competitive rates, but also robust security, integration capabilities, and business-specific features.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-indigo-600 p-4 text-white h-16 flex items-center">
                <h3 className="text-xl font-semibold text-left">Bank Services</h3>
              </div>
              <div className="p-5 flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Trade finance solutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Letters of credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Documentary collections</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-left">
                    Best for established businesses with complex banking needs and those requiring highest security levels.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-indigo-600 p-4 text-white h-16 flex items-center">
                <h3 className="text-xl font-semibold text-left">Specialised Providers</h3>
              </div>
              <div className="p-5 flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">API integrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Batch payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Multi-currency accounts</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-left">
                    Ideal for businesses seeking better rates than banks and requiring modern technology integrations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-indigo-600 p-4 text-white h-16 flex items-center">
                <h3 className="text-xl font-semibold text-left">Payment Platforms</h3>
              </div>
              <div className="p-5 flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">E-commerce integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">Global payment collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <span className="text-left">User-friendly interfaces</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-left">
                    Best for online businesses, marketplaces and companies needing simplified payment flows.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <blockquote className="italic border-l-4 border-indigo-500 pl-4 my-8 text-gray-700 text-left">
            "The right international payment solution can save a business up to 4% on transaction costs while improving operational efficiency through automation."
          </blockquote>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Currency Risk Management</h2>
          
          <p className="mb-6 text-left">
            Currency fluctuations can significantly impact your business's profit margins and budget predictability. Implementing a robust currency risk management strategy is essential for businesses with international operations.
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden my-8">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Forward Contracts</h3>
                <p className="mb-4 text-left">Lock in today's exchange rate for a future date, providing certainty for budgeting and pricing.</p>
                <h4 className="font-semibold text-gray-900 mb-2 text-left">Best For:</h4>
                <ul className="space-y-1 text-sm text-gray-600 pl-6 list-disc">
                  <li className="text-left">Fixed-price international contracts</li>
                  <li className="text-left">Protecting profit margins</li>
                  <li className="text-left">Major international purchases</li>
                </ul>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Limit Orders</h3>
                <p className="mb-4 text-left">Set a target exchange rate for your transfer that executes automatically when the market reaches your specified rate.</p>
                <h4 className="font-semibold text-gray-900 mb-2 text-left">Best For:</h4>
                <ul className="space-y-1 text-sm text-gray-600 pl-6 list-disc">
                  <li className="text-left">Non-urgent payments</li>
                  <li className="text-left">Opportunistic rate targeting</li>
                  <li className="text-left">Businesses with flexible timing</li>
                </ul>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Currency Options</h3>
                <p className="mb-4 text-left">Gain the right (but not obligation) to exchange at a predetermined rate, protecting against unfavorable movements.</p>
                <h4 className="font-semibold text-gray-900 mb-2 text-left">Best For:</h4>
                <ul className="space-y-1 text-sm text-gray-600 pl-6 list-disc">
                  <li className="text-left">Sophisticated businesses</li>
                  <li className="text-left">Higher-value transactions</li>
                  <li className="text-left">When maximum flexibility is needed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-5 my-10">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">Case Study: Hedging Success</h3>
            <p className="mb-4 text-left">A UK manufacturing firm with €2.5 million in annual purchases from EU suppliers used forward contracts to lock in exchange rates quarterly. When Brexit volatility caused a 7% currency swing, the company saved over £120,000 compared to competitors who didn't hedge.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Managing Bulk Transfers Efficiently</h2>
          
          <p className="mb-6 text-left">
            For businesses making multiple international payments, efficiency and cost-effectiveness are paramount. Modern bulk payment solutions can dramatically reduce administrative burden and costs.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 my-8">
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Mass Payment Solutions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>Batch uploads:</strong> CSV or XML format files containing multiple payment instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>Approval workflows:</strong> Multi-level authorization processes for payment security</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>Reduced per-transaction fees:</strong> Volume discounts for multiple payments</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Integration Options</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>Accounting software:</strong> Xero, QuickBooks, and Sage integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>API solutions:</strong> Custom integrations for enterprise clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>Automation:</strong> Scheduled payments without manual intervention</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Cost Optimisation Strategies</h2>
          
          <p className="mb-6">
            Unlike personal transfers, businesses often have leverage to negotiate better rates and terms due to transaction volumes and relationship value.
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden my-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">How It Works</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Savings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Tiered Pricing</td>
                  <td className="px-6 py-4">Request volume-based fee reductions based on your monthly transaction value</td>
                  <td className="px-6 py-4">0.2-0.7% on exchange rates</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Multi-Provider Strategy</td>
                  <td className="px-6 py-4">Use different providers for different currency pairs based on their strengths</td>
                  <td className="px-6 py-4">0.5-1.2% on total costs</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Strategic Timing</td>
                  <td className="px-6 py-4">Schedule non-urgent payments to coincide with favorable market conditions</td>
                  <td className="px-6 py-4">Up to 2-3% on volatile pairs</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">Payment Batching</td>
                  <td className="px-6 py-4">Group multiple payments to the same country to reduce fixed fees</td>
                  <td className="px-6 py-4">£10-40 per transaction</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-10 flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Ready to Optimise Your Business Transfers?</h3>
              <p className="text-indigo-900">Find the most cost-effective solution for your international business payments.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150">
                Compare Business Solutions
              </Link>
            </div>
          </div>
        </div>
      }
      relatedGuides={[
        {
          title: "Understanding Exchange Rates",
          description: "What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.",
          path: "/guides/exchange-rates"
        },
        {
          title: "Transfer Fees Explained",
          description: "A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.",
          path: "/guides/transfer-fees"
        },
        {
          title: "Security Tips for Money Transfers",
          description: "How to ensure your international transfers are secure and what to do if something goes wrong.",
          path: "/guides/security-tips"
        }
      ]}
    />
  );
};

export default BusinessTransfers; 