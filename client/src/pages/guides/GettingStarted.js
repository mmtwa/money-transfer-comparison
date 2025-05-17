import React from 'react';
import GuideDetail from './GuideDetail';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/exchange-rates-hero.jpg';
import heroImageWebp from '../../assets/images/guides/exchange-rates-hero-new.webp';
import SEO from '../../components/SEO';

/**
 * Getting Started guide page
 */
const GettingStarted = () => {
  // Define related guides
  const relatedGuides = [
    {
      title: "Exchange Rate Strategies",
      description: "Learn how to get the best exchange rates and save money on your international transfers.",
      path: "/guides/exchange-rates"
    },
    {
      title: "Security Tips for Money Transfers",
      description: "Essential security practices to protect your money when sending internationally.",
      path: "/guides/security-tips"
    }
  ];

  // Define content
  const content = (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl font-medium mb-8 text-left">
        If you're new to international money transfers, you're in the right place. This comprehensive guide will walk you through everything you need to know to get started sending money abroad securely and cost-effectively.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">How to choose the right money transfer service</li>
          <li className="text-left">Understanding exchange rates and fees</li>
          <li className="text-left">Documentation requirements for international transfers</li>
          <li className="text-left">Common pitfalls to avoid when sending money</li>
          <li className="text-left">Security best practices to protect your funds</li>
          <li className="text-left">How to track and verify your transfer</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Understanding International Money Transfers</h2>
      
      <p className="mb-6 text-left">
        International money transfers allow you to send funds across borders to family, friends, businesses, or your own accounts in other countries. These transfers can be processed through various channels including banks, specialized money transfer operators, online platforms, and mobile applications.
      </p>
      
      <p className="mb-6 text-left">
        The process typically involves converting money from one currency to another and transferring it to a recipient in a different country. Understanding the basics of how these transfers work will help you make informed decisions about which service to use and how to get the best value.
      </p>
    </div>
  );

  return (
    <div>
      <SEO
        title="Getting Started | MyMoneyTransfers"
        description="Getting Started - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/getting-started"
      />
      <GuideDetail
        title="Getting Started with International Money Transfers"
        subtitle="A beginner's guide to sending money abroad safely and affordably"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="June 15, 2023"
        readTime="8"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default GettingStarted;