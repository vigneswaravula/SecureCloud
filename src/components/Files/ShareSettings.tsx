import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  X,
  Link,
  Copy,
  Check,
  Calendar,
  Eye,
  Download,
  Edit3,
  Lock,
  Globe,
  AlertTriangle,
  Trash2,
  Clock,
  Users,
  Mail
} from 'lucide-react';
import { FileItem, SharedLink } from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface ShareSettingsProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
}

const ShareSettings: React.FC<ShareSettingsProps> = ({ file, isOpen, onClose }) => {
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [newLinkSettings, setNewLinkSettings] = useState({
    permissions: 'view' as 'view' | 'download' | 'edit',
    expiresAt: '',
    password: '',
    requiresAuth: false,
    downloadLimit: 0,
    viewLimit: 0
  });
  const [showNewLinkForm, setShowNewLinkForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSharedLinks();
    }
  }, [isOpen, file.id]);

  const loadSharedLinks = async () => {
    setIsLoading(true);
    try {
      // Use file's shared links or mock data
      const links = file.sharedLinks.length > 0 
        ? file.sharedLinks 
        : [
            {
              id: 'link-1',
              fileId: file.id,
              token: 'abc123',
              permissions: 'view',
              expiresAt: '2024-02-15T10:30:00Z',
              createdAt: '2024-01-15T10:30:00Z',
              createdBy: '1',
              createdByName: 'John Doe',
              views: 12,
              downloads: 3,
              requiresAuth: false,
              twoFactorRequired: false,
              isRevoked: false
            },
            {
              id: 'link-2',
              fileId: file.id,
              token: 'def456',
              permissions: 'download',
              password: 'password123',
              createdAt: '2024-01-10T14:20:00Z',
              createdBy: '1',
              createdByName: 'John Doe',
              views: 5,
              downloads: 2,
              requiresAuth: true,
              twoFactorRequired: false,
              downloadLimit: 10,
              viewLimit: 20,
              isRevoked: false
            }
          ];

      setSharedLinks(links);
    } catch (error) {
      toast.error('Failed to load shared links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      const newLink: SharedLink = {
        id: `link-${Date.now()}`,
        fileId: file.id,
        token: Math.random().toString(36).substring(2, 15),
        permissions: newLinkSettings.permissions,
        expiresAt: newLinkSettings.expiresAt || undefined,
        password: newLinkSettings.password || undefined,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'John Doe',
        views: 0,
        downloads: 0,
        requiresAuth: newLinkSettings.requiresAuth,
        twoFactorRequired: false,
        downloadLimit: newLinkSettings.downloadLimit || undefined,
        viewLimit: newLinkSettings.viewLimit || undefined,
        isRevoked: false
      };

      setSharedLinks(prev => [...prev, newLink]);
      setShowNewLinkForm(false);
      
      // Reset form
      setNewLinkSettings({
        permissions: 'view',
        expiresAt: '',
        password: '',
        requiresAuth: false,
        downloadLimit: 0,
        viewLimit: 0
      });

      toast.success('Share link created');
    } catch (error) {
      toast.error('Failed to create share link');
    }
  };

  const handleCopyLink = (token: string) => {
    const shareUrl = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(token);
    toast.success('Link copied to clipboard');
    
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  const handleRevokeLink = async (linkId: string) => {
    try {
      setSharedLinks(prev => prev.map(link =>
        link.id === linkId
          ? { ...link, isRevoked: true, revokedAt: new Date().toISOString(), revokedBy: '1' }
          : link
      ));
      
      toast.success('Link revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke link');
    }
  };

  const handleSendInvite = async (email: string, permission: 'view' | 'edit' | 'comment') => {
    try {
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'edit':
        return <Edit3 className="w-4 h-4 text-green-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-blue-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'edit':
        return 'Can edit';
      case 'download':
        return 'Can download';
      default:
        return 'Can view';
    }
  };

  const isLinkExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Share Settings</h2>
                <p className="text-sm text-gray-600">{file.name}</p>
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
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading share settings...</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Create New Link */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">Share via Link</h3>
                  </div>
                  <button
                    onClick={() => setShowNewLinkForm(!showNewLinkForm)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
                  >
                    {showNewLinkForm ? 'Cancel' : 'Create Link'}
                  </button>
                </div>

                {showNewLinkForm && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-2">
                          Permission Level
                        </label>
                        <select
                          value={newLinkSettings.permissions}
                          onChange={(e) => setNewLinkSettings({ ...newLinkSettings, permissions: e.target.value as any })}
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="view">View only</option>
                          <option value="download">Download allowed</option>
                          <option value="edit">Edit allowed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={newLinkSettings.expiresAt}
                          onChange={(e) => setNewLinkSettings({ ...newLinkSettings, expiresAt: e.target.value })}
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-2">
                          Password Protection (Optional)
                        </label>
                        <input
                          type="password"
                          value={newLinkSettings.password}
                          onChange={(e) => setNewLinkSettings({ ...newLinkSettings, password: e.target.value })}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-2">
                          Download Limit (Optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newLinkSettings.downloadLimit}
                          onChange={(e) => setNewLinkSettings({ ...newLinkSettings, downloadLimit: parseInt(e.target.value) })}
                          placeholder="0 = unlimited"
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requiresAuth"
                        checked={newLinkSettings.requiresAuth}
                        onChange={(e) => setNewLinkSettings({ ...newLinkSettings, requiresAuth: e.target.checked })}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="requiresAuth" className="ml-2 text-sm text-purple-900">
                        Require authentication
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleCreateLink}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        Create Share Link
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Share Links</h3>
                
                <div className="space-y-4">
                  {sharedLinks.filter(link => !link.isRevoked).map((link) => (
                    <div
                      key={link.id}
                      className={`border rounded-lg p-4 ${
                        isLinkExpired(link.expiresAt) ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLinkExpired(link.expiresAt)
                              ? 'bg-red-100'
                              : link.permissions === 'edit'
                              ? 'bg-green-100'
                              : link.permissions === 'download'
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                          }`}>
                            {isLinkExpired(link.expiresAt) ? (
                              <Clock className="w-4 h-4 text-red-600" />
                            ) : (
                              getPermissionIcon(link.permissions)
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {getPermissionLabel(link.permissions)}
                              </span>
                              {link.password && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  <Lock className="w-3 h-3" />
                                  <span>Password protected</span>
                                </span>
                              )}
                              {link.requiresAuth && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  <Users className="w-3 h-3" />
                                  <span>Auth required</span>
                                </span>
                              )}
                              {isLinkExpired(link.expiresAt) && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Expired</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm text-gray-700 truncate">
                                {`${window.location.origin}/share/${link.token}`}
                              </div>
                              <button
                                onClick={() => handleCopyLink(link.token)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              >
                                {copiedLink === link.token ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Created: {formatDate(link.createdAt)}</span>
                              </div>
                              {link.expiresAt && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Expires: {formatDate(link.expiresAt)}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{link.views} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{link.downloads} downloads</span>
                              </div>
                            </div>

                            {(link.downloadLimit || link.viewLimit) && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {link.downloadLimit && (
                                  <div className="text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-gray-600">Download limit:</span>
                                      <span className="font-medium">{link.downloads} / {link.downloadLimit}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                      <div
                                        className="bg-blue-600 h-1 rounded-full"
                                        style={{ width: `${Math.min((link.downloads / link.downloadLimit) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {link.viewLimit && (
                                  <div className="text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-gray-600">View limit:</span>
                                      <span className="font-medium">{link.views} / {link.viewLimit}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                      <div
                                        className="bg-green-600 h-1 rounded-full"
                                        style={{ width: `${Math.min((link.views / link.viewLimit) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRevokeLink(link.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Revoke link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {sharedLinks.filter(link => !link.isRevoked).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Link className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No active share links</p>
                      <p className="text-sm">Create a link to share this file</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Revoked Links */}
              {sharedLinks.some(link => link.isRevoked) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revoked Links</h3>
                  
                  <div className="space-y-3">
                    {sharedLinks.filter(link => link.isRevoked).map((link) => (
                      <div
                        key={link.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <X className="w-4 h-4 text-gray-600" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-700">
                                {getPermissionLabel(link.permissions)}
                              </span>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Revoked
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 mb-1">
                              {`${window.location.origin}/share/${link.token}`}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Created: {formatDate(link.createdAt)}</span>
                              </div>
                              {link.revokedAt && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Revoked: {formatDate(link.revokedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Invite */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Invite by Email</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    <select
                      className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="view">Viewer</option>
                      <option value="comment">Commenter</option>
                      <option value="edit">Editor</option>
                    </select>
                    <button
                      onClick={() => handleSendInvite('example@example.com', 'view')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareSettings;