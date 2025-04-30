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
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50/30 to-white text-gray-900">
      {/* Hero Section with gradient background */}
      <section className="py-20 md:py-28 relative overflow-hidden border-b border-indigo-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
        <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h4 
              className="text-sm uppercase tracking-widest text-indigo-600 mb-4 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Got Questions?
            </motion.h4>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Questions</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Find answers to common questions about money transfers and our comparison service
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex justify-center"
            >
              <Link 
                to="/compare"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Comparing
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl"></div>
        <div className="absolute -top-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
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
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
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