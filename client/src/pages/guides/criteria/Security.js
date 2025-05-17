import React from 'react';
import GuideDetail from '../GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../../assets/images/guides/security-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/security-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../../components/common/ResponsiveImage';
import SEO from '../../../components/SEO';

/**
 * Guide to secure and trustworthy international transfers
 */
const Security = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'provider-security': true,
    'fraud-prevention': true,
    'data-protection': true,
    'compliance': true,
    'verification': true,
    'risk-management': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Security Tips for Money Transfers',
      description: 'How to ensure your international transfers are secure and what to do if something goes wrong.',
      path: '/guides/security-tips'
    },
    {
      title: 'Service Quality',
      description: 'Understanding what makes a great money transfer service and how to find it.',
      path: '/guides/criteria/service'
    }
  ];

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <>
      <ClickableHeadline 
        id="introduction" 
        isExpanded={expandedSections['introduction']} 
        onClick={toggleSection}
      >
        The Complete Guide to Secure and Trustworthy International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Security and trust are paramount when sending money internationally. This comprehensive guide will help you understand how to ensure your transfers are secure and how to identify trustworthy providers.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Security Matters</h3>
            <p className="mb-4 text-left">
              "I lost £2,000 to a fraudulent transfer service," says John from Birmingham. "If I had known what to look for, I could have avoided this completely."
            </p>
            <p className="text-left">
              This guide will show you how to protect your money and personal information when making international transfers, and how to identify legitimate, trustworthy providers.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="provider-security" 
        isExpanded={expandedSections['provider-security']} 
        onClick={toggleSection}
      >
        Provider Security Measures
      </ClickableHeadline>
      {expandedSections['provider-security'] && (
        <>
          <p className="mb-4 text-left">
            Understanding the security measures that reputable providers implement is crucial for making informed decisions about your transfers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Technical Security</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">End-to-end encryption</li>
                <li className="text-left">Secure socket layer (SSL) protection</li>
                <li className="text-left">Two-factor authentication</li>
                <li className="text-left">Fraud detection systems</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Operational Security</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Regular security audits</li>
                <li className="text-left">Employee background checks</li>
                <li className="text-left">Secure data centers</li>
                <li className="text-left">Incident response plans</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fraud-prevention" 
        isExpanded={expandedSections['fraud-prevention']} 
        onClick={toggleSection}
      >
        Fraud Prevention Strategies
      </ClickableHeadline>
      {expandedSections['fraud-prevention'] && (
        <>
          <p className="mb-6 text-left">
            Fraud prevention is a critical aspect of secure money transfers. Learn how to protect yourself and your money from common fraud schemes.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Common Fraud Types</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Phishing Scams</strong>: Fake emails and websites</li>
              <li className="mb-2 text-left"><strong>Social Engineering</strong>: Manipulation tactics</li>
              <li className="mb-2 text-left"><strong>Fake Providers</strong>: Unauthorized services</li>
              <li className="mb-2 text-left"><strong>Identity Theft</strong>: Unauthorized access</li>
              <li className="mb-2 text-left"><strong>Payment Fraud</strong>: Stolen payment methods</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="data-protection" 
        isExpanded={expandedSections['data-protection']} 
        onClick={toggleSection}
      >
        Data Protection and Privacy
      </ClickableHeadline>
      {expandedSections['data-protection'] && (
        <>
          <p className="mb-6 text-left">
            Your personal and financial data must be protected throughout the transfer process. Understand how providers should handle your information.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Data Protection Measures</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Data Encryption</strong>: Secure transmission and storage</li>
              <li className="text-left"><strong>Privacy Policies</strong>: Clear data handling practices</li>
              <li className="text-left"><strong>Data Minimization</strong>: Collecting only necessary information</li>
              <li className="text-left"><strong>Access Controls</strong>: Limiting data access</li>
              <li className="text-left"><strong>Data Retention</strong>: Secure disposal of information</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="compliance" 
        isExpanded={expandedSections['compliance']} 
        onClick={toggleSection}
      >
        Regulatory Compliance
      </ClickableHeadline>
      {expandedSections['compliance'] && (
        <>
          <p className="mb-4 text-left">
            Compliance with financial regulations is a key indicator of a provider's trustworthiness. Learn about the important regulations and how they protect you.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Anti-Money Laundering (AML)</h3>
              <p className="mb-4 text-left">
                How providers prevent money laundering and what it means for your transfers.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Know Your Customer (KYC)</h3>
              <p className="mb-4 text-left">
                Why providers need to verify your identity and how they do it securely.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. International Regulations</h3>
              <p className="mb-4 text-left">
                How different countries regulate money transfers and what it means for you.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="verification" 
        isExpanded={expandedSections['verification']} 
        onClick={toggleSection}
      >
        Verifying Provider Trustworthiness
      </ClickableHeadline>
      {expandedSections['verification'] && (
        <>
          <p className="mb-6 text-left">
            Before using a transfer service, it's crucial to verify their trustworthiness. Here's how to check if a provider is legitimate and reliable.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Verification Steps</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>License Check</strong>: Verify regulatory registration</li>
              <li className="text-left"><strong>Reviews and Ratings</strong>: Check customer feedback</li>
              <li className="text-left"><strong>Company History</strong>: Research provider background</li>
              <li className="text-left"><strong>Security Certifications</strong>: Look for industry standards</li>
              <li className="text-left"><strong>Customer Support</strong>: Test response quality</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="risk-management" 
        isExpanded={expandedSections['risk-management']} 
        onClick={toggleSection}
      >
        Risk Management Strategies
      </ClickableHeadline>
      {expandedSections['risk-management'] && (
        <>
          <p className="mb-4 text-left">
            Understanding and managing risks is essential for secure transfers. Learn how to identify and mitigate potential risks.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Risk Type</th>
                  <th className="py-2 px-4 text-left">Mitigation Strategy</th>
                  <th className="py-2 px-4 text-left">Provider Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Transaction Risk</td>
                  <td className="py-2 px-4 text-left">Verify recipient details</td>
                  <td className="py-2 px-4 text-left">Transaction monitoring</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Security Risk</td>
                  <td className="py-2 px-4 text-left">Use secure devices</td>
                  <td className="py-2 px-4 text-left">Encryption and protection</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Compliance Risk</td>
                  <td className="py-2 px-4 text-left">Provide accurate information</td>
                  <td className="py-2 px-4 text-left">Regulatory compliance</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Operational Risk</td>
                  <td className="py-2 px-4 text-left">Choose reliable providers</td>
                  <td className="py-2 px-4 text-left">Service reliability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-practices" 
        isExpanded={expandedSections['best-practices']} 
        onClick={toggleSection}
      >
        Best Practices for Secure Transfers
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis of secure transfer practices, here are the key steps that consistently deliver the safest results:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Seven Critical Security Factors</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Always verify provider legitimacy</li>
              <li className="text-left">Use secure devices and networks</li>
              <li className="text-left">Enable two-factor authentication</li>
              <li className="text-left">Keep personal information private</li>
              <li className="text-left">Monitor transfer status</li>
              <li className="text-left">Report suspicious activity</li>
              <li className="text-left">Maintain security awareness</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts: Security in Practice</h2>
          <p className="mb-6 text-left">
            Security in international transfers is about creating multiple layers of protection. While this guide provides a comprehensive framework, remember that security is an ongoing process that requires 
            constant attention and adaptation.
          </p>
          <p className="text-left">
            The most secure transfer experiences combine knowledge of security best practices with careful provider selection and personal vigilance. By following these guidelines and staying informed about new security threats and solutions, you can make international transfers as secure as possible.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <>
      <SEO 
        title="Security in Money Transfers | MyMoneyTransfers"
        description="Learn how to protect your money with secure transfer options and best practices for safe international payments."
        canonicalUrl="/guides/criteria/security"
      />
      <GuideDetail
        title="Security in Money Transfers"
        subtitle="Protecting your money when sending internationally"
        content={content}
        heroImage={heroImageJpg}
        webp={heroImageWebp}
        publishDate="Updated May 5, 2025"
        readTime="10"
        relatedGuides={relatedGuides}
      />
    </>
  );
};

export default Security; 