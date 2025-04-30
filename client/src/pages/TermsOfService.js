import React, { useEffect } from 'react';

/**
 * Terms of Service page
 */
const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none text-left">
        <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Introduction and Acceptance</h2>
        <p>
          Welcome to mymoneytransfers.com. These Terms of Service ("Terms") govern your access to and use of our website
          and services. By accessing or using our service, you agree to be bound by these Terms. If you disagree
          with any part of the Terms, you may not access the service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Service Description</h2>
        <p>
          mymoneytransfers.com is a comparison platform that provides information about various money transfer
          services. We aim to help you find the most suitable money transfer provider for your needs by comparing
          rates, fees, delivery times, and other relevant factors.
        </p>
        <p>
          We are not a money transfer service provider ourselves. We do not process transfers or handle funds.
          We provide information and comparison tools only.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. Using Our Service</h2>
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.1 Eligibility</h3>
        <p>
          You must be at least 18 years old to use our service. By using our service, you represent and warrant
          that you meet this requirement.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.2 User Accounts</h3>
        <p>
          Some features of our service may require registration. You agree to provide accurate, current, and
          complete information during the registration process and to update such information to keep it accurate,
          current, and complete. You are responsible for safeguarding your password and for all activities that
          occur under your account.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.3 Prohibited Conduct</h3>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Use our service for any illegal purpose or in violation of any laws</li>
          <li>Violate the intellectual property rights of others</li>
          <li>Interfere with or disrupt our service or servers</li>
          <li>Attempt to gain unauthorized access to any part of our service</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Use our service for any fraudulent or deceptive purpose</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Content and Information Accuracy</h2>
        <p>
          We strive to provide accurate and up-to-date information about money transfer services. However, we do
          not guarantee the accuracy, completeness, or reliability of any information on our website. The rates,
          fees, and other details displayed are for informational purposes only and may change without notice.
        </p>
        <p>
          We recommend that you verify all information directly with the money transfer provider before making
          any decisions or completing any transactions.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our service, including but not limited to text, graphics,
          logos, icons, images, and software, are the exclusive property of mymoneytransfers.com or its licensors
          and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
          republish, download, store, or transmit any of the material on our website without our prior written consent.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Third-Party Websites and Services</h2>
        <p>
          Our service may contain links to third-party websites or services that are not owned or controlled by
          mymoneytransfers.com. We have no control over and assume no responsibility for the content, privacy
          policies, or practices of any third-party websites or services.
        </p>
        <p>
          We do not warrant the offerings of any third-party providers, and you acknowledge and agree that we shall
          not be responsible or liable for any damage or loss caused by your use of any such websites or services.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. Limitation of Liability</h2>
        <p>
          In no event shall mymoneytransfers.com, its directors, employees, partners, agents, suppliers, or affiliates
          be liable for any indirect, incidental, special, consequential, or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
          to or use of or inability to access or use the service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless mymoneytransfers.com and its licensors and service
          providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses,
          or fees arising out of or relating to your violation of these Terms or your use of the service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">9. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. The most current version will always
          be on this page. If the revision is material, we will provide at least 30 days' notice before the new
          terms take effect. By continuing to access or use our service after those revisions become effective,
          you agree to be bound by the revised terms.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of [Your Country/State],
          without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <br />
          <a href="mailto:legal@mymoneytransfers.com" className="text-indigo-600 hover:underline">
            legal@mymoneytransfers.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService; 