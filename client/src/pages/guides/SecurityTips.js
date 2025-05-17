import React from 'react';
import GuideDetail from './GuideDetail';
// Import images from assets directory
import heroImageJpg from '../../assets/images/guides/security-tips-hero.jpg';
import heroImageWebp from '../../assets/images/guides/security-tips-hero-new.webp';
import SEO from '../../components/SEO';

/**
 * Security Tips guide page
 */
const SecurityTips = () => {
  // Define related guides
  const relatedGuides = [
    {
      title: "High-Value Transfers Guide",
      description: "Learn about options for transferring large sums internationally.",
      path: "/guides/high-value-transfers"
    },
    {
      title: "Getting Started with Money Transfers",
      description: "Essential information for beginners about international money transfers.",
      path: "/guides/getting-started"
    }
  ];

  // Define content
  const content = (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl font-medium mb-8 text-left">
        Security should be your top priority when sending money internationally. This comprehensive guide covers essential security practices to protect your funds from fraud, scams, and theft when making international transfers.
      </p>
      
      <div className="my-10 p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-left">What You'll Learn in This Guide:</h3>
        <ul className="grid md:grid-cols-2 gap-3 pl-8 text-indigo-900">
          <li className="text-left">Common money transfer scams and how to avoid them</li>
          <li className="text-left">Best practices for secure online transfers</li>
          <li className="text-left">How to verify a money transfer provider's legitimacy</li>
          <li className="text-left">Red flags that might indicate fraud attempts</li>
          <li className="text-left">Steps to take if you suspect you've been defrauded</li>
          <li className="text-left">Secure payment methods for different situations</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Why Money Transfer Security Matters</h2>
      
      <p className="mb-6 text-left">
        International money transfers involve sending funds through various channels and across different jurisdictions, creating several potential points of vulnerability. Fraudsters and scammers actively target these transactions because they can be difficult to reverse once completed and may involve substantial sums.
      </p>
      
      <p className="mb-6 text-left">
        Understanding security risks and implementing robust protective measures can help ensure your money reaches its intended destination safely. This guide combines technical safeguards with practical advice to help you protect your transfers from common threats.
      </p>
    </div>
  );

  return (
    <div>
      <SEO
        title="Security Tips | MyMoneyTransfers"
        description="Security Tips - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/guides/security-tips"
      />
      <GuideDetail
        title="Security Tips for International Money Transfers"
        subtitle="Essential practices to protect your money when sending funds internationally"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="June 28, 2023"
        readTime="9"
        relatedGuides={relatedGuides}
      />
    </div>
  );
};

export default SecurityTips;