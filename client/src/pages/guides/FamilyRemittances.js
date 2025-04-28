import React from 'react';
import GuideDetail from './GuideDetail';
import { Link } from 'react-router-dom';

/**
 * Sending Money to Family Abroad guide page
 */
const FamilyRemittances = () => {
  return (
    <GuideDetail
      title="Sending Money to Family Abroad: A Complete Guide to Remittances"
      subtitle="Discover the best practices for regular international remittances, how to set up recurring transfers and practical ways to save on fees."
      publishDate="10 July 2023"
      readTime="8 min read"
      heroImage="/images/guides/animated-svg-placeholder.html"
      content={
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl font-medium mb-8 text-left">
            Regular remittances are a financial lifeline for millions of families worldwide. Finding the most efficient, cost-effective way to send money abroad can make a significant difference to both you and your recipients.
          </p>
          
          <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">In This Guide:</h3>
            <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
              <li className="text-left">Best remittance methods comparison</li>
              <li className="text-left">Setting up recurring transfers</li>
              <li className="text-left">Strategies to reduce transfer costs</li>
              <li className="text-left">Tax considerations for senders</li>
              <li className="text-left">Ensuring recipient access</li>
              <li className="text-left">Mobile money and digital options</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden my-12">
            <div className="bg-indigo-700 p-4 text-white">
              <h2 className="text-xl font-bold m-0 text-left">Global Remittance Facts</h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-4 text-left">According to the World Bank:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-3 border border-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600 mb-1">£589bn</p>
                  <p className="text-sm">Total remittances to low and middle-income countries in 2021</p>
                </div>
                <div className="text-center p-3 border border-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600 mb-1">200m+</p>
                  <p className="text-sm">People support family members living abroad</p>
                </div>
                <div className="text-center p-3 border border-gray-100 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600 mb-1">7%</p>
                  <p className="text-sm">Average global cost of sending remittances</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 text-left">Choosing the Right Method</h2>
          
          <p className="mb-6 text-left">
            The best transfer method depends on your recipient's needs, the destination country, and your priorities regarding cost, speed, and convenience.
          </p>
          
          <div className="overflow-x-auto my-8">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Method</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Best For</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Typical Fees</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Speed</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Recipient Needs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium text-left">Bank Transfers</td>
                  <td className="py-3 px-4 text-left">Large amounts, security</td>
                  <td className="py-3 px-4 text-left">£15-30 + exchange rate markup</td>
                  <td className="py-3 px-4 text-left">2-5 business days</td>
                  <td className="py-3 px-4 text-left">Bank account</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-left">Online Money Transfer Services</td>
                  <td className="py-3 px-4 text-left">Regular transfers, value</td>
                  <td className="py-3 px-4 text-left">£0-5 + 0.5-2% markup</td>
                  <td className="py-3 px-4 text-left">1-3 business days</td>
                  <td className="py-3 px-4 text-left">Bank account or cash pickup</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-left">Cash Transfer Services</td>
                  <td className="py-3 px-4 text-left">Speed, no-bank recipients</td>
                  <td className="py-3 px-4 text-left">£3-10 + 1-3% markup</td>
                  <td className="py-3 px-4 text-left">Minutes to hours</td>
                  <td className="py-3 px-4 text-left">ID for cash pickup</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-left">Mobile Money</td>
                  <td className="py-3 px-4 text-left">Small amounts, rural areas</td>
                  <td className="py-3 px-4 text-left">£1-5 + 1-2% markup</td>
                  <td className="py-3 px-4 text-left">Minutes to hours</td>
                  <td className="py-3 px-4 text-left">Mobile phone</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <blockquote className="italic border-l-4 border-indigo-500 pl-4 my-8 text-gray-700 text-left">
            "The cheapest option isn't always the best choice for family remittances. Consider how easily your recipient can access the funds and any local fees they might incur."
          </blockquote>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Setting Up Recurring Transfers</h2>
          
          <p className="mb-6 text-left">
            Most modern money transfer providers offer recurring transfer options that provide consistency, convenience, and potential cost savings.
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 my-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-left">Step-by-Step: Setting Up Automatic Transfers</h3>
            
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-lg mb-1 text-left">Create an account with your chosen provider</h4>
                  <p className="text-gray-600 text-left">Compare services using our <Link to="/" className="text-indigo-600 hover:text-indigo-800">comparison tool</Link> to find the best option for your destination.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-lg mb-1 text-left">Verify your identity</h4>
                  <p className="text-gray-600 text-left">All legitimate providers require ID verification for anti-money laundering compliance.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-lg mb-1 text-left">Add your recipient's details</h4>
                  <p className="text-gray-600 text-left">Double-check all banking details or collection information to avoid transfer issues.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-medium text-lg mb-1 text-left">Set up frequency and payment source</h4>
                  <p className="text-gray-600 text-left">Choose weekly, bi-weekly, or monthly transfers and select your preferred payment method.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="font-medium text-lg mb-1 text-left">Confirm and monitor</h4>
                  <p className="text-gray-600 text-left">Review the schedule and exchange rate policies, then monitor the first few transfers.</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Smart Strategies to Save on Fees</h2>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Timing Your Transfers</h3>
              <p className="mb-3 text-left">
                Exchange rates fluctuate daily. Using rate alerts can help you transfer when rates are most favorable.
              </p>
              <p className="text-sm text-gray-600 text-left">
                Many comparison sites and transfer services offer free rate alerts when your currency pair reaches a target rate.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Bundling Transfers</h3>
              <p className="mb-3 text-left">
                Sending larger amounts less frequently can significantly reduce the impact of fixed fees.
              </p>
              <p className="text-sm text-gray-600 text-left">
                Example: Sending £500 monthly instead of £125 weekly could save up to 75% on fixed fees.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Loyalty Programmes</h3>
              <p className="mb-3 text-left">
                Regular senders can often access VIP rates and reduced fees through loyalty schemes.
              </p>
              <p className="text-sm text-gray-600 text-left">
                Ask your provider if they have fee reductions for frequent users or high-volume transfers.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-3 text-left">Forward Contracts</h3>
              <p className="mb-3 text-left">
                Some providers let you lock in current exchange rates for future transfers if you're concerned about rate volatility.
              </p>
              <p className="text-sm text-gray-600 text-left">
                This can provide peace of mind and protect against currency fluctuations affecting your family's income.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Ensuring Your Family Can Access the Funds</h2>
          
          <p className="mb-6 text-left">
            Before committing to a regular transfer schedule, verify that your chosen method works well for the recipient:
          </p>
          
          <ul className="space-y-4 mb-8 pl-4">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-left"><strong className="text-gray-900">Confirm local access fees:</strong> Some banks or pickup locations charge recipients additional fees</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-left"><strong className="text-gray-900">Check pickup location reliability:</strong> Ensure cash pickup points have consistent operating hours</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-left"><strong className="text-gray-900">Verify ID requirements:</strong> Make sure your recipient has the necessary identification</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-left"><strong className="text-gray-900">Test before committing:</strong> Send a small transfer first to identify any potential issues</span>
            </li>
          </ul>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-12 flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-indigo-900 mb-2 text-left">Ready to Support Your Family?</h3>
              <p className="text-indigo-900 text-left">Compare international money transfer services to find the best option for your family remittances.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150">
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      }
      relatedGuides={[
        {
          title: "Transfer Fees Explained",
          description: "A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.",
          path: "/guides/transfer-fees"
        },
        {
          title: "Understanding Exchange Rates",
          description: "What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.",
          path: "/guides/exchange-rates"
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

export default FamilyRemittances; 