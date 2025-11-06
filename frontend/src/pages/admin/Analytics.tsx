import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">View platform statistics and insights</p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 p-8 text-center">
        <BarChart3 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600 mb-6">Analytics dashboard will be available here</p>
      </div>
    </div>
  );
};

export default Analytics;