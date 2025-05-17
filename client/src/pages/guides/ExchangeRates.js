
import React from 'react';
import { Helmet } from 'react-helmet';

const ExchangeRates = () => {
  return (
    <>
      <Helmet>
        <title> Exchange Rates | MyMoneyTransfers</title>
        <meta name="description" content="Get up-to-date exchange rates information and learn how to get the best deals on your currency transfers. Compare providers to find the best exchange rates." />
        <link rel="canonical" href="https://www.mymoneytransfers.com/guides/exchangerates" />
      </Helmet>
      
      {/* Original component content goes here */}
      <div className="guide-container">
        <h1> Exchange Rates</h1>
        <p>Get up-to-date exchange rates information and learn how to get the best deals on your currency transfers. Compare providers to find the best exchange rates.</p>
        <p>This guide is currently being updated with the latest information. Please check back soon for the complete guide.</p>
      </div>
    </>
  );
};

export default ExchangeRates;
