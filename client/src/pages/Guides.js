import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Guides page component
 */
const Guides = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 py-10 pt-[1px]">
      {/* Hero Section */}
      <section className="py-20 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">Money Transfer Guides</h1>
            <p className="text-xl text-gray-600 text-center mb-10">
              Helpful resources to understand international money transfers and make informed decisions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Getting Started with International Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Learn the basics of sending money internationally, including key terminology and processes you should know.
                </p>
                <Link to="/guides/getting-started" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Understanding Exchange Rates</h2>
                <p className="text-gray-700 mb-4">
                  What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.
                </p>
                <Link to="/guides/exchange-rates" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Transfer Fees Explained</h2>
                <p className="text-gray-700 mb-4">
                  A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.
                </p>
                <Link to="/guides/transfer-fees" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Sending Money to Family Abroad</h2>
                <p className="text-gray-700 mb-4">
                  Best practices for regular remittances, including how to set up recurring transfers and save on fees.
                </p>
                <Link to="/guides/family-remittances" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Business Transfers: A Complete Guide</h2>
                <p className="text-gray-700 mb-4">
                  Solutions for businesses needing to make international payments, currency hedging, and bulk transfers.
                </p>
                <Link to="/guides/business-transfers" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">Security Tips for Money Transfers</h2>
                <p className="text-gray-700 mb-4">
                  How to ensure your international transfers are secure and what to do if something goes wrong.
                </p>
                <Link to="/guides/security-tips" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors inline-flex items-center">
                  Read guide <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guides; 