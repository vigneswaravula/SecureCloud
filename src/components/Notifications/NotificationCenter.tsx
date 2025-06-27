import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  Share2,
  MessageCircle,
  Shield,
  Upload,
  Download,
  Users,
  Trash2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface Notification {
  id: string;
  type: 'share' | 'comment' | 'security' | 'upload' | 'download' | 'collaboration' | 'system';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: '1',
        type: 'share',
        title: 'File shared with you',
        message: 'Sarah Johnson shared "Marketing Campaign.pdf" with you',
        createdAt: '2024-01-15T10:30:00Z',
        isRead: false,
        actionUrl: '/shared',
        metadata: { fileName: 'Marketing Campaign.pdf', sharedBy: 'Sarah Johnson' }
      },
      {
        id: '2',
        type: 'comment',
        title: 'New comment',
        message: 'Mike Chen commented on "Project Proposal.pdf"',
        createdAt: '2024-01-15T09:15:00Z',
        isRead: false,
        metadata: { fileName: 'Project Proposal.pdf', commenter: 'Mike Chen' }
      },
      {
        id: '3',
        type: 'collaboration',
        title: 'User joined file',
        message: 'Alex Rivera is now collaborating on "Team Meeting Notes.docx"',
        createdAt: '2024-01-15T08:45:00Z',
        isRead: true,
        metadata: { fileName: 'Team Meeting Notes.docx', collaborator: 'Alex Rivera' }
      },
      {
        id: '4',
        type: 'security',
        title: 'Security alert',
        message: 'New login detected from Chrome on Windows',
        createdAt: '2024-01-14T22:30:00Z',
        isRead: true,
        metadata: { device: 'Chrome on Windows', location: 'New York, US' }
      },
      {
        id: '5',
        type: 'upload',
        title: 'Upload completed',
        message: 'Successfully uploaded "Demo Video.mp4"',
        createdAt: '2024-01-14T16:20:00Z',
        isRead: true,
        metadata: { fileName: 'Demo Video.mp4', size: '45.3 MB' }
      },
      {
        id: '6',
        type: 'system',
        title: 'Storage warning',
        message: 'You\'re using 85% of your storage space',
        createdAt: '2024-01-14T12:00:00Z',
        isRead: true,
        metadata: { usage: '85%', limit: '15 GB' }
      }
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'share':
        return <Share2 className="w-5 h-5 text-blue-600" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'upload':
        return <Upload className="w-5 h-5 text-purple-600" />;
      case 'download':
        return <Download className="w-5 h-5 text-indigo-600" />;
      case 'collaboration':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'system':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                filter === 'unread'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="mt-3">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'All caught up! No new notifications to read.'
                  : 'You\'ll see notifications here when they arrive.'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationCenter;