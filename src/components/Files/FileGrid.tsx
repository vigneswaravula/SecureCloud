import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreHorizontal,
  Star,
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive
} from 'lucide-react';
import { FileItem } from '../../types';
import { formatFileSize, formatDate, getFileTypeColor } from '../../utils/formatters';
import FilePreview from './FilePreview';
import FileOperations from './FileOperations';
import { useFiles } from '../../hooks/useFiles';

interface FileGridProps {
  files: FileItem[];
  onFileSelect?: (file: FileItem) => void;
}

const FileGrid: React.FC<FileGridProps> = ({ files, onFileSelect }) => {
  const { selectFile, selectedFiles } = useFiles();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleMenuClick = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === fileId ? null : fileId);
  };

  const handleFileClick = (file: FileItem) => {
    selectFile(file.id);
    onFileSelect?.(file);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    return File;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {files.map((file) => {
            const IconComponent = getFileIcon(file.mimeType);
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -2 }}
                className={`group relative bg-white border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFileClick(file)}
              >
                {/* File Preview */}
                <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  {file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`text-4xl ${getFileTypeColor(file.mimeType)}`}>
                      <IconComponent className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Star indicator */}
                  {file.isStarred && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 truncate text-sm" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.updatedAt)}</span>
                  </div>
                </div>

                {/* More Menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleMenuClick(file.id, e)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {activeMenu === file.id && (
                      <FileOperations
                        file={file}
                        onPreview={setPreviewFile}
                        onClose={() => setActiveMenu(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="absolute inset-0 rounded-lg group-hover:bg-black group-hover:bg-opacity-5 transition-all duration-200 pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <FilePreview
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}
      </AnimatePresence>

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

export default FileGrid;