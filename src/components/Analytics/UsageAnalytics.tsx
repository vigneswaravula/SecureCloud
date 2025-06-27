import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Upload,
  Download,
  HardDrive,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { formatFileSize } from '../../utils/formatters';

interface AnalyticsData {
  totalUploads: number;
  totalDownloads: number;
  activeUsers: number;
  storageUsed: number;
  uploadTrend: Array<{ date: string; uploads: number; downloads: number }>;
  fileTypes: Array<{ type: string; count: number; size: number }>;
  userActivity: Array<{ hour: string; activity: number }>;
}

const UsageAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Mock analytics data - in a real app, this would come from an API
    setAnalyticsData({
      totalUploads: 1247,
      totalDownloads: 3891,
      activeUsers: 89,
      storageUsed: 2.3 * 1024 * 1024 * 1024 * 1024, // 2.3TB
      uploadTrend: [
        { date: '2024-01-01', uploads: 45, downloads: 123 },
        { date: '2024-01-02', uploads: 52, downloads: 145 },
        { date: '2024-01-03', uploads: 38, downloads: 98 },
        { date: '2024-01-04', uploads: 67, downloads: 187 },
        { date: '2024-01-05', uploads: 71, downloads: 201 },
        { date: '2024-01-06', uploads: 59, downloads: 156 },
        { date: '2024-01-07', uploads: 83, downloads: 234 }
      ],
      fileTypes: [
        { type: 'Images', count: 456, size: 850 * 1024 * 1024 * 1024 },
        { type: 'Documents', count: 342, size: 420 * 1024 * 1024 * 1024 },
        { type: 'Videos', count: 189, size: 980 * 1024 * 1024 * 1024 },
        { type: 'Audio', count: 123, size: 45 * 1024 * 1024 * 1024 },
        { type: 'Others', count: 67, size: 15 * 1024 * 1024 * 1024 }
      ],
      userActivity: [
        { hour: '00', activity: 12 },
        { hour: '01', activity: 8 },
        { hour: '02', activity: 5 },
        { hour: '03', activity: 3 },
        { hour: '04', activity: 7 },
        { hour: '05', activity: 15 },
        { hour: '06', activity: 28 },
        { hour: '07', activity: 45 },
        { hour: '08', activity: 67 },
        { hour: '09', activity: 89 },
        { hour: '10', activity: 95 },
        { hour: '11', activity: 87 },
        { hour: '12', activity: 76 },
        { hour: '13', activity: 82 },
        { hour: '14', activity: 91 },
        { hour: '15', activity: 88 },
        { hour: '16', activity: 79 },
        { hour: '17', activity: 65 },
        { hour: '18', activity: 52 },
        { hour: '19', activity: 38 },
        { hour: '20', activity: 29 },
        { hour: '21', activity: 22 },
        { hour: '22', activity: 18 },
        { hour: '23', activity: 15 }
      ]
    });
  }, [timeRange]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
            <p className="text-gray-600">Monitor your file storage and usage patterns</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Uploads</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalUploads.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+12% from last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalDownloads.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+8% from last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+5% from last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-3xl font-bold text-gray-900">{formatFileSize(analyticsData.storageUsed)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+15% from last period</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload/Download Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload & Download Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.uploadTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#3B82F6" strokeWidth={2} name="Uploads" />
              <Line type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={2} name="Downloads" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* File Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.fileTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.fileTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Activity by Hour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activity" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Storage Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Breakdown by File Type</h3>
        <div className="space-y-4">
          {analyticsData.fileTypes.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm font-medium text-gray-900">{item.type}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatFileSize(item.size)}</p>
                <p className="text-xs text-gray-500">{item.count.toLocaleString()} files</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UsageAnalytics;