import React, { useEffect } from 'react';
import skylineBackground from '../assets/images/backgrounds/skyline.webp';
import heroVideo from '../assets/video/m1.mp4';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * About Us page component with a design inspired by modern UI/UX principles
 */
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
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
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
            <p className="text-2xl md:text-4xl leading-tight font-light">
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