import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * FAQ page component with enhanced UI/UX
 */
const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const toggleItem = (index) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };
  
  const faqItems = [
    {
      question: "How does the money transfer comparison work?",
      answer: "Our platform connects to multiple money transfer providers to get real-time exchange rates and fees. We display all options side by side so you can easily compare and choose the provider that offers the best value for your specific transfer."
    },
    {
      question: "Is it free to use the comparison service?",
      answer: "Yes, our comparison service is completely free to use. We're funded by relevant advertising partners only. Unlike other comparison sites, this means we don't have any conflict in the rates or providers we show."
    },
    {
      question: "How do you make money?",
      answer: "Unlike many comparison sites, we don't take commissions or referral fees from money transfer providers. This means we can show you genuinely unbiased results without favoring certain companies. Our business model is based entirely on advertising revenue. We display carefully selected ads from quality, relevant advertisers on our platform."
    },
    {
      question: "How do you determine which provider is best?",
      answer: "We rank providers based on the total amount the recipient will receive after all fees and exchange rate margins are applied. This gives you the clearest picture of which provider offers the best value for your specific transfer."
    },
    {
      question: "Do you show all available money transfer providers?",
      answer: "We cover most major money transfer providers, but we may not include every provider in the market. We regularly update our provider list to ensure comprehensive coverage."
    },
    {
      question: "What does Indicative mean?",
      answer: "When we show 'Indicative' rates, it means these are estimated rates based on current market conditions. The final rate you receive may vary slightly depending on the exact time of your transfer and the provider's specific terms. We always recommend checking the final rate with your chosen provider before completing the transaction."
    },
    {
      question: "How do you determine which provider is best?",
      answer: "We rank providers based on the total amount the recipient will receive after all fees and exchange rate margins are applied. This gives you the clearest picture of which provider offers the best value for your specific transfer."
    },
    {
      question: "Are the exchange rates shown guaranteed?",
      answer: "The exchange rates we display are pulled in real-time from our providers, but rates can fluctuate quickly. The final rate will be confirmed when you proceed to the provider's website to complete your transaction."
    },
    {
      question: "How do I actually make the transfer?",
      answer: "After comparing providers on our site, you'll click through to your chosen provider's website to complete the transaction. You'll need to register with the provider if you don't already have an account."
    },
    {
      question: "How long do international transfers take?",
      answer: "Transfer times vary by provider, destination country, payment method, and other factors. We show the estimated transfer time for each provider in our comparison results."
    },
    {
      question: "What information do I need to make an international transfer?",
      answer: "Generally, you'll need the recipient's full name, bank account details (including IBAN for many countries), and sometimes their address. Requirements can vary by provider and destination country."
    },
    {
      question: "Is my money safe when using these providers?",
      answer: "We only list regulated money transfer providers that comply with relevant financial regulations in the countries where they operate. Many providers also offer additional security measures like encryption and fraud monitoring."
    },
    {
      question: "What if something goes wrong with my transfer?",
      answer: "If you encounter issues with your transfer, you should contact the provider directly. Most providers have customer service teams that can help resolve problems. We also recommend checking the provider's terms and conditions regarding cancellations and refunds."
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Floating elements animation
  const floatingAnimation = {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0, -5, 0],
      transition: { 
        duration: 8, 
        repeat: Infinity, 
        repeatType: "reverse" 
      }
    }
  };

  // Pulse animation for trust badges
  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50/30 to-white text-gray-900">
      {/* Hero Section with advanced design elements */}
      <section className="pt-14 pb-20 md:pt-20 md:pb-32 relative overflow-hidden">
        {/* Glass morphism top bar */}
        <div className="absolute top-0 left-0 right-0 h-12 md:h-16 backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20 z-10"></div>
        
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 z-0"></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light z-0" 
             style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' x2=\'100%25\' y1=\'0\' y2=\'100%25\'%3E%3Cstop offset=\'0\' stop-color=\'%234F46E5\' stop-opacity=\'0.1\'/%3E%3Cstop offset=\'0.5\' stop-color=\'%23C084FC\' stop-opacity=\'0.1\'/%3E%3Cstop offset=\'1\' stop-color=\'%23EC4899\' stop-opacity=\'0.1\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=\'url(%23a)\' width=\'100%25\' height=\'100%25\'/%3E%3C/svg%3E")',
                  backgroundSize: 'cover'}}></div>
        
        {/* Floating decorative elements - hidden on smaller screens */}
        <motion.div 
          className="absolute left-[10%] top-[25%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-indigo-300/20 to-indigo-400/20 blur-xl z-0 hidden sm:block"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        ></motion.div>
        <motion.div 
          className="absolute right-[15%] top-[20%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-purple-300/20 to-purple-400/20 blur-xl z-0 hidden sm:block"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        ></motion.div>
        <motion.div 
          className="absolute left-[20%] bottom-[15%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-blue-300/20 to-blue-400/20 blur-xl z-0 hidden sm:block"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        ></motion.div>
        
        {/* Subtle morphing shapes - simplify on mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute top-0 left-0 opacity-10 sm:opacity-20 z-0" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M0,0 C40,40 60,40 100,0 V100 H0 V0 Z" fill="url(#grad1)" />
          </svg>
          <svg className="absolute bottom-0 right-0 opacity-10 sm:opacity-20 z-0" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M100,100 C60,60 40,60 0,100 V0 H100 V100 Z" fill="url(#grad2)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Responsive hero layout */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Content column */}
              <motion.div 
                className="w-full md:w-3/5 text-center md:text-left md:pr-4 lg:pr-8"
                initial={{ opacity: 0, x: 0, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Subtle badge */}
                <motion.div 
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 backdrop-blur-sm border border-indigo-200/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-xs sm:text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      Support Center
                    </span>
                  </span>
                </motion.div>
                
                {/* Main heading with modern typography */}
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  We're Here to <span className="relative">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient-x">Help</span>
                    <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-indigo-200/30 rounded-full blur-sm"></span>
                  </span>
                </motion.h1>
                
                {/* Warm, trustworthy description */}
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-gray-700 mb-5 sm:mb-8 leading-relaxed max-w-xl mx-auto md:mx-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Our transparent money transfer comparison helps you send funds with confidence. We've answered your most common questions to make your experience seamless and worry-free.
                </motion.p>
                
                {/* Trust indicators - row on mobile, wrapped on small screens */}
                <motion.div 
                  className="flex flex-row flex-wrap justify-center md:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.div 
                    className="flex items-center"
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center mr-2 sm:mr-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-medium text-gray-900">100% Transparent</span>
                      <span className="block text-2xs sm:text-xs text-gray-500">No hidden fees</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center"
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-medium text-gray-900">Verified Providers</span>
                      <span className="block text-2xs sm:text-xs text-gray-500">Trusted & secure</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* CTA buttons - stack on mobile, side by side on larger screens */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                  <Link 
                    to="/"
                    className="relative inline-flex items-center justify-center group w-full sm:w-auto"
                  >
                    <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-80 group-hover:opacity-100 blur-sm transition-all duration-300 group-hover:blur"></span>
                    <span className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto">
                      Start Comparing
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                  
                  <motion.button
                    className="inline-flex items-center justify-center gap-2 text-indigo-600 font-medium px-4 py-3 sm:px-6 sm:py-4 hover:text-indigo-800 transition-colors duration-300 bg-white/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none rounded-full sm:rounded-none"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Watch How It Works
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
              
              {/* Right visual column - improved mobile display */}
              <motion.div 
                className="w-full md:w-2/5 mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="relative max-w-xs sm:max-w-sm mx-auto md:max-w-none">
                  {/* Main illustration container */}
                  <div className="relative z-10 bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100">
                    {/* FAQ illustration elements */}
                    <div className="relative h-[240px] sm:h-[300px] flex items-center justify-center">
                      <motion.div 
                        className="absolute top-0 left-0 right-0 h-10 sm:h-12 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm flex items-center px-3 sm:px-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 mr-1.5 sm:mr-2"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 mr-1.5 sm:mr-2"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 mr-1.5 sm:mr-2"></div>
                        <div className="flex-grow ml-1 sm:ml-2">
                          <div className="h-2.5 sm:h-3 w-1/3 bg-indigo-200/50 rounded-full"></div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 h-12 sm:h-14 rounded-lg bg-indigo-50 shadow-sm flex items-center px-3 sm:px-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <div className="flex-grow">
                          <div className="h-2.5 sm:h-3 w-3/4 bg-indigo-200/70 rounded-full"></div>
                        </div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-200 flex items-center justify-center ml-2">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute top-32 sm:top-40 left-3 right-3 sm:left-4 sm:right-4 h-12 sm:h-14 rounded-lg bg-purple-50 shadow-sm flex items-center px-3 sm:px-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        <div className="flex-grow">
                          <div className="h-2.5 sm:h-3 w-2/3 bg-purple-200/70 rounded-full"></div>
                        </div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-200 flex items-center justify-center ml-2">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute top-48 sm:top-60 left-3 right-3 sm:left-4 sm:right-4 h-12 sm:h-14 rounded-lg bg-blue-50 shadow-sm flex items-center px-3 sm:px-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                      >
                        <div className="flex-grow">
                          <div className="h-2.5 sm:h-3 w-5/6 bg-blue-200/70 rounded-full"></div>
                        </div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-200 flex items-center justify-center ml-2">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Background decoration elements - scaled for mobile */}
                  <div className="absolute -top-3 -left-3 -right-3 -bottom-3 sm:-top-4 sm:-left-4 sm:-right-4 sm:-bottom-4 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-xl sm:rounded-2xl -z-10 transform -rotate-2"></div>
                  <div className="absolute -top-1.5 -left-1.5 -right-1.5 -bottom-1.5 sm:-top-2 sm:-left-2 sm:-right-2 sm:-bottom-2 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-xl sm:rounded-2xl -z-20 transform rotate-1"></div>
                  
                  {/* Accent elements - smaller on mobile */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-lg sm:blur-xl -z-30"></div>
                </div>
              </motion.div>
            </div>
            
            {/* Wave divider element - responsive adjustments */}
            <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 overflow-hidden z-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto translate-y-1/3 sm:translate-y-1/2">
                <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,144C672,171,768,213,864,213.3C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content with animated accordions */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-5">
              {faqItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-200 overflow-hidden transition-all duration-300">
                    <motion.button
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
                      onClick={() => toggleItem(index)}
                      whileHover={{ backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{item.question}</span>
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600 flex-shrink-0"
                        animate={{ rotate: openItem === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </motion.div>
                    </motion.button>
                    
                    <motion.div
                      className="overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ 
                        height: openItem === index ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 py-5 bg-indigo-50/50 border-t border-indigo-100">
                        <p className="text-gray-700 leading-relaxed text-left">{item.answer}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl relative overflow-hidden border border-indigo-100 shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Still have questions?</h3>
                  <p className="text-gray-700 mb-6">Our team is here to help with any other questions you might have.</p>
                  <Link 
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 font-medium px-6 py-3 rounded-full shadow-sm transition-all duration-300 border border-indigo-100"
                  >
                    Contact Us
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full"></div>
                <div className="absolute -left-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 