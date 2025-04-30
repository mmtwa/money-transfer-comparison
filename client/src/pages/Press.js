import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import skylineBackground from '../assets/images/backgrounds/skyline.webp';

/**
 * Press page component showcasing press releases and media information
 */
const Press = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pressReleases = [
    {
      date: 'March 15, 2025',
      title: 'MyMoneyTransfers.com Saves UK Consumers £27 Million in Hidden Fees',
      summary: 'New data reveals the significant impact of transparent exchange rate comparisons on UK households sending money abroad.',
      content: `LONDON — MyMoneyTransfers.com, the leading comparison site for international money transfers, has released new data showing that UK consumers have saved an estimated £27 million in hidden fees over the past year by using their transparent comparison service.

The research highlights how UK residents, particularly those regularly sending money to family overseas, are often unaware of the markup on exchange rates applied by banks and traditional transfer services, resulting in significantly higher costs than advertised.

"The average UK household sending money abroad is losing approximately £150 annually through hidden exchange rate markups," said Jane Wilson, Chief Analyst at MyMoneyTransfers.com. "For families supporting relatives or paying for properties overseas, these hidden costs add up to substantial amounts over time."

The company's analysis shows that users who compare providers before transferring save an average of 3.7% per transaction, with particularly significant savings on transfers to countries like India, Nigeria, Pakistan, and the Philippines.`,
      outlet: 'This is Money',
      link: '#'
    },
    {
      date: 'April 28, 2025',
      title: 'Post-Brexit Money Transfer Habits: UK Expats Face New Challenges',
      summary: 'Study reveals changing patterns in how UK expats in Europe are managing their finances post-Brexit.',
      content: `LONDON — A new report from MyMoneyTransfers.com reveals that 78% of British expats living in EU countries have changed their money transfer strategies since Brexit, with many facing increased difficulties and costs when moving money between the UK and their country of residence.

The comprehensive study surveyed over 2,000 British nationals living across Spain, France, Portugal, and other EU destinations, finding that nearly two-thirds have experienced increased fees or reduced services from their traditional banking providers.

"What we're seeing is a significant shift toward specialized money transfer services and fintech solutions," explained Freddie Supple, CEO of MyMoneyTransfers.com. "Traditional banking channels have become more expensive and cumbersome for cross-border transactions since the UK left the EU banking framework."

The report indicates that expat retirees are particularly affected, with 81% reporting increased costs when transferring their UK pensions to EU bank accounts. This demographic is increasingly turning to digital comparison platforms to find the most cost-effective solutions.`,
      outlet: 'Telegraph Money',
      link: '#'
    },
    {
      date: 'April 30, 2025',
      title: 'MyMoneyTransfers.com Announces Upcoming Launch of Real-Time Exchange Rate Alert System',
      summary: 'Upcoming feature will help users save by timing their international transfers to capitalize on favorable exchange rates.',
      content: `LONDON — MyMoneyTransfers.com is announcing the upcoming launch of its innovative Exchange Rate Alert system, a new feature designed to help users maximize the value of their international money transfers by notifying them of favorable exchange rate movements.

The free service will allow users to set target exchange rates for specific currency pairs. When the desired rate is reached, users will receive instant notifications via email or SMS, enabling them to time their transfers to achieve maximum value.

"Currency markets can fluctuate significantly, even within a single day. These movements can mean the difference of hundreds of pounds on larger transfers," said Sarah Mitchell, Product Director at MyMoneyTransfers.com. "Our new alert system, launching very soon, will essentially put the power of a forex trading desk in the hands of everyday consumers."

Early testing indicates that users who time their transfers based on rate alerts could save an additional 2.3% on average compared to those who transfer immediately without considering rate movements.

The feature will have particular relevance for UK property owners abroad, businesses with international suppliers, and families supporting students studying overseas.`,
      outlet: 'Mail Money',
      link: '#'
    }
  ];

  return (
    <div className="flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={skylineBackground} 
            alt="Skyline background" 
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 to-purple-900/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex justify-center items-center min-h-[inherit]">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-black/40 rounded-2xl p-8 md:p-12 shadow-xl" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Press & Media
            </h1>
            <p className="text-xl md:text-2xl font-light text-indigo-100 mb-10">
              Latest news, press releases and media resources from MyMoneyTransfers.com
            </p>
            <motion.div
              className="inline-block" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-white text-lg md:text-xl italic">
                "Bringing transparency to international money transfers"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">Latest Updates</h2>
              <p className="text-3xl font-bold text-gray-900">Press Releases</p>
            </div>

            <div className="space-y-12">
              {pressReleases
                .filter(release => release.title !== 'MyMoneyTransfers.com Saves UK Consumers £27 Million in Hidden Fees')
                .map((release, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-indigo-50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {release.date}
                      </div>
                    </div>
                    <a href={release.link} className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                      Full Release →
                    </a>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 text-left">{release.title}</h3>
                  <p className="text-gray-700 font-medium mb-4 text-left">{release.summary}</p>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-left">
                    <p className="text-gray-700 whitespace-pre-line">{release.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Contacts Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-2">Get In Touch</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Media Contacts</h3>
              <p className="text-lg text-gray-700">For press inquiries, interview requests, or additional information.</p>
            </div>

            <motion.div
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden"
              whileHover={{ boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">Press & Media Team</h4>
                  <p className="text-gray-700 mb-2">Email: press@mymoneytransfers.com</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">Expert Commentary</h4>
                  <p className="text-gray-700 mb-4">
                    Our team of analysts and executives are available for expert commentary on:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 text-left">
                    <li>International money transfer trends</li>
                    <li>Currency market analysis</li>
                    <li>Fintech innovations</li>
                    <li>Consumer financial behavior</li>
                  </ul>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full opacity-70"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-50 rounded-full opacity-70"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Press Kit Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-10 -ml-10"></div>
              
              <div className="text-white z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Press Kit</h3>
                <p className="text-indigo-100 mb-0 max-w-md">
                  Download our press kit including logos, executive headshots, product screenshots and brand guidelines.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-6 py-3 rounded-full text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 mt-4 md:mt-0 z-10"
              >
                Download Press Kit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Press; 