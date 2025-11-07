import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Users, TrendingUp, FileText, Eye, Download } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Documents', value: '0', icon: FileText, color: 'purple', change: '+0%' },
    { label: 'Total Users', value: '1', icon: Users, color: 'blue', change: '+0%' },
    { label: 'Total Views', value: '0', icon: Eye, color: 'green', change: '+0%' },
    { label: 'Downloads', value: '0', icon: Download, color: 'orange', change: '+0%' }
  ];

  const recentActivity = [
    { action: 'System initialized', user: 'System', time: 'Just now' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the Fincra Wisdom Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-semibold text-${stat.color}-600`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/documents')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <FileUp className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Upload New Document</span>
              </div>
              <span className="text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </div>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;