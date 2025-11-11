import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface INotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/notifications`, { withCredentials: true });
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, link?: string) => {
    try {
      await axios.put(`${API_BASE}/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));

      if (link) {
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
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-purple-100 rounded-full transition">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 mt-1">{notifications.length} notifications</p>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button
                  onClick={markAllRead}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark all read</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin">
              <Bell className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">You have no notifications at the moment.</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded-xl border-2 transition cursor-pointer hover:shadow-md ${
                  n.read
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-purple-50 border-purple-200 hover:border-purple-300 shadow-sm'
                }`}
                onClick={() => markAsRead(n._id, n.link)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{n.title}</h3>
                      {!n.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!n.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
