import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  MoreHorizontal,
  Star,
  Edit3,
  Trash2,
  Move
} from 'lucide-react';
import { Folder as FolderType } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useFiles } from '../../hooks/useFiles';
import toast from 'react-hot-toast';

interface FolderGridProps {
  folders: FolderType[];
}

const FolderGrid: React.FC<FolderGridProps> = ({ folders }) => {
  const { navigateToFolder, deleteFolder } = useFiles();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleFolderClick = (folder: FolderType) => {
    navigateToFolder(folder.id);
  };

  const handleMenuClick = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === folderId ? null : folderId);
  };

  const handleRename = (folder: FolderType) => {
    toast.success(`Rename "${folder.name}" - Feature coming soon`);
    setActiveMenu(null);
  };

  const handleMove = (folder: FolderType) => {
    toast.success(`Move "${folder.name}" - Feature coming soon`);
    setActiveMenu(null);
  };

  const handleStar = (folder: FolderType) => {
    toast.success(`${folder.name} ${folder.isStarred ? 'removed from' : 'added to'} starred`);
    setActiveMenu(null);
  };

  const handleDelete = async (folder: FolderType) => {
    try {
      await deleteFolder(folder.id);
      setActiveMenu(null);
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const menuItems = (folder: FolderType) => [
    { action: 'rename', icon: Edit3, label: 'Rename', onClick: () => handleRename(folder) },
    { action: 'move', icon: Move, label: 'Move', onClick: () => handleMove(folder) },
    { action: 'star', icon: Star, label: folder.isStarred ? 'Remove from starred' : 'Add to starred', onClick: () => handleStar(folder) },
    { action: 'delete', icon: Trash2, label: 'Move to trash', onClick: () => handleDelete(folder), danger: true },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="relative">
                <Folder className="w-8 h-8 text-blue-500" />
                {folder.isStarred && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white fill-current" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate" title={folder.name}>
                  {folder.name}
                </p>
                <p className="text-sm text-gray-500">{formatDate(folder.updatedAt)}</p>
              </div>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={(e) => handleMenuClick(folder.id, e)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {activeMenu === folder.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      {menuItems(folder).map((item) => (
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
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </>
  );
};

export default FolderGrid;