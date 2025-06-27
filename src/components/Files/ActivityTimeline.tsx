import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Upload,
  Download,
  Share2,
  Trash2,
  Edit3,
  Star,
  MessageCircle,
  Users,
  Eye,
  Calendar,
  Filter,
  Clock
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ActivityItem {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete' | 'rename' | 'star' | 'comment' | 'view' | 'collaborate';
  description: string;
  fileName?: string;
  fileId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  fileId?: string;
  userId?: string;
  limit?: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ fileId, userId, limit = 50 }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'uploads' | 'shares' | 'edits'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [fileId, userId, filter]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      // Mock activity data - in a real app, this would come from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'upload',
          description: 'Uploaded "Project Proposal.pdf"',
          fileName: 'Project Proposal.pdf',
          fileId: '1',
          userId: '1',
          userName: 'John Doe',
          userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          createdAt: '2024-01-15T10:30:00Z',
          metadata: { size: '2.5 MB' }
        },
        {
          id: '2',
          type: 'share',
          description: 'Shared "Team Photo.jpg" with Sarah Johnson',
          fileName: 'Team Photo.jpg',
          fileId: '2',
          userId: '1',
          userName: 'John Doe',
          createdAt: '2024-01-15T09:45:00Z',
          metadata: { sharedWith: 'Sarah Johnson', permission: 'view' }
        },
        {
          id: '3',
          type: 'comment',
          description: 'Added a comment on "Presentation.pptx"',
          fileName: 'Presentation.pptx',
          fileId: '3',
          userId: '2',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          createdAt: '2024-01-15T09:15:00Z',
          metadata: { comment: 'Great work on the design!' }
        },
        {
          id: '4',
          type: 'download',
          description: 'Downloaded "Demo Video.mp4"',
          fileName: 'Demo Video.mp4',
          fileId: '4',
          userId: '3',
          userName: 'Mike Chen',
          createdAt: '2024-01-15T08:30:00Z'
        },
        {
          id: '5',
          type: 'star',
          description: 'Starred "Budget Spreadsheet.xlsx"',
          fileName: 'Budget Spreadsheet.xlsx',
          fileId: '5',
          userId: '1',
          userName: 'John Doe',
          createdAt: '2024-01-14T16:20:00Z'
        },
        {
          id: '6',
          type: 'collaborate',
          description: 'Started collaborating on "Team Meeting Notes.docx"',
          fileName: 'Team Meeting Notes.docx',
          fileId: '6',
          userId: '4',
          userName: 'Alex Rivera',
          createdAt: '2024-01-14T14:45:00Z',
          metadata: { permission: 'editor' }
        },
        {
          id: '7',
          type: 'rename',
          description: 'Renamed file from "Untitled.pdf" to "Final Report.pdf"',
          fileName: 'Final Report.pdf',
          fileId: '7',
          userId: '1',
          userName: 'John Doe',
          createdAt: '2024-01-14T12:10:00Z',
          metadata: { oldName: 'Untitled.pdf', newName: 'Final Report.pdf' }
        },
        {
          id: '8',
          type: 'view',
          description: 'Viewed "Marketing Assets.zip"',
          fileName: 'Marketing Assets.zip',
          fileId: '8',
          userId: '2',
          userName: 'Sarah Johnson',
          createdAt: '2024-01-14T11:30:00Z'
        }
      ];

      // Filter activities based on the selected filter
      let filteredActivities = mockActivities;
      
      if (fileId) {
        filteredActivities = filteredActivities.filter(activity => activity.fileId === fileId);
      }
      
      if (userId) {
        filteredActivities = filteredActivities.filter(activity => activity.userId === userId);
      }

      switch (filter) {
        case 'uploads':
          filteredActivities = filteredActivities.filter(activity => activity.type === 'upload');
          break;
        case 'shares':
          filteredActivities = filteredActivities.filter(activity => ['share', 'collaborate'].includes(activity.type));
          break;
        case 'edits':
          filteredActivities = filteredActivities.filter(activity => ['rename', 'comment', 'star'].includes(activity.type));
          break;
      }

      setActivities(filteredActivities.slice(0, limit));
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-green-600" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-purple-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'rename':
        return <Edit3 className="w-4 h-4 text-orange-600" />;
      case 'star':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-indigo-600" />;
      case 'collaborate':
        return <Users className="w-4 h-4 text-teal-600" />;
      case 'view':
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-100 border-blue-200';
      case 'download':
        return 'bg-green-100 border-green-200';
      case 'share':
        return 'bg-purple-100 border-purple-200';
      case 'delete':
        return 'bg-red-100 border-red-200';
      case 'rename':
        return 'bg-orange-100 border-orange-200';
      case 'star':
        return 'bg-yellow-100 border-yellow-200';
      case 'comment':
        return 'bg-indigo-100 border-indigo-200';
      case 'collaborate':
        return 'bg-teal-100 border-teal-200';
      case 'view':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
            <p className="text-gray-600">Recent file activity and collaboration</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Activity</option>
            <option value="uploads">Uploads</option>
            <option value="shares">Shares & Collaboration</option>
            <option value="edits">Edits & Changes</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}

                {/* Activity icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity content */}
                <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {activity.userAvatar ? (
                          <img
                            src={activity.userAvatar}
                            alt={activity.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {activity.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{activity.userName}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{activity.description}</p>
                      
                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="text-sm text-gray-500 space-y-1">
                          {activity.metadata.comment && (
                            <p className="italic">"{activity.metadata.comment}"</p>
                          )}
                          {activity.metadata.sharedWith && (
                            <p>Shared with {activity.metadata.sharedWith} ({activity.metadata.permission} access)</p>
                          )}
                          {activity.metadata.size && (
                            <p>File size: {activity.metadata.size}</p>
                          )}
                          {activity.metadata.oldName && activity.metadata.newName && (
                            <p>From "{activity.metadata.oldName}" to "{activity.metadata.newName}"</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'File activity will appear here as you use SecureCloud'
                : `No ${filter} activity found`
              }
            </p>
          </div>
        )}
      </div>

      {/* Load more */}
      {activities.length >= limit && (
        <div className="text-center">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
            Load more activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;