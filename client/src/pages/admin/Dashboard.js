import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, Database, Award, BarChart2, 
  FileText, Zap, DollarSign, Eye
} from 'lucide-react';

const DashboardCard = ({ title, value, icon, linkTo, color }) => (
  <Link 
    to={linkTo} 
    className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition duration-200 hover:translate-y-[-5px] ${color}`}
  >
    <div className={`text-3xl mb-2 ${color}`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    providers: {
      total: 0,
      active: 0
    },
    adPartners: {
      total: 0,
      active: 0
    },
    campaigns: {
      total: 0,
      active: 0
    },
    content: {
      total: 0,
      published: 0
    },
    users: {
      total: 0,
      admins: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch providers stats
        const providerRes = await axios.get('/api/admin/analytics/providers');
        const providerStats = providerRes.data.data.summary;
        
        // Fetch campaign stats
        const campaignRes = await axios.get('/api/admin/analytics/campaigns');
        const campaignStats = campaignRes.data.data.summary;
        
        // Fetch ad partners
        const adPartnerRes = await axios.get('/api/admin/ad-partners');
        const adPartnerData = adPartnerRes.data.data;
        
        // Fetch content stats
        const contentRes = await axios.get('/api/admin/content');
        const contentData = contentRes.data.data;
        
        // Fetch users (if admin)
        const userRes = await axios.get('/api/users');
        const userData = userRes.data.data;
        
        setStats({
          providers: {
            total: providerStats.totalProviders || 0,
            active: providerStats.activeProviders || 0
          },
          adPartners: {
            total: adPartnerData.length || 0,
            active: adPartnerData.filter(p => p.status === 'active').length || 0
          },
          campaigns: {
            total: campaignStats.totalCampaigns || 0,
            active: campaignRes.data.data.campaigns.filter(c => c.status === 'active').length || 0
          },
          content: {
            total: contentData.length || 0,
            published: contentData.filter(c => c.status === 'published').length || 0
          },
          users: {
            total: userData.length || 0,
            admins: userData.filter(u => u.isAdmin).length || 0
          }
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Set default stats in case of error
        setStats({
          providers: {
            total: 0,
            active: 0
          },
          adPartners: {
            total: 0,
            active: 0
          },
          campaigns: {
            total: 0,
            active: 0
          },
          content: {
            total: 0,
            published: 0
          },
          users: {
            total: 0,
            admins: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder cards */}
          <DashboardCard title="Providers" value="--" icon={<Database />} linkTo="/admin/providers" color="text-blue-600" />
          <DashboardCard title="Ad Partners" value="--" icon={<Award />} linkTo="/admin/ad-partners" color="text-purple-600" />
          <DashboardCard title="Campaigns" value="--" icon={<BarChart2 />} linkTo="/admin/campaigns" color="text-green-600" />
          <DashboardCard title="Content" value="--" icon={<FileText />} linkTo="/admin/content" color="text-amber-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Providers" 
          value={`${stats.providers.active}/${stats.providers.total}`} 
          icon={<Database />} 
          linkTo="/admin/providers" 
          color="text-blue-600" 
        />
        <DashboardCard 
          title="Ad Partners" 
          value={`${stats.adPartners.active}/${stats.adPartners.total}`} 
          icon={<Award />} 
          linkTo="/admin/ad-partners" 
          color="text-purple-600" 
        />
        <DashboardCard 
          title="Campaigns" 
          value={`${stats.campaigns.active}/${stats.campaigns.total}`} 
          icon={<BarChart2 />} 
          linkTo="/admin/campaigns" 
          color="text-green-600" 
        />
        <DashboardCard 
          title="Content" 
          value={`${stats.content.published}/${stats.content.total}`} 
          icon={<FileText />} 
          linkTo="/admin/content" 
          color="text-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/admin/providers/new" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <Database className="w-5 h-5 mr-3 text-blue-600" />
              <span>Add New Provider</span>
            </Link>
            <Link to="/admin/ad-partners/new" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <Award className="w-5 h-5 mr-3 text-purple-600" />
              <span>Add New Ad Partner</span>
            </Link>
            <Link to="/admin/content/new" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <FileText className="w-5 h-5 mr-3 text-amber-600" />
              <span>Create New Content</span>
            </Link>
            <Link to="/admin/users/new" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <Users className="w-5 h-5 mr-3 text-teal-600" />
              <span>Add New User</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-indigo-500" />
            System Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold">{stats.users.total}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Admin Users</span>
              <span className="font-semibold">{stats.users.admins}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Active Providers</span>
              <span className="font-semibold">{stats.providers.active}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Active Campaigns</span>
              <span className="font-semibold">{stats.campaigns.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Published Content</span>
              <span className="font-semibold">{stats.content.published}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 