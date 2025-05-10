import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProviderForm from '../../../components/admin/providers/ProviderForm';

const EditProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/providers/${id}`);
        setProvider(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load provider data');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/admin/providers/${id}`, formData);
      navigate('/admin/providers', { state: { message: 'Provider updated successfully' } });
    } catch (err) {
      console.error('Error updating provider:', err);
      setError(err.response?.data?.message || 'Failed to update provider');
      throw err; // Re-throw for the form component to handle
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Provider</h1>
        <p className="text-gray-600">Update provider details and settings</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : provider ? (
        <ProviderForm provider={provider} onSubmit={handleSubmit} />
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Provider not found. The provider may have been deleted or you don't have permission to view it.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default EditProvider; 