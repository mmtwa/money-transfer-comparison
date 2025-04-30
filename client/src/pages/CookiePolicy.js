import React from 'react';

/**
 * Cookie Policy page
 */
const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Introduction</h2>
        <p>
          This Cookie Policy explains how mymoneytransfers.com ("we", "us", or "our") uses cookies and similar
          technologies when you visit our website. It explains what these technologies are and why we use them,
          as well as your rights to control our use of them.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website.
          They are widely used to make websites work more efficiently and provide information to the website owners.
          Cookies enhance user experience by allowing websites to remember your preferences and understand how you
          interact with the website.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. Types of Cookies We Use</h2>
        <p>We use the following types of cookies:</p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They enable basic functions like page
          navigation, access to secure areas, and security features. The website cannot function properly without
          these cookies, and they can only be disabled by changing your browser settings.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.2 Preference Cookies</h3>
        <p>
          These cookies allow us to remember choices you make and provide enhanced, personalized features. They
          may be set by us or by third-party providers whose services we have added to our pages. If you do not
          allow these cookies, some or all of these services may not function properly.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.3 Analytics Cookies</h3>
        <p>
          These cookies collect information about how visitors use our website, such as which pages visitors go to
          most often and if they get error messages from web pages. These cookies don't collect information that
          identifies a visitor. We use this information to improve our website and provide a better user experience.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">3.4 Marketing Cookies</h3>
        <p>
          These cookies are used to track visitors across websites. They are set by third-party advertising networks
          with our permission and are used to build a profile of your interests and show you relevant ads on other
          websites. If you do not allow these cookies, you will experience less targeted advertising.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Specific Cookies We Use</h2>
        <table className="min-w-full bg-white border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border text-left">Cookie Name</th>
              <th className="py-2 px-4 border text-left">Purpose</th>
              <th className="py-2 px-4 border text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">_ga</td>
              <td className="py-2 px-4 border">Used by Google Analytics to distinguish users</td>
              <td className="py-2 px-4 border">2 years</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">_gid</td>
              <td className="py-2 px-4 border">Used by Google Analytics to distinguish users</td>
              <td className="py-2 px-4 border">24 hours</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">_gat</td>
              <td className="py-2 px-4 border">Used by Google Analytics to throttle request rate</td>
              <td className="py-2 px-4 border">1 minute</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">currency_preferences</td>
              <td className="py-2 px-4 border">Stores your currency preferences for calculations</td>
              <td className="py-2 px-4 border">30 days</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">session_id</td>
              <td className="py-2 px-4 border">Maintains your session state</td>
              <td className="py-2 px-4 border">Session</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">cookie_consent</td>
              <td className="py-2 px-4 border">Records your cookie consent preferences</td>
              <td className="py-2 px-4 border">1 year</td>
            </tr>
          </tbody>
        </table>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Third-Party Cookies</h2>
        <p>
          We use services from Google Analytics, Facebook, and other third parties that set their own cookies.
          These companies use cookies to collect information about your activity across different websites and
          provide services like analytics and targeted advertising.
        </p>
        <p>
          We do not control these third-party cookies. You can control or delete them through your browser settings
          and using tools provided by these third parties.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Managing Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Most web browsers allow you to manage cookie settings.
          You can:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Delete cookies from your device</li>
          <li>Block cookies by activating the setting on your browser that allows you to refuse some or all cookies</li>
          <li>Set your browser to notify you when you receive a cookie</li>
        </ul>
        <p>
          Please be aware that if you disable or reject cookies, some parts of our website may not function properly,
          and your experience may be affected.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
          business practices. Any changes will be posted on this page, and if the changes are significant, we will
          provide a more prominent notice.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us at:
          <br />
          <a href="mailto:privacy@mymoneytransfers.com" className="text-indigo-600 hover:underline">
            privacy@mymoneytransfers.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy; 