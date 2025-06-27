import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Crown, Edit3, Eye, MessageCircle, MoreHorizontal, X } from 'lucide-react';
import { Collaborator, FolderPermission } from '../../types';
import { useWebSocket } from '../../hooks/useWebSocket';

interface CollaboratorsListProps {
  fileId?: string;
  folderId?: string;
  collaborators: Collaborator[];
  permissions: FolderPermission[];
  onInvite: (email: string, permission: 'viewer' | 'editor' | 'commenter') => void;
  onRemove: (userId: string) => void;
  onChangePermission: (userId: string, permission: 'viewer' | 'editor' | 'commenter') => void;
}

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  fileId,
  folderId,
  collaborators,
  permissions,
  onInvite,
  onRemove,
  onChangePermission
}) => {
  const { collaborators: liveCollaborators } = useWebSocket();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<'viewer' | 'editor' | 'commenter'>('viewer');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const currentCollaborators = fileId 
    ? liveCollaborators.get(fileId) || []
    : collaborators;

  const handleInvite = () => {
    if (inviteEmail && invitePermission) {
      onInvite(inviteEmail, invitePermission);
      setInviteEmail('');
      setInvitePermission('viewer');
      setShowInviteForm(false);
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'editor':
        return <Edit3 className="w-4 h-4" />;
      case 'commenter':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'editor':
        return 'text-green-600 bg-green-100';
      case 'commenter':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Collaborators ({currentCollaborators.length + permissions.length})
          </h3>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite</span>
        </button>
      </div>

      {/* Invite Form */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Invite Collaborator</h4>
              <button
                onClick={() => setShowInviteForm(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level
                </label>
                <select
                  value={invitePermission}
                  onChange={(e) => setInvitePermission(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">Viewer - Can view only</option>
                  <option value="commenter">Commenter - Can view and comment</option>
                  <option value="editor">Editor - Can view, comment, and edit</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborators List */}
      <div className="space-y-3">
        {/* Live Collaborators (for files) */}
        {currentCollaborators.map((collaborator) => (
          <motion.div
            key={collaborator.userId}
            layout
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {collaborator.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {collaborator.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {collaborator.cursor && (
                  <div 
                    className="absolute top-0 right-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: collaborator.cursor.color }}
                  ></div>
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{collaborator.userName}</p>
                <p className="text-sm text-gray-600">{collaborator.userEmail}</p>
                {collaborator.isOnline && (
                  <p className="text-xs text-green-600">Online now</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(collaborator.permission)}`}>
                {getPermissionIcon(collaborator.permission)}
                <span className="capitalize">{collaborator.permission}</span>
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === collaborator.userId ? null : collaborator.userId)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeMenu === collaborator.userId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          onChangePermission(collaborator.userId, 'viewer');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Make Viewer</span>
                      </button>
                      <button
                        onClick={() => {
                          onChangePermission(collaborator.userId, 'commenter');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Make Commenter</span>
                      </button>
                      <button
                        onClick={() => {
                          onChangePermission(collaborator.userId, 'editor');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Make Editor</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          onRemove(collaborator.userId);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 text-red-600"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Folder Permissions */}
        {permissions.map((permission) => (
          <motion.div
            key={permission.userId}
            layout
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {permission.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{permission.userName}</p>
                <p className="text-sm text-gray-600">{permission.userEmail}</p>
                <p className="text-xs text-gray-500">
                  Added by {permission.grantedBy} on {new Date(permission.grantedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission.permission)}`}>
                {getPermissionIcon(permission.permission)}
                <span className="capitalize">{permission.permission}</span>
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === permission.userId ? null : permission.userId)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeMenu === permission.userId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          onChangePermission(permission.userId, 'viewer');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Make Viewer</span>
                      </button>
                      <button
                        onClick={() => {
                          onChangePermission(permission.userId, 'commenter');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Make Commenter</span>
                      </button>
                      <button
                        onClick={() => {
                          onChangePermission(permission.userId, 'editor');
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Make Editor</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          onRemove(permission.userId);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 text-red-600"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}

        {currentCollaborators.length === 0 && permissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No collaborators yet</p>
            <p className="text-sm">Invite people to start collaborating</p>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default CollaboratorsList;