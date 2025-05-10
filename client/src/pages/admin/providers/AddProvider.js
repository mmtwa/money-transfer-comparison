import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProviderForm from '../../../components/admin/providers/ProviderForm';

const AddProvider = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      await axios.post('/api/admin/providers', formData);
      navigate('/admin/providers', { state: { message: 'Provider created successfully' } });
    } catch (err) {
      console.error('Error creating provider:', err);
      setError(err.response?.data?.message || 'Failed to create provider');
      throw err; // Re-throw for the form component to handle
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Provider</h1>
        <p className="text-gray-600">Create a new money transfer provider</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <ProviderForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default AddProvider; 