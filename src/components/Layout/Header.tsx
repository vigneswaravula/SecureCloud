import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Bell,
  User,
  Settings,
  LogOut,
  Upload,
  FolderPlus,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFiles } from '../../hooks/useFiles';
import SearchResults from '../Files/SearchResults';
import NotificationCenter from '../Notifications/NotificationCenter';

interface HeaderProps {
  onUpload: () => void;
  onCreateFolder: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpload, onCreateFolder }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleCreateFolder = () => {
    onCreateFolder();
    setIsCreateOpen(false);
  };

  const handleUpload = () => {
    onUpload();
    setIsCreateOpen(false);
  };

  // Mock notification count
  const notificationCount = 3;

  return (
    <>
      <header className="fixed top-0 left-70 right-0 h-16 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-between h-full px-6">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Create Button */}
            <div className="relative">
              <button
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>

              <AnimatePresence>
                {isCreateOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                  >
                    <button
                      onClick={handleUpload}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Upload files</span>
                    </button>
                    <button
                      onClick={handleCreateFolder}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FolderPlus className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">New folder</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        // Navigate to settings - you might want to use react-router here
                        window.location.href = '/settings';
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(isProfileOpen || isCreateOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsProfileOpen(false);
              setIsCreateOpen(false);
            }}
          />
        )}
      </header>

      {/* Search Results Overlay */}
      <AnimatePresence>
        {showSearchResults && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-4xl mx-4">
              <SearchResults
                query={searchQuery}
                onQueryChange={handleSearch}
                onClose={() => setShowSearchResults(false)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;