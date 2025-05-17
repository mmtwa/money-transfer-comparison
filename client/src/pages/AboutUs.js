import React, { useEffect } from 'react';
import skylineBackground from '../assets/images/backgrounds/skyline.webp';
import heroVideo from '../assets/video/m1.mp4';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * About Us page component with a design inspired by modern UI/UX principles
 */

import SEO from '../components/SEO';
const AboutUs = () => {
  // Navigate back to home page
  const handleNavigateHome = () => {
    window.history.pushState(
      { page: 'home' }, 
      'Home', 
      '/'
    );
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    // Smooth scroll behavior for the entire page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="flex flex-col bg-white text-gray-900 overflow-hidden">
      <SEO 
        title="About Us | MyMoneyTransfers"
        description=" About Us - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/about-us"
      />
      {/* Our Brand Statement - Animated with visual elements */}
      <section className="py-16 md:py-28 relative overflow-hidden bg-gradient-to-br from-white via-white to-indigo-50/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-indigo-100/50"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-100/50"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-indigo-50/70"></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full bg-purple-50/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-2">Our Brand</h2>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 mt-6"
              >
                We're Different By Design
              </motion.h3>
            </div>
            
            <motion.div 
              className="mb-16 bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl border border-indigo-100 hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-8 text-left">
                For international money senders who want truly unbiased advice, <span className="text-indigo-600 font-medium">mymoneytransfers.com</span> is the only genuinely independent comparison service that <span className="relative inline-block font-medium">
                  never takes provider commissions
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-200 hidden md:block"></span>
                </span>, ensuring you always get recommendations based on your actual needs, not what pays us the most.
              </p>
            </motion.div>
            
            {/* Featured Independence Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Browser URL Visualization */}
                <div className="w-full lg:w-3/5 relative">
                  <motion.div 
                    className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Browser chrome */}
                    <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      
                      {/* URL bar showing referral code */}
                      <div className="ml-4 flex-1 bg-white rounded-md border border-gray-300 py-1 px-3 flex items-center relative overflow-hidden group">
                        <div className="w-full overflow-hidden">
                          <motion.div 
                            className="text-xs md:text-sm font-mono text-gray-600 whitespace-nowrap"
                            initial={{ x: 0 }}
                            animate={{ x: [0, -120, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 8,
                              ease: "linear"
                            }}
                          >
                            <span className="hidden md:inline">https://competitor-site.com/send-money</span>
                            <span className="md:hidden">competitor-site.com/send-money</span>
                            <span className="text-red-500 font-semibold">?affiliate=<span className="text-red-500 font-semibold">REF123456789</span></span>
                            <span className="hidden md:inline">&utm_source=<span className="text-red-500 font-semibold">affiliate</span>&utm_medium=<span className="text-red-500 font-semibold">partner</span>&utm_campaign=<span className="text-red-500 font-semibold">money-transfer</span>&commission=<span className="text-red-500 font-semibold">15percent</span></span>
                          </motion.div>
                        </div>
                        
                        {/* Red cross overlay that animates in */}
                        <motion.div 
                          className="absolute inset-0 bg-red-500/10 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Content area showing affiliate banners crossed out */}
                    <div className="p-4 bg-gray-50 h-52 relative">
                      <div className="absolute inset-0 p-4 flex flex-col gap-4">
                        <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center px-4">
                          <span className="text-white font-bold text-lg">HIDDEN REFERRAL ID URL</span>
                        </div>
                        <div className="h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-md flex items-center justify-center px-4">
                          <span className="text-white font-bold text-lg">SPONSORED RECOMMENDATION</span>
                        </div>
                      </div>
                      
                      {/* No entry symbol overlay as rubber stamp */}
                      <div className="absolute inset-0">
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          whileInView={{ scale: 1, rotate: -15 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8, duration: 0.7, type: "spring", bounce: 0.4 }}
                          className="absolute left-6 top-1/2 -translate-y-1/2 origin-center" style={{ transform: 'rotate(-15deg)' }}>
                          <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-base font-bold text-red-700 bg-white px-2 py-0.5 rounded transform -rotate-15 shadow-md">NOT ON OUR SITE</span>
                            </div>
                            <div className="absolute -top-2 -left-2 w-3 h-3 bg-red-600 rounded-full"></div>
                            <div className="absolute -bottom-1 left-3 w-2 h-2 bg-red-600 rounded-full"></div>
                            <div className="absolute top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                            <div className="absolute -bottom-2 -right-1 w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-red-600 rounded-full"></div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Feature Highlight */}
                <div className="w-full lg:w-2/5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-indigo-600 rounded-xl p-8 text-white shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-700 rounded-full translate-y-1/3 -translate-x-1/3 opacity-30"></div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-left">Absolute Independence</h3>
                    <p className="text-indigo-100 text-lg mb-6 text-left">
                      We <span className="font-bold underline decoration-2 decoration-white underline-offset-4">never</span> use affiliate links, hidden referral codes, or accept commission-based recommendations. Our advice is truly independent.
                    </p>
                    
                    <ul className="space-y-3 text-left">
                      {[
                        "No affiliate commissions influencing our recommendations",
                        "No hidden referral codes in our links",
                        "No third-party kickbacks for featured listings",
                        "100% focused on finding you the best rates"
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                          className="flex items-start gap-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Transparency",
                  description: "Clear explanation of how all providers make money, including hidden exchange rate markups",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Comprehensive Coverage",
                  description: "Include all providers regardless of partnership status, even those who don't offer affiliate programs",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  )
                },
                {
                  title: "True Cost Calculator",
                  description: "Advanced tools showing actual costs inclusive of all fees and exchange rate differences",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "Premium Experience",
                  description: "Clean interface focused on user needs rather than affiliate conversion",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.15)" }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-50 hover:border-indigo-200 transition-all duration-300 flex flex-col items-start h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 text-left">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-left">{item.description}</p>
                  <div className="mt-4 h-1 w-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="relative inline-flex items-center">
                <span className="h-px w-8 bg-indigo-300 mr-4"></span>
                <span className="text-indigo-700 font-medium">
                  <span className="block md:inline">Truly Independent.</span>
                  <span className="block md:inline">Transparently Better.</span>
                </span>
                <span className="h-px w-8 bg-indigo-300 ml-4"></span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement with animated reveal */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-indigo-600 mb-6 font-semibold">Our Mission</h2>
            <p className="text-2xl md:text-4xl leading-tight font-light text-left">
              At mymoneytransfers.com, we believe <span className="font-medium relative inline-block">
                everyone deserves access 
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-200"></span>
              </span> to fair, transparent, 
              and <span className="text-indigo-600 font-medium">affordable</span> international money transfer services. 
              Our mission is simple: to help you make 
              informed decisions when sending money abroad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hero Statement with Video background */}
      <section 
        className="py-20 md:py-32 border-b border-gray-100 relative min-h-[90vh] flex items-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-10 tracking-tight text-white leading-none">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block"
              >We</motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 block"
              >EMPOWER</motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="block"
              >YOUR</motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="block relative"
              >
                TRANSFERS
                <span className="absolute -bottom-2 left-0 w-32 h-1 bg-indigo-500"></span>
              </motion.span>
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Link 
                to="/faq"
                className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Discover How
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>
      
      {/* Who We Serve - Visual typography section with animated cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/20 -z-10"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-7xl font-bold text-indigo-600/20 uppercase tracking-tighter mb-2">WHO WE SERVE</h2>
              <p className="text-xl text-gray-600 max-w-lg mx-auto">Helping diverse groups navigate international money transfers with confidence</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                "FAMILIES", "STUDENTS", "BUSINESSES", 
                "TRAVELLERS", "EX PATS", "WORKERS"
              ].map((item, index) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                  className="relative overflow-hidden rounded-xl bg-white border border-indigo-100 shadow-sm p-6 flex items-center justify-center group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{item}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How we do it - With parallax effect */}
      <section className="py-16 md:py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-12 text-center">How we do it</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Real-time Comparisons For <span className="text-indigo-600">Real Savings</span></h3>
                <p className="text-lg leading-relaxed mb-6 text-gray-700">
                  We aggregate data from leading money transfer providers and display real-time exchange rates and fees,
                  making it easy to compare and find the best deal for your transfer.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Our platform covers a wide range of currencies and countries, ensuring you can find the 
                  best provider no matter where you're sending money to or from.
                </p>
                
                <motion.div 
                  className="mt-8 inline-flex items-center gap-2 text-indigo-600 font-medium group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/faq">
                    <span>Learn more about our methodology</span>
                    <span className="h-px w-10 bg-indigo-600 transform transition-all duration-300 group-hover:w-14"></span>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-10 h-80 overflow-hidden shadow-lg">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full"></div>
                  <div className="absolute -left-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full"></div>
                  
                  <motion.div 
                    className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-white/40"
                    whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.25)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="font-medium text-gray-800">USD → EUR</span>
                      </div>
                      <span className="text-sm text-gray-500">Live rates</span>
                    </div>
                    <div className="space-y-3">
                      {["Provider A: 0.9345 €", "Provider B: 0.9250 €", "Provider C: 0.9421 €"].map((rate, i) => (
                        <div key={i} className={`flex items-center justify-between p-2 rounded ${i === 2 ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                          <span className={i === 2 ? 'font-medium text-indigo-700' : 'text-gray-700'}>{rate}</span>
                          {i === 2 && <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">Best Rate</span>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* What We Do Section - Card Grid */}
      <section className="py-16 md:py-28 bg-gradient-to-b from-white to-indigo-50/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">What We Do</h2>
              <p className="text-3xl font-bold text-gray-900">Empowering your financial decisions</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  title: "Unbiased Recommendations",
                  description: "We provide transparent, unbiased comparisons based on actual exchange rates, fees, and transfer speeds, helping you find the provider that truly offers the best value.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: "Educational Resources",
                  description: "We provide guides and resources to help you understand the money transfer market, enabling you to make informed decisions beyond just comparing rates.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Global Coverage",
                  description: "Our platform covers a wide range of currencies and countries, ensuring you can find the best provider no matter where you're sending money to or from.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: "Real-Time Updates",
                  description: "We provide up-to-the-minute exchange rates and fee information, ensuring you always have the most current data to make your decision.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story Section with animated border */}
      <section className="py-16 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-2">Why MMT?</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h3>
            </div>
            
            <motion.div 
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden"
              whileHover={{ boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
              
              <div className="space-y-6 relative z-10">
                <p className="text-lg leading-relaxed text-gray-700">
                  mymoneytransfers.com was founded by a team of fintech enthusiasts who experienced 
                  firsthand the challenges of sending money internationally - from high fees and poor 
                  exchange rates to confusing processes and lack of transparency.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  What started as a simple spreadsheet comparing a few providers for personal use has evolved 
                  into a comprehensive platform used by thousands of people around the world to save money 
                  on their international transfers.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Our commitment to transparency, accuracy, and user-centered design has made us a trusted 
                  resource in the money transfer space, and we continue to innovate and improve our platform 
                  to better serve your needs.
                </p>
              </div>
              
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full opacity-70"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-50 rounded-full opacity-70"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section with gradient background */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Find the Best Rate?</h2>
            <p className="text-xl mb-10 text-indigo-100">Compare providers now and start saving on your international money transfers.</p>
            
            <motion.button 
              onClick={handleNavigateHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
            >
              Compare Rates
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 