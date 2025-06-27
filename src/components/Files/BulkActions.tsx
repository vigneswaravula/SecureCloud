import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Share2,
  Star,
  Trash2,
  Move,
  Copy,
  Archive,
  X,
  Check
} from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import toast from 'react-hot-toast';

interface BulkActionsProps {
  selectedFiles: string[];
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedFiles, onClearSelection }) => {
  const { files, deleteFile, starFile, shareFile } = useFiles();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const selectedFileObjects = files.filter(file => selectedFiles.includes(file.id));

  const handleBulkDownload = async () => {
    setIsProcessing(true);
    try {
      // Create a zip file with all selected files
      const JSZip = (await import('jszip')).default;
      const FileSaver = await import('file-saver');
      
      const zip = new JSZip();
      
      for (const file of selectedFileObjects) {
        try {
          const response = await fetch(file.encryptedUrl);
          const blob = await response.blob();
          zip.file(file.name, blob);
        } catch (error) {
          console.error(`Failed to add ${file.name} to zip:`, error);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      FileSaver.saveAs(zipBlob, `selected-files-${Date.now()}.zip`);
      
      toast.success(`Downloaded ${selectedFiles.length} files`);
      onClearSelection();
    } catch (error) {
      toast.error('Failed to download files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStar = async () => {
    setIsProcessing(true);
    try {
      for (const fileId of selectedFiles) {
        await starFile(fileId);
      }
      toast.success(`Starred ${selectedFiles.length} files`);
      onClearSelection();
    } catch (error) {
      toast.error('Failed to star files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkShare = async () => {
    setIsProcessing(true);
    try {
      for (const fileId of selectedFiles) {
        await shareFile(fileId, 'view');
      }
      toast.success(`Shared ${selectedFiles.length} files`);
      onClearSelection();
    } catch (error) {
      toast.error('Failed to share files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      setIsProcessing(true);
      try {
        for (const fileId of selectedFiles) {
          await deleteFile(fileId);
        }
        toast.success(`Deleted ${selectedFiles.length} files`);
        onClearSelection();
      } catch (error) {
        toast.error('Failed to delete files');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBulkMove = () => {
    toast.info('Move feature coming soon');
  };

  const handleBulkCopy = () => {
    toast.info('Copy feature coming soon');
  };

  if (selectedFiles.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkDownload}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Download selected files"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={handleBulkShare}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Share selected files"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleBulkStar}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Star selected files"
            >
              <Star className="w-5 h-5" />
            </button>

            <button
              onClick={handleBulkMove}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Move selected files"
            >
              <Move className="w-5 h-5" />
            </button>

            <button
              onClick={handleBulkCopy}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Copy selected files"
            >
              <Copy className="w-5 h-5" />
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete selected files"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <button
            onClick={onClearSelection}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkActions;