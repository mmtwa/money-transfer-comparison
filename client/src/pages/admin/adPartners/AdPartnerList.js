import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdPartnerList = () => {
  const [adPartners, setAdPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdPartners = async () => {
      try {
        const response = await axios.get('/api/admin/ad-partners');
        setAdPartners(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load ad partners');
        setLoading(false);
        console.error('Error fetching ad partners:', err);
      }
    };

    fetchAdPartners();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`/api/admin/ad-partners/${id}`);
        setAdPartners(adPartners.filter(partner => partner._id !== id));
      } catch (err) {
        setError('Failed to delete ad partner');
        console.error('Error deleting ad partner:', err);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Ad Partners</h1>
          <Link 
            to="/admin/ad-partners/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Partner
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contract End
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {adPartners.length > 0 ? (
                adPartners.map((partner) => (
                  <tr key={partner._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        {partner.logo && (
                          <div className="flex-shrink-0 w-10 h-10 mr-3">
                            <img className="w-full h-full rounded-full object-contain" src={partner.logo} alt={partner.name} />
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 whitespace-no-wrap">{partner.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{partner.code}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        partner.status === 'active' ? 'bg-green-100 text-green-800' :
                        partner.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {format(new Date(partner.contractEndDate), 'MMM dd, yyyy')}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center space-x-3">
                        <Link to={`/admin/ad-partners/${partner._id}/edit`} className="text-blue-600 hover:text-blue-900">
                          <FaEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(partner._id, partner.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">
                    No ad partners found. Click "Add New Partner" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdPartnerList; 