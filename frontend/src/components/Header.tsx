import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layers, Shield, LogOut, LogIn, Bell } from 'lucide-react';
import axios from 'axios';

interface INotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`${API_BASE}/notifications/unread-count`, { withCredentials: true });
      setUnreadCount(res.data?.data?.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  // Fetch notifications list
  const fetchNotifications = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`${API_BASE}/notifications`, { withCredentials: true });
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // refresh periodically
    const iv = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Toggle dropdown and fetch notifications when opened
  const toggleNotifications = async () => {
    const willShow = !showNotif;
    setShowNotif(willShow);
    if (willShow) {
      await fetchNotifications();
    }
  };

  const markAsRead = async (id: string, link?: string) => {
    try {
      await axios.put(`${API_BASE}/notifications/${id}/read`, {}, { withCredentials: true });
      // Update local state
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount(c => Math.max(0, c - 1));

      if (link) {
        // navigate to link within app if relative, otherwise open in new tab
        if (link.startsWith('/')) navigate(link);
        else window.open(link, '_blank');
      }
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API_BASE}/notifications/read-all`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

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
                {/* Notifications */}
                {user && (
                  <div className="relative">
                    <button onClick={toggleNotifications} className="relative p-2 rounded-md hover:bg-purple-50 transition">
                      <Bell className="w-5 h-5 text-gray-700" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0 -right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {showNotif && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-purple-100 z-50">
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                          <h4 className="text-sm font-semibold">Notifications</h4>
                          <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-gray-700">Mark all read</button>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 && (
                            <div className="p-4 text-sm text-gray-500">No notifications</div>
                          )}

                          {notifications.map(n => (
                            <div key={n._id} className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${n.read ? 'bg-white' : 'bg-purple-50'}`} onClick={() => markAsRead(n._id, n.link)}>
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-800">{n.title}</div>
                                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-1 truncate">{n.message}</div>
                            </div>
                          ))}
                        </div>

                        <div className="px-3 py-2 text-center text-xs text-gray-500">
                          <button onClick={() => { setShowNotif(false); navigate('/notifications'); }} className="underline">View all</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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