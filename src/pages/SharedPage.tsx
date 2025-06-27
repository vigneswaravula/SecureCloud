import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Download, MessageCircle, Calendar, User, MoreHorizontal, Star } from 'lucide-react';
import { useFiles } from '../hooks/useFiles';
import FileGrid from '../components/Files/FileGrid';
import { FileItem, SharedLink } from '../types';

const SharedPage = () => {
  const { files } = useFiles();
  const [activeTab, setActiveTab] = useState<'files' | 'folders'>('files');

  // Mock shared files data - in a real app, this would come from an API
  const sharedFiles: FileItem[] = [
    {
      id: 'shared-1',
      name: 'Marketing Campaign.pdf',
      size: 3.2 * 1024 * 1024,
      type: 'document',
      mimeType: 'application/pdf',
      encryptedUrl: '/mock-files/marketing.pdf',
      thumbnailUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      ownerId: '2',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      versions: [],
      sharedLinks: [],
      tags: ['marketing', 'campaign'],
      isStarred: false,
      isTrashed: false,
      isEncrypted: false,
      encryptionMetadata: {
        algorithm: 'none',
        keyDerivation: 'none',
        iv: '',
        salt: '',
        iterations: 0
      },
      collaborators: [],
      comments: [],
      lastModifiedBy: '2',
      checksum: '',
      sharedBy: 'Sarah Johnson',
      sharedAt: '2024-01-10T14:30:00Z',
      permission: 'editor' as const
    },
    {
      id: 'shared-2',
      name: 'Team Meeting Notes.docx',
      size: 1.8 * 1024 * 1024,
      type: 'document',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      encryptedUrl: '/mock-files/notes.docx',
      thumbnailUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      ownerId: '3',
      createdAt: '2024-01-09T11:15:00Z',
      updatedAt: '2024-01-09T11:15:00Z',
      versions: [],
      sharedLinks: [],
      tags: ['meeting', 'notes'],
      isStarred: true,
      isTrashed: false,
      isEncrypted: false,
      encryptionMetadata: {
        algorithm: 'none',
        keyDerivation: 'none',
        iv: '',
        salt: '',
        iterations: 0
      },
      collaborators: [],
      comments: [],
      lastModifiedBy: '3',
      checksum: '',
      sharedBy: 'Mike Chen',
      sharedAt: '2024-01-09T11:15:00Z',
      permission: 'viewer' as const
    },
    {
      id: 'shared-3',
      name: 'Project Assets.zip',
      size: 25.6 * 1024 * 1024,
      type: 'archive',
      mimeType: 'application/zip',
      encryptedUrl: '/mock-files/assets.zip',
      ownerId: '4',
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-08T16:45:00Z',
      versions: [],
      sharedLinks: [],
      tags: ['assets', 'project'],
      isStarred: false,
      isTrashed: false,
      isEncrypted: false,
      encryptionMetadata: {
        algorithm: 'none',
        keyDerivation: 'none',
        iv: '',
        salt: '',
        iterations: 0
      },
      collaborators: [],
      comments: [],
      lastModifiedBy: '4',
      checksum: '',
      sharedBy: 'Alex Rivera',
      sharedAt: '2024-01-08T16:45:00Z',
      permission: 'commenter' as const
    }
  ];

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'editor':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'commenter':
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'editor':
        return 'text-green-600 bg-green-100';
      case 'commenter':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shared with me</h1>
            <p className="text-gray-600">Files and folders others have shared with you</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'files'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Files ({sharedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'folders'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Folders (0)
          </button>
        </div>

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {sharedFiles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sharedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {file.type === 'document' ? (
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Download className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{file.name}</h3>
                            {file.isStarred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Shared by {file.sharedBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(file.sharedAt!).toLocaleDateString()}</span>
                            </div>
                            <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(file.permission!)}`}>
                          {getPermissionIcon(file.permission!)}
                          <span className="capitalize">{file.permission}</span>
                        </span>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    {file.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-4">
                        {file.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shared files</h3>
                <p className="text-gray-600">
                  Files shared with you will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Folders Tab */}
        {activeTab === 'folders' && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shared folders</h3>
            <p className="text-gray-600">
              Folders shared with you will appear here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SharedPage;