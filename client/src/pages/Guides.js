import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CurrencyFlag from '../components/ui/CurrencyFlag';

/**
 * Guides page component
 */
const Guides = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="py-16 md:py-24 relative border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMDJmNDMiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djI2aDI0di0yNkgzNnpNNiA2djI2aDI0VjZINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 -z-10"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 mb-6 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">Knowledge Center</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Money Transfer Guides
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Helpful resources to understand international money transfers and make informed decisions for your financial journey
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center"
            >
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/20"
              >
                Compare Providers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>

            {/* Animated scroll indicator */}
            <motion.div 
              className="flex justify-center mt-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Cards */}
      <section className="py-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Getting Started with International Transfers",
                  path: "/guides/getting-started",
                  description: "Learn the basics of sending money internationally, including key terminology and processes you should know.",
                  icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  title: "Understanding Exchange Rates",
                  path: "/guides/exchange-rates",
                  description: "What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.",
                  icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                  color: "from-purple-500 to-indigo-600"
                },
                {
                  title: "Transfer Fees Explained",
                  path: "/guides/transfer-fees",
                  description: "A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.",
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  color: "from-indigo-500 to-blue-600"
                },
                {
                  title: "Sending Money to Family Abroad",
                  path: "/guides/family-remittances",
                  description: "Best practices for regular remittances, including how to set up recurring transfers and save on fees.",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  color: "from-pink-500 to-purple-600"
                },
                {
                  title: "Business Transfers: A Complete Guide",
                  path: "/guides/business-transfers",
                  description: "Solutions for businesses needing to make international payments, currency hedging, and bulk transfers.",
                  icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  color: "from-orange-500 to-red-600"
                },
                {
                  title: "Security Tips for Money Transfers",
                  path: "/guides/security-tips",
                  description: "How to ensure your international transfers are secure and what to do if something goes wrong.",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  color: "from-green-500 to-teal-600"
                },
              ].map((guide, index) => (
                <motion.div
                  key={guide.path}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${guide.color}`}></div>
                    
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${guide.color} text-white shadow-lg shadow-indigo-500/20`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={guide.icon} />
                        </svg>
                      </div>
                    </div>
                    
                    <Link to={guide.path}>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 hover:text-indigo-600 text-left">
                        {guide.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-8 flex-grow text-left">
                      {guide.description}
                    </p>
                    
                    <Link 
                      to={guide.path} 
                      className="mt-auto inline-flex items-center font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors"
                    >
                      <span>Read guide</span>
                      <span className="ml-1 inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Country-Specific Guides Section */}
      <section className="py-12 bg-gray-50 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Country-Specific Transfer Guides</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed information for sending money to specific countries, with local insights and provider recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Complete Guide to Sending Money to India",
                  path: "/guides/send-money-to-india",
                  description: "Find the best providers, lowest fees, and fastest ways to send money to India. Information on receiving methods, regional banks, and mobile wallets.",
                  currencyCode: "INR",
                  color: "from-orange-500 to-amber-600"
                },
                {
                  title: "Philippines Money Transfer Guide",
                  path: "/guides/send-money-to-philippines",
                  description: "How to support family back home in the Philippines with optimal remittance options. Compare bank transfers, cash pickup locations, and mobile wallet services.",
                  currencyCode: "PHP",
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  title: "Mexico Remittance Guide",
                  path: "/guides/send-money-to-mexico",
                  description: "Fastest and cheapest ways to send money to Mexico from the US. Includes envíos de dinero options, cash pickup locations, and bank transfer comparisons.",
                  currencyCode: "MXN",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  title: "Pakistan Money Transfer Guide",
                  path: "/guides/send-money-to-pakistan",
                  description: "Best providers, lowest fees, and fastest ways to send money from the UK to Pakistan. Includes PRI benefits, bank deposits, and cash pickup options.",
                  icon: "pakistan",
                  color: "from-emerald-500 to-green-600"
                },
                {
                  title: "Nigeria Money Transfer Guide",
                  path: "/guides/send-money-to-nigeria",
                  description: "Navigate Nigeria's unique financial landscape with our guide to exchange rates, cash pickup locations, mobile money options, and the Naira-4-Dollar scheme.",
                  currencyCode: "NGN",
                  color: "from-purple-500 to-indigo-600"
                },
                {
                  title: "Poland Money Transfer Guide",
                  path: "/guides/send-money-to-poland",
                  description: "Find the best ways to send money to Poland from the UK. Learn about złoty exchange rates, EU transfer regulations, and digital wallet options.",
                  currencyCode: "PLN",
                  color: "from-red-500 to-pink-600"
                },
                {
                  title: "Romania Money Transfer Guide",
                  path: "/guides/send-money-to-romania",
                  description: "Best options for sending money to Romania, including digital transfers, cash pickup options, and banking preferences across different Romanian regions.",
                  currencyCode: "RON",
                  color: "from-yellow-500 to-amber-600"
                },
                {
                  title: "China Money Transfer Guide",
                  path: "/guides/send-money-to-china",
                  description: "Navigate China's unique regulations and find the best providers for sending money to China. Learn about documentation requirements and regional considerations.",
                  currencyCode: "CNY",
                  color: "from-red-600 to-rose-600"
                },
              ].map((guide, index) => (
                <motion.div
                  key={guide.path}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${guide.color}`}></div>
                    
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${guide.color} text-white shadow-lg shadow-indigo-500/20`}>
                        {guide.icon === 'pakistan' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-7 w-7">
                            <path fill="#ffffff" d="M0 0h512v512H0z"/>
                            <path fill="#01411c" d="M0 0h128v512H0z"/>
                            <g fill="#ffffff">
                              <path d="M340.1 170.7c-39.1 0-70.7 31.6-70.7 70.7 0 39 31.6 70.7 70.7 70.7 13 0 25.2-3.5 35.6-9.7-29.1-3.7-51.7-28.6-51.7-58.7 0-30.1 22.6-55 51.7-58.7-10.4-6.1-22.6-9.6-35.6-9.6z"/>
                              <path d="M388.6 297.9l7.6 20.4 21.6-.2-17 13.2 6.4 20.8-17.6-12.4-17.7 12.3 6.5-20.7-16.9-13.3 21.6.3z"/>
                            </g>
                          </svg>
                        ) : (
                          <CurrencyFlag currency={guide.currencyCode} size="lg" />
                        )}
                      </div>
                    </div>
                    
                    <Link to={guide.path}>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 hover:text-indigo-600 text-left">
                        {guide.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-8 flex-grow text-left">
                      {guide.description}
                    </p>
                    
                    <Link 
                      to={guide.path} 
                      className="mt-auto inline-flex items-center font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors"
                    >
                      <span>Read guide</span>
                      <span className="ml-1 inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find the best transfer provider?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Apply what you've learned and start comparing providers to find the best rates and lowest fees for your next money transfer.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-medium px-8 py-4 rounded-full hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Compare Providers Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Guides; 