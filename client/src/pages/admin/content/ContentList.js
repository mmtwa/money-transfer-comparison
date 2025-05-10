import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Plus, Eye, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

const ContentList = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedSections, setExpandedSections] = useState({});

  // Define guide sections based on Guides.js structure
  const guideSections = [
    {
      id: 'basics',
      title: 'Money Transfer Basics',
      paths: [
        '/guides/getting-started',
        '/guides/exchange-rates',
        '/guides/transfer-fees',
        '/guides/family-remittances',
        '/guides/business-transfers',
        '/guides/security-tips'
      ]
    },
    {
      id: 'countries',
      title: 'Country-Specific Transfer Guides',
      paths: [
        '/guides/send-money-to-india',
        '/guides/send-money-to-philippines',
        '/guides/send-money-to-mexico',
        '/guides/send-money-to-pakistan',
        '/guides/send-money-to-nigeria',
        '/guides/send-money-to-poland',
        '/guides/send-money-to-romania',
        '/guides/send-money-to-china',
        '/guides/send-money-to-morocco',
        '/guides/send-money-to-vietnam',
        '/guides/send-money-to-bangladesh',
        '/guides/send-money-to-canada'
      ]
    },
    {
      id: 'value',
      title: 'Value of Transfer',
      paths: [
        '/guides/high-value',
        '/guides/mid-value',
        '/guides/low-value',
        '/guides/micro'
      ]
    },
    {
      id: 'purpose',
      title: 'Transfer Purpose',
      paths: [
        '/guides/purpose/property',
        '/guides/purpose/study',
        '/guides/purpose/family',
        '/guides/purpose/nomad',
        '/guides/purpose/business'
      ]
    },
    {
      id: 'frequency',
      title: 'Transfer Frequency',
      paths: [
        '/guides/frequency/regular',
        '/guides/frequency/periodic',
        '/guides/frequency/one-time',
        '/guides/frequency/occasional'
      ]
    },
    {
      id: 'corridors',
      title: 'Key Transfer Corridors',
      paths: [
        '/guides/corridors/uk-asia',
        '/guides/corridors/us-latam',
        '/guides/corridors/eu-africa',
        '/guides/corridors/aus-pacific',
        '/guides/corridors/gulf-asia'
      ]
    },
    {
      id: 'criteria',
      title: 'Transfer by Criteria',
      paths: [
        '/guides/criteria/cost',
        '/guides/criteria/convenience',
        '/guides/criteria/security',
        '/guides/criteria/service'
      ]
    },
    {
      id: 'method',
      title: 'Transfer Method',
      paths: [
        '/guides/method/digital-native',
        '/guides/method/digital-adapter',
        '/guides/method/traditional'
      ]
    }
  ];

  // Initialize expanded sections
  useEffect(() => {
    const initialExpandedState = {};
    guideSections.forEach(section => {
      initialExpandedState[section.id] = true; // Start with all sections expanded
    });
    setExpandedSections(initialExpandedState);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/content');
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
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await axios.delete(`/api/admin/content/${id}`);
        // Remove deleted content from state
        setContent(content.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting content:', err);
        alert(err.response?.data?.message || 'Error deleting content');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Group content by section
  const getContentBySection = (sectionPaths) => {
    return content.filter(item => {
      // Convert paths to match content slug format
      const normalizedPaths = sectionPaths.map(path => path.replace(/^\/guides/, ''));
      return normalizedPaths.some(path => item.slug === path || item.slug === path.substring(1));
    });
  };

  const filteredContent = filter === 'all' 
    ? content
    : content.filter(item => item.type === filter);

  // Count how many guides from the expected list are missing
  const getMissingGuidesCount = (section) => {
    const sectionContent = getContentBySection(section.paths);
    return section.paths.length - sectionContent.length;
  };

  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
            <p className="text-gray-600">Manage website guides, FAQs, and pages</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="all">All Types</option>
                <option value="guide">Guides</option>
                <option value="faq">FAQs</option>
                <option value="page">Pages</option>
              </select>
            </div>
            <Link 
              to="/admin/content/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Section-based content display */}
            <div className="p-4">
              {guideSections.map(section => {
                const sectionContent = getContentBySection(section.paths);
                const missingCount = getMissingGuidesCount(section);
                
                return (
                  <div key={section.id} className="mb-8 border rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <span className="ml-3 text-sm text-gray-500">
                          ({sectionContent.length} / {section.paths.length} guides)
                        </span>
                        {missingCount > 0 && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {missingCount} missing
                          </span>
                        )}
                      </div>
                      {expandedSections[section.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedSections[section.id] && (
                      <div className="overflow-x-auto">
                        {sectionContent.length > 0 ? (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Last Updated
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {sectionContent.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{item.title}</div>
                                    <div className="text-sm text-gray-500">{item.slug}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${item.status === 'published' ? 'bg-green-100 text-green-800' : 
                                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-gray-100 text-gray-800'}`}>
                                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.updatedDate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                      <Link 
                                        to={`/admin/content/${item._id}/view`} 
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="View"
                                      >
                                        <Eye className="w-5 h-5" />
                                      </Link>
                                      <Link 
                                        to={`/admin/content/${item._id}/edit`} 
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Edit"
                                      >
                                        <Edit className="w-5 h-5" />
                                      </Link>
                                      <button 
                                        onClick={() => handleDelete(item._id)} 
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p>No content found in this section.</p>
                            <div className="mt-2">
                              <h3 className="text-sm font-medium">Guides expected in this section:</h3>
                              <ul className="mt-1 text-xs text-left list-disc pl-5">
                                {section.paths.map(path => (
                                  <li key={path} className="mt-1">
                                    <Link 
                                      to={`/admin/content/new?path=${path}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {path}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {/* Missing guides list */}
                        {missingCount > 0 && sectionContent.length > 0 && (
                          <div className="bg-yellow-50 p-3 border-t">
                            <h4 className="text-sm font-medium text-yellow-800">Missing guides in this section:</h4>
                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {section.paths.filter(path => 
                                !sectionContent.some(item => 
                                  item.slug === path.replace(/^\/guides/, '') || 
                                  item.slug === path.substring(1).replace(/^guides/, '')
                                )
                              ).map(path => (
                                <Link 
                                  key={path}
                                  to={`/admin/content/new?path=${path}`}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {path}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Other content (not in guides sections) */}
            {filteredContent.filter(item => 
              !guideSections.some(section => 
                section.paths.some(path => 
                  item.slug === path.replace(/^\/guides/, '') || 
                  item.slug === path.substring(1).replace(/^guides/, '')
                )
              )
            ).length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Other Content</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContent.filter(item => 
                        !guideSections.some(section => 
                          section.paths.some(path => 
                            item.slug === path.replace(/^\/guides/, '') || 
                            item.slug === path.substring(1).replace(/^guides/, '')
                          )
                        )
                      ).map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.slug}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.type === 'guide' ? 'bg-green-100 text-green-800' : 
                              item.type === 'faq' ? 'bg-blue-100 text-blue-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.status === 'published' ? 'bg-green-100 text-green-800' : 
                              item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.updatedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link 
                                to={`/admin/content/${item._id}/view`} 
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              <Link 
                                to={`/admin/content/${item._id}/edit`} 
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button 
                                onClick={() => handleDelete(item._id)} 
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentList; 