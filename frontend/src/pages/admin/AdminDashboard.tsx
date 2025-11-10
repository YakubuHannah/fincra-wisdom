import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Users, TrendingUp, FileText, Eye, Download } from 'lucide-react';
import documentService from '../../services/documentService';

interface DashboardStats {
  totalDocuments: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  documentChange: string;
  viewsChange: string;
  downloadsChange: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    totalUsers: 1,
    totalViews: 0,
    totalDownloads: 0,
    documentChange: '+0%',
    viewsChange: '+0%',
    downloadsChange: '+0%'
  });
  const [loading, setLoading] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all documents
      const docsResponse = await documentService.getAllDocuments();
      const documents = docsResponse.data || [];
      
      // Calculate stats
      const totalViews = documents.reduce((sum, doc) => sum + (doc.viewCount || 0), 0);
      const totalDownloads = documents.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0);
      
      setStats({
        totalDocuments: documents.length,
        totalUsers: 1, // You can update this when you have user management
        totalViews: totalViews,
        totalDownloads: totalDownloads,
        documentChange: '+0%',
        viewsChange: '+0%',
        downloadsChange: '+0%'
      });

      // Get 5 most recent documents for activity
      const recent = documents
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentDocuments(recent);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const statsData = [
    { 
      label: 'Total Documents', 
      value: stats.totalDocuments.toString(), 
      icon: FileText, 
      color: 'purple', 
      change: stats.documentChange 
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: 'blue', 
      change: '+0%' 
    },
    { 
      label: 'Total Views', 
      value: stats.totalViews.toString(), 
      icon: Eye, 
      color: 'green', 
      change: stats.viewsChange 
    },
    { 
      label: 'Downloads', 
      value: stats.totalDownloads.toString(), 
      icon: Download, 
      color: 'orange', 
      change: stats.downloadsChange 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the Fincra Wisdom Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, idx) => {
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
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Document uploaded: {doc.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.departmentName} • {formatTimeAgo(doc.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System initialized</p>
                  <p className="text-xs text-gray-500">System • Just now</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;