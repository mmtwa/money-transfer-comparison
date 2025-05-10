import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  Plus, Edit, Trash2, Power, Database, 
  Search, RefreshCw, CheckCircle, XCircle 
} from 'lucide-react';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [toggleLoading, setToggleLoading] = useState(null);

  // Fetch providers
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/providers');
      setProviders(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Toggle provider active status
  const toggleProviderStatus = async (id) => {
    try {
      setToggleLoading(id);
      const response = await axios.post(`/api/admin/providers/${id}/toggle-status`);
      
      // Update the provider in the list
      setProviders(providers.map(provider => 
        provider._id === id ? response.data.data : provider
      ));
      
      setError(null);
    } catch (err) {
      console.error('Error toggling provider status:', err);
      setError('Failed to update provider status');
    } finally {
      setToggleLoading(null);
    }
  };

  // Delete provider
  const deleteProvider = async (id) => {
    if (!window.confirm('Are you sure you want to delete this provider?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/providers/${id}`);
      
      // Remove the provider from the list
      setProviders(providers.filter(provider => provider._id !== id));
      
      setError(null);
    } catch (err) {
      console.error('Error deleting provider:', err);
      setError('Failed to delete provider');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort providers
  const filteredProviders = providers
    .filter(provider => 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      // Handle different field types
      if (sortField === 'name' || sortField === 'code') {
        comparison = a[sortField].localeCompare(b[sortField]);
      } else if (sortField === 'active' || sortField === 'apiEnabled') {
        comparison = (a[sortField] === b[sortField]) ? 0 : a[sortField] ? -1 : 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-gray-600">Manage your money transfer providers</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/admin/providers/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Provider
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={fetchProviders}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Database className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-xl font-medium text-gray-500">No providers found</p>
            <p className="text-gray-500 mt-1">Add your first provider to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Provider Name
                      {sortField === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center">
                      Code
                      {sortField === 'code' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('active')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'active' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('apiEnabled')}
                  >
                    <div className="flex items-center">
                      API Status
                      {sortField === 'apiEnabled' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProviders.map(provider => (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-contain" 
                            src={provider.logo} 
                            alt={provider.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {provider.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {provider.active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {provider.apiEnabled ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Enabled
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => toggleProviderStatus(provider._id)}
                          className={`p-1 rounded-md ${provider.active ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                          disabled={toggleLoading === provider._id}
                        >
                          {toggleLoading === provider._id ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <Power className="h-5 w-5" />
                          )}
                        </button>
                        <Link 
                          to={`/admin/providers/${provider._id}/edit`}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => deleteProvider(provider._id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProviderList; 