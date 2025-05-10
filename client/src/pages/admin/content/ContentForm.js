import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

const ContentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    type: 'guide',
    category: '',
    status: 'draft',
    featured: false,
    images: {
      heroImage: '',
      contentImages: []
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);

  // Helper to get guide type from path
  const getTypeFromPath = (path) => {
    if (path.includes('/faq/')) return 'faq';
    if (path.includes('/page/')) return 'page';
    return 'guide';
  };

  // Helper to get category from path
  const getCategoryFromPath = (path) => {
    // Extract category based on path patterns
    if (path.includes('/purpose/')) return 'Purpose';
    if (path.includes('/frequency/')) return 'Frequency';
    if (path.includes('/corridors/')) return 'Corridors';
    if (path.includes('/criteria/')) return 'Criteria';
    if (path.includes('/method/')) return 'Method';
    if (path.includes('/send-money-to-')) return 'Country Guides';
    
    // Default categories based on specific paths
    if (path.includes('/high-value') || path.includes('/mid-value') || 
        path.includes('/low-value') || path.includes('/micro')) return 'Value';
    
    if (path.includes('/getting-started') || path.includes('/exchange-rates') || 
        path.includes('/transfer-fees') || path.includes('/family-remittances') || 
        path.includes('/business-transfers') || path.includes('/security-tips')) return 'Basics';
    
    return '';
  };

  // Helper to determine a suggested hero image based on slug
  const getSuggestedHeroImage = (slug) => {
    if (slug.includes('send-money-to-')) {
      const country = slug.replace(/^\/?(guides\/)?send-money-to-/, '');
      return `/images/guides/${country}-transfer-hero-optimized-hero-new.webp`;
    }
    
    if (slug.includes('getting-started')) return '/images/guides/international-transfers-hero.webp';
    if (slug.includes('exchange-rates')) return '/images/guides/exchange-rates-hero-optimized.webp';
    if (slug.includes('transfer-fees')) return '/images/guides/transfer-fees-hero-optimized.webp';
    if (slug.includes('security-tips')) return '/images/guides/security-hero-optimized.webp';
    if (slug.includes('family-remittances')) return '/images/guides/family-remittances-hero-optimized.webp';
    if (slug.includes('business-transfers')) return '/images/guides/business-transfers-hero-optimized.webp';
    
    // Default hero image
    return '/images/guides/default-guide-hero.webp';
  };

  // Helper to generate a title from slug
  const generateTitleFromSlug = (slug) => {
    // Remove leading slashes and 'guides' prefix if present
    let cleanSlug = slug.replace(/^\/?(guides\/)?/, '');
    
    // Special case for country guides
    if (cleanSlug.startsWith('send-money-to-')) {
      const country = cleanSlug.replace('send-money-to-', '');
      return `How to Send Money to ${country.charAt(0).toUpperCase() + country.slice(1)}`;
    }
    
    // Handle special cases for paths with subfolders
    if (cleanSlug.includes('/')) {
      const parts = cleanSlug.split('/');
      const lastPart = parts[parts.length - 1];
      
      // Format specific guide types
      if (parts[0] === 'purpose') {
        return `Guide to ${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)} Transfers`;
      }
      if (parts[0] === 'frequency') {
        return `${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)} Transfers Guide`;
      }
      if (parts[0] === 'criteria') {
        return `Choosing Money Transfers by ${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)}`;
      }
      if (parts[0] === 'method') {
        return `Money Transfers for ${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)} Users`;
      }
      if (parts[0] === 'corridors') {
        return `Money Transfer Corridor: ${lastPart.toUpperCase().replace(/-/g, ' to ')}`;
      }
    }
    
    // General case - convert slug to title case with spaces
    return cleanSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' Guide';
  };

  // Load available images
  useEffect(() => {
    const fetchAvailableImages = async () => {
      try {
        // This path would need to be implemented on the backend
        const response = await axios.get('/api/admin/content/images');
        setAvailableImages(response.data.images || []);
      } catch (err) {
        console.error('Error fetching available images:', err);
        // Provide some default image paths as fallback
        setAvailableImages([
          '/images/guides/international-transfers-hero.webp',
          '/images/guides/exchange-rates-hero-optimized.webp',
          '/images/guides/transfer-fees-hero-optimized.webp',
          '/images/guides/security-hero-optimized.webp',
          '/images/guides/family-remittances-hero-optimized.webp',
          '/images/guides/business-transfers-hero-optimized.webp',
          '/images/guides/wu-phone.webp'
        ]);
      }
    };

    fetchAvailableImages();
  }, []);

  useEffect(() => {
    // If editing, fetch the content data
    if (isEdit) {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`/api/admin/content/${id}`);
          const contentData = res.data.data;
          
          // Format keywords array into comma-separated string
          const formattedData = {
            ...contentData,
            seo: {
              ...contentData.seo,
              keywords: contentData.seo?.keywords?.join(', ') || ''
            },
            // Ensure images object exists
            images: contentData.images || {
              heroImage: '',
              contentImages: []
            }
          };
          
          setFormData(formattedData);
          setError(null);
        } catch (err) {
          console.error('Error fetching content:', err);
          setError(err.response?.data?.message || 'Error fetching content');
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    } else {
      // For new content, check if path is provided in URL parameters
      const queryParams = new URLSearchParams(location.search);
      const guidePath = queryParams.get('path');
      
      if (guidePath) {
        // Extract slug from path
        const slug = guidePath.replace(/^\/guides/, '');
        const type = getTypeFromPath(guidePath);
        const category = getCategoryFromPath(guidePath);
        const title = generateTitleFromSlug(guidePath);
        const heroImage = getSuggestedHeroImage(slug);
        
        // Pre-populate form with guide data
        setFormData(prev => ({
          ...prev,
          title,
          slug: slug.startsWith('/') ? slug.substring(1) : slug,
          type,
          category,
          status: 'published', // Default to published for guides
          images: {
            ...prev.images,
            heroImage
          },
          seo: {
            ...prev.seo,
            title: title,
            description: `Learn about ${title.toLowerCase()} with our comprehensive guide.`,
            keywords: 'money transfer, international transfers, guide'
          }
        }));
      }
    }
  }, [id, isEdit, location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., seo.title, images.heroImage)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({
      ...formData,
      slug
    });
  };

  // Add content image
  const addContentImage = () => {
    if (formData.images.contentImageToAdd) {
      setFormData({
        ...formData,
        images: {
          ...formData.images,
          contentImages: [...formData.images.contentImages, formData.images.contentImageToAdd],
          contentImageToAdd: ''
        }
      });
    }
  };

  // Remove content image
  const removeContentImage = (index) => {
    const updatedImages = [...formData.images.contentImages];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        contentImages: updatedImages
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Format data to match API expectations
      const submitData = {
        ...formData,
        seo: {
          ...formData.seo,
          // Convert comma-separated keywords to array
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
        }
      };
      
      if (isEdit) {
        await axios.put(`/api/admin/content/${id}`, submitData);
      } else {
        await axios.post('/api/admin/content', submitData);
      }
      
      navigate('/admin/content');
    } catch (err) {
      console.error('Error saving content:', err);
      setError(err.response?.data?.message || 'Error saving content');
      setSaving(false);
    }
  };

  // Generate template content based on content type
  const generateTemplateContent = () => {
    const { slug, type, title, images } = formData;
    
    if (type === 'guide') {
      const heroImageMarkdown = images.heroImage ? 
        `![${title} Hero Image](${images.heroImage})\n\n` : '';

      return `# ${title}\n\n${heroImageMarkdown}## Introduction\n\nThis guide provides information about ${title.toLowerCase()}.\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3\n\n## Summary\n\nSummary of the guide.`;
    }
    
    if (type === 'faq') {
      return `# Frequently Asked Questions about ${title}\n\n## Question 1\n\nAnswer to question 1.\n\n## Question 2\n\nAnswer to question 2.\n\n## Question 3\n\nAnswer to question 3.`;
    }
    
    return `# ${title}\n\nContent for ${slug}`;
  };
  
  // Apply template
  const applyTemplate = () => {
    if (!formData.content || formData.content.trim() === '') {
      setFormData({
        ...formData,
        content: generateTemplateContent()
      });
    } else if (window.confirm('This will replace your current content. Are you sure?')) {
      setFormData({
        ...formData,
        content: generateTemplateContent()
      });
    }
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
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Content' : 'Add New Content'}
            </h1>
          </div>
          <div className="flex gap-2">
            {!isEdit && (
              <button
                type="button"
                onClick={applyTemplate}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center"
              >
                Apply Template
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main column - content editor */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="guide">Guide</option>
                    <option value="faq">FAQ</option>
                    <option value="page">Page</option>
                  </select>
                </div>
              </div>

              {/* Image selection section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image
                </label>
                <div className="flex items-center mb-2">
                  <select
                    name="images.heroImage"
                    value={formData.images.heroImage}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a hero image</option>
                    {availableImages.map((image, index) => (
                      <option key={index} value={image}>
                        {image.split('/').pop()}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.images.heroImage && (
                  <div className="mt-2 border rounded-md p-2">
                    <img 
                      src={formData.images.heroImage} 
                      alt="Hero preview" 
                      className="max-h-32 mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* Content images section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Images
                </label>
                <div className="flex items-center mb-2">
                  <select
                    name="images.contentImageToAdd"
                    value={formData.images.contentImageToAdd || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an image to add</option>
                    {availableImages.map((image, index) => (
                      <option key={index} value={image}>
                        {image.split('/').pop()}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addContentImage}
                    disabled={!formData.images.contentImageToAdd}
                    className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                {formData.images.contentImages && formData.images.contentImages.length > 0 && (
                  <div className="mt-2 border rounded-md p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.contentImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Content image ${index + 1}`} 
                            className="h-24 w-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeContentImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                          >
                            ✕
                          </button>
                          <div className="text-xs truncate mt-1">{image.split('/').pop()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  To insert images in your content, use Markdown: ![Alt text](image-path)
                </p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="15"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Markdown formatting is supported
                </p>
              </div>
            </div>

            {/* Sidebar - metadata */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Publishing Options</h3>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured content
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4">SEO Options</h3>
                
                <div className="mb-4">
                  <label htmlFor="seo.title" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seo.title"
                    name="seo.title"
                    value={formData.seo.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="seo.description" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="seo.description"
                    name="seo.description"
                    value={formData.seo.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="seo.keywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    id="seo.keywords"
                    name="seo.keywords"
                    value={formData.seo.keywords}
                    onChange={handleChange}
                    placeholder="Comma-separated keywords"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ContentForm; 