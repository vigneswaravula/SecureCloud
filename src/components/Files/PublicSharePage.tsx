import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  Download,
  Eye,
  Lock,
  Calendar,
  User,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Shield,
  Clock
} from 'lucide-react';
import { formatFileSize, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface SharedFileData {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  sharedBy: string;
  sharedAt: string;
  expiresAt?: string;
  requiresPassword: boolean;
  allowDownload: boolean;
  views: number;
  downloads: number;
  description?: string;
}

const PublicSharePage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [fileData, setFileData] = useState<SharedFileData | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    loadSharedFile();
  }, [shareId]);

  const loadSharedFile = async () => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock shared file data
      const mockFileData: SharedFileData = {
        id: shareId || '1',
        name: 'Project Proposal.pdf',
        size: 2.5 * 1024 * 1024,
        type: 'document',
        mimeType: 'application/pdf',
        url: '/mock-files/proposal.pdf',
        thumbnailUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
        sharedBy: 'Sarah Johnson',
        sharedAt: '2024-01-15T10:30:00Z',
        expiresAt: '2024-02-15T10:30:00Z',
        requiresPassword: false,
        allowDownload: true,
        views: 23,
        downloads: 8,
        description: 'Q1 2024 project proposal for the new marketing campaign initiative.'
      };

      setFileData(mockFileData);
      setIsPasswordRequired(mockFileData.requiresPassword);
      setHasAccess(!mockFileData.requiresPassword);
    } catch (error) {
      toast.error('Failed to load shared file');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    try {
      // Mock password verification
      if (password === 'demo123') {
        setHasAccess(true);
        setIsPasswordRequired(false);
        toast.success('Access granted');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Failed to verify password');
    }
  };

  const handleDownload = async () => {
    if (!fileData || !fileData.allowDownload) return;

    setIsDownloading(true);
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = fileData.url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count (in a real app, this would be an API call)
      setFileData(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null);
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    if (!fileData) return;

    // Update view count (in a real app, this would be an API call)
    setFileData(prev => prev ? { ...prev, views: prev.views + 1 } : null);

    // Open preview in new tab
    window.open(fileData.url, '_blank');
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    return FileText;
  };

  const isExpired = fileData?.expiresAt && new Date(fileData.expiresAt) < new Date();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared file...</p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">File Not Found</h1>
          <p className="text-gray-600">The shared file you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600">This shared link has expired and is no longer accessible.</p>
        </div>
      </div>
    );
  }

  if (isPasswordRequired && !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-8"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Required</h1>
            <p className="text-gray-600">This file is password protected. Enter the password to access it.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!password.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Access File
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo password: demo123</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const FileIcon = getFileIcon(fileData.mimeType);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared File</h1>
          <p className="text-gray-600">Securely shared via SecureCloud</p>
        </div>

        {/* File Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* File Preview */}
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
            {fileData.thumbnailUrl ? (
              <img
                src={fileData.thumbnailUrl}
                alt={fileData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileIcon className="w-24 h-24 text-gray-400" />
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handlePreview}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{fileData.name}</h2>
                {fileData.description && (
                  <p className="text-gray-600 mb-4">{fileData.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Shared by {fileData.sharedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(fileData.sharedAt)}</span>
                  </div>
                  <span>{formatFileSize(fileData.size)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>

                {fileData.allowDownload && (
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{fileData.views}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{fileData.downloads}</p>
                <p className="text-sm text-gray-600">Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(fileData.size)}</p>
                <p className="text-sm text-gray-600">File Size</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 capitalize">{fileData.type}</p>
                <p className="text-sm text-gray-600">File Type</p>
              </div>
            </div>

            {/* Expiry Warning */}
            {fileData.expiresAt && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This link expires on {formatDate(fileData.expiresAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold">SecureCloud</span> - Secure file sharing made simple
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicSharePage;