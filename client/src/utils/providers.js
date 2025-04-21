// Mock data for providers
export const providers = [
  {
    id: 1,
    name: 'Wise (TransferWise)',
    logo: '/wiselogo.png',
    exchangeRateMargin: 0.005, // 0.5%
    transferFee: 3.99,
    transferTime: '1-2 days',
    rating: 4.8,
    features: ['Low fees', 'No hidden costs', 'Instant transfers available'],
  },
  {
    id: 2,
    name: 'XE Money Transfer',
    logo: '/XELogo.svg',
    exchangeRateMargin: 0.01, // 1%
    transferFee: 0,
    transferTime: '2-3 days',
    rating: 4.5,
    features: ['No transfer fees', 'Competitive rates', 'Easy tracking'],
  },
  {
    id: 3,
    name: 'OFX',
    logo: '/OFX_Logo.png',
    exchangeRateMargin: 0.008, // 0.8%
    transferFee: 0,
    transferTime: '3-5 days',
    rating: 4.4,
    features: ['No transfer fees', 'Specialized in large transfers', '24/7 support'],
  },
  {
    id: 4,
    name: 'Western Union',
    logo: '/Western-Union-Logo.png',
    exchangeRateMargin: 0.025, // 2.5%
    transferFee: 5.99,
    transferTime: 'Same day',
    rating: 4.0,
    features: ['Cash pickup available', 'Global network', 'Same day transfers'],
  },
  {
    id: 5,
    name: 'Remitly',
    logo: '/remitlylogo.svg',
    exchangeRateMargin: 0.015, // 1.5%
    transferFee: 2.99,
    transferTime: '0-2 days',
    rating: 4.2,
    features: ['Mobile-friendly', 'Fast delivery', 'First transfer promotion'],
  },
  {
    id: 6,
    name: 'Currency Online Group',
    logo: '/coglogo.webp',
    exchangeRateMargin: 0.008, // 0.8%
    transferFee: 0,
    transferTime: '3-5 days',
    rating: 4.4,
    features: ['No transfer fees', 'Specialized in large transfers', '24/7 support'],
  },
];

// Calculate provider results
export const calculateProviderResults = (fromCurrency, toCurrency, amount, exchangeRates, sortBy = 'amount', sortDirection = 'desc') => {
  // Get base exchange rate
  const baseRate = exchangeRates[fromCurrency][toCurrency];
  
  // Calculate for each provider
  const results = providers.map(provider => {
    // Calculate provider's rate with margin
    const providerRate = baseRate * (1 - provider.exchangeRateMargin);
    const amountReceived = amount * providerRate;
    const totalFees = provider.transferFee + (amount * provider.exchangeRateMargin);
    
    return {
      ...provider,
      rate: providerRate,
      amountReceived,
      totalFees,
    };
  });
  
  // Sort results
  const sortedResults = results.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'rate':
        comparison = a.rate - b.rate;
        break;
      case 'fees':
        comparison = a.totalFees - b.totalFees;
        break;
      case 'amount':
        comparison = a.amountReceived - b.amountReceived;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      default:
        comparison = a.amountReceived - b.amountReceived;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return sortedResults;
}; 