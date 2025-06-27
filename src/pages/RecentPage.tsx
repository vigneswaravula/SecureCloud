import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useFiles } from '../hooks/useFiles';
import FileGrid from '../components/Files/FileGrid';

const RecentPage = () => {
  const { getRecentFiles } = useFiles();
  const recentFiles = getRecentFiles(20);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
            <p className="text-gray-600">Files you've accessed recently</p>
          </div>
        </div>

        {/* Files Grid */}
        {recentFiles.length > 0 ? (
          <FileGrid files={recentFiles} />
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent files</h3>
            <p className="text-gray-600">
              Files you access will appear here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RecentPage;