// List of world currencies
export const currenciesList = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' }
];

// Generate exchange rates for all currency pairs
export const generateExchangeRates = () => {
  const rates = {};
  
  // Initialize structure for each currency
  currenciesList.forEach(currency => {
    rates[currency.code] = {};
  });
  
  // Base rates against USD
  const baseRatesAgainstUSD = {
    USD: 1.00,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 110.23,
    AUD: 1.43,
    CAD: 1.35,
    CHF: 0.92,
    CNY: 7.25,
    HKD: 7.82,
    NZD: 1.58,
    SEK: 10.48,
    SGD: 1.34,
    NOK: 10.65,
    MXN: 19.87,
    INR: 73.12,
    BRL: 5.45,
    RUB: 73.78,
    ZAR: 18.35,
    TRY: 8.56,
    DKK: 6.78,
    PLN: 4.18,
    THB: 32.65,
    IDR: 14250.00,
    HUF: 330.50,
    CZK: 23.15,
    ILS: 3.28,
    CLP: 820.45,
    PHP: 50.25,
    AED: 3.67,
    COP: 3850.00,
    SAR: 3.75,
    MYR: 4.19,
    RON: 4.48,
    BGN: 1.78,
    KRW: 1175.50,
    EGP: 15.70,
    ARS: 98.50,
    QAR: 3.64,
    KWD: 0.30,
    NGN: 410.50
  };
  
  // Generate rates for all currency pairs
  currenciesList.forEach(fromCurrency => {
    currenciesList.forEach(toCurrency => {
      if (fromCurrency.code !== toCurrency.code) {
        // Calculate cross-rate via USD
        const fromToUSD = 1 / baseRatesAgainstUSD[fromCurrency.code];
        const usdToTarget = baseRatesAgainstUSD[toCurrency.code];
        rates[fromCurrency.code][toCurrency.code] = fromToUSD * usdToTarget;
      } else {
        rates[fromCurrency.code][toCurrency.code] = 1;
      }
    });
  });
  
  return rates;
};

export const exchangeRates = generateExchangeRates();

// Format amount to 2 decimal places
export const formatAmount = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Get currency symbol by code
export const getCurrencySymbol = (code) => {
  const currency = currenciesList.find(c => c.code === code);
  return currency ? currency.symbol : '';
}; 