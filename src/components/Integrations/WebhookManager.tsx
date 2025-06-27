import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Copy, 
  ExternalLink,
  Play,
  Pause,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface WebhookEvent {
  id: string;
  name: string;
  description: string;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  timestamp: string;
  event: string;
  status: 'success' | 'failed';
  statusCode?: number;
  requestPayload: any;
  responsePayload?: any;
  duration: number;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  createdAt: string;
  isActive: boolean;
  lastDelivery?: {
    status: 'success' | 'failed';
    timestamp: string;
  };
  deliveryCount: number;
  failureCount: number;
}

interface WebhookManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ isOpen, onClose }) => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [availableEvents, setAvailableEvents] = useState<WebhookEvent[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadWebhooks();
      loadAvailableEvents();
    }
  }, [isOpen]);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockWebhooks: WebhookConfig[] = [
        {
          id: 'wh_1',
          name: 'File Upload Notifications',
          url: 'https://example.com/webhooks/file-uploads',
          secret: 'whsec_a1b2c3d4e5f6g7h8i9j0',
          events: ['file.created', 'file.updated'],
          createdAt: '2024-01-01T00:00:00Z',
          isActive: true,
          lastDelivery: {
            status: 'success',
            timestamp: '2024-01-15T10:30:00Z'
          },
          deliveryCount: 128,
          failureCount: 2
        },
        {
          id: 'wh_2',
          name: 'User Activity Tracker',
          url: 'https://example.com/webhooks/user-activity',
          secret: 'whsec_z9y8x7w6v5u4t3s2r1q0',
          events: ['user.login', 'user.logout', 'user.updated'],
          createdAt: '2024-01-05T00:00:00Z',
          isActive: true,
          lastDelivery: {
            status: 'failed',
            timestamp: '2024-01-14T15:45:00Z'
          },
          deliveryCount: 256,
          failureCount: 12
        },
        {
          id: 'wh_3',
          name: 'Sharing Events',
          url: 'https://example.com/webhooks/sharing',
          secret: 'whsec_j9i8h7g6f5e4d3c2b1a0',
          events: ['file.shared', 'folder.shared'],
          createdAt: '2024-01-10T00:00:00Z',
          isActive: false,
          deliveryCount: 45,
          failureCount: 0
        }
      ];
      
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableEvents = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockEvents: WebhookEvent[] = [
        { id: 'file.created', name: 'File Created', description: 'Triggered when a new file is uploaded' },
        { id: 'file.updated', name: 'File Updated', description: 'Triggered when a file is modified' },
        { id: 'file.deleted', name: 'File Deleted', description: 'Triggered when a file is moved to trash' },
        { id: 'file.restored', name: 'File Restored', description: 'Triggered when a file is restored from trash' },
        { id: 'file.shared', name: 'File Shared', description: 'Triggered when a file is shared' },
        { id: 'folder.created', name: 'Folder Created', description: 'Triggered when a new folder is created' },
        { id: 'folder.deleted', name: 'Folder Deleted', description: 'Triggered when a folder is moved to trash' },
        { id: 'folder.shared', name: 'Folder Shared', description: 'Triggered when a folder is shared' },
        { id: 'user.login', name: 'User Login', description: 'Triggered when a user logs in' },
        { id: 'user.logout', name: 'User Logout', description: 'Triggered when a user logs out' },
        { id: 'user.created', name: 'User Created', description: 'Triggered when a new user is created' },
        { id: 'user.updated', name: 'User Updated', description: 'Triggered when a user profile is updated' }
      ];
      
      setAvailableEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load available events:', error);
    }
  };

  const loadWebhookDeliveries = async (webhookId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockDeliveries: WebhookDelivery[] = [
        {
          id: 'del_1',
          webhookId,
          timestamp: '2024-01-15T10:30:00Z',
          event: 'file.created',
          status: 'success',
          statusCode: 200,
          requestPayload: {
            event: 'file.created',
            data: {
              fileId: 'file_123',
              fileName: 'document.pdf',
              fileSize: 1024 * 1024,
              createdAt: '2024-01-15T10:29:55Z'
            }
          },
          responsePayload: { success: true },
          duration: 245
        },
        {
          id: 'del_2',
          webhookId,
          timestamp: '2024-01-14T15:45:00Z',
          event: 'file.updated',
          status: 'failed',
          statusCode: 500,
          requestPayload: {
            event: 'file.updated',
            data: {
              fileId: 'file_456',
              fileName: 'presentation.pptx',
              fileSize: 2.5 * 1024 * 1024,
              updatedAt: '2024-01-14T15:44:50Z'
            }
          },
          responsePayload: { error: 'Internal Server Error' },
          duration: 1250
        },
        {
          id: 'del_3',
          webhookId,
          timestamp: '2024-01-13T09:15:00Z',
          event: 'file.created',
          status: 'success',
          statusCode: 200,
          requestPayload: {
            event: 'file.created',
            data: {
              fileId: 'file_789',
              fileName: 'image.jpg',
              fileSize: 500 * 1024,
              createdAt: '2024-01-13T09:14:55Z'
            }
          },
          responsePayload: { success: true },
          duration: 180
        }
      ];
      
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Failed to load webhook deliveries:', error);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random secret
      const randomSecret = 'whsec_' + Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      
      const webhook: WebhookConfig = {
        id: `wh_${Date.now()}`,
        name: newWebhook.name.trim(),
        url: newWebhook.url.trim(),
        secret: randomSecret,
        events: newWebhook.events,
        createdAt: new Date().toISOString(),
        isActive: true,
        deliveryCount: 0,
        failureCount: 0
      };
      
      setWebhooks(prev => [...prev, webhook]);
      setShowCreateForm(false);
      
      // Reset form
      setNewWebhook({
        name: '',
        url: '',
        events: []
      });
      
      // Show the secret
      setSelectedWebhook(webhook);
      setCopiedSecret(null);
      
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const handleToggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWebhooks(prev => prev.map(webhook => 
        webhook.id === webhookId ? { ...webhook, isActive } : webhook
      ));
      
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
      
      if (selectedWebhook?.id === webhookId) {
        setSelectedWebhook(null);
      }
      
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const handleViewDeliveries = async (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setShowDeliveries(true);
    await loadWebhookDeliveries(webhook.id);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSecret('copied');
      
      setTimeout(() => {
        setCopiedSecret(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getEventName = (eventId: string): string => {
    const event = availableEvents.find(e => e.id === eventId);
    return event ? event.name : eventId;
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Webhook className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Webhook Management</h2>
                <p className="text-sm text-gray-600">Configure webhooks to receive real-time event notifications</p>
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
            {/* Create Webhook Button */}
            {!showCreateForm && !selectedWebhook && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 mb-6"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Webhook</span>
              </button>
            )}

            {/* Create Webhook Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6 overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Webhook</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook Name
                      </label>
                      <input
                        type="text"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                        placeholder="e.g., File Upload Notifications"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination URL
                      </label>
                      <input
                        type="url"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                        placeholder="https://example.com/webhooks/endpoint"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Events to Subscribe
                      </label>
                      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                        {availableEvents.map((event) => (
                          <label key={event.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={newWebhook.events.includes(event.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event.id] });
                                } else {
                                  setNewWebhook({ 
                                    ...newWebhook, 
                                    events: newWebhook.events.filter(id => id !== event.id) 
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{event.name}</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
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
                        onClick={handleCreateWebhook}
                        disabled={!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0}
                        className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Create Webhook
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Webhook Details */}
            <AnimatePresence>
              {selectedWebhook && !showDeliveries && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Webhook Details</h3>
                    <button
                      onClick={() => setSelectedWebhook(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedWebhook.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">URL</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900 break-all">{selectedWebhook.url}</p>
                        <a
                          href={selectedWebhook.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Webhook Secret</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 font-mono text-sm text-gray-900 bg-white border border-gray-300 rounded px-3 py-2">
                          {copiedSecret === 'copied' ? '••••••••••••••••••••••••••••••' : selectedWebhook.secret}
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedWebhook.secret)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          {copiedSecret === 'copied' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use this secret to verify webhook signatures in your endpoint.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Subscribed Events</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedWebhook.events.map((eventId) => (
                          <span
                            key={eventId}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {getEventName(eventId)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                        <p className="text-gray-900">{formatDate(selectedWebhook.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Deliveries</p>
                        <p className="text-gray-900">{selectedWebhook.deliveryCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Failures</p>
                        <p className="text-gray-900">{selectedWebhook.failureCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleWebhook(selectedWebhook.id, !selectedWebhook.isActive)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                            selectedWebhook.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {selectedWebhook.isActive ? (
                            <>
                              <Pause className="w-4 h-4" />
                              <span>Disable</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>Enable</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteWebhook(selectedWebhook.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleViewDeliveries(selectedWebhook)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <Clock className="w-4 h-4" />
                        <span>View Deliveries</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Webhook Deliveries */}
            <AnimatePresence>
              {selectedWebhook && showDeliveries && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Webhook Deliveries: {selectedWebhook.name}
                    </h3>
                    <button
                      onClick={() => setShowDeliveries(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {deliveries.length > 0 ? (
                    <div className="space-y-4">
                      {deliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          className={`border rounded-lg p-4 ${
                            delivery.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  delivery.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {delivery.status === 'success' ? 'Success' : 'Failed'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {delivery.statusCode && `Status: ${delivery.statusCode}`}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {delivery.duration}ms
                                </span>
                              </div>
                              <div className="mt-1">
                                <p className="font-medium text-gray-900">{getEventName(delivery.event)}</p>
                                <p className="text-sm text-gray-600">{formatDate(delivery.timestamp)}</p>
                              </div>
                            </div>
                            
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors duration-200"
                              title="Retry delivery"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Request Payload</p>
                              <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                  {JSON.stringify(delivery.requestPayload, null, 2)}
                                </pre>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Response</p>
                              <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                  {delivery.responsePayload 
                                    ? JSON.stringify(delivery.responsePayload, null, 2)
                                    : 'No response data'
                                  }
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries yet</h3>
                      <p className="text-gray-600">
                        Webhook delivery history will appear here once events are triggered
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end mt-4">
                    <button
                      onClick={() => setShowDeliveries(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back to Webhook
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Webhooks List */}
            {!selectedWebhook && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Webhooks</h3>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading webhooks...</p>
                  </div>
                ) : webhooks.length > 0 ? (
                  <div className="space-y-4">
                    {webhooks.map((webhook) => (
                      <div
                        key={webhook.id}
                        className={`border rounded-lg p-4 ${
                          webhook.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                              {!webhook.isActive && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  Disabled
                                </span>
                              )}
                              {webhook.lastDelivery && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  webhook.lastDelivery.status === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  Last delivery: {webhook.lastDelivery.status}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 break-all">{webhook.url}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {webhook.events.map((eventId) => (
                                <span
                                  key={eventId}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                >
                                  {getEventName(eventId)}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Created: {formatDate(webhook.createdAt)}</span>
                              <span>Deliveries: {webhook.deliveryCount}</span>
                              {webhook.failureCount > 0 && (
                                <span className="text-red-600">Failures: {webhook.failureCount}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleToggleWebhook(webhook.id, !webhook.isActive)}
                              className={`p-2 rounded transition-colors duration-200 ${
                                webhook.isActive
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              }`}
                              title={webhook.isActive ? 'Disable webhook' : 'Enable webhook'}
                            >
                              {webhook.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => setSelectedWebhook(webhook)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleViewDeliveries(webhook)}
                              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors duration-200"
                              title="View deliveries"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteWebhook(webhook.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                              title="Delete webhook"
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
                    <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first webhook to receive real-time event notifications
                    </p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Create Webhook
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">Webhook Security</p>
              <p>Verify webhook signatures using your webhook secret to ensure requests are authentic.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WebhookManager;