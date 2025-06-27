import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Settings,
  Pause,
  Play,
  Trash2,
  Plus,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Database,
  HardDrive,
  Lock
} from 'lucide-react';
import { CloudSyncProvider, SyncStatus } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface CloudSyncManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloudSyncManager: React.FC<CloudSyncManagerProps> = ({ isOpen, onClose }) => {
  const [providers, setProviders] = useState<CloudSyncProvider[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CloudSyncProvider | null>(null);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProviders();
      loadSyncStatuses();
    }
  }, [isOpen]);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      // Mock cloud providers
      const mockProviders: CloudSyncProvider[] = [
        {
          id: 'google-drive',
          name: 'Google Drive',
          type: 'google_drive',
          isConnected: true,
          connectedAt: '2024-01-10T14:20:00Z',
          lastSync: '2024-01-15T10:30:00Z',
          syncStatus: 'idle',
          settings: {
            autoSync: true,
            syncInterval: 60,
            syncDirection: 'bidirectional',
            conflictResolution: 'ask',
            excludePatterns: ['*.tmp', '*.temp'],
            includeFolders: ['Documents', 'Images']
          },
          quotaUsed: 5.2 * 1024 * 1024 * 1024,
          quotaLimit: 15 * 1024 * 1024 * 1024
        },
        {
          id: 'onedrive',
          name: 'OneDrive',
          type: 'onedrive',
          isConnected: false,
          syncStatus: 'idle',
          settings: {
            autoSync: false,
            syncInterval: 120,
            syncDirection: 'upload_only',
            conflictResolution: 'keep_local',
            excludePatterns: [],
            includeFolders: []
          }
        },
        {
          id: 'dropbox',
          name: 'Dropbox',
          type: 'dropbox',
          isConnected: true,
          connectedAt: '2024-01-05T09:15:00Z',
          lastSync: '2024-01-14T16:45:00Z',
          syncStatus: 'error',
          settings: {
            autoSync: true,
            syncInterval: 30,
            syncDirection: 'bidirectional',
            conflictResolution: 'keep_both',
            excludePatterns: ['*.log'],
            includeFolders: ['Work']
          },
          quotaUsed: 3.8 * 1024 * 1024 * 1024,
          quotaLimit: 5 * 1024 * 1024 * 1024
        }
      ];

      setProviders(mockProviders);
    } catch (error) {
      toast.error('Failed to load cloud providers');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSyncStatuses = async () => {
    try {
      // Mock sync statuses
      const mockSyncStatuses: SyncStatus[] = [
        {
          fileId: 'file-1',
          status: 'synced',
          lastSync: '2024-01-15T10:30:00Z',
          provider: 'google_drive'
        },
        {
          fileId: 'file-2',
          status: 'syncing',
          lastSync: '2024-01-15T10:29:00Z',
          provider: 'google_drive',
          progress: 75
        },
        {
          fileId: 'file-3',
          status: 'error',
          lastSync: '2024-01-14T16:45:00Z',
          provider: 'dropbox',
          errorMessage: 'Insufficient permissions'
        },
        {
          fileId: 'file-4',
          status: 'conflict',
          lastSync: '2024-01-14T14:20:00Z',
          provider: 'dropbox',
          conflictReason: 'Both local and remote files were modified'
        }
      ];

      setSyncStatuses(mockSyncStatuses);
    } catch (error) {
      console.error('Failed to load sync statuses:', error);
    }
  };

  const handleConnectProvider = async (providerType: string) => {
    try {
      // In a real app, this would open OAuth flow
      toast.success(`Connecting to ${providerType}...`);
      
      // Update provider status
      setProviders(prev => prev.map(provider =>
        provider.type === providerType
          ? {
              ...provider,
              isConnected: true,
              connectedAt: new Date().toISOString(),
              lastSync: new Date().toISOString(),
              syncStatus: 'idle'
            }
          : provider
      ));
    } catch (error) {
      toast.error(`Failed to connect to ${providerType}`);
    }
  };

  const handleDisconnectProvider = async (providerId: string) => {
    try {
      // In a real app, this would revoke OAuth tokens
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? {
              ...provider,
              isConnected: false,
              connectedAt: undefined,
              lastSync: undefined,
              syncStatus: 'idle'
            }
          : provider
      ));
      
      toast.success('Provider disconnected');
    } catch (error) {
      toast.error('Failed to disconnect provider');
    }
  };

  const handleSyncNow = async (providerId: string) => {
    try {
      // Update provider status
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? { ...provider, syncStatus: 'syncing' }
          : provider
      ));

      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update provider status
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? { 
              ...provider, 
              syncStatus: 'idle',
              lastSync: new Date().toISOString()
            }
          : provider
      ));

      toast.success('Sync completed successfully');
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  const handlePauseSync = async (providerId: string) => {
    try {
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? { ...provider, syncStatus: 'paused' }
          : provider
      ));
      
      toast.success('Sync paused');
    } catch (error) {
      toast.error('Failed to pause sync');
    }
  };

  const handleResumeSync = async (providerId: string) => {
    try {
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? { ...provider, syncStatus: 'idle' }
          : provider
      ));
      
      toast.success('Sync resumed');
    } catch (error) {
      toast.error('Failed to resume sync');
    }
  };

  const handleUpdateSettings = async (providerId: string, settings: any) => {
    try {
      setProviders(prev => prev.map(provider =>
        provider.id === providerId
          ? { ...provider, settings }
          : provider
      ));
      
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google_drive':
        return <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">G</div>;
      case 'onedrive':
        return <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">O</div>;
      case 'dropbox':
        return <div className="w-6 h-6 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xs">D</div>;
      case 'box':
        return <div className="w-6 h-6 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xs">B</div>;
      default:
        return <Cloud className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing':
        return 'text-blue-600 bg-blue-100';
      case 'synced':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'conflict':
        return 'text-orange-600 bg-orange-100';
      case 'paused':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cloud Sync</h2>
                <p className="text-sm text-gray-600">Manage external cloud storage connections</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cloud providers...</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Provider List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border rounded-lg p-6 ${
                      provider.isConnected
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getProviderIcon(provider.type)}
                        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        provider.isConnected
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {provider.isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>

                    {provider.isConnected ? (
                      <>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last Sync</span>
                            <span className="font-medium">
                              {provider.lastSync ? formatDate(provider.lastSync) : 'Never'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Status</span>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(provider.syncStatus)}
                              <span className="capitalize">{provider.syncStatus}</span>
                            </div>
                          </div>

                          {provider.quotaUsed !== undefined && provider.quotaLimit !== undefined && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Storage</span>
                                <span className="font-medium">
                                  {formatFileSize(provider.quotaUsed)} / {formatFileSize(provider.quotaLimit)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min((provider.quotaUsed / provider.quotaLimit) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {provider.syncStatus === 'syncing' ? (
                            <button
                              onClick={() => handlePauseSync(provider.id)}
                              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                            >
                              <Pause className="w-4 h-4" />
                              <span>Pause</span>
                            </button>
                          ) : provider.syncStatus === 'paused' ? (
                            <button
                              onClick={() => handleResumeSync(provider.id)}
                              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                              <Play className="w-4 h-4" />
                              <span>Resume</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSyncNow(provider.id)}
                              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Sync Now</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedProvider(provider)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDisconnectProvider(provider.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnectProvider(provider.type)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>Connect</span>
                      </button>
                    )}
                  </motion.div>
                ))}

                {/* Add New Provider */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setShowAddProvider(true)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Add Cloud Provider</h3>
                  <p className="text-sm text-gray-600">Connect to another cloud storage service</p>
                </motion.div>
              </div>

              {/* Sync Status */}
              {syncStatuses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sync Activity</h3>
                  <div className="space-y-3">
                    {syncStatuses.map((status) => (
                      <div
                        key={status.fileId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(status.status)}`}>
                              {getStatusIcon(status.status)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">File ID: {status.fileId}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status.status)}`}>
                                  {status.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>Provider: {status.provider}</span>
                                <span>Last Sync: {formatDate(status.lastSync)}</span>
                              </div>
                              {status.errorMessage && (
                                <p className="text-sm text-red-600 mt-1">{status.errorMessage}</p>
                              )}
                              {status.conflictReason && (
                                <p className="text-sm text-orange-600 mt-1">{status.conflictReason}</p>
                              )}
                            </div>
                          </div>

                          {status.status === 'syncing' && status.progress !== undefined && (
                            <div className="w-32">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${status.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-600 text-right">{status.progress}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Provider Settings Modal */}
        <AnimatePresence>
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setSelectedProvider(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {getProviderIcon(selectedProvider.type)}
                    <h3 className="text-lg font-semibold text-gray-900">{selectedProvider.name} Settings</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Sync
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProvider.settings.autoSync}
                        onChange={(e) => {
                          const newSettings = {
                            ...selectedProvider.settings,
                            autoSync: e.target.checked
                          };
                          handleUpdateSettings(selectedProvider.id, newSettings);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Automatically sync files
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sync Interval (minutes)
                    </label>
                    <select
                      value={selectedProvider.settings.syncInterval}
                      onChange={(e) => {
                        const newSettings = {
                          ...selectedProvider.settings,
                          syncInterval: parseInt(e.target.value)
                        };
                        handleUpdateSettings(selectedProvider.id, newSettings);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="360">6 hours</option>
                      <option value="720">12 hours</option>
                      <option value="1440">24 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sync Direction
                    </label>
                    <select
                      value={selectedProvider.settings.syncDirection}
                      onChange={(e) => {
                        const newSettings = {
                          ...selectedProvider.settings,
                          syncDirection: e.target.value as any
                        };
                        handleUpdateSettings(selectedProvider.id, newSettings);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="bidirectional">Bidirectional</option>
                      <option value="upload_only">Upload Only</option>
                      <option value="download_only">Download Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conflict Resolution
                    </label>
                    <select
                      value={selectedProvider.settings.conflictResolution}
                      onChange={(e) => {
                        const newSettings = {
                          ...selectedProvider.settings,
                          conflictResolution: e.target.value as any
                        };
                        handleUpdateSettings(selectedProvider.id, newSettings);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ask">Ask me</option>
                      <option value="keep_local">Keep local version</option>
                      <option value="keep_remote">Keep remote version</option>
                      <option value="keep_both">Keep both versions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exclude Patterns (comma separated)
                    </label>
                    <input
                      type="text"
                      value={selectedProvider.settings.excludePatterns.join(', ')}
                      onChange={(e) => {
                        const patterns = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                        const newSettings = {
                          ...selectedProvider.settings,
                          excludePatterns: patterns
                        };
                        handleUpdateSettings(selectedProvider.id, newSettings);
                      }}
                      placeholder="*.tmp, *.log, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Provider Modal */}
        <AnimatePresence>
          {showAddProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setShowAddProvider(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Cloud Provider</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      handleConnectProvider('google_drive');
                      setShowAddProvider(false);
                    }}
                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                    <span className="font-medium text-gray-900">Google Drive</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleConnectProvider('onedrive');
                      setShowAddProvider(false);
                    }}
                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
                    <span className="font-medium text-gray-900">OneDrive</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleConnectProvider('dropbox');
                      setShowAddProvider(false);
                    }}
                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                    <span className="font-medium text-gray-900">Dropbox</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleConnectProvider('box');
                      setShowAddProvider(false);
                    }}
                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                    <span className="font-medium text-gray-900">Box</span>
                  </button>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowAddProvider(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CloudSyncManager;