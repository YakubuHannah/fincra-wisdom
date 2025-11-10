import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileUp, 
  Users, 
  BarChart3, 
  Settings,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user, logout } = useAuth();

  // Check if user is admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const getUserInitials = () => {
    if (!user) return 'P';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileUp, label: 'Documents', path: '/admin/documents' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigate('/')}>
                <img 
                  src="/images/Fincra_icon.png" 
                  alt="Fincra" 
                  className="h-10 w-10 transition-transform group-hover:scale-110 animate-float"
                />
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight hover:tracking-wide transition-all duration-300">
                  Wisdom
                </h1>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
              <h2 className="hidden sm:block text-lg font-bold text-gray-700">
                Admin Dashboard
              </h2>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Back to Site</span>
              </button>

              {/* User Avatar with Dropdown */}
              <div className="relative group">
                <button className="p-1 hover:scale-110 transition-transform">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
                    {getUserInitials()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-purple-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/50 backdrop-blur-sm border-r border-purple-100 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;