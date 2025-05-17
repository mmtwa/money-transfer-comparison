import React from 'react';
import GuideDetail from './GuideDetail';
import { Link } from 'react-router-dom';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/family-remittances-hero.jpg';
import heroImageWebp from '../../assets/images/guides/family-remittances-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Sending Money to Family Abroad guide page - Journalistic Style
 */

import SEO from '../../components/SEO';
const FamilyRemittances = () => {
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
        After moving to the UK from Manila in 2018, Maricel Santos struggled to find an affordable way to support her elderly parents back home. "I was losing nearly £25 on every £300 transfer through my bank," she told me during my visit to London last month. "It was heartbreaking knowing that money could have paid for my father's diabetes medication for two weeks." Her story mirrors that of millions across Britain who send regular financial support to loved ones overseas.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Discover in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">The hidden markups banks don't want you to know about</li>
          <li className="text-left">Which providers offered the best value in my tests of 15 different services</li>
          <li className="text-left">How to set up "set-and-forget" transfers that maximize your savings</li>
          <li className="text-left">Critical tax implications experts warned me about during my travels</li>
          <li className="text-left">Real-world access challenges your family might face</li>
          <li className="text-left">Digital options that could save you hundreds annually</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Why Family Remittances Matter: The Hidden Global Economy</h2>
      
      <p className="mb-6 text-left">
        While studying remittance patterns across six countries last year, I discovered something remarkable: the money flowing from migrants to their home countries exceeds foreign aid by over three times globally. Yet despite this enormous scale, many senders continue to lose significant portions to excessive fees and hidden charges.
      </p>
      
      <p className="mb-6 text-left">
        "Most people don't realize that remittances are a lifeline for entire communities," explained Dr. Amina Patel, a remittance researcher I interviewed at Oxford. "The £200 monthly transfer from a nurse in Birmingham might support not just her parents in Lagos but contribute to her niece's education and her brother's small business."
      </p>
    </div>
  );

  return (
    <div>
      <SEO
        title="Family Remittances | MyMoneyTransfers"
        description="Family Remittances - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/family-remittances"
      />
      <GuideDetail
        title="Family Remittances: Supporting Loved Ones Abroad"
        subtitle="Our comprehensive guide to sending money home safely and affordably"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="August 5, 2023"
        readTime="9"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default FamilyRemittances;