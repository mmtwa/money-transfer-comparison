import React from 'react';
import GuideDetail from '../GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../../components/common/ClickableHeadline';
import useExpandableSections from '../../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../../assets/images/guides/service-hero-optimized.jpg';
import heroImageWebp from '../../../assets/images/guides/service-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../../components/common/ResponsiveImage';
import SEO from '../../../components/SEO';

/**
 * Guide to service quality in international transfers
 */

const Service = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'customer-support': true,
    'transfer-experience': true,
    'problem-resolution': true,
    'service-features': true,
    'provider-selection': true,
    'quality-standards': true,
    'best-practices': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Convenience',
      description: 'Learn how to make international transfers as easy and convenient as possible.',
      path: '/guides/criteria/convenience'
    },
    {
      title: 'Security and Trust',
      description: 'How to ensure your international transfers are secure and trustworthy.',
      path: '/guides/criteria/security'
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
        The Ultimate Guide to Quality Service in International Money Transfers
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            Quality service is essential for a smooth international transfer experience. This comprehensive guide will help you understand what makes a great money transfer service and how to find providers that deliver exceptional quality.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Why Service Quality Matters</h3>
            <p className="mb-4 text-left">
              "I switched providers after my transfer was delayed for three days with no explanation," says Emma from Glasgow. "The difference in service quality was like night and day."
            </p>
            <p className="text-left">
              This guide will show you how to identify and benefit from high-quality transfer services, ensuring a smooth and reliable experience every time.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="customer-support" 
        isExpanded={expandedSections['customer-support']} 
        onClick={toggleSection}
      >
        Customer Support Excellence
      </ClickableHeadline>
      {expandedSections['customer-support'] && (
        <>
          <p className="mb-4 text-left">
            Quality customer support is a cornerstone of excellent service. Learn what to look for in a provider's support system.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Support Channels</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">24/7 availability</li>
                <li className="text-left">Multiple contact methods</li>
                <li className="text-left">Local language support</li>
                <li className="text-left">Response time standards</li>
              </ul>
            </div>
            
            <div className="bg-white shadow-sm rounded p-5">
              <h3 className="text-lg font-bold text-indigo-600 mb-2 text-left">Support Quality</h3>
              <ul className="list-disc pl-8">
                <li className="text-left">Knowledgeable staff</li>
                <li className="text-left">Problem-solving ability</li>
                <li className="text-left">Communication clarity</li>
                <li className="text-left">Follow-up procedures</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="transfer-experience" 
        isExpanded={expandedSections['transfer-experience']} 
        onClick={toggleSection}
      >
        Transfer Experience Quality
      </ClickableHeadline>
      {expandedSections['transfer-experience'] && (
        <>
          <p className="mb-6 text-left">
            The quality of the transfer experience itself is crucial. Learn what makes a transfer process smooth and efficient.
          </p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-left">Key Experience Elements</h3>
            
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2 text-left"><strong>Process Simplicity</strong>: Easy-to-follow steps</li>
              <li className="mb-2 text-left"><strong>Clear Communication</strong>: Regular updates</li>
              <li className="mb-2 text-left"><strong>Speed and Reliability</strong>: Consistent delivery</li>
              <li className="mb-2 text-left"><strong>Error Prevention</strong>: Clear validation</li>
              <li className="mb-2 text-left"><strong>User Interface</strong>: Intuitive design</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="problem-resolution" 
        isExpanded={expandedSections['problem-resolution']} 
        onClick={toggleSection}
      >
        Problem Resolution Excellence
      </ClickableHeadline>
      {expandedSections['problem-resolution'] && (
        <>
          <p className="mb-6 text-left">
            How a provider handles problems is a true test of service quality. Learn what to expect in terms of problem resolution.
          </p>

          <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg my-8">
            <h3 className="text-xl font-bold text-yellow-800 mb-2 text-left">Resolution Standards</h3>
            <ul className="list-disc pl-8">
              <li className="text-left"><strong>Response Time</strong>: Quick acknowledgment</li>
              <li className="text-left"><strong>Resolution Process</strong>: Clear steps</li>
              <li className="text-left"><strong>Communication</strong>: Regular updates</li>
              <li className="text-left"><strong>Escalation Path</strong>: Clear hierarchy</li>
              <li className="text-left"><strong>Prevention</strong>: Learning from issues</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="service-features" 
        isExpanded={expandedSections['service-features']} 
        onClick={toggleSection}
      >
        Quality Service Features
      </ClickableHeadline>
      {expandedSections['service-features'] && (
        <>
          <p className="mb-4 text-left">
            High-quality transfer services offer features that enhance the user experience. Learn what features to look for.
          </p>
          
          <div className="space-y-8 ml-4 pl-6 border-l-2 border-indigo-200 mb-8">
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">1. Transfer Management</h3>
              <p className="mb-4 text-left">
                Features that make managing transfers easier and more efficient.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">2. Account Features</h3>
              <p className="mb-4 text-left">
                Tools and options that enhance account management and security.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-33px] top-1 h-5 w-5 rounded-full bg-indigo-600"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1 text-left">3. Additional Services</h3>
              <p className="mb-4 text-left">
                Value-added services that complement the core transfer offering.
              </p>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="provider-selection" 
        isExpanded={expandedSections['provider-selection']} 
        onClick={toggleSection}
      >
        Selecting Quality Providers
      </ClickableHeadline>
      {expandedSections['provider-selection'] && (
        <>
          <p className="mb-6 text-left">
            Choosing the right provider is crucial for receiving quality service. Learn how to evaluate providers effectively.
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Selection Criteria</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left"><strong>Service Reviews</strong>: Customer feedback</li>
              <li className="text-left"><strong>Provider History</strong>: Track record</li>
              <li className="text-left"><strong>Service Range</strong>: Available features</li>
              <li className="text-left"><strong>Support Quality</strong>: Customer service</li>
              <li className="text-left"><strong>Technology</strong>: Platform quality</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="quality-standards" 
        isExpanded={expandedSections['quality-standards']} 
        onClick={toggleSection}
      >
        Quality Standards and Metrics
      </ClickableHeadline>
      {expandedSections['quality-standards'] && (
        <>
          <p className="mb-4 text-left">
            Understanding quality standards helps you evaluate service providers effectively. Learn about key metrics and standards.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-2 px-4 text-left">Standard</th>
                  <th className="py-2 px-4 text-left">Measurement</th>
                  <th className="py-2 px-4 text-left">Expectation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-4 text-left">Response Time</td>
                  <td className="py-2 px-4 text-left">Initial contact</td>
                  <td className="py-2 px-4 text-left">Under 2 hours</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Resolution Time</td>
                  <td className="py-2 px-4 text-left">Problem solving</td>
                  <td className="py-2 px-4 text-left">24-48 hours</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Transfer Speed</td>
                  <td className="py-2 px-4 text-left">Delivery time</td>
                  <td className="py-2 px-4 text-left">As advertised</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-left">Accuracy</td>
                  <td className="py-2 px-4 text-left">Error rate</td>
                  <td className="py-2 px-4 text-left">99.9%+</td>
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
        Best Practices for Quality Service
      </ClickableHeadline>
      {expandedSections['best-practices'] && (
        <>
          <p className="mb-6 text-left">
            Based on our analysis of successful transfer experiences, here are the key practices that consistently deliver quality service:
          </p>

          <div className="bg-indigo-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 text-left">Seven Critical Success Factors</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Research providers thoroughly</li>
              <li className="text-left">Check customer reviews</li>
              <li className="text-left">Test customer support</li>
              <li className="text-left">Verify service features</li>
              <li className="text-left">Monitor transfer progress</li>
              <li className="text-left">Provide feedback</li>
              <li className="text-left">Stay informed about updates</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Final Thoughts: Quality in Practice</h2>
          <p className="mb-6 text-left">
            Quality service in international transfers is about finding the right balance between features, support, and reliability. While this guide provides a comprehensive framework, remember that the best service depends on your specific needs and preferences.
          </p>
          <p className="text-left">
            The most successful users combine knowledge of quality standards with careful provider selection and active engagement. By following these guidelines and staying informed about service developments, you can ensure a consistently high-quality transfer experience.
          </p>
        </>
      )}
    </>
  );

  // Return the GuideDetail component with our content
  return (
    <>
      <SEO 
        title="Service Quality in Money Transfers | MyMoneyTransfers"
        description="Learn how to evaluate customer service when choosing a money transfer provider and why it matters for your experience."
        canonicalUrl="/guides/criteria/service"
      />
      <GuideDetail
        title="Service Quality in Money Transfers"
        subtitle="Why customer support matters when sending money internationally"
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

export default Service; 