import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import CurrencyFlag from './CurrencyFlag';

/**
 * TransitionLoader component - Provides a seamless transition animation
 * between the search form and results view
 */
const TransitionLoader = ({ 
  isVisible, 
  message = "Finding the best rates",
  fromCurrency,
  toCurrency,
  amount,
  onAnimationComplete,
  isReturningToSearch = false
}) => {
  // Format numbers with commas
  const formatAmount = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Custom messages for when returning to search
  const statusTexts = isReturningToSearch 
    ? ["Returning to search...", "Updating form...", "Loading search options...", "Almost there...", "Ready!"]
    : ["Checking rates...", "Comparing providers...", "Finding best deals...", "Calculating fees...", "Almost there..."];

  // Custom main message
  const mainMessage = isReturningToSearch 
    ? "Returning to search" 
    : message;

  useEffect(() => {
    // Once animation completes, notify parent component
    if (isVisible) {
      // Allow a bit more time for the animation to be visible (2.8 seconds)
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glass effect background with site colors */}
          <motion.div 
            className="absolute inset-0 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(224, 231, 255, 0.9) 50%, rgba(199, 210, 254, 0.85) 100%)',
              boxShadow: 'inset 0 0 100px rgba(99, 102, 241, 0.1)'
            }}
          />
          
          {/* Subtle animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              background: [
                'linear-gradient(60deg, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.1) 100%)',
                'linear-gradient(60deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.3) 100%)',
                'linear-gradient(60deg, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.1) 100%)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-indigo-200/30"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6">
            {/* Main content container */}
            <motion.div 
              className="relative bg-white/80 rounded-3xl p-7 sm:p-8 shadow-xl border border-indigo-100/50 backdrop-blur-sm overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 via-white/90 to-blue-50/80"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative z-10">
                {/* Animated circles */}
                <motion.div 
                  className="relative w-28 h-28 mx-auto mb-7"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Outer rotating circle */}
                  <motion.div 
                    className="absolute inset-0 border-4 border-indigo-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Middle pulsing circle */}
                  <motion.div 
                    className="absolute inset-4 border-4 border-indigo-400 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Inner rotating circle */}
                  <motion.div 
                    className="absolute inset-8 border-4 border-indigo-500 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Center dot with glow */}
                  <motion.div 
                    className="absolute inset-[35%] bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                
                {/* Search icon */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
                >
                  <Search size={24} className="text-white" />
                </motion.div>
                
                {/* Text content */}
                <div className="text-center space-y-5">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 
                      className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-700 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {mainMessage}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
                      {isReturningToSearch 
                        ? "Taking you back to update your search options." 
                        : <span>We're comparing <span className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">multiple providers</span> to find you the best deal for your transfer.</span>}
                    </p>
                  </motion.div>
                  
                  {/* Animated progress indicators */}
                  <motion.div 
                    className="flex justify-center items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Progress bar */}
                  <motion.div 
                    className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ 
                        background: 'linear-gradient(to right, #4f46e5, #818cf8, #6366f1)',
                        boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)'
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  
                  {/* Status text that changes */}
                  <motion.div
                    className="text-sm text-gray-500 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ opacity: [1, 0, 0, 0, 0, 1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      {statusTexts[0]}
                    </motion.div>
                    <motion.div
                      className="absolute left-0 right-0"
                      animate={{ opacity: [0, 1, 0, 0, 0, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    >
                      {statusTexts[1]}
                    </motion.div>
                    <motion.div
                      className="absolute left-0 right-0"
                      animate={{ opacity: [0, 0, 1, 0, 0, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                    >
                      {statusTexts[2]}
                    </motion.div>
                    <motion.div
                      className="absolute left-0 right-0"
                      animate={{ opacity: [0, 0, 0, 1, 0, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 3 }}
                    >
                      {statusTexts[3]}
                    </motion.div>
                    <motion.div
                      className="absolute left-0 right-0"
                      animate={{ opacity: [0, 0, 0, 0, 1, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 4 }}
                    >
                      {statusTexts[4]}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionLoader; 