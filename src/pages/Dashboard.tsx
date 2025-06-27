import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  List,
  Filter,
  ChevronDown,
  Folder,
  Clock,
  TrendingUp,
  ChevronRight,
  Home,
  Sparkles,
  BarChart3,
  Activity
} from 'lucide-react';
import FileGrid from '../components/Files/FileGrid';
import FolderGrid from '../components/Files/FolderGrid';
import BulkActions from '../components/Files/BulkActions';
import UsageAnalytics from '../components/Analytics/UsageAnalytics';
import ActivityTimeline from '../components/Files/ActivityTimeline';
import SmartSearch from '../components/AI/SmartSearch';
import UploadModal from '../components/Files/UploadModal';
import CreateFolderModal from '../components/Files/CreateFolderModal';
import { useFiles } from '../hooks/useFiles';
import { formatFileSize } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    files, 
    folders, 
    currentFolder, 
    selectedFiles,
    navigateToFolder, 
    uploadFile,
    getRecentFiles,
    getFilesByType,
    clearSelection
  } = useFiles();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [activeTab, setActiveTab] = useState<'files' | 'analytics' | 'activity'>('files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);

  const handleUpload = async (uploadedFiles: File[]) => {
    try {
      for (const file of uploadedFiles) {
        await uploadFile(file);
      }
      setIsUploadModalOpen(false);
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handleCreateFolder = () => {
    setIsCreateFolderModalOpen(true);
  };

  // Get breadcrumb path
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ id: null, name: 'My Files' }];
    // In a real app, you'd build the full path from the folder hierarchy
    if (currentFolder) {
      const folder = folders.find(f => f.id === currentFolder);
      if (folder) {
        breadcrumbs.push({ id: folder.id, name: folder.name });
      }
    }
    return breadcrumbs;
  };

  const recentFiles = getRecentFiles(5);
  const imageFiles = getFilesByType('image');
  const documentFiles = getFilesByType('document');
  const videoFiles = getFilesByType('video');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Stats */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              <p className="text-sm text-gray-600">Files</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {user ? formatFileSize(user.storageUsed) : '0 B'}
              </p>
              <p className="text-sm text-gray-600">Used Storage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recentFiles.length}</p>
              <p className="text-sm text-gray-600">Recent Files</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
              <p className="text-sm text-gray-600">Folders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'files'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Files</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'activity'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </button>
        </div>

        {/* Files Tab */}
        {activeTab === 'files' && (
          <>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.id || 'root'}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                      onClick={() => navigateToFolder(crumb.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors duration-200 ${
                        index === getBreadcrumbs().length - 1
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {index === 0 && <Home className="w-4 h-4" />}
                      <span className="text-sm font-medium">{crumb.name}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* AI Search Button */}
              <button
                onClick={() => setIsSmartSearchOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Search</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentFolder ? 'Folder Contents' : 'My Files'}
                </h1>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span>Sort by: {sortBy}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Filter */}
                <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Folders */}
            {folders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
                <FolderGrid folders={folders} />
              </div>
            )}

            {/* Files */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
              {files.length > 0 ? (
                <FileGrid files={files} />
              ) : (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first file to get started
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Upload Files
                  </button>
                </div>
              )}
            </div>

            {/* File Type Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{imageFiles.length}</span>
                  <span className="text-sm text-gray-500">files</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{documentFiles.length}</span>
                  <span className="text-sm text-gray-500">files</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">{videoFiles.length}</span>
                  <span className="text-sm text-gray-500">files</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <UsageAnalytics />}

        {/* Activity Tab */}
        {activeTab === 'activity' && <ActivityTimeline />}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedFiles={selectedFiles}
        onClearSelection={clearSelection}
      />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />

      <SmartSearch
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
      />
    </div>
  );
};

export default Dashboard;