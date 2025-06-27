import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Download,
  Share2,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface DataVisualizationProps {
  data: any;
  type: 'storage' | 'activity' | 'sharing' | 'security';
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, type }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, [timeRange]);

  const refreshData = async () => {
    setIsLoading(true);
    // In a real app, this would fetch new data based on the time range
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const exportChart = () => {
    // In a real app, this would generate and download a CSV or image of the chart
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}-data-${timeRange}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const renderStorageChart = () => {
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.fileTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="size"
              nameKey="type"
              label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.fileTypes.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatFileSize(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.fileTypes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis tickFormatter={(value) => formatFileSize(value)} />
            <Tooltip formatter={(value: number) => formatFileSize(value)} />
            <Legend />
            <Bar dataKey="size" fill="#3B82F6" name="Size" />
            <Bar dataKey="count" fill="#10B981" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data.storageGrowth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `${value} GB`} />
          <Tooltip formatter={(value: number) => `${value} GB`} />
          <Legend />
          <Area type="monotone" dataKey="storage" stroke="#3B82F6" fill="#93C5FD" name="Storage Used" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderActivityChart = () => {
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.activityTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uploads" stroke="#3B82F6" name="Uploads" />
            <Line type="monotone" dataKey="downloads" stroke="#10B981" name="Downloads" />
            <Line type="monotone" dataKey="shares" stroke="#F59E0B" name="Shares" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.activityByUser}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="uploads" fill="#3B82F6" name="Uploads" />
            <Bar dataKey="downloads" fill="#10B981" name="Downloads" />
            <Bar dataKey="shares" fill="#F59E0B" name="Shares" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data.activityByHour}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="activity" stroke="#3B82F6" fill="#93C5FD" name="Activity" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === 'storage' && 'Storage Analytics'}
          {type === 'activity' && 'Activity Metrics'}
          {type === 'sharing' && 'Sharing Statistics'}
          {type === 'security' && 'Security Insights'}
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportChart}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Export data"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Share chart"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              chartType === 'bar'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              chartType === 'line'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Line Chart"
          >
            <LineChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              chartType === 'area'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Area Chart"
          >
            <AreaChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              chartType === 'pie'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Pie Chart"
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                timeRange === '7d'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                timeRange === '30d'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                timeRange === '90d'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              90D
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                timeRange === '1y'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1Y
            </button>
          </div>

          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Filter data"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Date range"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          {type === 'storage' && renderStorageChart()}
          {type === 'activity' && renderActivityChart()}
          {/* Add other chart types as needed */}
        </>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {type === 'storage' && (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Storage</h3>
              <p className="text-xl font-bold text-blue-700">{formatFileSize(data.totalStorage)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Available</h3>
              <p className="text-xl font-bold text-green-700">{formatFileSize(data.availableStorage)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">File Count</h3>
              <p className="text-xl font-bold text-yellow-700">{data.fileCount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Growth Rate</h3>
              <p className="text-xl font-bold text-purple-700">+{data.growthRate}%</p>
            </div>
          </>
        )}

        {type === 'activity' && (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Actions</h3>
              <p className="text-xl font-bold text-blue-700">{data.totalActions.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Active Users</h3>
              <p className="text-xl font-bold text-green-700">{data.activeUsers}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Peak Hour</h3>
              <p className="text-xl font-bold text-yellow-700">{data.peakHour}:00</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Avg. Session</h3>
              <p className="text-xl font-bold text-purple-700">{data.avgSession} min</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataVisualization;