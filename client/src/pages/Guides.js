import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
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

      {/* Interactive Guide Navigation Menu */}
      <GuidesMenu />

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
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Money Transfer Basics</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Essential guides to help you understand and optimize your international money transfers
              </p>
            </div>
            
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={guide.icon} />
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

            {/* Interactive Country Guide Selector */}
            <CountryGuideSelector />
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

/**
 * GuidesMenu component - An expandable, hierarchical menu system for guides
 */
const GuidesMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeContinent, setActiveContinent] = useState(null);
  
  // Country guides data
  const countryGuides = [
    {
      title: "Complete Guide to Sending Money to India",
      path: "/guides/send-money-to-india",
      description: "Find the best providers, lowest fees, and fastest ways to send money to India. Information on receiving methods, regional banks, and mobile wallets.",
      currencyCode: "INR",
      color: "from-orange-500 to-amber-600",
      region: "Asia",
      coordinates: [78.9629, 20.5937]
    },
    {
      title: "Send Money to Bangladesh Guide",
      path: "/guides/send-money-to-bangladesh",
      description: "Best providers, receiving options, and regional considerations for sending money to Bangladesh. Includes details on the 2% government incentive and mobile financial services.",
      currencyCode: "BDT",
      color: "from-green-600 to-emerald-500",
      region: "Asia",
      coordinates: [90.3563, 23.6850]
    },
    {
      title: "Philippines Money Transfer Guide",
      path: "/guides/send-money-to-philippines",
      description: "How to support family back home in the Philippines with optimal remittance options. Compare bank transfers, cash pickup locations, and mobile wallet services.",
      currencyCode: "PHP",
      color: "from-blue-500 to-cyan-600",
      region: "Asia",
      coordinates: [121.7740, 12.8797]
    },
    {
      title: "Mexico Remittance Guide",
      path: "/guides/send-money-to-mexico",
      description: "Fastest and cheapest ways to send money to Mexico from the US. Includes envíos de dinero options, cash pickup locations, and bank transfer comparisons.",
      currencyCode: "MXN",
      color: "from-green-500 to-emerald-600",
      region: "Americas",
      coordinates: [-102.5528, 23.6345]
    },
    {
      title: "Pakistan Money Transfer Guide",
      path: "/guides/send-money-to-pakistan",
      description: "Best providers, lowest fees, and fastest ways to send money from the UK to Pakistan. Includes PRI benefits, bank deposits, and cash pickup options.",
      currencyCode: "PKR",
      color: "from-emerald-500 to-green-600",
      region: "Asia",
      coordinates: [69.3451, 30.3753]
    },
    {
      title: "Nigeria Money Transfer Guide",
      path: "/guides/send-money-to-nigeria",
      description: "Navigate Nigeria's unique financial landscape with our guide to exchange rates, cash pickup locations, mobile money options, and the Naira-4-Dollar scheme.",
      currencyCode: "NGN",
      color: "from-purple-500 to-indigo-600",
      region: "Africa",
      coordinates: [8.6753, 9.0820]
    },
    {
      title: "Vietnam Money Transfer Guide",
      path: "/guides/send-money-to-vietnam",
      description: "Best options for sending money to Vietnam from the UK. Includes details on banking infrastructure, cash pickup networks, mobile wallets, and regional considerations.",
      currencyCode: "VND",
      color: "from-red-600 to-red-400",
      region: "Asia",
      coordinates: [108.2772, 14.0583]
    },
    {
      title: "Poland Money Transfer Guide",
      path: "/guides/send-money-to-poland",
      description: "Find the best ways to send money to Poland from the UK. Learn about złoty exchange rates, EU transfer regulations, and digital wallet options.",
      currencyCode: "PLN",
      color: "from-red-500 to-pink-600",
      region: "Europe",
      coordinates: [19.1451, 51.9194]
    },
    {
      title: "Romania Money Transfer Guide",
      path: "/guides/send-money-to-romania",
      description: "Best options for sending money to Romania, including digital transfers, cash pickup options, and banking preferences across different Romanian regions.",
      currencyCode: "RON",
      color: "from-yellow-500 to-amber-600",
      region: "Europe",
      coordinates: [24.9668, 45.9432]
    },
    {
      title: "China Money Transfer Guide",
      path: "/guides/send-money-to-china",
      description: "Navigate China's unique regulations and find the best providers for sending money to China. Learn about documentation requirements and regional considerations.",
      currencyCode: "CNY",
      color: "from-red-600 to-rose-600",
      region: "Asia",
      coordinates: [104.1954, 35.8617]
    },
    {
      title: "Morocco Money Transfer Guide",
      path: "/guides/send-money-to-morocco",
      description: "Navigate exchange controls, find the best providers, and understand the unique aspects of UK to Morocco transfers.",
      currencyCode: "MAD",
      color: "from-green-600 to-emerald-600",
      region: "Africa",
      coordinates: [-7.0926, 31.7917]
    },
    {
      title: "Canada Money Transfer Guide",
      path: "/guides/send-money-to-canada",
      description: "Find the best ways to send money to Canada from the UK. Compare providers, understand receiving options, and learn about exchange rates and fees.",
      currencyCode: "CAD",
      color: "from-red-500 to-red-600",
      region: "Americas",
      coordinates: [-106.3468, 56.1304]
    }
  ];
  
  // Menu categories and subcategories data structure
  const menuCategories = [
    {
      id: 'basics',
      title: 'Money Transfer Basics',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-blue-500 to-indigo-600',
      subcategories: [
        { id: 'getting-started', title: 'Getting Started with International Transfers', path: '/guides/getting-started' },
        { id: 'business-transfers', title: 'Business Transfers Guide', path: '/guides/business-transfers' },
        { id: 'transfer-fees', title: 'Transfer Fees Explained', path: '/guides/transfer-fees' },
        { id: 'exchange-rates', title: 'Understanding Exchange Rates', path: '/guides/exchange-rates' },
        { id: 'family-remittances', title: 'Sending Money to Family Abroad', path: '/guides/family-remittances' },
        { id: 'security-tips', title: 'Security Tips for Money Transfers', path: '/guides/security-tips' }
      ]
    },
    {
      id: 'countries',
      title: 'Country Specific Guides',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-green-500 to-teal-600',
      subcategories: [
        { id: 'asia', title: 'Asia', path: '/guides/regions/asia' },
        { id: 'europe', title: 'Europe', path: '/guides/regions/europe' },
        { id: 'americas', title: 'Americas', path: '/guides/regions/americas' },
        { id: 'africa', title: 'Africa', path: '/guides/regions/africa' },
        { id: 'oceania', title: 'Oceania', path: '/guides/regions/oceania' }
      ]
    },
    {
      id: 'value',
      title: 'Value of Transfer',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-amber-500 to-orange-600',
      subcategories: [
        { id: 'high-value', title: 'High Value Transfers', path: '/guides/high-value' },
        { id: 'mid-value', title: 'Mid-Range Transfers', path: '/guides/mid-value' },
        { id: 'low-value', title: 'Low Value Transfers', path: '/guides/low-value' },
        { id: 'micro', title: 'Micro Transfers', path: '/guides/micro' }
      ]
    },
    {
      id: 'purpose',
      title: 'Transfer Purpose',
      icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
      color: 'from-purple-500 to-pink-600',
      subcategories: [
        { id: 'property', title: 'Buying Property Abroad', path: '/guides/purpose/property' },
        { id: 'study', title: 'Studying Abroad', path: '/guides/purpose/study' },
        { id: 'family', title: 'Sending to Family', path: '/guides/purpose/family' },
        { id: 'nomad', title: 'Digital Nomads', path: '/guides/purpose/nomad' },
        { id: 'business', title: 'Business Purposes', path: '/guides/purpose/business' }
      ]
    },
    {
      id: 'frequency',
      title: 'Transfer Frequency',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'from-blue-600 to-cyan-600',
      subcategories: [
        { id: 'regular', title: 'Regular Transfers', path: '/guides/frequency/regular' },
        { id: 'periodic', title: 'Periodic Transfers', path: '/guides/frequency/periodic' },
        { id: 'one-time', title: 'One-Time Transfers', path: '/guides/frequency/one-time' },
        { id: 'occasional', title: 'Occasional Transfers', path: '/guides/frequency/occasional' }
      ]
    },
    {
      id: 'corridors',
      title: 'Key Corridors',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      color: 'from-red-500 to-orange-600',
      subcategories: [
        { id: 'uk-asia', title: 'UK to Asia', path: '/guides/corridors/uk-asia' },
        { id: 'us-latam', title: 'US to Latin America', path: '/guides/corridors/us-latam' },
        { id: 'eu-africa', title: 'Europe to Africa', path: '/guides/corridors/eu-africa' },
        { id: 'aus-pacific', title: 'Australia to Pacific', path: '/guides/corridors/aus-pacific' },
        { id: 'gulf-asia', title: 'Gulf to Asia', path: '/guides/corridors/gulf-asia' }
      ]
    },
    {
      id: 'criteria',
      title: 'Transfer by Criteria',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
      color: 'from-indigo-500 to-purple-600',
      subcategories: [
        { id: 'cost', title: 'Cost Optimizing', path: '/guides/criteria/cost' },
        { id: 'convenience', title: 'Convenience', path: '/guides/criteria/convenience' },
        { id: 'security', title: 'Security and Trust', path: '/guides/criteria/security' },
        { id: 'service', title: 'Service Quality', path: '/guides/criteria/service' }
      ]
    },
    {
      id: 'method',
      title: 'Transfer Method',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'from-teal-500 to-emerald-600',
      subcategories: [
        { id: 'digital-native', title: 'Digital Natives', path: '/guides/method/digital-native' },
        { id: 'digital-adapter', title: 'Digital Adapters', path: '/guides/method/digital-adapter' },
        { id: 'traditional', title: 'Traditional Users', path: '/guides/method/traditional' }
      ]
    }
  ];
  
  // Get country guides for a specific continent
  const getCountryGuidesForContinent = (continent) => {
    return countryGuides.filter(guide => guide.region === continent);
  };
  
  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    setActiveContinent(null);
  };

  // Toggle continent expansion
  const toggleContinent = (continentId) => {
    setActiveContinent(activeContinent === continentId ? null : continentId);
  };
  
  return (
    <section className="py-10 bg-indigo-50 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Explore Our Guide Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the information you need based on your specific transfer scenario and requirements
            </p>
          </div>
          
          {/* Responsive Grid of Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuCategories.map((category) => (
              <motion.div 
                key={category.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  onClick={() => toggleCategory(category.id)}
                  className={`bg-white cursor-pointer rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 h-[100px] flex items-center ${activeCategory === category.id ? 'ring-2 ring-indigo-400 shadow-lg' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${category.color} text-white shadow-md`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-left">{category.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeCategory === category.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* Subcategories dropdown */}
                <AnimatePresence>
                  {activeCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 relative"
                    >
                      <ul className="py-2">
                        {category.subcategories.map((subcategory) => (
                          <motion.li 
                            key={subcategory.id}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {category.id === 'countries' ? (
                              <div 
                                onClick={() => toggleContinent(subcategory.id)}
                                className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-left cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-left">{subcategory.title}</span>
                                  <motion.div
                                    animate={{ rotate: activeContinent === subcategory.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </motion.div>
                                </div>
                                {/* Country guides submenu */}
                                {activeContinent === subcategory.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2 ml-4 bg-gray-50 rounded-lg overflow-hidden"
                                  >
                                    <ul className="py-2">
                                      {getCountryGuidesForContinent(subcategory.title).map((guide) => (
                                        <motion.li
                                          key={guide.path}
                                          whileHover={{ x: 5 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <Link
                                            to={guide.path}
                                            className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-left"
                                          >
                                            <div className="flex items-center gap-2">
                                              <CurrencyFlag currency={guide.currencyCode} size="sm" />
                                              <span>{guide.title.replace(/Send Money to |Sending Money to |Money Transfer Guide|Guide|Complete Guide to |Remittance Guide/g, '').trim()}</span>
                                            </div>
                                          </Link>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <Link 
                                to={subcategory.path} 
                                className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-left"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-left">{subcategory.title}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10 10.586 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </Link>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* View All Guides Button */}
          <div className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-100 text-indigo-700 font-medium shadow-sm hover:shadow-md hover:bg-indigo-200 transition-all duration-300"
            >
              <span>Browse All Guides</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const CountryGuideSelector = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState('All');
  const [visibleGuides, setVisibleGuides] = React.useState(8);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  
  const regions = [
    { id: 'All', name: 'All Regions' },
    { id: 'Asia', name: 'Asia' },
    { id: 'Europe', name: 'Europe' },
    { id: 'Americas', name: 'Americas' },
    { id: 'Africa', name: 'Africa' }
  ];
  
  const countryGuides = [
    {
      title: "Complete Guide to Sending Money to India",
      path: "/guides/send-money-to-india",
      description: "Find the best providers, lowest fees, and fastest ways to send money to India. Information on receiving methods, regional banks, and mobile wallets.",
      currencyCode: "INR",
      color: "from-orange-500 to-amber-600",
      region: "Asia",
      coordinates: [78.9629, 20.5937]
    },
    {
      title: "Send Money to Bangladesh Guide",
      path: "/guides/send-money-to-bangladesh",
      description: "Best providers, receiving options, and regional considerations for sending money to Bangladesh. Includes details on the 2% government incentive and mobile financial services.",
      currencyCode: "BDT",
      color: "from-green-600 to-emerald-500",
      region: "Asia",
      coordinates: [90.3563, 23.6850]
    },
    {
      title: "Philippines Money Transfer Guide",
      path: "/guides/send-money-to-philippines",
      description: "How to support family back home in the Philippines with optimal remittance options. Compare bank transfers, cash pickup locations, and mobile wallet services.",
      currencyCode: "PHP",
      color: "from-blue-500 to-cyan-600",
      region: "Asia",
      coordinates: [121.7740, 12.8797]
    },
    {
      title: "Mexico Remittance Guide",
      path: "/guides/send-money-to-mexico",
      description: "Fastest and cheapest ways to send money to Mexico from the US. Includes envíos de dinero options, cash pickup locations, and bank transfer comparisons.",
      currencyCode: "MXN",
      color: "from-green-500 to-emerald-600",
      region: "Americas",
      coordinates: [-102.5528, 23.6345]
    },
    {
      title: "Pakistan Money Transfer Guide",
      path: "/guides/send-money-to-pakistan",
      description: "Best providers, lowest fees, and fastest ways to send money from the UK to Pakistan. Includes PRI benefits, bank deposits, and cash pickup options.",
      currencyCode: "PKR",
      color: "from-emerald-500 to-green-600",
      region: "Asia",
      coordinates: [69.3451, 30.3753]
    },
    {
      title: "Nigeria Money Transfer Guide",
      path: "/guides/send-money-to-nigeria",
      description: "Navigate Nigeria's unique financial landscape with our guide to exchange rates, cash pickup locations, mobile money options, and the Naira-4-Dollar scheme.",
      currencyCode: "NGN",
      color: "from-purple-500 to-indigo-600",
      region: "Africa",
      coordinates: [8.6753, 9.0820]
    },
    {
      title: "Vietnam Money Transfer Guide",
      path: "/guides/send-money-to-vietnam",
      description: "Best options for sending money to Vietnam from the UK. Includes details on banking infrastructure, cash pickup networks, mobile wallets, and regional considerations.",
      currencyCode: "VND",
      color: "from-red-600 to-red-400",
      region: "Asia",
      coordinates: [108.2772, 14.0583]
    },
    {
      title: "Poland Money Transfer Guide",
      path: "/guides/send-money-to-poland",
      description: "Find the best ways to send money to Poland from the UK. Learn about złoty exchange rates, EU transfer regulations, and digital wallet options.",
      currencyCode: "PLN",
      color: "from-red-500 to-pink-600",
      region: "Europe",
      coordinates: [19.1451, 51.9194]
    },
    {
      title: "Romania Money Transfer Guide",
      path: "/guides/send-money-to-romania",
      description: "Best options for sending money to Romania, including digital transfers, cash pickup options, and banking preferences across different Romanian regions.",
      currencyCode: "RON",
      color: "from-yellow-500 to-amber-600",
      region: "Europe",
      coordinates: [24.9668, 45.9432]
    },
    {
      title: "China Money Transfer Guide",
      path: "/guides/send-money-to-china",
      description: "Navigate China's unique regulations and find the best providers for sending money to China. Learn about documentation requirements and regional considerations.",
      currencyCode: "CNY",
      color: "from-red-600 to-rose-600",
      region: "Asia",
      coordinates: [104.1954, 35.8617]
    },
    {
      title: "Morocco Money Transfer Guide",
      path: "/guides/send-money-to-morocco",
      description: "Navigate exchange controls, find the best providers, and understand the unique aspects of UK to Morocco transfers.",
      currencyCode: "MAD",
      color: "from-green-600 to-emerald-600",
      region: "Africa",
      coordinates: [-7.0926, 31.7917]
    },
    {
      title: "Canada Money Transfer Guide",
      path: "/guides/send-money-to-canada",
      description: "Find the best ways to send money to Canada from the UK. Compare providers, understand receiving options, and learn about exchange rates and fees.",
      currencyCode: "CAD",
      color: "from-red-500 to-red-600",
      region: "Americas",
      coordinates: [-106.3468, 56.1304]
    }
  ];
  
  const searchFilteredGuides = searchTerm
    ? countryGuides.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const regionFilteredGuides = countryGuides.filter(guide => {
    return selectedRegion === 'All' || guide.region === selectedRegion;
  });
  
  const handleLoadMore = () => {
    setVisibleGuides(prev => Math.min(prev + 6, regionFilteredGuides.length));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow" ref={searchContainerRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search country guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {isSearchFocused && searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
              >
                {searchFilteredGuides.length > 0 ? (
                  searchFilteredGuides.map((guide) => (
                    <Link
                      key={guide.path}
                      to={guide.path}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                      onClick={() => {
                        setSearchTerm('');
                        setIsSearchFocused(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <CurrencyFlag currency={guide.currencyCode} size="sm" />
                        <span>{guide.title.replace(/Send Money to |Sending Money to |Money Transfer Guide|Guide|Complete Guide to |Remittance Guide/g, '').trim()}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No guides found matching "{searchTerm}".</div>
                )}
              </motion.div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 -mx-1 py-1 overflow-x-auto scrollbar-hide">
            {regions.map((region) => (
              <motion.button
                key={region.id}
                className={`mx-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === region.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedRegion(region.id);
                  setVisibleGuides(8);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {region.name}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Visual Country Flag Selector */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Popular Destinations</h3>
          <div className="flex flex-wrap gap-3">
            {countryGuides.map((guide) => (
              <Link
                key={guide.path}
                to={guide.path}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedRegion === 'All' || guide.region === selectedRegion
                    ? 'opacity-100 scale-100'
                    : 'opacity-50 scale-95'
                } hover:bg-indigo-50`}
              >
                <CurrencyFlag currency={guide.currencyCode} size="md" />
                <span className="hidden md:inline-block">{guide.title.replace(/Send Money to |Sending Money to |Money Transfer Guide|Guide|Complete Guide to |Remittance Guide/g, '').trim()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* World Map Visualization - Replace placeholder with react-simple-maps */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-4 overflow-hidden hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h3 className="text-lg font-medium mb-2 text-gray-700">Select a Country</h3> 
        <div className="relative h-[450px] w-full bg-indigo-50 rounded-lg overflow-hidden border border-indigo-100"> 
          <ComposableMap projection="geoMercator" className="w-full h-full">
            <ZoomableGroup center={[30, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E0E7FF"
                      stroke="#FFFFFF"
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#C7D2FE" },
                        pressed: { outline: "none", fill: "#A5B4FC" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {countryGuides.map((guide) => {
                const isActive = selectedRegion === 'All' || guide.region === selectedRegion;
                return (
                  <Marker key={guide.path} coordinates={guide.coordinates}>
                    <Link to={guide.path}>
                      <motion.g
                        initial={{ opacity: 0.6, scale: 0.8 }}
                        animate={{ 
                            opacity: isActive ? 1 : 0.5, 
                            scale: isActive ? 1 : 0.8 
                        }}
                        whileHover={{ scale: 1.5, opacity: 1, zIndex: 10 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            scale: { duration: 0.2 },
                            opacity: { duration: 0.2 }
                         }}
                        style={{ zIndex: isActive ? 1 : 0 }}
                      >
                        <foreignObject x={isActive ? -10 : -7} y={isActive ? -10 : -7} width={isActive ? 20 : 14} height={isActive ? 20 : 14}>
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CurrencyFlag currency={guide.currencyCode} size={isActive ? "sm" : "xs"} />
                          </div>
                        </foreignObject>
                      </motion.g>
                      <title>{guide.title}</title> 
                    </Link>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/50 px-1 rounded">
            Click on a marker to view the country guide.
          </div>
        </div>
      </motion.div>
      
      {/* Country Cards Grid with Animation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regionFilteredGuides.slice(0, visibleGuides).map((guide, index) => (
          <motion.div
            key={guide.path}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -5 }}
            layoutId={`card-${guide.currencyCode}`}
          >
            <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${guide.color}`}></div>
              
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${guide.color} text-white shadow-lg shadow-indigo-500/20`}>
                  <CurrencyFlag currency={guide.currencyCode} size="lg" />
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
      
      {/* Load More Button */}
      {regionFilteredGuides.length > visibleGuides && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleLoadMore}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-indigo-200 text-indigo-600 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Load more guides</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      )}
      
      {/* No Results Message */}
      {regionFilteredGuides.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No guides found for this region</h3>
          <p className="mt-1 text-gray-500">Try selecting a different region or 'All Regions'.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedRegion('All');
                setVisibleGuides(8);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Show All Regions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides; 