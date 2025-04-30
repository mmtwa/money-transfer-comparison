import React from 'react';

/**
 * Legal Disclosure page (Impressum)
 */
const LegalDisclosure = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Legal Disclosure</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Company Information</h2>
        <p>
          <strong>Company Name:</strong> Money Transfer Comparison Ltd<br />
          <strong>Address:</strong> 123 Financial Street, London, EC1V 1AB, United Kingdom<br />
          <strong>Email:</strong> <a href="mailto:contact@mymoneytransfers.com" className="text-indigo-600 hover:underline">contact@mymoneytransfers.com</a><br />
          <strong>Phone:</strong> +44 123 456 7890<br />
          <strong>Company Registration Number:</strong> 12345678<br />
          <strong>VAT Identification Number:</strong> GB123456789
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Responsible for Content</h2>
        <p>
          <strong>Managing Director:</strong> John Smith<br />
          <strong>Address:</strong> 123 Financial Street, London, EC1V 1AB, United Kingdom<br />
          <strong>Email:</strong> <a href="mailto:john.smith@mymoneytransfers.com" className="text-indigo-600 hover:underline">john.smith@mymoneytransfers.com</a>
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. Regulatory Information</h2>
        <p>
          Money Transfer Comparison Ltd is registered with the Financial Conduct Authority (FCA) as an Information Service Provider.
          We are not a money transfer service provider ourselves and do not process any financial transactions.
        </p>
        <p>
          <strong>FCA Registration Number:</strong> 123456
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Disclaimer</h2>
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">4.1 Limitation of Liability</h3>
        <p>
          The contents of this website have been prepared with the utmost care. However, we cannot guarantee
          the accuracy, completeness, or timeliness of the information provided. As a service provider, we are
          responsible for our own content on these pages according to general laws. However, we are not obliged
          to monitor transmitted or stored third-party information or to investigate circumstances that indicate
          illegal activity.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">4.2 External Links</h3>
        <p>
          Our website contains links to external websites of third parties, over whose content we have no influence.
          Therefore, we cannot assume any liability for these external contents. The respective provider or operator
          of the linked pages is always responsible for the content of the linked pages. The linked pages were checked
          for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
        </p>
        <p>
          However, a permanent control of the content of the linked pages is not reasonable without concrete evidence
          of a violation of law. If we become aware of any legal violations, we will remove such links immediately.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Copyright</h2>
        <p>
          The content and works created by the site operators on these pages are subject to copyright law.
          Duplication, processing, distribution, or any form of commercialization of such material beyond the
          scope of the copyright law shall require the prior written consent of its respective author or creator.
          Downloads and copies of this site are only permitted for private, non-commercial use.
        </p>
        <p>
          Insofar as the content on this site was not created by the operator, the copyrights of third parties
          are respected. In particular, third-party content is marked as such. Should you nevertheless become aware
          of a copyright infringement, please inform us accordingly. If we become aware of any infringements,
          we will remove such content immediately.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Dispute Resolution</h2>
        <p>
          The European Commission provides a platform for online dispute resolution (OS): 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mx-1">
            https://ec.europa.eu/consumers/odr/
          </a>
          Our email address can be found in the Legal Disclosure above.
        </p>
        <p>
          We are not willing or obliged to participate in dispute resolution proceedings before a
          consumer arbitration board.
        </p>
      </div>
    </div>
  );
};

export default LegalDisclosure; 