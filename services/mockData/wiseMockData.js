/**
 * Mock data for Wise API fallback
 * Used when API requests fail or for development purposes
 */

// Mock currency data
const currencies = [
  { code: 'GBP', name: 'British Pound', isMockData: true },
  { code: 'EUR', name: 'Euro', isMockData: true },
  { code: 'USD', name: 'US Dollar', isMockData: true },
  { code: 'CAD', name: 'Canadian Dollar', isMockData: true },
  { code: 'AUD', name: 'Australian Dollar', isMockData: true },
  { code: 'JPY', name: 'Japanese Yen', isMockData: true },
  { code: 'CHF', name: 'Swiss Franc', isMockData: true },
  { code: 'NZD', name: 'New Zealand Dollar', isMockData: true }
];

// Mock exchange rates
const exchangeRates = {
  'GBP_EUR': 1.17,
  'GBP_USD': 1.27,
  'EUR_GBP': 0.86,
  'EUR_USD': 1.08,
  'USD_GBP': 0.79,
  'USD_EUR': 0.93,
  'USD_CAD': 1.36,
  'CAD_USD': 0.74
};

// Generate exchange rate data
function getExchangeRate(sourceCurrency, targetCurrency, amount) {
  const pairKey = `${sourceCurrency}_${targetCurrency}`;
  const rate = exchangeRates[pairKey] || 1.1; // Fallback rate if pair not found
  const sourceAmount = parseFloat(amount);
  
  return {
    rate: rate,
    sourceAmount: sourceAmount,
    targetAmount: sourceAmount * rate,
    fee: getTransferFee(sourceCurrency, targetCurrency, amount).fee,
    estimatedDelivery: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    isMockData: true
  };
}

// Generate transfer fee data
function getTransferFee(sourceCurrency, targetCurrency, amount) {
  // Mock fee calculation based on amount
  const amountValue = parseFloat(amount);
  let fee = 3.49; // Base fee
  
  if (amountValue > 1000) {
    fee = 4.99;
  }
  if (amountValue > 5000) {
    fee = 9.99;
  }
  
  return {
    fee: fee,
    estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
    isMockData: true
  };
}

module.exports = {
  currencies,
  getExchangeRate,
  getTransferFee
}; 