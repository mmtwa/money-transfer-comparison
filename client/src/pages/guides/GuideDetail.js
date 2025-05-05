import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ResponsiveImage from '../../components/common/ResponsiveImage';
import useScrollProgress from '../../hooks/useScrollProgress';

/**
 * GuideDetail component - template for all guide articles
 */
const GuideDetail = ({ 
  title, 
  subtitle, 
  content, 
  heroImage,
  webp,
  publishDate,
  readTime,
  relatedGuides = []
}) => {
  const progress = useScrollProgress();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate the gradient color based on progress
  const getGradientColor = () => {
    if (progress <= 0) return '#6366f1';
    if (progress >= 100) return '#3CBF7A';
    
    // Interpolate between purple and green based on progress
    const startColor = [99, 102, 241]; // #6366f1
    const endColor = [60, 191, 122];   // #3CBF7A
    
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (progress / 100));
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (progress / 100));
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (progress / 100));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Debug progress value
  useEffect(() => {
    console.log('Scroll progress:', progress);
  }, [progress]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Progress Bar - Positioned at 72px to match mobile menu */}
      <div 
        className="fixed top-[72px] left-0 h-2 z-[9999] transition-all duration-300 shadow-lg"
        style={{ 
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0,
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: getGradientColor(),
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 9999
        }}
      />

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link 
              to="/guides"
              className="flex items-center text-indigo-600 mb-8 hover:text-indigo-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Guides
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-900">{title}</h1>
            <p className="text-xl text-gray-600 mb-6">
              {subtitle}
            </p>
            
            <div className="flex items-center text-sm text-gray-500">
              {publishDate && (
                <span className="flex items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {publishDate}
                </span>
              )}
              
              {readTime && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero Image (if provided) */}
      {heroImage && (
        <div className="w-full max-w-4xl mx-auto -mt-8 mb-8 px-4">
          <ResponsiveImage 
            src={heroImage} 
            webp={webp}
            alt={title} 
            className="w-full h-auto rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1024px"
            lazy={false} // Hero image should load immediately
          />
        </div>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-indigo max-w-none">
              {content}
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Guides Section */}
      {relatedGuides.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Related Guides</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {relatedGuides.map((guide, index) => (
                  <Link 
                    key={index} 
                    to={guide.path} 
                    className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">{guide.title}</h3>
                    <p className="text-gray-600 text-sm">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default GuideDetail; 