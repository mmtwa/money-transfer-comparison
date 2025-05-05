import React from 'react';
import GuideDetail from '../GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../../assets/images/guides/method/digital-adapter-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/method/digital-adapter-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../../components/common/ResponsiveImage';

/**
 * Guide for digital adapters transitioning to modern money transfer methods
 */
const DigitalAdapter = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'transition-strategy': true,
    'digital-basics': true,
    'mobile-banking': true,
    'online-platforms': true,
    'security-fundamentals': true,
    'hybrid-approach': true,
    'building-confidence': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Digital Natives Guide',
      description: 'Advanced digital solutions for tech-savvy users.',
      path: '/guides/method/digital-native'
    },
    {
      title: 'Traditional Users Guide',
      description: 'Understanding traditional banking methods and when to use them.',
      path: '/guides/method/traditional'
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
        The Digital Adapter's Guide to Modern Money Transfers: Making the Transition
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            If you're comfortable with basic technology but still prefer some traditional banking methods, this guide is for you. We'll help you transition to digital solutions at your own pace while maintaining the security and reliability you value.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Transition to Digital?</h3>
            <p className="mb-4 text-left">
              While traditional banking methods are familiar, digital solutions offer significant advantages in terms of convenience, speed, and often lower costs. This guide will help you understand these benefits while addressing common concerns.
            </p>
            <p className="text-left">
              We'll take a measured approach, introducing digital tools gradually and explaining each step clearly, ensuring you feel confident and secure in your transition.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transition-strategy" 
        isExpanded={expandedSections['transition-strategy']} 
        onClick={toggleSection}
      >
        Your Personal Transition Strategy
      </ClickableHeadline>
      {expandedSections['transition-strategy'] && (
        <>
          <p className="mb-4 text-left">
            A successful transition to digital banking requires a thoughtful approach. Here's how to make the switch comfortably and securely.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Getting Started</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Start with familiar features</li>
                <li className="text-left">Use bank's mobile app for basic tasks</li>
                <li className="text-left">Enable online banking alerts</li>
                <li className="text-left">Practice with small transfers</li>
                <li className="text-left">Keep traditional options as backup</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Building Confidence</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Learn one feature at a time</li>
                <li className="text-left">Use bank's tutorial resources</li>
                <li className="text-left">Start with domestic transfers</li>
                <li className="text-left">Track your progress</li>
                <li className="text-left">Celebrate small wins</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="digital-basics" 
        isExpanded={expandedSections['digital-basics']} 
        onClick={toggleSection}
      >
        Understanding Digital Banking Basics
      </ClickableHeadline>
      {expandedSections['digital-basics'] && (
        <>
          <p className="mb-6 text-left">
            Before diving into international transfers, it's important to understand the fundamental concepts of digital banking.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Key Digital Banking Concepts</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Online Banking</strong>: Access your accounts through secure websites</li>
              <li className="mb-2 text-left"><strong>Mobile Banking</strong>: Manage your money through smartphone apps</li>
              <li className="mb-2 text-left"><strong>Digital Wallets</strong>: Store payment information securely</li>
              <li className="mb-2 text-left"><strong>Two-Factor Authentication</strong>: Extra security for your accounts</li>
              <li className="mb-2 text-left"><strong>Real-time Notifications</strong>: Stay informed about your transactions</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="mobile-banking" 
        isExpanded={expandedSections['mobile-banking']} 
        onClick={toggleSection}
      >
        Getting Comfortable with Mobile Banking
      </ClickableHeadline>
      {expandedSections['mobile-banking'] && (
        <>
          <p className="mb-6 text-left">
            Mobile banking apps are becoming essential tools for managing money. Here's how to use them effectively and securely.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Mobile Banking Essentials</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>App Security</strong>: Setting up proper authentication</li>
              <li className="text-left"><strong>Basic Features</strong>: Checking balances and recent transactions</li>
              <li className="text-left"><strong>Transfer Options</strong>: Sending money to other accounts</li>
              <li className="text-left"><strong>Bill Payments</strong>: Setting up and managing payments</li>
              <li className="text-left"><strong>Alerts</strong>: Customizing notifications for your needs</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="online-platforms" 
        isExpanded={expandedSections['online-platforms']} 
        onClick={toggleSection}
      >
        Exploring Online Money Transfer Platforms
      </ClickableHeadline>
      {expandedSections['online-platforms'] && (
        <>
          <p className="mb-4 text-left">
            Online money transfer platforms offer convenient alternatives to traditional bank transfers. Learn how to use them safely and effectively.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Choosing the Right Platform</h3>
              <p className="mb-4 text-left">
                How to evaluate and select reliable online transfer services that meet your needs.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Setting Up Your Account</h3>
              <p className="mb-4 text-left">
                Step-by-step guide to creating and securing your online transfer account.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Making Your First Transfer</h3>
              <p className="mb-4 text-left">
                Detailed instructions for completing your first online international transfer.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="security-fundamentals" 
        isExpanded={expandedSections['security-fundamentals']} 
        onClick={toggleSection}
      >
        Essential Security Practices
      </ClickableHeadline>
      {expandedSections['security-fundamentals'] && (
        <>
          <p className="mb-6 text-left">
            Security is crucial when using digital banking services. Here are the fundamental practices you need to know.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Basic Security Measures</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Password Management</strong>: Creating and storing strong passwords</li>
              <li className="text-left"><strong>Device Security</strong>: Protecting your computer and smartphone</li>
              <li className="text-left"><strong>Network Safety</strong>: Using secure internet connections</li>
              <li className="text-left"><strong>Account Monitoring</strong>: Regular checking of transactions</li>
              <li className="text-left"><strong>Scam Awareness</strong>: Recognizing and avoiding common frauds</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="hybrid-approach" 
        isExpanded={expandedSections['hybrid-approach']} 
        onClick={toggleSection}
      >
        The Hybrid Approach: Combining Traditional and Digital
      </ClickableHeadline>
      {expandedSections['hybrid-approach'] && (
        <>
          <p className="mb-4 text-left">
            You don't have to go fully digital overnight. A hybrid approach can help you transition comfortably.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Traditional Method</th>
                  <th className="py-2 px-4 text-left">Digital Alternative</th>
                  <th className="py-2 px-4 text-left">Transition Tips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Branch Visits</td>
                  <td className="py-2 px-4 text-left">Mobile Banking</td>
                  <td className="py-2 px-4 text-left">Start with basic transactions</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Paper Statements</td>
                  <td className="py-2 px-4 text-left">Digital Statements</td>
                  <td className="py-2 px-4 text-left">Enable email notifications</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Phone Banking</td>
                  <td className="py-2 px-4 text-left">Online Support</td>
                  <td className="py-2 px-4 text-left">Use chat features first</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Cash Transactions</td>
                  <td className="py-2 px-4 text-left">Digital Payments</td>
                  <td className="py-2 px-4 text-left">Try small amounts first</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="building-confidence" 
        isExpanded={expandedSections['building-confidence']} 
        onClick={toggleSection}
      >
        Building Confidence in Digital Banking
      </ClickableHeadline>
      {expandedSections['building-confidence'] && (
        <>
          <p className="mb-6 text-left">
            Confidence comes with practice and understanding. Here's how to build your digital banking skills.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Steps to Digital Confidence</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Start with familiar banking tasks</li>
              <li className="text-left">Use bank's learning resources</li>
              <li className="text-left">Practice with small amounts</li>
              <li className="text-left">Keep records of digital transactions</li>
              <li className="text-left">Stay updated on new features</li>
              <li className="text-left">Join online banking communities</li>
              <li className="text-left">Celebrate your progress</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Your Digital Banking Journey</h2>
          <p className="mb-6 text-left">
            Remember that transitioning to digital banking is a journey, not a race. Take your time, ask questions, and use the resources available to you.
          </p>
          <p className="text-left">
            With patience and practice, you'll soon be comfortable with digital banking methods while maintaining the security and reliability you value in traditional banking.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <GuideDetail
      title="The Digital Adapter's Guide to Modern Money Transfers"
      subtitle="Transition to digital banking at your own pace while maintaining security and reliability"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 5, 2025"
      readTime="12"
      relatedGuides={relatedGuides}
    />
  );
};

export default DigitalAdapter; 