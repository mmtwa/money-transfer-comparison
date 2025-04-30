import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import skylineBackground from '../assets/images/backgrounds/skyline.webp';

/**
 * Careers page component with a design inspired by modern UI/UX principles
 */
const Careers = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section 
        className="py-20 md:py-32 border-b border-gray-100 relative min-h-[80vh] flex items-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={skylineBackground} 
            alt="City skyline" 
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/80 to-purple-900/70"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight text-white leading-none text-center">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block"
              >Join Our</motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 block"
              >MISSION</motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="block relative"
              >
                TO TRANSFORM
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white"></span>
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-indigo-100 max-w-2xl mt-6 text-center mx-auto"
            >
              Help us revolutionise how people send money across borders
            </motion.p>
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
      
      {/* Our Culture Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-indigo-600 mb-6 font-semibold">Our Culture</h2>
            <p className="text-2xl md:text-4xl leading-tight font-light">
              We're building a team of <span className="font-medium relative inline-block">
                innovators
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-200"></span>
              </span> committed to making international money transfers 
              <span className="text-indigo-600 font-medium"> accessible and transparent to everyone</span>. 
              We're creative, irreverent and share a vision to do our best work possible.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Values Section with Cards */}
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
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">Our Values</h2>
              <p className="text-3xl font-bold text-gray-900">What drives us every day</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Transparency",
                  description: "We believe in being honest and open in everything we do, from how we build our products to how we communicate with our team.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "Innovation",
                  description: "We're constantly looking for new ways to improve our platform and create better experiences for our users.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: "User Focus",
                  description: "Our users are at the heart of everything we do. We're committed to understanding their needs and building products that make their lives better.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
      
      {/* Benefits Section */}
      <section className="py-16 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">Benefits</h2>
              <p className="text-3xl font-bold text-gray-900">What we offer</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Flexible Work Environment",
                  description: "Work from home or our modern offices with flexible hours that support your lifestyle."
                },
                {
                  title: "Continuous Learning",
                  description: "Access to courses, conferences, and learning resources to help you grow professionally."
                },
                {
                  title: "Competitive Compensation",
                  description: "Salary packages that recognize your contributions and experience."
                },
                {
                  title: "Health & Wellness",
                  description: "Comprehensive health benefits and wellness programs to keep you at your best."
                },
                {
                  title: "Team Events",
                  description: "Regular team-building activities, retreats, and social events to foster connection."
                },
                {
                  title: "Career Growth",
                  description: "Clear paths for advancement and mentorship to help you achieve your career goals."
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 p-6 rounded-xl hover:bg-indigo-50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* No Current Openings Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white/60 -z-10"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-lg border border-indigo-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">No Current Openings</h2>
              <p className="text-gray-700 text-lg mb-8">
                We're not actively hiring at the moment, but we're always interested in connecting with talented individuals who share our passion.
              </p>
              
              <h3 className="text-xl font-bold mb-4 text-indigo-600">Stay Connected</h3>
              <p className="text-gray-700 mb-6">
                Join our talent community to be the first to know about future opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="mailto:careers@mymoneytransfers.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Us Your Resume
                </motion.a>
                
                <motion.a 
                  href="https://www.linkedin.com/company/mymoneytransfers"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-600 font-medium px-6 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Follow Us on LinkedIn
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
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
              <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-semibold mb-4">FAQs</h2>
              <p className="text-3xl font-bold text-gray-900">Common Questions</p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "Where are your offices located?",
                  answer: "Our headquarters is in London, UK, with additional team members working remotely across Europe and Asia."
                },
                {
                  question: "What is your hiring process like?",
                  answer: "Our typical hiring process includes an initial application review, a skills assessment, 1-2 interviews, and a final team meeting. We aim to make decisions within 2-3 weeks."
                },
                {
                  question: "Do you offer internships or entry-level positions?",
                  answer: "We occasionally offer internships and entry-level roles, particularly in technology and marketing. Join our talent community to be notified when these opportunities arise."
                },
                {
                  question: "What skills and backgrounds do you value?",
                  answer: "We value diverse skills and backgrounds. Experience in fintech is helpful but not required. We prioritize problem-solving abilities, user empathy, and alignment with our mission."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl p-6 border border-indigo-100 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Join Our Journey CTA */}
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Join Our Journey</h2>
            <p className="text-xl mb-10 text-indigo-100">
              Even though we don't have open positions right now, we'd love to connect with passionate individuals who share our vision.
            </p>
            
            <motion.a 
              href="mailto:careers@mymoneytransfers.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
            >
              Get In Touch
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers; 