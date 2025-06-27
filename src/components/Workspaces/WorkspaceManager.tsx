import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Settings,
  Crown,
  Shield,
  Globe,
  Lock,
  Edit3,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Workspace, WorkspaceMember } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface WorkspaceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkspace: (workspace: Workspace) => void;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({
  isOpen,
  onClose,
  onSelectWorkspace
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadWorkspaces();
    }
  }, [isOpen]);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      // Mock workspace data
      const mockWorkspaces: Workspace[] = [
        {
          id: 'ws-1',
          name: 'Marketing Team',
          description: 'Collaborative workspace for marketing campaigns and assets',
          ownerId: '1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          members: [
            {
              userId: '1',
              userName: 'John Doe',
              userEmail: 'john@example.com',
              role: 'admin',
              joinedAt: '2024-01-01T00:00:00Z',
              invitedBy: '1',
              lastActive: '2024-01-15T10:30:00Z',
              permissions: []
            },
            {
              userId: '2',
              userName: 'Sarah Johnson',
              userEmail: 'sarah@example.com',
              role: 'editor',
              joinedAt: '2024-01-02T00:00:00Z',
              invitedBy: '1',
              lastActive: '2024-01-15T09:15:00Z',
              permissions: []
            }
          ],
          settings: {
            isPublic: false,
            allowGuestAccess: true,
            requireApproval: false,
            defaultFilePermission: 'editor',
            retentionPolicy: {
              enabled: false,
              deleteAfterDays: 365,
              notifyBeforeDays: 30,
              exemptStarred: true,
              exemptShared: true
            },
            encryptionRequired: false,
            aiAnalysisEnabled: true,
            collaborationFeatures: {
              realTimeEditing: true,
              comments: true,
              mentions: true,
              videoChat: false,
              screenSharing: false,
              whiteboard: false
            }
          },
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF'
          },
          storageUsed: 2.5 * 1024 * 1024 * 1024,
          storageLimit: 50 * 1024 * 1024 * 1024,
          isActive: true,
          plan: 'pro'
        },
        {
          id: 'ws-2',
          name: 'Development Team',
          description: 'Code repositories, documentation, and project files',
          ownerId: '1',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-14T16:20:00Z',
          members: [
            {
              userId: '1',
              userName: 'John Doe',
              userEmail: 'john@example.com',
              role: 'admin',
              joinedAt: '2024-01-05T00:00:00Z',
              invitedBy: '1',
              lastActive: '2024-01-14T16:20:00Z',
              permissions: []
            }
          ],
          settings: {
            isPublic: false,
            allowGuestAccess: false,
            requireApproval: true,
            defaultFilePermission: 'viewer',
            retentionPolicy: {
              enabled: true,
              deleteAfterDays: 180,
              notifyBeforeDays: 14,
              exemptStarred: true,
              exemptShared: false
            },
            encryptionRequired: true,
            aiAnalysisEnabled: false,
            collaborationFeatures: {
              realTimeEditing: true,
              comments: true,
              mentions: true,
              videoChat: true,
              screenSharing: true,
              whiteboard: true
            }
          },
          branding: {
            primaryColor: '#10B981',
            secondaryColor: '#059669'
          },
          storageUsed: 1.2 * 1024 * 1024 * 1024,
          storageLimit: 25 * 1024 * 1024 * 1024,
          isActive: true,
          plan: 'enterprise'
        }
      ];

      setWorkspaces(mockWorkspaces);
    } catch (error) {
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (workspaceData: Partial<Workspace>) => {
    try {
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        name: workspaceData.name || 'New Workspace',
        description: workspaceData.description,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
          {
            userId: '1',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            role: 'admin',
            joinedAt: new Date().toISOString(),
            invitedBy: '1',
            lastActive: new Date().toISOString(),
            permissions: []
          }
        ],
        settings: {
          isPublic: false,
          allowGuestAccess: false,
          requireApproval: false,
          defaultFilePermission: 'editor',
          retentionPolicy: {
            enabled: false,
            deleteAfterDays: 365,
            notifyBeforeDays: 30,
            exemptStarred: true,
            exemptShared: true
          },
          encryptionRequired: false,
          aiAnalysisEnabled: true,
          collaborationFeatures: {
            realTimeEditing: true,
            comments: true,
            mentions: true,
            videoChat: false,
            screenSharing: false,
            whiteboard: false
          }
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF'
        },
        storageUsed: 0,
        storageLimit: 10 * 1024 * 1024 * 1024,
        isActive: true,
        plan: 'free'
      };

      setWorkspaces(prev => [...prev, newWorkspace]);
      setShowCreateModal(false);
      toast.success('Workspace created successfully');
    } catch (error) {
      toast.error('Failed to create workspace');
    }
  };

  const handleInviteMember = async (workspaceId: string, email: string, role: 'admin' | 'editor' | 'viewer') => {
    try {
      // Mock invite logic
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterRole === 'all') return matchesSearch;
    
    const userRole = workspace.members.find(m => m.userId === '1')?.role;
    return matchesSearch && userRole === filterRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor':
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Shield className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-700',
      pro: 'bg-blue-100 text-blue-700',
      enterprise: 'bg-purple-100 text-purple-700'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plan as keyof typeof colors]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
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
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Workspaces</h2>
                <p className="text-sm text-gray-600">Manage your team workspaces and collaboration</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workspaces..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading workspaces...</p>
              </div>
            </div>
          ) : filteredWorkspaces.length > 0 ? (
            <div className="p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkspaces.map((workspace) => (
                    <motion.div
                      key={workspace.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -2 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => onSelectWorkspace(workspace)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                            {getPlanBadge(workspace.plan)}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{workspace.description}</p>
                        </div>
                        
                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Members</span>
                          <span className="font-medium">{workspace.members.length}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Storage</span>
                          <span className="font-medium">
                            {formatFileSize(workspace.storageUsed)} / {formatFileSize(workspace.storageLimit)}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((workspace.storageUsed / workspace.storageLimit) * 100, 100)}%`
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(workspace.members.find(m => m.userId === '1')?.role || 'viewer')}
                            <span className="text-xs text-gray-600 capitalize">
                              {workspace.members.find(m => m.userId === '1')?.role}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(workspace.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredWorkspaces.map((workspace) => (
                    <motion.div
                      key={workspace.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => onSelectWorkspace(workspace)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                              {getPlanBadge(workspace.plan)}
                            </div>
                            <p className="text-sm text-gray-600">{workspace.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span>{workspace.members.length} members</span>
                              <span>{formatFileSize(workspace.storageUsed)} used</span>
                              <span>Updated {formatDate(workspace.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(workspace.members.find(m => m.userId === '1')?.role || 'viewer')}
                            <span className="text-sm text-gray-600 capitalize">
                              {workspace.members.find(m => m.userId === '1')?.role}
                            </span>
                          </div>
                          
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No workspaces found' : 'No workspaces yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first workspace to start collaborating'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Workspace
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Workspace Modal */}
        <CreateWorkspaceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWorkspace}
        />
      </motion.div>
    </motion.div>
  );
};

// Create Workspace Modal Component
interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workspace: Partial<Workspace>) => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      settings: {
        isPublic,
        allowGuestAccess: false,
        requireApproval: false,
        defaultFilePermission: 'editor',
        retentionPolicy: {
          enabled: false,
          deleteAfterDays: 365,
          notifyBeforeDays: 30,
          exemptStarred: true,
          exemptShared: true
        },
        encryptionRequired: false,
        aiAnalysisEnabled: true,
        collaborationFeatures: {
          realTimeEditing: true,
          comments: true,
          mentions: true,
          videoChat: false,
          screenSharing: false,
          whiteboard: false
        }
      },
      plan
    });

    // Reset form
    setName('');
    setDescription('');
    setIsPublic(false);
    setPlan('free');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Workspace</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your workspace"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="free">Free (10GB)</option>
              <option value="pro">Pro (50GB)</option>
              <option value="enterprise">Enterprise (Unlimited)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Make workspace public
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default WorkspaceManager;