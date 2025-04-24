import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, useAnimate } from 'framer-motion';
import CurrencySelector from '../components/ui/CurrencySelector';
import Button from '../components/ui/Button';
import { currenciesList } from '../utils/currency';

/**
 * Search form container for currency transfer comparison
 */
const SearchForm = ({ onSearch, initialData }) => {
  // Format the number with commas and no decimal places (without currency symbol)
  const formatAmount = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const [fromCurrency, setFromCurrency] = useState(initialData?.fromCurrency || 'GBP');
  const [toCurrency, setToCurrency] = useState(initialData?.toCurrency || 'EUR');
  const [amount, setAmount] = useState(initialData?.amount || 1000);
  const [inputValue, setInputValue] = useState(formatAmount(initialData?.amount || 1000));
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // null, 'from', or 'to'
  const [isInitialFocus, setIsInitialFocus] = useState(false);
  const [isLongNumber, setIsLongNumber] = useState(false);
  const amountInputRef = useRef(null);
  
  // References for headline animations
  const [line1Ref, animate1] = useAnimate();
  const [line2Ref, animate2] = useAnimate();
  const [line3Ref, animate3] = useAnimate();
  
  // Run "bang" animation sequence on mount (with form loaded first)
  useEffect(() => {
    const animateHeadlines = async () => {
      // Ensure form elements are visible first
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Line 1 animation - quick bang effect
      await animate1(line1Ref.current, 
        { opacity: 1 }, 
        { duration: 0.1, ease: "circOut" }
      );
      
      // Quick pause between each bang
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Line 2 animation - quick bang effect
      await animate2(line2Ref.current, 
        { opacity: 1 }, 
        { duration: 0.1, ease: "circOut" }
      );
      
      // Quick pause between each bang
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Line 3 animation - quick bang effect 
      await animate3(line3Ref.current, 
        { opacity: 1 }, 
        { duration: 0.1, ease: "circOut" }
      );
    };
    
    animateHeadlines();
  }, [animate1, animate2, animate3]);

  // Update form when initialData changes (e.g., when using browser back button)
  useEffect(() => {
    if (initialData) {
      setFromCurrency(initialData.fromCurrency);
      setToCurrency(initialData.toCurrency);
      setAmount(initialData.amount);
      setInputValue(formatAmount(initialData.amount));
    }
  }, [initialData]);
  
  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const currency = currenciesList.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '';
  };
  
  // Update input value when currency changes
  const handleCurrencyChange = (currency) => {
    setFromCurrency(currency);
    // No need to update input value as the currency symbol is separate
  };
  
  const handleSearch = () => {
    setActiveDropdown(null); // Close any open dropdown
    setIsLoading(true);
    
    // Simulate API call with a short delay
    setTimeout(() => {
      onSearch({
        fromCurrency,
        toCurrency,
        amount: amount || 1000 // Default to 1000 if amount is empty
      });
      setIsLoading(false);
    }, 1000);
  };

  // Handle dropdown toggle - ensures only one dropdown is open at a time
  // Also toggles the current dropdown closed if clicked again
  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(prev => prev === dropdownId ? null : dropdownId);
  };

  // Handle amount field focus
  const handleAmountFocus = () => {
    // Only clear the input if it's the default value or empty
    if (inputValue === formatAmount(1000) || !inputValue) {
      setInputValue('');
      setIsInitialFocus(true);
    } else {
      // If the field already has a user-entered value, don't clear it
      setIsInitialFocus(false);
    }
    setActiveDropdown(null); // Close any open dropdown
  };

  // Handle amount field blur
  const handleAmountBlur = () => {
    setIsInitialFocus(false);
    if (!inputValue || inputValue === '') {
      // If empty, reset to default 1000
      setAmount(1000);
      setInputValue(formatAmount(1000));
    } else {
      // Get just the numbers from the input
      const numericValue = inputValue.replace(/[^0-9]/g, '');
      if (numericValue) {
        const numValue = Number(numericValue);
        setAmount(numValue);
        setInputValue(formatAmount(numValue));
      }
    }
  };
  
  // Handle keydown events for special key handling
  const handleKeyDown = (e) => {
    // If delete or backspace is pressed
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Get current cursor position and selection
      const cursorPosition = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      const hasSelection = cursorPosition !== selectionEnd;
      
      // Get current value and numeric representation
      const currentValue = e.target.value;
      const numericString = currentValue.replace(/[^0-9]/g, '');
      
      // If everything is selected or no numeric characters would remain after deletion
      if ((hasSelection && selectionEnd - cursorPosition === currentValue.length) || 
          (!hasSelection && numericString.length <= 1) ||
          (currentValue === '0')) {
        // Clear the field when deleting the last digit, the entire field is selected, or we're at 0
        e.preventDefault();
        setAmount('');
        setInputValue('');
        setIsInitialFocus(true);
        return;
      }
      
      // If there's a selection, let the default handler work
      if (hasSelection) return;
      
      // For backspace, we need to handle removing a character before the cursor
      if (e.key === 'Backspace' && cursorPosition > 0) {
        // If the character before cursor is a comma, move cursor back one more position
        if (currentValue[cursorPosition - 1] === ',') {
          e.preventDefault();
          const newCursorPos = cursorPosition - 2;
          setTimeout(() => {
            if (amountInputRef.current) {
              amountInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
              // Trigger a manual backspace at the new position
              const newValue = currentValue.substring(0, newCursorPos) + currentValue.substring(newCursorPos + 1);
              const syntheticEvent = {
                target: {
                  value: newValue,
                  selectionStart: newCursorPos
                }
              };
              handleAmountChange(syntheticEvent);
            }
          }, 0);
        }
      }
      
      // For delete, we need to handle removing a character after the cursor
      if (e.key === 'Delete' && cursorPosition < currentValue.length) {
        // Prevent default for all delete operations to handle them manually
        e.preventDefault();
        
        // If the character after cursor is a comma, skip over it
        if (currentValue[cursorPosition] === ',') {
          const newCursorPos = cursorPosition + 1;
          // New value is old value without the character after the new cursor position
          const newValue = currentValue.substring(0, newCursorPos) + 
                         (newCursorPos + 1 < currentValue.length ? currentValue.substring(newCursorPos + 1) : '');
          
          // Update the input value directly
          const numericValue = newValue.replace(/[^0-9]/g, '');
          if (numericValue) {
            const numValue = parseInt(numericValue, 10);
            
            setAmount(numValue);
            setInputValue(formatAmount(numValue));
            
            // Position cursor
            setTimeout(() => {
              if (amountInputRef.current) {
                amountInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
              }
            }, 0);
          }
        } else {
          // For a normal character, remove it and format result
          const newValue = currentValue.substring(0, cursorPosition) + 
                         (cursorPosition + 1 < currentValue.length ? currentValue.substring(cursorPosition + 1) : '');
          
          // Update the input value directly
          const numericValue = newValue.replace(/[^0-9]/g, '');
          if (numericValue) {
            const numValue = parseInt(numericValue, 10);
            
            setAmount(numValue);
            setInputValue(formatAmount(numValue));
            
            // Position cursor
            setTimeout(() => {
              if (amountInputRef.current) {
                amountInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
              }
            }, 0);
          } else {
            setAmount('');
            setInputValue('');
            setIsInitialFocus(true);
          }
        }
      }
    }
  };
  
  // Handle change in amount field
  const handleAmountChange = (e) => {
    // Get the raw input and cursor position
    const rawValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // If this is the initial focus after clicking, just set the raw value
    if (isInitialFocus) {
      // Strip non-numeric characters first
      const cleanValue = rawValue.replace(/[^0-9]/g, '');
      
      // For normal numeric input, just use the raw value (digits only)
      setInputValue(rawValue);
      
      // Only set amount if there are numbers
      if (cleanValue) {
        const numValue = parseInt(cleanValue, 10);
        setAmount(numValue);
        
        // If we're just typing a single digit (like 1, 2, etc.), don't format yet
        if (cleanValue.length === 1 && !isNaN(parseInt(cleanValue, 10))) {
          // Keep in initial focus mode to allow more digits
          return;
        }
        
        // If more than one digit, start formatting
        setIsInitialFocus(false);
      } else {
        setAmount('');
      }
      return;
    }
    
    // For all subsequent typing after initial focus
    
    // Detect if backspace or delete was used based on value length change
    const isDeleting = rawValue.length < inputValue.length;
    
    // Strip out currency symbols and commas to get the raw numeric value
    const numericString = rawValue.replace(/[^0-9]/g, '');
    
    // Skip if empty after removing non-numeric characters
    if (!numericString) {
      setAmount('');
      setInputValue('');
      setIsLongNumber(false);
      return;
    }
    
    // Parse as a number (always as integer)
    const numValue = parseInt(numericString, 10);
    
    if (!isNaN(numValue)) {
      setAmount(numValue);
      
      // Format with commas (no decimal places)
      const formattedValue = formatAmount(numValue);
      setInputValue(formattedValue);
      
      // Check if the number is long (more than 6 digits)
      const digitCount = numValue.toString().length;
      setIsLongNumber(digitCount > 6);
      
      // Keep cursor in appropriate position
      setTimeout(() => {
        if (amountInputRef.current) {
          // If backspace/delete was used, adjust cursor position to reflect deletion
          if (isDeleting) {
            // For backspace/delete, maintain the cursor at the current position
            amountInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            return;
          }
          
          // For normal typing, position cursor based on stripped value and formatted value
          const strippedBefore = rawValue.substring(0, cursorPosition).replace(/[^0-9]/g, '');
          let newPosition = formattedValue.length;
          
          if (strippedBefore.length > 0) {
            // Find position in formatted string that corresponds to the end of the stripped part
            let count = 0;
            for (let i = 0; i < formattedValue.length; i++) {
              if (/[0-9]/.test(formattedValue[i])) {
                count++;
                if (count === strippedBefore.length) {
                  newPosition = i + 1;
                  break;
                }
              }
            }
          }
          
          amountInputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <motion.div 
        className="bg-white rounded-3xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6 md:p-8">
          <h2 className="text-center mb-4">
            <div className="flex flex-col items-center mb-2">
              <motion.div
                ref={line1Ref}
                className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-transparent bg-clip-text overflow-hidden whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '5px', paddingRight: '5px' }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ 
                  opacity: [0, 0.7, 1], 
                  y: [-5, -2, 0],
                  scale: [1, 1.012, 1],
                  textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(104,117,245,0.25)", "0px 0px 0px rgba(0,0,0,0)"]
                }}
                transition={{ 
                  duration: 2.5,
                  ease: [0.215, 0.61, 0.355, 1], // Revised cubic bezier for ultra-smooth motion
                  times: [0, 0.5, 1]
                }}
              >
                Transfer more, pay less.
              </motion.div>
              
              <motion.div
                ref={line2Ref}
                className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-tight leading-tight mt-2 text-gray-700 overflow-hidden text-center"
                style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '30px', paddingRight: '30px' }}
                initial={{ opacity: 0 }}
              >
                Compare money transfers with us & never wonder again if you could have gotten a better deal.
              </motion.div>
              
              <motion.div
                ref={line3Ref}
                className="hidden"
                initial={{ opacity: 0 }}
              >
                
              </motion.div>
            </div>
            
          
            <motion.span 
              className="inline-block hidden  text-sm md:text-lg font-medium tracking-tight leading-tight bg-gradient-to-r from-indigo-800 via-purple-600 to-blue-600 text-transparent bg-clip-text" 
              style={{ fontFamily: 'Poppins, sans-serif' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3
              }}
              whileHover={{ scale: 1.05 }}
            >
              We earn from ads, not your money.
            </motion.span>
          </h2>
          
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-medium text-black-600 mb-2 text-left">You send</label>
            <div className="flex">
              <div className="relative w-2/5">
                <CurrencySelector 
                  selectedCurrency={fromCurrency}
                  onCurrencyChange={handleCurrencyChange}
                  isOpen={activeDropdown === 'from'}
                  onToggle={handleDropdownToggle}
                  id="from"
                />
              </div>
              <div className="relative w-3/5 ml-4 md:ml-8">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg md:text-xl">
                  {getCurrencySymbol(fromCurrency)}
                </div>
                <input
                  ref={amountInputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleAmountChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full border border-gray-500 bg-white-100 rounded-xl p-4 md:p-5 pl-10 focus:outline-none text-gray-800 font-medium text-lg md:text-xl text-right`}
                  inputMode="decimal"
                  placeholder="Enter amount"
                  onFocus={handleAmountFocus}
                  onBlur={handleAmountBlur}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-6 lg:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-medium text-black-600 mb-2 text-left">They receive</label>
            <CurrencySelector 
              selectedCurrency={toCurrency}
              onCurrencyChange={setToCurrency}
              isOpen={activeDropdown === 'to'}
              onToggle={handleDropdownToggle}
              id="to"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2 md:mr-3" />
                  Find the best rates
                </>
              )}
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-6 md:mt-6 text-xs md:text-xs text-center text-gray-900" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            We're funded by ad partners so we don't take any cut. This means we give you the best rates straight.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchForm; 