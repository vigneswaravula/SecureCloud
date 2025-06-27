import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, X } from 'lucide-react';
import { useFiles } from '../hooks/useFiles';
import FileGrid from '../components/Files/FileGrid';

const TrashPage = () => {
  const { getTrashedFiles, restoreFile, deleteFile } = useFiles();
  const trashedFiles = getTrashedFiles();

  const handleRestore = async (fileId: string) => {
    try {
      await restoreFile(fileId);
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handlePermanentDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
      try {
        // In a real app, this would permanently delete the file
        console.log('Permanently delete file:', fileId);
      } catch (error) {
        // Error handling
      }
    }
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
              <p className="text-gray-600">Files will be permanently deleted after 30 days</p>
            </div>
          </div>

          {trashedFiles.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to empty the trash? This action cannot be undone.')) {
                    console.log('Empty trash');
                  }
                }}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Empty Trash
              </button>
            </div>
          )}
        </div>

        {/* Files Grid */}
        {trashedFiles.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-yellow-800">
                  Files in trash will be automatically deleted after 30 days. You can restore them before then.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {trashedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-white border border-gray-200 rounded-lg p-4 opacity-75"
                >
                  {/* File Preview */}
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    {file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">
                        <Trash2 className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-medium text-gray-900 truncate text-sm">{file.name}</h3>
                    <p className="text-xs text-gray-500">Deleted recently</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestore(file.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(file.id)}
                      className="flex items-center justify-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
            <p className="text-gray-600">
              Deleted files will appear here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrashPage;