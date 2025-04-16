import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CurrencyWidget = () => {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [isFromCurrencyOpen, setIsFromCurrencyOpen] = useState(false);
  const [isToCurrencyOpen, setIsToCurrencyOpen] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', countryCode: 'us' },
    { code: 'EUR', name: 'Euro', countryCode: 'eu' },
    { code: 'GBP', name: 'British Pound', countryCode: 'gb' },
    { code: 'JPY', name: 'Japanese Yen', countryCode: 'jp' },
    { code: 'CAD', name: 'Canadian Dollar', countryCode: 'ca' },
    { code: 'AUD', name: 'Australian Dollar', countryCode: 'au' },
    { code: 'CHF', name: 'Swiss Franc', countryCode: 'ch' },
    { code: 'CNY', name: 'Chinese Yuan', countryCode: 'cn' },
    { code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'hk' },
    { code: 'NZD', name: 'New Zealand Dollar', countryCode: 'nz' },
    { code: 'SEK', name: 'Swedish Krona', countryCode: 'se' },
    { code: 'KRW', name: 'South Korean Won', countryCode: 'kr' },
    { code: 'SGD', name: 'Singapore Dollar', countryCode: 'sg' },
    { code: 'NOK', name: 'Norwegian Krone', countryCode: 'no' },
    { code: 'MXN', name: 'Mexican Peso', countryCode: 'mx' },
    { code: 'INR', name: 'Indian Rupee', countryCode: 'in' },
    { code: 'RUB', name: 'Russian Ruble', countryCode: 'ru' },
    { code: 'ZAR', name: 'South African Rand', countryCode: 'za' },
    { code: 'TRY', name: 'Turkish Lira', countryCode: 'tr' },
    { code: 'BRL', name: 'Brazilian Real', countryCode: 'br' },
    { code: 'TWD', name: 'Taiwan Dollar', countryCode: 'tw' },
    { code: 'DKK', name: 'Danish Krone', countryCode: 'dk' },
    { code: 'PLN', name: 'Polish Zloty', countryCode: 'pl' },
    { code: 'THB', name: 'Thai Baht', countryCode: 'th' },
    { code: 'IDR', name: 'Indonesian Rupiah', countryCode: 'id' },
    { code: 'HUF', name: 'Hungarian Forint', countryCode: 'hu' },
    { code: 'CZK', name: 'Czech Koruna', countryCode: 'cz' },
    { code: 'ILS', name: 'Israeli Shekel', countryCode: 'il' },
    { code: 'CLP', name: 'Chilean Peso', countryCode: 'cl' },
    { code: 'PHP', name: 'Philippine Peso', countryCode: 'ph' },
    { code: 'AED', name: 'UAE Dirham', countryCode: 'ae' },
    { code: 'COP', name: 'Colombian Peso', countryCode: 'co' },
    { code: 'SAR', name: 'Saudi Riyal', countryCode: 'sa' },
    { code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'my' },
    { code: 'RON', name: 'Romanian Leu', countryCode: 'ro' }
  ];

  const handleAmountChange = (e) => {
    setAmount(Math.max(0, Number(e.target.value)));
  };

  const toggleFromCurrency = () => {
    setIsFromCurrencyOpen(!isFromCurrencyOpen);
    if (isToCurrencyOpen) setIsToCurrencyOpen(false);
  };

  const toggleToCurrency = () => {
    setIsToCurrencyOpen(!isToCurrencyOpen);
    if (isFromCurrencyOpen) setIsFromCurrencyOpen(false);
  };

  const selectFromCurrency = (currency) => {
    setFromCurrency(currency);
    setIsFromCurrencyOpen(false);
  };

  const selectToCurrency = (currency) => {
    setToCurrency(currency);
    setIsToCurrencyOpen(false);
  };

  const getFlag = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? (
      <img
        src={`https://flagcdn.com/w40/${currency.countryCode}.png`}
        alt={`${code} flag`}
        className="w-5 h-4 mr-2 object-cover rounded-sm"
        loading="lazy"
      />
    ) : null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-10" style={{
      background: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 className="text-2xl font-semibold mb-8 text-center">What are you sending and where?</h2>

      {/* You're sending section */}
      <div className="mb-8">
        <label className="block text-base font-medium text-gray-700 mb-3">You're sending</label>
        <div className="relative">
          <div className="flex">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="rounded-l border border-gray-300 p-3 w-3/5 focus:outline-none focus:ring-1 focus:ring-blue-300 font-semibold text-lg"
              min="0"
              style={{ height: '54px' }}
            />
            <button
              onClick={toggleFromCurrency}
              className="rounded-r border border-gray-300 p-3 w-2/5 flex items-center justify-between bg-white focus:outline-none font-semibold text-lg"
              style={{
                height: '54px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <span className="flex items-center">
                {getFlag(fromCurrency)} {fromCurrency}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${isFromCurrencyOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isFromCurrencyOpen && (
            <div
              className="absolute top-full right-0 mt-1 w-2/5 bg-white border border-gray-200 rounded z-10 max-h-72 overflow-y-auto"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
            >
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => selectFromCurrency(currency.code)}
                  className="w-full p-3 text-left hover:bg-gray-100 flex items-center font-semibold"
                >
                  {getFlag(currency.code)} {currency.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* They're receiving section */}
      <div className="mb-8">
        <label className="block text-base font-medium text-gray-700 mb-3">They're receiving</label>
        <div className="relative">
          <button
            onClick={toggleToCurrency}
            className="w-full rounded border border-gray-300 p-3 flex items-center justify-between bg-white focus:outline-none font-semibold text-lg"
            style={{
              height: '54px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <span className="flex items-center">
              {getFlag(toCurrency)} {toCurrency}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${isToCurrencyOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isToCurrencyOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded z-10 max-h-72 overflow-y-auto"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
            >
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => selectToCurrency(currency.code)}
                  className="w-full p-3 text-left hover:bg-gray-100 flex items-center font-semibold"
                >
                  {getFlag(currency.code)} {currency.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-base text-gray-600 mb-8 text-center">We'll check all providers for the best deal</p>

      <button
        className="w-full text-white py-4 px-4 rounded-full flex items-center justify-center shadow-md text-lg"
        style={{
          backgroundColor: '#3272e7',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#2a64d9';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#3272e7';
        }}
      >
        Compare deals now
      </button>
    </div>
  );
};

export default CurrencyWidget;