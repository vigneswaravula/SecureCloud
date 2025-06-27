import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Share2,
  Star,
  Trash2,
  Edit3,
  Copy,
  Move,
  Eye,
  MoreHorizontal,
  Calendar,
  Lock,
  Globe,
  Users,
  History
} from 'lucide-react';
import { FileItem } from '../../types';
import { useFiles } from '../../hooks/useFiles';
import FileVersions from './FileVersions';
import toast from 'react-hot-toast';

interface FileOperationsProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onClose: () => void;
}

const FileOperations: React.FC<FileOperationsProps> = ({ file, onPreview, onClose }) => {
  const { deleteFile, starFile, shareFile, renameFile } = useFiles();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [sharePermissions, setSharePermissions] = useState<'view' | 'download' | 'edit'>('view');
  const [shareExpiry, setShareExpiry] = useState('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.encryptedUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${file.name}`);
    onClose();
  };

  const handleShare = async () => {
    try {
      const expiresAt = shareExpiry ? new Date(shareExpiry).toISOString() : undefined;
      await shareFile(file.id, sharePermissions, expiresAt);
      setShowShareModal(false);
      onClose();
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handleRename = async () => {
    if (newName.trim() && newName !== file.name) {
      try {
        await renameFile(file.id, newName.trim());
        setShowRenameModal(false);
        onClose();
      } catch (error) {
        // Error handled in useFiles hook
      }
    }
  };

  const handleStar = async () => {
    try {
      await starFile(file.id);
      onClose();
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file.id);
      onClose();
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handleCopy = () => {
    toast.success(`${file.name} copied`);
    onClose();
  };

  const handleMove = () => {
    toast.success(`Move ${file.name} - Feature coming soon`);
    onClose();
  };

  const handleVersionHistory = () => {
    setShowVersions(true);
    onClose();
  };

  const menuItems = [
    { action: 'preview', icon: Eye, label: 'Preview', onClick: () => onPreview(file) },
    { action: 'download', icon: Download, label: 'Download', onClick: handleDownload },
    { action: 'versions', icon: History, label: 'Version History', onClick: handleVersionHistory },
    { action: 'share', icon: Share2, label: 'Share', onClick: () => setShowShareModal(true) },
    { action: 'rename', icon: Edit3, label: 'Rename', onClick: () => setShowRenameModal(true) },
    { action: 'copy', icon: Copy, label: 'Make a copy', onClick: handleCopy },
    { action: 'move', icon: Move, label: 'Move', onClick: handleMove },
    { action: 'star', icon: Star, label: file.isStarred ? 'Remove from starred' : 'Add to starred', onClick: handleStar },
    { action: 'delete', icon: Trash2, label: 'Move to trash', onClick: handleDelete, danger: true },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
      >
        {menuItems.map((item) => (
          <button
            key={item.action}
            onClick={item.onClick}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
              item.danger ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share "{file.name}"</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'view', icon: Eye, label: 'Can view', desc: 'Can view and preview the file' },
                      { value: 'download', icon: Download, label: 'Can download', desc: 'Can view and download the file' },
                      { value: 'edit', icon: Edit3, label: 'Can edit', desc: 'Can view, download, and edit the file' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="permissions"
                          value={option.value}
                          checked={sharePermissions === option.value}
                          onChange={(e) => setSharePermissions(e.target.value as any)}
                          className="text-blue-600"
                        />
                        <option.icon className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setShowRenameModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename File</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={!newName.trim() || newName === file.name}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version History Modal */}
      <FileVersions
        file={file}
        isOpen={showVersions}
        onClose={() => setShowVersions(false)}
      />
    </>
  );
};

export default FileOperations;