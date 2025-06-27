import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link, 
  X, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Calendar, 
  ExternalLink,
  Clock,
  Shield,
  Copy,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface OAuthApp {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
  isActive: boolean;
  logoUrl?: string;
}

interface OAuthConnection {
  id: string;
  provider: string;
  providerName: string;
  providerLogo: string;
  connectedAt: string;
  lastUsed?: string;
  scopes: string[];
  isActive: boolean;
  expiresAt?: string;
  tokenInfo: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

interface OAuthIntegrationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const OAuthIntegrations: React.FC<OAuthIntegrationsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'connections'>('connections');
  const [oauthApps, setOAuthApps] = useState<OAuthApp[]>([]);
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState<OAuthApp | null>(null);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    redirectUris: [''],
    scopes: [] as string[]
  });
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load both apps and connections in parallel
      await Promise.all([loadOAuthApps(), loadConnections()]);
    } catch (error) {
      console.error('Failed to load OAuth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOAuthApps = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockApps: OAuthApp[] = [
        {
          id: 'app_1',
          name: 'Mobile App Integration',
          description: 'OAuth integration for our mobile application',
          clientId: 'client_a1b2c3d4e5f6g7h8i9j0',
          clientSecret: 'secret_a1b2c3d4e5f6g7h8i9j0',
          redirectUris: ['https://example.com/callback', 'myapp://callback'],
          createdAt: '2024-01-01T00:00:00Z',
          lastUsed: '2024-01-15T10:30:00Z',
          scopes: ['read', 'write', 'user:profile'],
          isActive: true
        },
        {
          id: 'app_2',
          name: 'Third-party Integration',
          description: 'Integration with external service',
          clientId: 'client_z9y8x7w6v5u4t3s2r1q0',
          clientSecret: 'secret_z9y8x7w6v5u4t3s2r1q0',
          redirectUris: ['https://thirdparty.com/oauth/callback'],
          createdAt: '2024-01-05T00:00:00Z',
          scopes: ['read'],
          isActive: true
        }
      ];
      
      setOAuthApps(mockApps);
    } catch (error) {
      console.error('Failed to load OAuth apps:', error);
    }
  };

  const loadConnections = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockConnections: OAuthConnection[] = [
        {
          id: 'conn_1',
          provider: 'google',
          providerName: 'Google Drive',
          providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png',
          connectedAt: '2024-01-01T00:00:00Z',
          lastUsed: '2024-01-15T10:30:00Z',
          scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.profile'],
          isActive: true,
          tokenInfo: {
            accessToken: 'ya29.a0AfB_byC...',
            refreshToken: '1//04dX...',
            expiresAt: '2024-01-16T10:30:00Z'
          }
        },
        {
          id: 'conn_2',
          provider: 'microsoft',
          providerName: 'Microsoft OneDrive',
          providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg',
          connectedAt: '2024-01-05T00:00:00Z',
          lastUsed: '2024-01-14T15:45:00Z',
          scopes: ['Files.ReadWrite', 'User.Read'],
          isActive: true,
          tokenInfo: {
            accessToken: 'EwBAA...',
            refreshToken: 'M.R3_B...',
            expiresAt: '2024-01-16T15:45:00Z'
          }
        },
        {
          id: 'conn_3',
          provider: 'dropbox',
          providerName: 'Dropbox',
          providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
          connectedAt: '2024-01-10T00:00:00Z',
          scopes: ['files.content.read', 'files.content.write'],
          isActive: false,
          expiresAt: '2024-01-12T00:00:00Z',
          tokenInfo: {
            accessToken: 'sl.Bh...',
            refreshToken: '',
            expiresAt: '2024-01-12T00:00:00Z'
          }
        }
      ];
      
      setConnections(mockConnections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const handleCreateApp = async () => {
    if (!newApp.name.trim() || !newApp.redirectUris[0].trim()) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate random client ID and secret
      const clientId = 'client_' + Math.random().toString(36).substring(2, 15);
      const clientSecret = 'secret_' + Math.random().toString(36).substring(2, 15);
      
      const app: OAuthApp = {
        id: `app_${Date.now()}`,
        name: newApp.name.trim(),
        description: newApp.description.trim(),
        clientId,
        clientSecret,
        redirectUris: newApp.redirectUris.filter(uri => uri.trim()),
        createdAt: new Date().toISOString(),
        scopes: newApp.scopes.length > 0 ? newApp.scopes : ['read'],
        isActive: true
      };
      
      setOAuthApps(prev => [...prev, app]);
      setShowCreateForm(false);
      setSelectedApp(app);
      
      // Reset form
      setNewApp({
        name: '',
        description: '',
        redirectUris: [''],
        scopes: []
      });
      
    } catch (error) {
      console.error('Failed to create OAuth app:', error);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOAuthApps(prev => prev.filter(app => app.id !== appId));
      
      if (selectedApp?.id === appId) {
        setSelectedApp(null);
      }
      
    } catch (error) {
      console.error('Failed to delete OAuth app:', error);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleRefreshToken = async (connectionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId
          ? {
              ...conn,
              isActive: true,
              lastUsed: new Date().toISOString(),
              tokenInfo: {
                ...conn.tokenInfo,
                accessToken: 'new_token_' + Math.random().toString(36).substring(2, 10),
                expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
              }
            }
          : conn
      ));
      
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSecret(field);
      
      setTimeout(() => {
        setCopiedSecret(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleAddRedirectUri = () => {
    setNewApp({
      ...newApp,
      redirectUris: [...newApp.redirectUris, '']
    });
  };

  const handleRemoveRedirectUri = (index: number) => {
    const updatedUris = [...newApp.redirectUris];
    updatedUris.splice(index, 1);
    setNewApp({
      ...newApp,
      redirectUris: updatedUris
    });
  };

  const handleUpdateRedirectUri = (index: number, value: string) => {
    const updatedUris = [...newApp.redirectUris];
    updatedUris[index] = value;
    setNewApp({
      ...newApp,
      redirectUris: updatedUris
    });
  };

  const isTokenExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
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
                <Link className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">OAuth Integrations</h2>
                <p className="text-sm text-gray-600">Manage your OAuth applications and connections</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'connections'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Connected Services
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'apps'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              OAuth Applications
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Connected Services Tab */}
            {activeTab === 'connections' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Connected Services</h3>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading connections...</p>
                  </div>
                ) : connections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connections.map((connection) => (
                      <div
                        key={connection.id}
                        className={`border rounded-lg p-4 ${
                          !connection.isActive || (connection.expiresAt && isTokenExpired(connection.expiresAt))
                            ? 'border-gray-200 bg-gray-50 opacity-75'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {connection.providerLogo ? (
                            <img 
                              src={connection.providerLogo} 
                              alt={connection.providerName}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Link className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{connection.providerName}</h4>
                                {!connection.isActive && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                    Disconnected
                                  </span>
                                )}
                                {connection.isActive && connection.tokenInfo.expiresAt && isTokenExpired(connection.tokenInfo.expiresAt) && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                    Token Expired
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="text-gray-600">
                                Connected: {formatDate(connection.connectedAt)}
                              </p>
                              {connection.lastUsed && (
                                <p className="text-gray-600">
                                  Last used: {formatDate(connection.lastUsed)}
                                </p>
                              )}
                              {connection.tokenInfo.expiresAt && (
                                <p className={`${
                                  isTokenExpired(connection.tokenInfo.expiresAt) ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  Token expires: {formatDate(connection.tokenInfo.expiresAt)}
                                </p>
                              )}
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-1">
                              {connection.scopes.map((scope, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {scope}
                                </span>
                              ))}
                            </div>
                            
                            <div className="mt-4 flex items-center space-x-2">
                              {connection.isActive && connection.tokenInfo.expiresAt && isTokenExpired(connection.tokenInfo.expiresAt) && (
                                <button
                                  onClick={() => handleRefreshToken(connection.id)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  Refresh Token
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDisconnect(connection.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors duration-200"
                              >
                                Disconnect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No connected services</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your account to external services for enhanced functionality
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <span>Connect Google Drive</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <span>Connect OneDrive</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <span>Connect Dropbox</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OAuth Apps Tab */}
            {activeTab === 'apps' && (
              <div className="space-y-6">
                {/* Create App Button */}
                {!showCreateForm && !selectedApp && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-6"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create OAuth App</span>
                  </button>
                )}

                {/* Create App Form */}
                <AnimatePresence>
                  {showCreateForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New OAuth App</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Application Name
                          </label>
                          <input
                            type="text"
                            value={newApp.name}
                            onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                            placeholder="e.g., My Integration"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                          </label>
                          <textarea
                            value={newApp.description}
                            onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                            placeholder="Describe what your application does"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Redirect URIs
                          </label>
                          <div className="space-y-2">
                            {newApp.redirectUris.map((uri, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="url"
                                  value={uri}
                                  onChange={(e) => handleUpdateRedirectUri(index, e.target.value)}
                                  placeholder="https://example.com/callback"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {newApp.redirectUris.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveRedirectUri(index)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={handleAddRedirectUri}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              + Add another redirect URI
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Scopes
                          </label>
                          <div className="space-y-2">
                            {['read', 'write', 'delete', 'user:profile'].map((scope) => (
                              <label key={scope} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={newApp.scopes.includes(scope)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewApp({ ...newApp, scopes: [...newApp.scopes, scope] });
                                    } else {
                                      setNewApp({ 
                                        ...newApp, 
                                        scopes: newApp.scopes.filter(s => s !== scope) 
                                      });
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{scope}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-2">
                          <button
                            onClick={() => setShowCreateForm(false)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCreateApp}
                            disabled={!newApp.name.trim() || !newApp.redirectUris[0].trim()}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Create OAuth App
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* App Details */}
                <AnimatePresence>
                  {selectedApp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">OAuth App Details</h3>
                        <button
                          onClick={() => setSelectedApp(null)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedApp.name}</p>
                        </div>
                        
                        {selectedApp.description && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                            <p className="text-gray-900">{selectedApp.description}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Client ID</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 font-mono text-sm text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                              {selectedApp.clientId}
                            </div>
                            <button
                              onClick={() => copyToClipboard(selectedApp.clientId, 'clientId')}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                            >
                              {copiedSecret === 'clientId' ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Client Secret</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 font-mono text-sm text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                              {copiedSecret === 'clientSecret' ? '••••••••••••••••••••••••••••••' : selectedApp.clientSecret}
                            </div>
                            <button
                              onClick={() => copyToClipboard(selectedApp.clientSecret, 'clientSecret')}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                            >
                              {copiedSecret === 'clientSecret' ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Keep this value secret. Never share it in public repositories or client-side code.
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Redirect URIs</p>
                          <ul className="space-y-2 mt-1">
                            {selectedApp.redirectUris.map((uri, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="flex-1 text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                                  {uri}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(uri, `uri_${index}`)}
                                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                >
                                  {copiedSecret === `uri_${index}` ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Scopes</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedApp.scopes.map((scope, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                            <p className="text-gray-900">{formatDate(selectedApp.createdAt)}</p>
                          </div>
                          {selectedApp.lastUsed && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Last Used</p>
                              <p className="text-gray-900">{formatDate(selectedApp.lastUsed)}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-end pt-2">
                          <button
                            onClick={() => handleDeleteApp(selectedApp.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete App</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OAuth Apps List */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your OAuth Apps</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading OAuth apps...</p>
                    </div>
                  ) : oauthApps.length > 0 ? (
                    <div className="space-y-4">
                      {oauthApps.map((app) => (
                        <div
                          key={app.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">{app.name}</h4>
                                {!app.isActive && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              
                              {app.description && (
                                <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Client ID: {app.clientId.substring(0, 10)}...</span>
                                <span>Created: {formatDate(app.createdAt)}</span>
                                {app.lastUsed && (
                                  <span>Last used: {formatDate(app.lastUsed)}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteApp(app.id)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                title="Delete app"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No OAuth apps yet</h3>
                      <p className="text-gray-600 mb-4">
                        Create your first OAuth app to allow external services to access your data
                      </p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Create OAuth App
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">Security Best Practices</p>
              <p>Keep client secrets secure and never expose them in client-side code. Use proper OAuth flows and validate all tokens.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OAuthIntegrations;