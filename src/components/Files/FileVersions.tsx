import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Download, RotateCcw, Eye, Calendar, User, FileText, Sparkles, GitBranch, Clock, ChevronDown, ChevronRight, GitCompare as Compare, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { FileItem, FileVersion, VersionChange } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { useFiles } from '../../hooks/useFiles';
import toast from 'react-hot-toast';

interface FileVersionsProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
}

const FileVersions: React.FC<FileVersionsProps> = ({ file, isOpen, onClose }) => {
  const { restoreFileVersion } = useFiles();
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, file.id]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      // Mock version data with AI summaries
      const mockVersions: FileVersion[] = [
        {
          id: 'v1',
          version: 1,
          encryptedUrl: file.encryptedUrl,
          size: file.size,
          createdAt: file.createdAt,
          createdBy: file.ownerId,
          createdByName: 'John Doe',
          changelog: 'Initial version',
          checksum: 'abc123',
          aiSummary: 'Initial document creation with basic structure and content outline.',
          changes: [
            {
              type: 'content',
              description: 'Document created',
              confidence: 1.0
            }
          ],
          isAutoSave: false,
          downloadCount: 0,
          restoreCount: 0
        },
        {
          id: 'v2',
          version: 2,
          encryptedUrl: file.encryptedUrl + '?v=2',
          size: file.size + 1024,
          createdAt: '2024-01-16T10:30:00Z',
          createdBy: file.ownerId,
          createdByName: 'John Doe',
          changelog: 'Added executive summary and updated budget section',
          checksum: 'def456',
          aiSummary: 'Major content additions including executive summary, detailed budget analysis, and market research data. Document structure improved with better organization.',
          changes: [
            {
              type: 'content',
              description: 'Added executive summary (2 pages)',
              confidence: 0.95,
              details: { pages: 2, wordCount: 450 }
            },
            {
              type: 'content',
              description: 'Updated budget section with Q1 projections',
              confidence: 0.92,
              details: { section: 'Budget', changes: 'Added Q1 projections' }
            },
            {
              type: 'structure',
              description: 'Reorganized document sections',
              confidence: 0.88
            }
          ],
          isAutoSave: false,
          parentVersionId: 'v1',
          downloadCount: 3,
          restoreCount: 0
        },
        {
          id: 'v3',
          version: 3,
          encryptedUrl: file.encryptedUrl + '?v=3',
          size: file.size + 2048,
          createdAt: '2024-01-17T14:15:00Z',
          createdBy: '2',
          createdByName: 'Sarah Johnson',
          changelog: 'Collaborative review - added comments and suggestions',
          checksum: 'ghi789',
          aiSummary: 'Collaborative editing session with multiple reviewer comments, suggestions for improvement, and minor text corrections throughout the document.',
          changes: [
            {
              type: 'content',
              description: 'Added 12 review comments',
              confidence: 0.98,
              details: { comments: 12, reviewers: ['Sarah Johnson'] }
            },
            {
              type: 'content',
              description: 'Minor text corrections and improvements',
              confidence: 0.85
            }
          ],
          isAutoSave: false,
          parentVersionId: 'v2',
          downloadCount: 1,
          restoreCount: 0
        },
        {
          id: 'v4',
          version: 4,
          encryptedUrl: file.encryptedUrl + '?v=4',
          size: file.size + 3072,
          createdAt: '2024-01-18T09:45:00Z',
          createdBy: file.ownerId,
          createdByName: 'John Doe',
          changelog: 'Final version - incorporated feedback and added appendices',
          checksum: 'jkl012',
          aiSummary: 'Final document version incorporating all reviewer feedback, added comprehensive appendices with supporting data, charts, and references. Ready for presentation.',
          changes: [
            {
              type: 'content',
              description: 'Incorporated reviewer feedback',
              confidence: 0.93,
              details: { feedbackItems: 8, resolved: 8 }
            },
            {
              type: 'content',
              description: 'Added appendices with charts and data',
              confidence: 0.96,
              details: { appendices: 3, charts: 5 }
            },
            {
              type: 'metadata',
              description: 'Updated document status to final',
              confidence: 1.0
            }
          ],
          isAutoSave: false,
          parentVersionId: 'v3',
          downloadCount: 7,
          restoreCount: 0
        }
      ];

      setVersions(mockVersions.reverse()); // Show newest first
    } catch (error) {
      toast.error('Failed to load file versions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setIsRestoring(versionId);
    try {
      await restoreFileVersion(file.id, versionId);
      
      // Update restore count
      setVersions(prev => prev.map(v => 
        v.id === versionId 
          ? { ...v, restoreCount: v.restoreCount + 1 }
          : v
      ));
      
      toast.success('File restored to selected version');
      onClose();
    } catch (error) {
      toast.error('Failed to restore file version');
    } finally {
      setIsRestoring(null);
    }
  };

  const handleDownload = async (version: FileVersion) => {
    try {
      const link = document.createElement('a');
      link.href = version.encryptedUrl;
      link.download = `${file.name} (v${version.version})`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      setVersions(prev => prev.map(v => 
        v.id === version.id 
          ? { ...v, downloadCount: v.downloadCount + 1 }
          : v
      ));

      toast.success(`Downloaded version ${version.version}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handlePreview = (version: FileVersion) => {
    window.open(version.encryptedUrl, '_blank');
  };

  const toggleVersionExpansion = (versionId: string) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId]; // Replace oldest selection
      }
    });
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'metadata':
        return <Info className="w-4 h-4 text-purple-600" />;
      case 'permissions':
        return <User className="w-4 h-4 text-orange-600" />;
      case 'structure':
        return <GitBranch className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Version History</h2>
                <p className="text-sm text-gray-600">{file.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {selectedVersions.length === 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Compare className="w-4 h-4" />
                  <span>Compare</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {selectedVersions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {selectedVersions.length === 1 
                  ? 'Select another version to compare'
                  : `Comparing versions ${selectedVersions.map(id => versions.find(v => v.id === id)?.version).join(' and ')}`
                }
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading version history...</p>
              </div>
            </div>
          ) : versions.length > 0 ? (
            <div className="p-6">
              {/* Timeline */}
              <div className="relative">
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start space-x-4 pb-8"
                  >
                    {/* Timeline line */}
                    {index < versions.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
                    )}

                    {/* Version indicator */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm ${
                      version.version === versions[0].version
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : selectedVersions.includes(version.id)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}>
                      v{version.version}
                    </div>

                    {/* Version content */}
                    <div className="flex-1 min-w-0">
                      <div className={`bg-white border-2 rounded-lg p-4 transition-all duration-200 ${
                        selectedVersions.includes(version.id)
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {/* Version header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                Version {version.version}
                                {version.version === versions[0].version && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Current
                                  </span>
                                )}
                              </h3>
                              {version.isAutoSave && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Auto-save
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{version.createdByName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(version.createdAt)}</span>
                              </div>
                              <span>{formatFileSize(version.size)}</span>
                            </div>

                            <p className="text-gray-700 mb-3">{version.changelog}</p>

                            {/* AI Summary */}
                            {version.aiSummary && (
                              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-900">AI Summary</span>
                                </div>
                                <p className="text-sm text-purple-800">{version.aiSummary}</p>
                              </div>
                            )}

                            {/* Changes */}
                            <div className="space-y-2">
                              <button
                                onClick={() => toggleVersionExpansion(version.id)}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                              >
                                {expandedVersions.has(version.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <span>{version.changes.length} change{version.changes.length !== 1 ? 's' : ''}</span>
                              </button>

                              <AnimatePresence>
                                {expandedVersions.has(version.id) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                  >
                                    {version.changes.map((change, changeIndex) => (
                                      <div key={changeIndex} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                                        {getChangeIcon(change.type)}
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-900">{change.description}</p>
                                          {change.details && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {Object.entries(change.details).map(([key, value]) => (
                                                <span key={key} className="mr-3">
                                                  {key}: {String(value)}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(change.confidence)}`}>
                                          {Math.round(change.confidence * 100)}%
                                        </span>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                              <span>{version.downloadCount} downloads</span>
                              <span>{version.restoreCount} restores</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <input
                              type="checkbox"
                              checked={selectedVersions.includes(version.id)}
                              onChange={() => handleVersionSelect(version.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              title="Select for comparison"
                            />
                            
                            <button
                              onClick={() => handlePreview(version)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Preview version"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDownload(version)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Download version"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {version.version !== versions[0].version && (
                              <button
                                onClick={() => handleRestore(version.id)}
                                disabled={isRestoring === version.id}
                                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Restore to this version"
                              >
                                {isRestoring === version.id ? (
                                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <RotateCcw className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No version history</h3>
              <p className="text-gray-600">
                Version history will appear here as you make changes to the file
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Automatic versioning enabled</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI-powered change detection</span>
              </div>
            </div>
            <span>Total versions: {versions.length}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FileVersions;