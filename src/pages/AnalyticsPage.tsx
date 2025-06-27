import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Filter, Download, RefreshCw, ChevronDown } from 'lucide-react';
import DataVisualization from '../components/Analytics/DataVisualization';
import UsageAnalytics from '../components/Analytics/UsageAnalytics';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'storage' | 'activity' | 'sharing' | 'security'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTab]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockData = {
        storage: {
          totalStorage: 2.3 * 1024 * 1024 * 1024 * 1024, // 2.3TB
          availableStorage: 1.7 * 1024 * 1024 * 1024 * 1024, // 1.7TB
          fileCount: 45623,
          growthRate: 15,
          fileTypes: [
            { type: 'Images', count: 18500, size: 850 * 1024 * 1024 * 1024 },
            { type: 'Documents', count: 15200, size: 420 * 1024 * 1024 * 1024 },
            { type: 'Videos', count: 8900, size: 980 * 1024 * 1024 * 1024 },
            { type: 'Audio', count: 2800, size: 45 * 1024 * 1024 * 1024 },
            { type: 'Others', count: 223, size: 5 * 1024 * 1024 * 1024 }
          ],
          storageGrowth: [
            { date: '2024-01', storage: 1.2 },
            { date: '2024-02', storage: 1.6 },
            { date: '2024-03', storage: 2.0 },
            { date: '2024-04', storage: 2.3 }
          ]
        },
        activity: {
          totalActions: 12547,
          activeUsers: 89,
          peakHour: 14,
          avgSession: 32,
          activityTrend: [
            { date: '2024-01-01', uploads: 45, downloads: 123, shares: 12 },
            { date: '2024-01-02', uploads: 52, downloads: 145, shares: 15 },
            { date: '2024-01-03', uploads: 38, downloads: 98, shares: 8 },
            { date: '2024-01-04', uploads: 67, downloads: 187, shares: 22 },
            { date: '2024-01-05', uploads: 71, downloads: 201, shares: 18 },
            { date: '2024-01-06', uploads: 59, downloads: 156, shares: 14 },
            { date: '2024-01-07', uploads: 83, downloads: 234, shares: 27 }
          ],
          activityByUser: [
            { name: 'John', uploads: 120, downloads: 85, shares: 45 },
            { name: 'Sarah', uploads: 95, downloads: 120, shares: 65 },
            { name: 'Mike', uploads: 75, downloads: 95, shares: 30 },
            { name: 'Lisa', uploads: 110, downloads: 75, shares: 50 },
            { name: 'David', uploads: 85, downloads: 110, shares: 40 }
          ],
          activityByHour: [
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
        },
        sharing: {
          totalShares: 3456,
          activeShares: 1234,
          expiredShares: 567,
          publicShares: 890,
          privateShares: 2566,
          sharingTrend: [
            { date: '2024-01-01', shares: 45 },
            { date: '2024-01-02', shares: 52 },
            { date: '2024-01-03', shares: 38 },
            { date: '2024-01-04', shares: 67 },
            { date: '2024-01-05', shares: 71 },
            { date: '2024-01-06', shares: 59 },
            { date: '2024-01-07', shares: 83 }
          ]
        },
        security: {
          totalEvents: 567,
          criticalEvents: 12,
          highEvents: 45,
          mediumEvents: 123,
          lowEvents: 387,
          securityTrend: [
            { date: '2024-01-01', events: 15, critical: 2 },
            { date: '2024-01-02', events: 22, critical: 1 },
            { date: '2024-01-03', events: 18, critical: 0 },
            { date: '2024-01-04', events: 27, critical: 3 },
            { date: '2024-01-05', events: 31, critical: 2 },
            { date: '2024-01-06', events: 19, critical: 1 },
            { date: '2024-01-07', events: 23, critical: 3 }
          ]
        }
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV or Excel file
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `analytics-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Insights and metrics about your file storage and usage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadAnalyticsData}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'storage', label: 'Storage' },
            { id: 'activity', label: 'Activity' },
            { id: 'sharing', label: 'Sharing' },
            { id: 'security', label: 'Security' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Last 30 days</span>
            <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                <UsageAnalytics />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DataVisualization data={analyticsData.storage} type="storage" />
                  <DataVisualization data={analyticsData.activity} type="activity" />
                </div>
              </>
            )}

            {activeTab === 'storage' && (
              <DataVisualization data={analyticsData.storage} type="storage" />
            )}

            {activeTab === 'activity' && (
              <DataVisualization data={analyticsData.activity} type="activity" />
            )}

            {activeTab === 'sharing' && (
              <DataVisualization data={analyticsData.sharing} type="sharing" />
            )}

            {activeTab === 'security' && (
              <DataVisualization data={analyticsData.security} type="security" />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
            <p className="text-gray-600">
              We're still collecting data for your account
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;