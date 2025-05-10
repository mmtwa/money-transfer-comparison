import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, ArrowLeft, Calendar, Clock, Tag, Star, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/content/${id}`);
        setContent(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err.response?.data?.message || 'Error fetching content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-2">Loading content...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Content</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/admin/content')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Content List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!content) {
    return (
      <AdminLayout>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Content Not Found</h2>
            <p className="text-gray-600 mb-4">The requested content item could not be found.</p>
            <button 
              onClick={() => navigate('/admin/content')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Content List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/content')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
          </div>
          <Link
            to={`/admin/content/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Link>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Content</h2>
              <div className="bg-gray-50 p-6 rounded-md whitespace-pre-wrap font-mono text-sm">
                {content.content}
              </div>
            </div>

            {content.seo && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO Information</h2>
                <div className="bg-gray-50 p-6 rounded-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">SEO Title</h3>
                    <p className="text-gray-900">{content.seo.title || 'Not specified'}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Meta Description</h3>
                    <p className="text-gray-900">{content.seo.description || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.seo.keywords && content.seo.keywords.length > 0 ? (
                        content.seo.keywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs"
                          >
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No keywords specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - metadata */}
          <div>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-md text-blue-600 mr-3">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Type</h4>
                    <p className="text-gray-900 capitalize">{content.type}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md text-green-600 mr-3">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Category</h4>
                    <p className="text-gray-900">{content.category || 'Uncategorized'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-md text-purple-600 mr-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Published</h4>
                    <p className="text-gray-900">{formatDate(content.publishedDate)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-md text-yellow-600 mr-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Last Updated</h4>
                    <p className="text-gray-900">{formatDate(content.updatedDate)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`${content.featured ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'} p-2 rounded-md mr-3`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Featured</h4>
                    <p className="text-gray-900">{content.featured ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {content.analytics && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Analytics</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Views</h4>
                    <p className="text-2xl font-bold text-blue-600">{content.analytics.views || 0}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Avg. Time on Page</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {content.analytics.averageTimeOnPage ? `${content.analytics.averageTimeOnPage}s` : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Bounce Rate</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {content.analytics.bounceRate ? `${content.analytics.bounceRate}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentDetail; 