import React from 'react';
import GuideDetail from './GuideDetail';
import { Link } from 'react-router-dom';

/**
 * Security Tips for Money Transfers guide page
 */
const SecurityTips = () => {
  return (
    <GuideDetail
      title="Security Tips for Money Transfers: How to Protect Your Funds"
      subtitle="Essential guidance on keeping your international transfers secure and what steps to take if something goes wrong."
      publishDate="12 September 2023"
      readTime="8 min read"
      heroImage="/images/guides/animated-svg-placeholder.html"
      content={
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl font-medium mb-8 text-left">
            As international money transfers become increasingly common, so do the security risks associated with them. With the right knowledge and precautions, you can ensure your money reaches its intended destination safely.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-lg my-8">
            <h3 className="text-red-700 font-bold text-lg mb-2 text-left">Security Alert</h3>
            <p className="text-red-700 mb-0 text-left">
              In 2022, financial fraud losses in the UK reached £1.2 billion, with a significant portion related to payment scams. Being vigilant with your transfers has never been more important.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 text-left">Common Security Risks You Should Know</h2>
          
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-600 h-2"></div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-left">Phishing Scams</h3>
                <p className="mb-4 text-left">
                  Fraudsters pose as legitimate money transfer services, sending deceptive communications to steal your credentials.
                </p>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1 text-left">Warning Signs:</p>
                  <ul className="text-sm text-red-700 pl-8 space-y-1">
                    <li className="text-left">Requests to verify account details</li>
                    <li className="text-left">Urgent password update notifications</li>
                    <li className="text-left">Confirmations for transfers you didn't make</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-600 h-2"></div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-left">Man-in-the-Middle Attacks</h3>
                <p className="mb-4 text-left">
                  These sophisticated attacks intercept your communications with money transfer providers, potentially altering payment details.
                </p>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1 text-left">Protection Strategy:</p>
                  <p className="text-sm text-red-700 text-left">
                    Always use secure, private networks and verify the website has proper HTTPS encryption.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-600 h-2"></div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-left">Fraudulent Recipients</h3>
                <p className="mb-4 text-left">
                  Scammers may convince you to transfer money for goods or services that don't exist or aren't as described.
                </p>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1 text-left">Red Flag:</p>
                  <p className="text-sm text-red-700 text-left">
                    Requests for payment via methods with little consumer protection, particularly for first-time transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <blockquote className="italic border-l-4 border-indigo-500 pl-4 my-8 text-gray-700 text-left">
            "The most secure money transfer is one where you've verified both the provider and the recipient before sending a penny."
          </blockquote>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">Choosing Providers with Strong Security Measures</h2>
          
          <p className="mb-6 text-left">
            Not all money transfer services are created equal when it comes to security. Here's what to look for:
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 my-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Regulatory Compliance</h3>
                <ul className="space-y-2 text-gray-700 pl-4">
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>FCA registration (UK)</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AML compliance</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>KYC protocols</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Security Features</h3>
                <ul className="space-y-2 text-gray-700 pl-4">
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Two-factor authentication</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Transaction monitoring</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-3 text-left">Company Reputation</h3>
                <ul className="space-y-2 text-gray-700 pl-4">
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Independent reviews</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>History of operation</span>
                  </li>
                  <li className="flex items-start gap-2 text-left">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Incident response record</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">The Secure Transfer Checklist</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden my-8">
            <div className="bg-indigo-600 p-4">
              <h3 className="text-white font-semibold text-lg m-0 text-left">Your Step-by-Step Security Guide</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-900 mb-3 text-left">Before the Transfer</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-left">Verify recipient details thoroughly</p>
                      <p className="text-sm text-gray-600 text-left">Double-check all banking information or collection details before confirming.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-left">Use only secure networks</p>
                      <p className="text-sm text-gray-600 text-left">Never make transfers on public Wi-Fi or shared computers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-left">Keep software updated</p>
                      <p className="text-sm text-gray-600 text-left">Ensure your device has the latest security patches installed.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium text-left">Use strong, unique passwords</p>
                      <p className="text-sm text-gray-600 text-left">Never reuse passwords across different financial services.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-900 mb-3 text-left">During the Transfer</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-left">Check the website URL</p>
                      <p className="text-sm text-gray-600 text-left">Ensure you're on the legitimate website with proper HTTPS encryption.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-left">Be wary of unexpected fees</p>
                      <p className="text-sm text-gray-600 text-left">Question any charges that weren't disclosed upfront.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-left">Watch for unusual behavior</p>
                      <p className="text-sm text-gray-600 text-left">Slow processing or unexpected errors could indicate security issues.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 text-left">What to Do If Something Goes Wrong</h2>
          
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-amber-100 p-4">
                <h3 className="text-amber-800 font-semibold text-lg">If You Suspect Fraud</h3>
              </div>
              <div className="p-5">
                <ol className="space-y-2 pl-5 list-decimal">
                  <li className="font-medium">Contact your money transfer provider immediately</li>
                  <li>Report the incident to your bank if you used a bank account or card</li>
                  <li>File a report with Action Fraud (UK) or appropriate authorities</li>
                  <li>Document all communications and evidence</li>
                </ol>
                <p className="text-sm text-gray-600 mt-4">Time is critical - report suspected fraud within 24 hours.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-amber-100 p-4">
                <h3 className="text-amber-800 font-semibold text-lg">If Funds Aren't Received</h3>
              </div>
              <div className="p-5">
                <ol className="space-y-2 pl-5 list-decimal">
                  <li className="font-medium">Check the transfer status with your provider</li>
                  <li>Verify that all recipient details were correct</li>
                  <li>Ask about potential delays in the destination country</li>
                  <li>Request a trace on the transfer</li>
                </ol>
                <p className="text-sm text-gray-600 mt-4">Most delayed transfers are resolved within 3-5 business days.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-amber-100 p-4">
                <h3 className="text-amber-800 font-semibold text-lg">Disputing a Transfer</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span><strong>Act quickly</strong> - time limits apply for claims</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <span><strong>Follow specific processes</strong> for your provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span><strong>Provide documentation</strong> of the issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                    <span><strong>Escalate to ombudsman</strong> if necessary</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">The Financial Ombudsman Service can help with unresolved UK complaints.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg my-10 flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Find Secure Transfer Providers</h3>
              <p className="text-indigo-900">Compare international money transfer services with strong security features.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150">
                Compare Secure Providers
              </Link>
            </div>
          </div>
        </div>
      }
      relatedGuides={[
        {
          title: "Getting Started with International Transfers",
          description: "Learn the basics of sending money internationally, including key terminology and processes you should know.",
          path: "/guides/getting-started"
        },
        {
          title: "Transfer Fees Explained",
          description: "A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.",
          path: "/guides/transfer-fees"
        },
        {
          title: "Family Remittances",
          description: "Best practices for regular international remittances, how to set up recurring transfers and save on fees.",
          path: "/guides/family-remittances"
        }
      ]}
    />
  );
};

export default SecurityTips; 