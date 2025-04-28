import React, { useState } from 'react';

/**
 * FAQ page component
 */
const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);
  
  const toggleItem = (index) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };
  
  const faqItems = [
    {
      question: "How does the money transfer comparison work?",
      answer: "Our platform connects to multiple money transfer providers to get real-time exchange rates and fees. We display all options side by side so you can easily compare and choose the provider that offers the best value for your specific transfer."
    },
    {
      question: "Is it free to use the comparison service?",
      answer: "Yes, our comparison service is completely free to use. We receive a commission from some providers when you click through our site and complete a transaction, but this never affects our rankings or recommendations."
    },
    {
      question: "How do you determine which provider is best?",
      answer: "We rank providers based on the total amount the recipient will receive after all fees and exchange rate margins are applied. This gives you the clearest picture of which provider offers the best value for your specific transfer."
    },
    {
      question: "Do you show all available money transfer providers?",
      answer: "We cover most major money transfer providers, but we may not include every provider in the market. We regularly update our provider list to ensure comprehensive coverage."
    },
    {
      question: "Are the exchange rates shown guaranteed?",
      answer: "The exchange rates we display are pulled in real-time from our providers, but rates can fluctuate quickly. The final rate will be confirmed when you proceed to the provider's website to complete your transaction."
    },
    {
      question: "How do I actually make the transfer?",
      answer: "After comparing providers on our site, you'll click through to your chosen provider's website to complete the transaction. You'll need to register with the provider if you don't already have an account."
    },
    {
      question: "How long do international transfers take?",
      answer: "Transfer times vary by provider, destination country, payment method, and other factors. We show the estimated transfer time for each provider in our comparison results."
    },
    {
      question: "What information do I need to make an international transfer?",
      answer: "Generally, you'll need the recipient's full name, bank account details (including IBAN for many countries), and sometimes their address. Requirements can vary by provider and destination country."
    },
    {
      question: "Is my money safe when using these providers?",
      answer: "We only list regulated money transfer providers that comply with relevant financial regulations in the countries where they operate. Many providers also offer additional security measures like encryption and fraud monitoring."
    },
    {
      question: "What if something goes wrong with my transfer?",
      answer: "If you encounter issues with your transfer, you should contact the provider directly. Most providers have customer service teams that can help resolve problems. We also recommend checking the provider's terms and conditions regarding cancellations and refunds."
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 py-10 pt-[1px]">
      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 text-center mb-8">
              Find answers to common questions about money transfers and our comparison service
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="font-semibold text-lg">{item.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${openItem === index ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {openItem === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 