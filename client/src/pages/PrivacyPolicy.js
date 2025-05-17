import React, { useEffect } from 'react';

/**
 * Privacy Policy page
 */

import SEO from '../components/SEO';
const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO 
        title=" Privacy Policy | MyMoneyTransfers"
        description=" Privacy Policy - MyMoneyTransfers provides detailed information to help you make informed decisions about international money transfers."
        canonicalUrl="/privacy-policy"
      />
      <div className="container mx-auto px-6 py-8 max-w-4xl text-left">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Introduction</h2>
          <p>
            Welcome to mymoneytransfers.com ("we," "our," or "us"). We are committed to protecting your privacy
            and providing you with a safe online experience. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website and use our money transfer comparison service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Information We Collect</h2>
          <p>We collect information in the following ways:</p>
          <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Contact information (such as name, email address)</li>
            <li>Account information when you register</li>
            <li>Transaction details (currency pairs, amounts)</li>
            <li>Feedback and correspondence (surveys, customer support)</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Usage data (pages visited, time spent)</li>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Location data</li>
            <li>Cookies and similar technologies (see our Cookie Policy)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our service</li>
            <li>Process your comparison requests</li>
            <li>Improve and personalize user experience</li>
            <li>Communicate with you about our services</li>
            <li>Monitor service usage and trends</li>
            <li>Detect, prevent, and address technical or security issues</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Money transfer service providers (when you explicitly request more information)</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your consent</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access, correct, or delete your personal information</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent (where processing is based on consent)</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we
            cannot guarantee absolute security.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. International Transfers</h2>
          <p>
            Your information may be transferred to, stored, and processed in countries other than your country of residence.
            We ensure appropriate safeguards are in place for such transfers.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Children's Privacy</h2>
          <p>
            Our service is not directed to individuals under the age of 18. We do not knowingly collect personal
            information from children. If you believe we have collected information from a child, please contact us.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:privacy@mymoneytransfers.com" className="text-indigo-600 hover:underline">
              privacy@mymoneytransfers.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 