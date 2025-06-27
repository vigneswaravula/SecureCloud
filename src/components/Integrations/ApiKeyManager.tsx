import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, Eye, EyeOff, Plus, Trash2, RefreshCw, Check, X, AlertTriangle, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
  scopes: string[];
  isActive: boolean;
}

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read']);
  const [newKeyExpiry, setNewKeyExpiry] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadApiKeys();
    }
  }, [isOpen]);

  const loadApiKeys = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockKeys: ApiKey[] = [
        {
          id: 'key_1',
          name: 'Development API Key',
          key: 'sk_dev_a1b2c3d4e5f6g7h8i9j0',
          createdAt: '2024-01-01T00:00:00Z',
          lastUsed: '2024-01-15T10:30:00Z',
          scopes: ['read', 'write'],
          isActive: true
        },
        {
          id: 'key_2',
          name: 'Production API Key',
          key: 'sk_prod_z9y8x7w6v5u4t3s2r1q0',
          createdAt: '2024-01-05T00:00:00Z',
          expiresAt: '2025-01-05T00:00:00Z',
          scopes: ['read', 'write', 'delete'],
          isActive: true
        },
        {
          id: 'key_3',
          name: 'Testing API Key',
          key: 'sk_test_j9i8h7g6f5e4d3c2b1a0',
          createdAt: '2024-01-10T00:00:00Z',
          lastUsed: '2024-01-12T15:45:00Z',
          scopes: ['read'],
          isActive: false
        }
      ];
      
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random key
      const randomKey = 'sk_' + Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyName.trim(),
        key: randomKey,
        createdAt: new Date().toISOString(),
        expiresAt: newKeyExpiry || undefined,
        scopes: newKeyScopes,
        isActive: true
      };
      
      setApiKeys(prev => [newKey, ...prev]);
      setNewlyCreatedKey(randomKey);
      setShowCreateForm(false);
      
      // Reset form
      setNewKeyName('');
      setNewKeyScopes(['read']);
      setNewKeyExpiry('');
      
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, isActive: false } : key
      ));
      
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleRegenerateKey = async (keyId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random key
      const randomKey = 'sk_' + Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      
      setApiKeys(prev => prev.map(key => 
        key.id === keyId 
          ? { 
              ...key, 
              key: randomKey,
              createdAt: new Date().toISOString(),
              isActive: true
            } 
          : key
      ));
      
      setNewlyCreatedKey(randomKey);
      
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatKeyForDisplay = (key: string, isVisible: boolean) => {
    if (isVisible) return key;
    return '•'.repeat(Math.min(20, key.length));
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'read':
        return 'bg-blue-100 text-blue-700';
      case 'write':
        return 'bg-green-100 text-green-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">API Key Management</h2>
                <p className="text-sm text-gray-600">Create and manage API keys for external integrations</p>
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
          <div className="p-6">
            {/* Create Key Button */}
            {!showCreateForm && !newlyCreatedKey && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-6"
              >
                <Plus className="w-4 h-4" />
                <span>Create New API Key</span>
              </button>
            )}

            {/* Create Key Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Development API Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="space-y-2">
                        {['read', 'write', 'delete', 'admin'].map((scope) => (
                          <label key={scope} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newKeyScopes.includes(scope)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewKeyScopes(prev => [...prev, scope]);
                                } else {
                                  setNewKeyScopes(prev => prev.filter(s => s !== scope));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{scope}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration (Optional)
                      </label>
                      <input
                        type="date"
                        value={newKeyExpiry}
                        onChange={(e) => setNewKeyExpiry(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateKey}
                        disabled={!newKeyName.trim() || newKeyScopes.length === 0}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Create API Key
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Newly Created Key */}
            <AnimatePresence>
              {newlyCreatedKey && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 overflow-hidden"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">API Key Created Successfully</h3>
                      <p className="text-sm text-green-700 mb-4">
                        Make sure to copy your API key now. For security reasons, you won't be able to see it again.
                      </p>
                      
                      <div className="bg-white border border-green-300 rounded-lg p-3 mb-4">
                        <code className="text-sm font-mono text-green-800 break-all">
                          {newlyCreatedKey}
                        </code>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => copyToClipboard(newlyCreatedKey, 'new')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          {copiedKey === 'new' ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy to Clipboard</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => setNewlyCreatedKey(null)}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* API Keys List */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Your API Keys</h3>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading API keys...</p>
                </div>
              ) : apiKeys.length > 0 ? (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className={`border rounded-lg p-4 ${
                        apiKey.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                            {!apiKey.isActive && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Revoked
                              </span>
                            )}
                            {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex-1 font-mono text-sm text-gray-700 bg-gray-100 rounded px-3 py-2 truncate">
                              {formatKeyForDisplay(apiKey.key, visibleKeys.has(apiKey.id))}
                            </div>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                            >
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              disabled={!apiKey.isActive}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Copy to clipboard"
                            >
                              {copiedKey === apiKey.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Created</p>
                              <p className="font-medium text-gray-900">{formatDate(apiKey.createdAt)}</p>
                            </div>
                            {apiKey.lastUsed && (
                              <div>
                                <p className="text-gray-500">Last Used</p>
                                <p className="font-medium text-gray-900">{formatDate(apiKey.lastUsed)}</p>
                              </div>
                            )}
                            {apiKey.expiresAt && (
                              <div>
                                <p className="text-gray-500">Expires</p>
                                <p className="font-medium text-gray-900">{formatDate(apiKey.expiresAt)}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500">Permissions</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {apiKey.scopes.map((scope) => (
                                  <span
                                    key={scope}
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getScopeColor(scope)}`}
                                  >
                                    {scope}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          {apiKey.isActive ? (
                            <button
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                              title="Revoke key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteKey(apiKey.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              title="Delete key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleRegenerateKey(apiKey.id)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="Regenerate key"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first API key to integrate with external services
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">Security Notice</p>
              <p>API keys grant access to your account. Never share them in public repositories or client-side code.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApiKeyManager;