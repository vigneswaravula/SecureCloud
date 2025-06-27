import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Download,
  Share2,
  Star,
  Edit3,
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music
} from 'lucide-react';
import { FileItem } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const renderPreview = () => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={file.thumbnailUrl || file.url}
            alt={file.name}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
      );
    }

    if (file.mimeType.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
          <div className="text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Video preview not available</p>
            <p className="text-sm text-gray-500">Click download to view the file</p>
          </div>
        </div>
      );
    }

    if (file.mimeType.includes('pdf')) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">PDF preview not available</p>
            <p className="text-sm text-gray-500">Click download to view the file</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Preview not available</p>
          <p className="text-sm text-gray-500">Click download to view the file</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              {file.mimeType.startsWith('image/') ? (
                <Image className="w-5 h-5 text-blue-600" />
              ) : file.mimeType.startsWith('video/') ? (
                <Video className="w-5 h-5 text-blue-600" />
              ) : file.mimeType.startsWith('audio/') ? (
                <Music className="w-5 h-5 text-blue-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{file.name}</h2>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {formatDate(file.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Edit3 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
          {renderPreview()}
        </div>

        {/* File Details */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Type</p>
              <p className="text-gray-600">{file.type}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Size</p>
              <p className="text-gray-600">{formatFileSize(file.size)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Created</p>
              <p className="text-gray-600">{formatDate(file.createdAt)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Modified</p>
              <p className="text-gray-600">{formatDate(file.updatedAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilePreview;