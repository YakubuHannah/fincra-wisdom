import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layers, Shield, LogOut, LogIn } from 'lucide-react';

// Add this to your component (replace the existing header)
const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigate('/')}>
            <img 
              src="/images/Fincra_icon.png" 
              alt="Fincra" 
              className="h-10 w-10 transition-transform group-hover:scale-110 animate-float"
            />
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight hover:tracking-wide transition-all duration-300">
              Wisdom
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => navigate('/category')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-medium"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Category</span>
            </button>

            {/* Admin button - only show if user is admin */}
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* User menu or Login button */}
            {user ? (
              <div className="flex items-center space-x-2">
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
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          Admin
                        </span>
                      )}
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
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;