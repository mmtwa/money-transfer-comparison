import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Settings, Users, Database, BarChart2, 
  FileText, Package, Award, LogOut, Menu, X,
  Monitor, Smartphone, Tablet, Grid
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authenticated and is an admin
  if (!user || user.role !== 'admin') {
    // Redirect to login if not authenticated or not admin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <Grid className="w-5 h-5 mr-3" />,
      path: '/admin'
    },
    {
      title: 'Providers',
      icon: <Database className="w-5 h-5 mr-3" />,
      path: '/admin/providers'
    },
    {
      title: 'Ad Partners',
      icon: <Award className="w-5 h-5 mr-3" />,
      path: '/admin/ad-partners'
    },
    {
      title: 'Campaigns',
      icon: <BarChart2 className="w-5 h-5 mr-3" />,
      path: '/admin/campaigns'
    },
    {
      title: 'Content',
      icon: <FileText className="w-5 h-5 mr-3" />,
      path: '/admin/content'
    },
    {
      title: 'Ad Assets',
      icon: <Package className="w-5 h-5 mr-3" />,
      subItems: [
        {
          title: 'Desktop',
          icon: <Monitor className="w-4 h-4 mr-2" />,
          path: '/admin/ad-assets/desktop'
        },
        {
          title: 'Mobile',
          icon: <Smartphone className="w-4 h-4 mr-2" />,
          path: '/admin/ad-assets/mobile'
        },
        {
          title: 'Tablet',
          icon: <Tablet className="w-4 h-4 mr-2" />,
          path: '/admin/ad-assets/tablet'
        }
      ]
    },
    {
      title: 'Users',
      icon: <Users className="w-5 h-5 mr-3" />,
      path: '/admin/users'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5 mr-3" />,
      path: '/admin/settings'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-md shadow-md md:hidden"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 fixed inset-y-0 z-30 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navigationItems.map((item, index) => (
              <li key={index} className="px-2 py-1">
                {item.path ? (
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-4 py-3 my-1 transition duration-200 rounded-md ${location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center px-4 py-2 text-gray-400 text-sm">
                      {item.icon}
                      {item.title}
                    </div>
                    <ul className="ml-4 mt-1">
                      {item.subItems && item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link 
                            to={subItem.path} 
                            className={`flex items-center px-4 py-2 my-1 transition duration-200 rounded-md text-sm ${location.pathname === subItem.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {subItem.icon}
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            <li className="px-2 py-1 mt-6">
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-3 my-1 transition duration-200 rounded-md hover:bg-red-700 text-left"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6">
        {/* Overlay to close sidebar on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Page content */}
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 