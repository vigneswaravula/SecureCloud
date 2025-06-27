import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  X,
  Upload,
  File,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending' as const
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);

    // Simulate upload progress
    for (const uploadFile of uploadFiles) {
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading' }
            : f
        )
      );

      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress }
              : f
          )
        );
      }

      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        )
      );
    }

    // Call the upload handler
    onUpload(uploadFiles.map(f => f.file));
    
    setIsUploading(false);
    setTimeout(() => {
      onClose();
      setUploadFiles([]);
    }, 1000);
  };

  const totalSize = uploadFiles.reduce((total, f) => total + f.file.size, 0);
  const completedFiles = uploadFiles.filter(f => f.status === 'completed').length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 100MB
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Files to upload ({uploadFiles.length})
                </h3>
                <p className="text-sm text-gray-500">
                  Total size: {formatFileSize(totalSize)}
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploadFiles.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <File className="w-8 h-8 text-gray-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadFile.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {uploadFile.status === 'pending' && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {uploadFile.status === 'uploading' && (
                        <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                      )}
                      {uploadFile.status === 'completed' && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      {uploadFile.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {uploadFiles.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {isUploading && (
                <span>
                  {completedFiles} of {uploadFiles.length} files uploaded
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || uploadFiles.length === 0}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;