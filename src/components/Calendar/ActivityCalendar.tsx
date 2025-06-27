import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Share2,
  Edit3,
  Users,
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ActivityCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'upload' | 'edit' | 'share' | 'collaboration'>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    if (isOpen) {
      loadCalendarEvents();
    }
  }, [isOpen, currentDate]);

  const loadCalendarEvents = async () => {
    try {
      // Mock calendar events
      const mockEvents: CalendarEvent[] = [
        {
          id: 'event-1',
          date: '2024-01-15',
          type: 'upload',
          title: 'File Uploads',
          description: 'Uploaded 5 files including project documents',
          fileIds: ['1', '2', '3', '4', '5'],
          userId: '1',
          userName: 'John Doe',
          count: 5,
          metadata: { totalSize: '25MB' }
        },
        {
          id: 'event-2',
          date: '2024-01-15',
          type: 'collaboration',
          title: 'Team Collaboration',
          description: 'Collaborated on marketing campaign files',
          fileIds: ['6', '7'],
          userId: '2',
          userName: 'Sarah Johnson',
          count: 3,
          metadata: { collaborators: ['John Doe', 'Mike Chen'] }
        },
        {
          id: 'event-3',
          date: '2024-01-14',
          type: 'share',
          title: 'File Sharing',
          description: 'Shared presentation with team members',
          fileIds: ['8'],
          userId: '1',
          userName: 'John Doe',
          count: 1,
          metadata: { recipients: 3 }
        },
        {
          id: 'event-4',
          date: '2024-01-13',
          type: 'edit',
          title: 'Document Edits',
          description: 'Updated project proposal and budget',
          fileIds: ['9', '10'],
          userId: '1',
          userName: 'John Doe',
          count: 2,
          metadata: { changes: 15 }
        },
        {
          id: 'event-5',
          date: '2024-01-12',
          type: 'backup',
          title: 'Backup Completed',
          description: 'Automatic backup of all files',
          fileIds: [],
          userId: 'system',
          userName: 'System',
          count: 45,
          metadata: { backupSize: '2.3GB' }
        }
      ];

      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => 
      event.date === date && 
      (filterType === 'all' || event.type === filterType)
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-3 h-3" />;
      case 'download':
        return <Download className="w-3 h-3" />;
      case 'share':
        return <Share2 className="w-3 h-3" />;
      case 'edit':
        return <Edit3 className="w-3 h-3" />;
      case 'collaboration':
        return <Users className="w-3 h-3" />;
      case 'backup':
        return <Clock className="w-3 h-3" />;
      default:
        return <BarChart3 className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-500';
      case 'download':
        return 'bg-green-500';
      case 'share':
        return 'bg-purple-500';
      case 'edit':
        return 'bg-orange-500';
      case 'collaboration':
        return 'bg-pink-500';
      case 'backup':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Activity Calendar</h2>
                <p className="text-sm text-gray-600">Track your file activity over time</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              ×
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="upload">Uploads</option>
                  <option value="edit">Edits</option>
                  <option value="share">Shares</option>
                  <option value="collaboration">Collaboration</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    viewMode === 'month'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    viewMode === 'week'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {viewMode === 'month' ? (
            <div className="grid grid-cols-7 gap-2">
              {/* Day Names */}
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-lg"></div>;
                }

                const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateEvents = getEventsForDate(dateKey);
                const isCurrentDay = isToday(currentDate.getFullYear(), currentDate.getMonth(), day);

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`h-24 border rounded-lg p-2 cursor-pointer transition-colors duration-200 ${
                      isCurrentDay
                        ? 'border-blue-500 bg-blue-50'
                        : dateEvents.length > 0
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${selectedDate === dateKey ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      {dateEvents.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          {dateEvents.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dateEvents.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={`event-${event.id}-${eventIndex}`}
                          className="flex items-center space-x-1 text-xs"
                        >
                          <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dateEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dateEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Week View - Simplified for this example */}
              <div className="text-center text-gray-600 mb-4">
                Week view implementation would go here
              </div>
            </div>
          )}

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activities on {formatDate(selectedDate)}
                </h3>
                <span className="text-sm text-gray-600">
                  {getEventsForDate(selectedDate).length} events
                </span>
              </div>

              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventColor(event.type)} bg-opacity-20`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <span className="text-sm text-gray-500">{event.count} {event.type}s</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>By: {event.userName}</span>
                          {event.metadata && Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key}>{key}: {value}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No activities on this date</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityCalendar;