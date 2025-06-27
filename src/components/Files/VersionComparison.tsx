import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCompare as Compare, ArrowRight, FileText, Plus, Minus, Edit3, Sparkles, X, Download, Eye } from 'lucide-react';
import { FileVersion, VersionComparison as VersionComparisonType } from '../../types';
import { formatDate, formatFileSize } from '../../utils/formatters';

interface VersionComparisonProps {
  versions: [FileVersion, FileVersion];
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
}

const VersionComparison: React.FC<VersionComparisonProps> = ({
  versions,
  fileName,
  isOpen,
  onClose
}) => {
  const [comparison, setComparison] = useState<VersionComparisonType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      generateComparison();
    }
  }, [isOpen, versions]);

  const generateComparison = async () => {
    setIsLoading(true);
    try {
      // Simulate AI comparison analysis
      await new Promise(resolve => setTimeout(resolve, 1500));

      const [olderVersion, newerVersion] = versions.sort((a, b) => a.version - b.version);

      const mockComparison: VersionComparisonType = {
        fileId: 'file-1',
        fromVersion: olderVersion.id,
        toVersion: newerVersion.id,
        similarity: 0.73,
        aiAnalysis: `Significant content evolution between versions ${olderVersion.version} and ${newerVersion.version}. The document has grown substantially with new sections, improved structure, and enhanced detail. Key improvements include better organization, additional supporting data, and refined language throughout.`,
        changes: [
          {
            type: 'content',
            description: 'Added 3 new sections with detailed analysis',
            confidence: 0.95,
            details: {
              sections: ['Executive Summary', 'Market Analysis', 'Risk Assessment'],
              wordCount: 1200,
              pages: 4
            }
          },
          {
            type: 'content',
            description: 'Enhanced existing content with more detailed explanations',
            confidence: 0.88,
            details: {
              enhancedSections: 5,
              additionalDetails: 'Charts, graphs, and supporting data'
            }
          },
          {
            type: 'structure',
            description: 'Reorganized document flow and improved navigation',
            confidence: 0.92,
            details: {
              reorderedSections: 3,
              addedTOC: true,
              improvedHeadings: true
            }
          },
          {
            type: 'content',
            description: 'Updated financial projections and budget estimates',
            confidence: 0.97,
            details: {
              updatedTables: 2,
              newProjections: 'Q1-Q4 2024',
              budgetIncrease: '15%'
            }
          },
          {
            type: 'metadata',
            description: 'Added document properties and keywords',
            confidence: 0.85,
            details: {
              keywords: 8,
              author: 'Updated',
              category: 'Business Plan'
            }
          }
        ]
      };

      setComparison(mockComparison);
    } catch (error) {
      console.error('Failed to generate comparison:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'structure':
        return <Edit3 className="w-4 h-4 text-green-600" />;
      case 'metadata':
        return <Plus className="w-4 h-4 text-purple-600" />;
      default:
        return <Edit3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-green-600 bg-green-100';
    if (similarity >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (similarity >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.8) return 'Very Similar';
    if (similarity >= 0.6) return 'Moderately Similar';
    if (similarity >= 0.4) return 'Somewhat Different';
    return 'Very Different';
  };

  if (!isOpen) return null;

  const [olderVersion, newerVersion] = versions.sort((a, b) => a.version - b.version);

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
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Compare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Version Comparison</h2>
                <p className="text-sm text-gray-600">{fileName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Version Headers */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {/* Older Version */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Version {olderVersion.version}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(olderVersion.encryptedUrl, '_blank')}
                    className="p-1 text-gray-600 hover:text-blue-600 rounded"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = olderVersion.encryptedUrl;
                      link.download = `${fileName} (v${olderVersion.version})`;
                      link.click();
                    }}
                    className="p-1 text-gray-600 hover:text-green-600 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{formatDate(olderVersion.createdAt)}</p>
                <p>{formatFileSize(olderVersion.size)}</p>
                <p>By {olderVersion.createdByName}</p>
              </div>
            </div>

            {/* Comparison Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <ArrowRight className="w-6 h-6" />
                <span className="text-sm font-medium">Compare</span>
              </div>
            </div>

            {/* Newer Version */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Version {newerVersion.version}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(newerVersion.encryptedUrl, '_blank')}
                    className="p-1 text-gray-600 hover:text-blue-600 rounded"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = newerVersion.encryptedUrl;
                      link.download = `${fileName} (v${newerVersion.version})`;
                      link.click();
                    }}
                    className="p-1 text-gray-600 hover:text-green-600 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{formatDate(newerVersion.createdAt)}</p>
                <p>{formatFileSize(newerVersion.size)}</p>
                <p>By {newerVersion.createdByName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing differences with AI...</p>
              </div>
            </div>
          ) : comparison ? (
            <div className="p-6 space-y-6">
              {/* Similarity Score */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                      <p className="text-sm text-gray-600">Similarity Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSimilarityColor(comparison.similarity)}`}>
                      {Math.round(comparison.similarity * 100)}% {getSimilarityLabel(comparison.similarity)}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${comparison.similarity * 100}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{comparison.aiAnalysis}</p>
              </div>

              {/* Changes List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detected Changes ({comparison.changes.length})
                </h3>
                <div className="space-y-4">
                  {comparison.changes.map((change, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getChangeIcon(change.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{change.description}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              change.confidence >= 0.9 ? 'bg-green-100 text-green-700' :
                              change.confidence >= 0.7 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {Math.round(change.confidence * 100)}% confidence
                            </span>
                          </div>
                          
                          {change.details && (
                            <div className="bg-gray-50 rounded p-3 mt-2">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Details:</h5>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                {Object.entries(change.details).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                    <span className="font-medium">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Size Comparison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Size Comparison</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Version {olderVersion.version}</p>
                    <p className="text-lg font-bold text-gray-900">{formatFileSize(olderVersion.size)}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Version {newerVersion.version}</p>
                    <p className="text-lg font-bold text-gray-900">{formatFileSize(newerVersion.size)}</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                    newerVersion.size > olderVersion.size
                      ? 'bg-blue-100 text-blue-700'
                      : newerVersion.size < olderVersion.size
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {newerVersion.size > olderVersion.size ? (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
                        +{formatFileSize(newerVersion.size - olderVersion.size)}
                      </>
                    ) : newerVersion.size < olderVersion.size ? (
                      <>
                        <Minus className="w-3 h-3 mr-1" />
                        -{formatFileSize(olderVersion.size - newerVersion.size)}
                      </>
                    ) : (
                      'No size change'
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Compare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison Failed</h3>
              <p className="text-gray-600">Unable to compare the selected versions</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI-powered comparison analysis</span>
            </div>
            <span>
              Comparing v{olderVersion.version} → v{newerVersion.version}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VersionComparison;