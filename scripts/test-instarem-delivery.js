/**
 * Test script for InstaReM delivery time implementation
 */
const instaremService = require('../services/instaremService');

// Test data - simulating different responses from the InstaReM API
const testData = [
  {
    name: "LOCAL rail type",
    data: {
      'Exchange rate': "1.1864",
      'Total fee': "0.00",
      'Delivery ETA': "n/a",
      'Amount received': "1186.4",
      'Rail type': "LOCAL"
    },
    fromCurrency: "GBP",
    toCurrency: "EUR",
    amount: 1000
  },
  {
    name: "SWIFT rail type",
    data: {
      'Exchange rate': "83.254",
      'Total fee': "3.50",
      'Delivery ETA': "n/a", 
      'Amount received': "83254",
      'Rail type': "SWIFT"
    },
    fromCurrency: "USD",
    toCurrency: "INR",
    amount: 1000
  },
  {
    name: "With explicit delivery ETA",
    data: {
      'Exchange rate': "1.324",
      'Total fee': "2.99",
      'Delivery ETA': "1-2 business days",
      'Amount received': "1324",
      'Rail type': "SWIFT"
    },
    fromCurrency: "GBP",
    toCurrency: "USD",
    amount: 1000
  },
  {
    name: "VISA with Fast Funds",
    data: {
      'Exchange rate': "1.324",
      'Total fee': "4.99",
      'Delivery ETA': "n/a",
      'Amount received': "1324",
      'Rail type': "VISA"
    },
    fromCurrency: "GBP",
    toCurrency: "USD",
    amount: 1000
  },
  {
    name: "Fallback to common corridor",
    data: {
      'Exchange rate': "83.254",
      'Total fee': "3.50",
      'Delivery ETA': "n/a",
      'Amount received': "83254",
      'Rail type': "Unknown"
    },
    fromCurrency: "USD",
    toCurrency: "INR",
    amount: 1000
  },
  {
    name: "Service time as ISO date",
    data: {
      'Exchange rate': "1.324",
      'Total fee': "2.99",
      'Delivery ETA': new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      'Amount received': "1324",
      'Rail type': "SWIFT"
    },
    fromCurrency: "GBP",
    toCurrency: "USD",
    amount: 1000
  },
  {
    name: "With service_time in additional_info",
    data: {
      'Exchange rate': "1.324",
      'Total fee': "2.99",
      'Delivery ETA': "n/a",
      'Amount received': "1324",
      'Rail type': "Unknown",
      'additional_info': {
        'service_time': new Date(Date.now() + 172800000).toISOString() // 2 days from now
      }
    },
    fromCurrency: "GBP",
    toCurrency: "USD",
    amount: 1000
  }
];

// Run tests
console.log("InstaReM Delivery Time Estimation Test");
console.log("======================================");

testData.forEach((test, index) => {
  console.log(`\nTest #${index + 1}: ${test.name}`);
  console.log("Input data:");
  console.log(JSON.stringify(test.data, null, 2));
  
  const result = instaremService.formatForProviderCard(
    test.data,
    test.fromCurrency,
    test.toCurrency,
    test.amount
  );
  
  console.log("\nFormatted result:");
  console.log(`- Transfer time: ${result.transferTime}`);
  console.log(`- Transfer time hours: min=${result.transferTimeHours.min}, max=${result.transferTimeHours.max}`);
  console.log(`- Rail type: ${result.railType}`);
});

console.log("\nTest complete!"); 