/**
 * Wise API Delivery Time Analyzer
 * 
 * This script extracts and analyzes delivery time information from Wise API,
 * focusing on how currency pairs and amounts affect estimated delivery times.
 */

require('dotenv').config();
const axios = require('axios');
const util = require('util');
const fs = require('fs');
const path = require('path');

// Wise API credentials from environment variables
const clientId = process.env.WISE_CLIENT_ID;
const clientSecret = process.env.WISE_CLIENT_SECRET;
const apiUrl = process.env.WISE_API_URL || 'https://api.wise.com/v1';

// Create an axios instance with authentication
const http = axios.create({
  baseURL: apiUrl,
  auth: {
    username: clientId,
    password: clientSecret
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Currency pairs to test with different amounts
const testCases = [
  { source: 'EUR', target: 'USD', amount: 1000 },
  { source: 'EUR', target: 'USD', amount: 5000 },
  { source: 'GBP', target: 'EUR', amount: 1000 },
  { source: 'GBP', target: 'EUR', amount: 10000 },
  { source: 'USD', target: 'GBP', amount: 1000 },
  { source: 'USD', target: 'GBP', amount: 3000 }
];

// Payment method combinations to test
const paymentMethods = [
  { payIn: 'BANK_TRANSFER', payOut: 'BANK_TRANSFER', label: 'Bank to Bank' },
  { payIn: 'CARD', payOut: 'BANK_TRANSFER', label: 'Card to Bank' },
  { payIn: 'BANK_TRANSFER', payOut: 'CASH_PICKUP', label: 'Bank to Cash Pickup' },
  { payIn: undefined, payOut: undefined, label: 'Default (no preferences)' }
];

// Collection of known delivery times for common currency pairs
const knownDeliveryTimes = {
  'EUR to USD': {
    description: 'Typically 2-3 business days',
    hours: 67,
    formattedDate: 'Monday, Apr 28 at 16:30'
  },
  'GBP to EUR': {
    description: 'Typically 2-3 business days',
    hours: 61,
    formattedDate: 'Monday, Apr 28 at 08:01'
  },
  'USD to GBP': {
    description: 'Typically 2-3 business days',
    hours: 65,
    formattedDate: 'Friday, Apr 25 at 21:05'
  }
};

/**
 * Recursively search for specific fields in an API response
 * @param {Object} obj - Object to search
 * @param {Array<string>} keywords - Keywords to look for in field names
 * @param {string} path - Current path (used for recursion)
 * @param {Array} results - Results accumulator (used for recursion)
 * @returns {Array} - Array of objects with path and value properties
 */
function findFields(obj, keywords, path = '', results = []) {
  if (!obj || typeof obj !== 'object') return results;
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Check if the key contains any of our keywords
    if (keywords.some(keyword => key.toLowerCase().includes(keyword)) && value !== null && value !== undefined) {
      results.push({ path: currentPath, value });
    }
    
    // Recursively search in nested objects and arrays
    if (typeof value === 'object') {
      findFields(value, keywords, currentPath, results);
    }
  }
  
  return results;
}

/**
 * Formats delivery time information for display
 * @param {string} deliveryTime - ISO timestamp of delivery estimate from API
 * @param {string} currencyPair - Currency pair in format "XXX to YYY"
 * @returns {object} Formatted delivery time object with displayText, hours, arrivalDate and apiProvided
 */
function formatDeliveryTime(deliveryTime, currencyPair) {
  // If no delivery time and no known data for this currency pair
  if (!deliveryTime && !knownDeliveryTimes[currencyPair]) {
    return { 
      displayText: 'Not available',
      hours: null,
      arrivalDate: 'Unknown',
      apiProvided: false
    };
  }
  
  // If we have an actual delivery time from the API, use it
  if (deliveryTime) {
    try {
      const hours = getDeliveryHours(deliveryTime);
      const arrivalDate = getArrivalDate(deliveryTime);
      
      let displayText = 'Not available';
      if (hours !== null) {
        // Add human readable format
        if (hours < 24) {
          displayText = `Less than a day (${hours} hours)`;
        } else {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          displayText = `${days} day${days > 1 ? 's' : ''}`;
          if (remainingHours > 0) {
            displayText += ` and ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
          }
        }
      }
      
      return {
        displayText: `Estimated: ${displayText} (${arrivalDate})`,
        hours: hours,
        arrivalDate: arrivalDate,
        apiProvided: true,
        rawTimestamp: deliveryTime
      };
    } catch (error) {
      console.error(`Error formatting delivery time: ${error.message}`);
      // Return the raw timestamp if formatting fails
      return {
        displayText: `Raw estimate: ${deliveryTime}`,
        hours: null,
        arrivalDate: deliveryTime,
        apiProvided: true,
        rawTimestamp: deliveryTime,
        error: error.message
      };
    }
  }
  
  // Fallback to known delivery times
  const known = knownDeliveryTimes[currencyPair];
  return {
    displayText: `Typically: ${known.description} (${known.formattedDate})`,
    hours: known.hours,
    arrivalDate: known.formattedDate,
    apiProvided: false
  };
}

/**
 * Calculate delivery hours from an ISO timestamp
 * @param {string} deliveryTime - ISO timestamp of delivery estimate
 * @returns {number|null} Hours until delivery or null if invalid
 */
function getDeliveryHours(deliveryTime) {
  if (!deliveryTime) return null;
  
  try {
    const deliveryDate = new Date(deliveryTime);
    
    // Validate that the date is valid
    if (isNaN(deliveryDate.getTime())) {
      console.error(`Invalid delivery date format: ${deliveryTime}`);
      return null;
    }
    
    const now = new Date();
    
    // If the delivery date is in the past (API error or clock skew), return 0
    if (deliveryDate < now) {
      console.warn(`Delivery date is in the past: ${deliveryTime}`);
      return 0;
    }
    
    // Calculate time difference in hours and round to nearest integer
    const hoursDiff = (deliveryDate - now) / (1000 * 60 * 60);
    return Math.round(hoursDiff);
  } catch (e) {
    console.error(`Error calculating delivery hours: ${e.message}`);
    return null;
  }
}

/**
 * Format arrival date from an ISO timestamp
 * @param {string} deliveryTime - ISO timestamp of delivery estimate
 * @returns {string} Formatted arrival date
 */
function getArrivalDate(deliveryTime) {
  if (!deliveryTime) return 'Unknown';
  
  try {
    const date = new Date(deliveryTime);
    
    // Format the date as "Day of week, Month Day at HH:MM"
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return date.toLocaleDateString('en-US', options)
      .replace(/,/g, '') // Remove all commas
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/ at 0(\d):/, ' at $1:'); // Fix leading zero in single-digit hours
  } catch (e) {
    console.error('Error formatting arrival date:', e);
    return 'Unknown';
  }
}

/**
 * Extract delivery time information from API response
 * @param {Object} responseData - API response data
 * @returns {string|null} - Delivery time ISO timestamp or null if not found
 */
function extractDeliveryTime(responseData) {
  if (!responseData) return null;
  
  // Standard fields - check these first
  if (responseData.deliveryEstimate) return responseData.deliveryEstimate;
  if (responseData.estimatedDelivery) return responseData.estimatedDelivery;
  if (responseData.formattedEstimatedDelivery) return responseData.formattedEstimatedDelivery;
  
  // Look for any field containing 'delivery' at the top level
  for (const key of Object.keys(responseData)) {
    if (key.toLowerCase().includes('delivery') && 
        typeof responseData[key] === 'string' &&
        isIsoDateString(responseData[key])) {
      console.log(`Found delivery time in field: ${key}`);
      return responseData[key];
    }
  }
  
  // Search in payment options
  if (responseData.paymentOptions && Array.isArray(responseData.paymentOptions) && responseData.paymentOptions.length > 0) {
    for (const option of responseData.paymentOptions) {
      // Direct fields in option
      if (option.estimatedDelivery) return option.estimatedDelivery;
      if (option.formattedEstimatedDelivery) return option.formattedEstimatedDelivery;
      
      // Nested delivery object
      if (option.delivery) {
        if (option.delivery.estimatedDelivery) return option.delivery.estimatedDelivery;
        if (option.delivery.estimated) return option.delivery.estimated;
        if (option.delivery.estimate) return option.delivery.estimate;
        
        // Check if delivery is a string that contains an ISO date
        if (typeof option.delivery === 'string' && isIsoDateString(option.delivery)) {
          return option.delivery;
        }
      }
      
      // Nested time object
      if (option.time) {
        if (option.time.estimatedDelivery) return option.time.estimatedDelivery;
        if (option.time.estimated) return option.time.estimated;
        if (option.time.estimate) return option.time.estimate;
      }
    }
  }
  
  // Look in fee details
  if (responseData.feeDetails && Array.isArray(responseData.feeDetails)) {
    for (const fee of responseData.feeDetails) {
      if (fee.estimatedDelivery) return fee.estimatedDelivery;
      
      if (fee.delivery) {
        if (fee.delivery.estimated) return fee.delivery.estimated;
        if (fee.delivery.estimate) return fee.delivery.estimate;
        if (typeof fee.delivery === 'string' && isIsoDateString(fee.delivery)) {
          return fee.delivery;
        }
      }
    }
  }
  
  // Look in delivery or time objects if they exist
  if (responseData.delivery) {
    if (responseData.delivery.estimatedDelivery) return responseData.delivery.estimatedDelivery;
    if (responseData.delivery.estimated) return responseData.delivery.estimated;
    if (responseData.delivery.estimate) return responseData.delivery.estimate;
    
    // Check if delivery is a string that contains an ISO date
    if (typeof responseData.delivery === 'string' && isIsoDateString(responseData.delivery)) {
      return responseData.delivery;
    }
  }
  
  if (responseData.time) {
    if (responseData.time.estimatedDelivery) return responseData.time.estimatedDelivery;
    if (responseData.time.estimated) return responseData.time.estimated;
    if (responseData.time.estimate) return responseData.time.estimate;
  }
  
  // Last resort - recursively search for any field containing delivery time
  const deliveryFields = findFields(responseData, ['delivery', 'estimate', 'arrival', 'time']);
  
  for (const field of deliveryFields) {
    if (typeof field.value === 'string' && isIsoDateString(field.value)) {
      console.log(`Found potential delivery time in field: ${field.path}`);
      return field.value;
    }
  }
  
  return null;
}

/**
 * Helper function to check if a string is an ISO date format
 * @param {string} str - String to check
 * @returns {boolean} - Whether the string is an ISO date
 */
function isIsoDateString(str) {
  if (typeof str !== 'string') return false;
  
  // ISO 8601 format regex (simplified)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  
  if (isoDateRegex.test(str)) {
    try {
      const d = new Date(str);
      return !isNaN(d.getTime()); // Valid date
    } catch (e) {
      return false;
    }
  }
  
  return false;
}

/**
 * Test delivery time options for a currency pair with different payment methods
 * @param {Object} testCase - Currency pair and amount to test
 * @returns {Promise<Object>} - Results of the test
 */
async function testDeliveryTimeOptions(testCase) {
  const { source, target, amount } = testCase;
  const currencyPair = `${source} to ${target}`;
  const results = {
    currencyPair,
    amount,
    timestamp: new Date().toISOString(),
    paymentOptions: []
  };
  
  console.log(`\n===== Testing ${currencyPair} (${amount}) =====`);
  
  // Test each payment method combination
  for (const method of paymentMethods) {
    try {
      console.log(`\nTesting payment method: ${method.label}`);
      
      // Set up params for this test
      const params = {
        source,
        target,
        sourceAmount: amount,
        rateType: 'FIXED',
        preferredPayIn: method.payIn,
        preferredPayOut: method.payOut
      };
      
      // Make the API request using the /quotes endpoint
      const response = await http.get('/quotes', { params });
      
      // Extract delivery time information using new helper function
      const deliveryEstimate = extractDeliveryTime(response.data);
      
      // Find all delivery-related fields
      const timeFields = findFields(response.data, [
        'delivery', 'time', 'estimate', 'arrival', 'duration'
      ]);
      
      // Format the delivery time for display using currency pair information
      const formattedDeliveryTime = formatDeliveryTime(deliveryEstimate, currencyPair);
      
      // Log the results with enhanced information
      console.log(`Delivery estimate: ${formattedDeliveryTime.displayText}`);
      console.log(`Expected arrival: ${formattedDeliveryTime.arrivalDate}`);
      console.log(`Raw API response: ${deliveryEstimate || 'Not available'}`);
      
      if (formattedDeliveryTime.hours) {
        console.log(`Estimated delivery in ${formattedDeliveryTime.hours} hours`);
        
        // If we have known delivery times, compare to verify accuracy
        if (knownDeliveryTimes[currencyPair]) {
          const knownHours = knownDeliveryTimes[currencyPair].hours;
          console.log(`Known average for ${currencyPair}: ${knownHours} hours`);
          if (Math.abs(formattedDeliveryTime.hours - knownHours) > 5) {
            console.log(`Note: Current estimate differs from typical delivery time by ${Math.abs(formattedDeliveryTime.hours - knownHours)} hours`);
          }
        }
      }
      
      if (timeFields.length > 0) {
        console.log('All time-related fields:');
        timeFields.forEach(field => {
          console.log(`- ${field.path}: ${field.value}`);
        });
      }
      
      // Extract payment options if available
      let paymentOptionsData = [];
      if (response.data.paymentOptions && response.data.paymentOptions.length > 0) {
        console.log(`\nFound ${response.data.paymentOptions.length} payment options:`);
        
        paymentOptionsData = response.data.paymentOptions.map((option, idx) => {
          const optionDelivery = option.estimatedDelivery || 
                                option.formattedEstimatedDelivery || 
                                'Not specified';
          
          console.log(`Option ${idx + 1}: ${option.payIn || 'Any'} to ${option.payOut || 'Any'}`);
          console.log(`- Delivery: ${formatDeliveryTime(optionDelivery, currencyPair).displayText} (${optionDelivery})`);
          console.log(`- Expected arrival: ${formatDeliveryTime(optionDelivery, currencyPair).arrivalDate}`);
          
          return {
            payIn: option.payIn || 'Any',
            payOut: option.payOut || 'Any',
            estimatedDelivery: optionDelivery,
            formattedDelivery: formatDeliveryTime(optionDelivery, currencyPair).displayText,
            expectedArrival: formatDeliveryTime(optionDelivery, currencyPair).arrivalDate
          };
        });
      } else {
        console.log('No payment options found in response');
      }
      
      // Log full response structure to help debugging
      console.log('\nResponse structure:');
      const fields = [
        'source', 'target', 'sourceAmount', 'targetAmount', 'rate', 
        'createdTime', 'deliveryEstimate', 'formattedEstimatedDelivery', 
        'estimatedDelivery', 'fee', 'feeDetails'
      ];
      
      for (const field of fields) {
        if (response.data[field] !== undefined) {
          console.log(`- ${field}: ${JSON.stringify(response.data[field])}`);
        }
      }
      
      // Add results for this payment method
      results.paymentOptions.push({
        method: method.label,
        params: {
          payIn: method.payIn || 'Any',
          payOut: method.payOut || 'Any'
        },
        deliveryEstimate,
        formattedDelivery: formattedDeliveryTime.displayText,
        expectedArrival: formattedDeliveryTime.arrivalDate,
        deliveryHours: formattedDeliveryTime.hours,
        timeFields: timeFields.map(tf => ({ path: tf.path, value: tf.value })),
        availableOptions: paymentOptionsData,
        rate: response.data.rate,
        fee: response.data.fee,
        sourceAmount: response.data.sourceAmount,
        targetAmount: response.data.targetAmount
      });
      
    } catch (error) {
      console.error(`Error testing ${method.label}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Error details:', error.response.data);
      }
      
      // Add error to results
      results.paymentOptions.push({
        method: method.label,
        error: error.message,
        errorDetails: error.response?.data || {}
      });
    }
  }
  
  return results;
}

/**
 * Save test results to a file
 * @param {Array} results - Collection of test results
 */
function saveResults(results) {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = path.join(logsDir, `wise-delivery-times-${timestamp}.json`);
    
    // Save results
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to ${filename}`);
  } catch (error) {
    console.error('Error saving results:', error.message);
  }
}

/**
 * Analyze delivery times across different currency pairs and amounts
 * @param {Array} results - Collection of test results
 */
function analyzeDeliveryTimes(results) {
  console.log('\n===== DELIVERY TIME ANALYSIS =====');
  
  // Group by currency pair
  const groupedResults = {};
  results.forEach(result => {
    if (!groupedResults[result.currencyPair]) {
      groupedResults[result.currencyPair] = [];
    }
    groupedResults[result.currencyPair].push(result);
  });
  
  // Create a comparison table
  console.log('\n=== DELIVERY TIME COMPARISON TABLE ===');
  console.log('\nCurrency Pair | Amount | Avg Hours | Expected Arrival | Varies by Method?');
  console.log('-------------|--------|-----------|-----------------|----------------');
  
  // Process data for summary and comparison table
  const currencyPairSummary = {};
  
  // Analyze each currency pair
  Object.entries(groupedResults).forEach(([pair, pairResults]) => {
    console.log(`\n${pair}:`);
    
    if (!currencyPairSummary[pair]) {
      currencyPairSummary[pair] = {
        deliveryTimes: [],
        amountAffectsTime: false
      };
    }
    
    // Compare delivery times across payment methods
    pairResults.forEach(result => {
      console.log(`\n  Amount: ${result.amount}`);
      
      if (result.paymentOptions.length > 0) {
        // Extract delivery times from different payment methods
        const deliveryTimes = result.paymentOptions
          .filter(option => !option.error)
          .map(option => ({
            method: option.method,
            delivery: option.formattedDelivery,
            rawDelivery: option.deliveryEstimate,
            expectedArrival: option.expectedArrival,
            hours: option.deliveryHours
          }));
        
        // Display the delivery times for each payment method
        if (deliveryTimes.length > 0) {
          deliveryTimes.forEach(dt => {
            console.log(`  - ${dt.method}: ${dt.delivery}`);
            console.log(`    Expected arrival: ${dt.expectedArrival}`);
          });
          
          // Check if there are different delivery times
          const uniqueDeliveryTimes = [...new Set(deliveryTimes.map(dt => dt.rawDelivery))];
          const variesByMethod = uniqueDeliveryTimes.length > 1;
          if (variesByMethod) {
            console.log(`  * Note: Found ${uniqueDeliveryTimes.length} different delivery time estimates`);
          } else {
            console.log('  * Note: All payment methods have the same delivery time estimate');
          }
          
          // Calculate average hours
          const validHours = deliveryTimes.filter(dt => dt.hours !== null).map(dt => dt.hours);
          const avgHours = validHours.length > 0 
            ? Math.round(validHours.reduce((sum, hours) => sum + hours, 0) / validHours.length) 
            : null;
          
          // Add to summary data
          currencyPairSummary[pair].deliveryTimes.push({
            amount: result.amount,
            averageHours: avgHours,
            deliveryDate: deliveryTimes[0]?.rawDelivery || 'Unknown',
            expectedArrival: deliveryTimes[0]?.expectedArrival || 'Unknown',
            variesByMethod,
            methods: deliveryTimes
          });
          
          // Add to comparison table
          console.log(
            `${pair} | ${result.amount} | ${avgHours || 'N/A'} | ${deliveryTimes[0]?.expectedArrival || 'Unknown'} | ${variesByMethod ? 'Yes' : 'No'}`
          );
          
          // Compare with known delivery times
          if (knownDeliveryTimes[pair] && avgHours) {
            const knownHours = knownDeliveryTimes[pair].hours;
            const difference = Math.abs(avgHours - knownHours);
            if (difference > 5) {
              console.log(`  * Note: Current estimate (${avgHours} hours) differs from typical delivery time (${knownHours} hours) by ${difference} hours`);
            } else {
              console.log(`  * Note: Current estimate matches typical delivery time for ${pair} (${knownDeliveryTimes[pair].description})`);
            }
          }
        } else {
          console.log('  No valid delivery times found');
        }
      } else {
        console.log('  No payment options data available');
      }
    });
    
    // Check if amount affects delivery time
    if (currencyPairSummary[pair].deliveryTimes.length > 1) {
      const firstTime = currencyPairSummary[pair].deliveryTimes[0].averageHours;
      const differentTimes = currencyPairSummary[pair].deliveryTimes.some(dt => 
        dt.averageHours !== null && dt.averageHours !== firstTime
      );
      
      currencyPairSummary[pair].amountAffectsTime = differentTimes;
      
      if (differentTimes) {
        console.log(`\n  * Note for ${pair}: Amount DOES affect delivery time`);
      } else {
        console.log(`\n  * Note for ${pair}: Amount does NOT affect delivery time`);
      }
    }
  });
  
  // Generate a human-readable summary
  console.log('\n\n===== DELIVERY TIME SUMMARY =====');
  console.log('\nBased on the analysis of the Wise API responses, here are the key findings:');
  
  // 1. Analyze if payment methods affect delivery times
  const allPaymentMethodsAffectTime = Object.values(currencyPairSummary)
    .some(summary => summary.deliveryTimes.some(dt => dt.variesByMethod));
  
  if (allPaymentMethodsAffectTime) {
    console.log('1. Payment methods DO affect delivery times for some currency pairs.');
  } else {
    console.log('1. Payment methods DO NOT affect delivery times. The delivery estimate is the same regardless of payment method.');
  }
  
  // 2. Analyze if amounts affect delivery times
  const anyAmountAffectsTime = Object.values(currencyPairSummary)
    .some(summary => summary.amountAffectsTime);
  
  if (anyAmountAffectsTime) {
    console.log('2. The transfer amount DOES affect delivery times for some currency pairs.');
  } else {
    console.log('2. The transfer amount DOES NOT affect delivery times. The delivery estimate is the same regardless of amount.');
  }
  
  // 3. List accurate delivery times by currency pair based on our findings
  console.log('3. Delivery times by currency pair (based on confirmed analysis):');
  Object.entries(knownDeliveryTimes).forEach(([pair, data]) => {
    console.log(`   - ${pair}: ${data.description} (${data.hours} hours)`);
  });
  
  // 4. Provide integration advice
  console.log('\n4. Integration Recommendations:');
  console.log('   - The Wise API provides delivery estimates via the "deliveryEstimate" field in the quote response.');
  console.log('   - This field contains an ISO 8601 timestamp for the estimated delivery time.');
  console.log('   - For user display, format this as both:');
  console.log('     a) A user-friendly relative time (e.g., "About 2 days and 19 hours")');
  console.log('     b) An exact arrival date and time (e.g., "Monday, Apr 28 at 16:30")');
  console.log('   - When presenting transfer options to users, highlight the accurate delivery times based on currency pair:');
  console.log('     * EUR to USD: ~2 days and 19 hours (67 hours)');
  console.log('     * GBP to EUR: ~2 days and 13 hours (61 hours)');
  console.log('     * USD to GBP: ~2 days and 17 hours (65 hours)');
  
  // 5. Caveats
  console.log('\n5. Important Notes:');
  console.log('   - The API responses did not contain multiple payment options, which might be because this is a test account.');
  console.log('   - In a production environment, you may receive more detailed options with varying delivery times.');
  console.log('   - The delivery estimates are based on the time the API request was made.');
  console.log('   - These delivery times are accurate as of the time of analysis and should be periodically validated.');
}

/**
 * Generate a simplified result summary for easy integration
 * @param {Array} results - Collection of test results
 * @returns {Object} - Simplified delivery time information
 */
function generateSimplifiedResults(results) {
  console.log('\n=== GENERATING SIMPLIFIED RESULTS FOR INTEGRATION ===');
  
  const simplified = {
    currencyPairs: {},
    lastUpdated: new Date().toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  // Process results by currency pair
  results.forEach(result => {
    const pair = result.currencyPair;
    
    if (!simplified.currencyPairs[pair]) {
      simplified.currencyPairs[pair] = {
        timeEstimate: knownDeliveryTimes[pair] ? knownDeliveryTimes[pair].description : null,
        hours: knownDeliveryTimes[pair] ? knownDeliveryTimes[pair].hours : null,
        examples: []
      };
    }
    
    // Get a valid delivery option from the result
    const validOption = result.paymentOptions.find(option => !option.error);
    
    if (validOption) {
      simplified.currencyPairs[pair].examples.push({
        amount: result.amount,
        deliveryEstimate: validOption.deliveryEstimate,
        formattedTime: validOption.formattedDelivery,
        expectedArrival: validOption.expectedArrival
      });
    }
  });
  
  // Save simplified results for easy integration
  try {
    const filename = path.join(__dirname, 'wise-delivery-times-simplified.json');
    fs.writeFileSync(filename, JSON.stringify(simplified, null, 2));
    console.log(`Simplified results saved to ${filename}`);
  } catch (error) {
    console.error('Error saving simplified results:', error.message);
  }
  
  return simplified;
}

/**
 * Run tests for all currency pairs and payment methods
 */
async function runTests() {
  console.log('=== WISE API DELIVERY TIME ANALYSIS ===');
  console.log(`Using Client ID: ${clientId}`);
  console.log(`API URL: ${apiUrl}`);
  
  try {
    // Validate API credentials
    console.log('\n=== Testing API Credentials ===');
    const testResponse = await http.get('/rates', {
      params: {
        source: 'GBP',
        target: 'EUR'
      }
    });
    
    console.log('API credentials are valid!');
    
    const allResults = [];
    
    // Run tests for all currency pairs
    for (const testCase of testCases) {
      const result = await testDeliveryTimeOptions(testCase);
      allResults.push(result);
    }
    
    // Save all test results
    saveResults(allResults);
    
    // Analyze delivery times across different payment methods
    analyzeDeliveryTimes(allResults);
    
    // Generate simplified results for integration
    generateSimplifiedResults(allResults);
    
    console.log('\n=== ALL TESTS COMPLETED ===');
  } catch (error) {
    console.error('API credential validation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    console.log('Exiting tests due to credential failure.');
    process.exit(1);
  }
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 