import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * About Us page component with a design inspired by Nike's about page
 */
const AboutUs = () => {
  // Navigate back to home page
  const handleNavigateHome = () => {
    window.history.pushState(
      { page: 'home' }, 
      'Home', 
      '/'
    );
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header onLogoClick={handleNavigateHome} />
      
      {/* Hero Statement - Bold typography with mission statement */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-bold mb-10 tracking-tight">
              We <br className="hidden md:block" />
              <span className="text-indigo-600">EMPOWER</span> <br className="hidden md:block" />
              YOUR <br className="hidden md:block" />
              TRANSFERS
            </h1>
          </div>
        </div>
      </section>
      
      {/* Mission Statement - Bold with clear purpose */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl md:text-3xl leading-relaxed font-light">
              At Money Transfer Comparison, we believe <span className="font-medium">everyone deserves access to fair, transparent, 
              and affordable international money transfer services</span>. Our mission is simple: to help you make 
              informed decisions when sending money abroad.
            </p>
          </div>
        </div>
      </section>
      
      {/* Who We Serve - Visual typography section */}
      <section className="py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap">
            <div className="w-full md:w-1/3 p-4">
              <h2 className="text-5xl font-bold text-indigo-600 mb-4">WE</h2>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <h2 className="text-5xl font-bold text-indigo-600 mb-4">SERVE</h2>
            </div>
            <div className="w-full md:w-2/3 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-xl md:text-2xl font-bold py-2">FAMILIES</div>
                <div className="text-xl md:text-2xl font-bold py-2">STUDENTS</div>
                <div className="text-xl md:text-2xl font-bold py-2">BUSINESSES</div>
                <div className="text-xl md:text-2xl font-bold py-2">TRAVELERS</div>
                <div className="text-xl md:text-2xl font-bold py-2">IMMIGRANTS</div>
                <div className="text-xl md:text-2xl font-bold py-2">EVERYONE</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Editor's Pick / Featured Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg uppercase tracking-wider text-gray-500 mb-8">Featured Story</h2>
            
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Real-time Comparisons For Real Savings</h3>
                <p className="text-lg leading-relaxed mb-6">
                  We aggregate data from leading money transfer providers and display real-time exchange rates and fees,
                  making it easy to compare and find the best deal for your transfer.
                </p>
                <p className="text-lg leading-relaxed">
                  Our platform covers a wide range of currencies and countries, ensuring you can find the 
                  best provider no matter where you're sending money to or from.
                </p>
              </div>
              <div className="w-full md:w-1/2 p-4 flex items-center justify-center">
                <div className="bg-indigo-50 rounded-lg p-8 w-full h-64 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What We Do Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg uppercase tracking-wider text-gray-500 mb-12">What We Do</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-lg p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Unbiased Recommendations</h3>
                <p className="text-gray-700">
                  We provide transparent, unbiased comparisons based on actual exchange rates, fees, and transfer speeds, 
                  helping you find the provider that truly offers the best value.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Educational Resources</h3>
                <p className="text-gray-700">
                  We provide guides and resources to help you understand the money transfer market, 
                  enabling you to make informed decisions beyond just comparing rates.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Global Coverage</h3>
                <p className="text-gray-700">
                  Our platform covers a wide range of currencies and countries, ensuring you can 
                  find the best provider no matter where you're sending money to or from.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Real-Time Updates</h3>
                <p className="text-gray-700">
                  We provide up-to-the-minute exchange rates and fee information, ensuring you 
                  always have the most current data to make your decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg uppercase tracking-wider text-gray-500 mb-8">From The Archive</h2>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h3>
            
            <div className="bg-white p-8 rounded-lg">
              <p className="text-lg leading-relaxed mb-6">
                Money Transfer Comparison was founded by a team of fintech enthusiasts who experienced 
                firsthand the challenges of sending money internationally - from high fees and poor 
                exchange rates to confusing processes and lack of transparency.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as a simple spreadsheet comparing a few providers for personal use has evolved 
                into a comprehensive platform used by thousands of people around the world to save money 
                on their international transfers.
              </p>
              <p className="text-lg leading-relaxed">
                Our commitment to transparency, accuracy, and user-centered design has made us a trusted 
                resource in the money transfer space, and we continue to innovate and improve our platform 
                to better serve your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find the Best Rate?</h2>
            <p className="text-xl mb-10">Compare providers now and start saving on your international money transfers.</p>
            <button 
              onClick={handleNavigateHome}
              className="inline-block bg-white text-indigo-600 font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Compare Rates
            </button>
          </div>
        </div>
      </section>
      
      <Footer onAboutClick={() => {}} />
    </div>
  );
};

export default AboutUs; 