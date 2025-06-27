import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Sparkles,
  Search,
  Upload,
  Share2,
  Trash2,
  FolderPlus,
  BarChart3,
  Lightbulb,
  X,
  Mic,
  MicOff,
  Bot,
  User,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, ChatAction, AIInsight } from '../../types';
import { useFiles } from '../../hooks/useFiles';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { files, searchFiles, uploadFile, deleteFile, createFolder } = useFiles();
  const { isListening, startListening, stopListening } = useVoiceCommands();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadInsights();
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you manage files, search for documents, organize your workspace, and provide insights about your data. What would you like to do?",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'search',
          label: 'Search files',
          type: 'search',
          parameters: {},
          executed: false
        },
        {
          id: 'organize',
          label: 'Organize files',
          type: 'organize',
          parameters: {},
          executed: false
        },
        {
          id: 'analyze',
          label: 'Analyze storage',
          type: 'analyze',
          parameters: {},
          executed: false
        }
      ]
    };

    setMessages([welcomeMessage]);
  };

  const loadInsights = async () => {
    try {
      // Mock AI insights
      const mockInsights: AIInsight[] = [
        {
          id: 'insight-1',
          type: 'duplicate_files',
          title: 'Duplicate Files Detected',
          description: 'Found 5 duplicate files that could save 25MB of storage space.',
          priority: 'medium',
          actionable: true,
          actions: [
            {
              id: 'remove-duplicates',
              label: 'Remove duplicates',
              type: 'delete',
              parameters: { fileIds: ['1', '2', '3'] }
            }
          ],
          createdAt: new Date().toISOString(),
          fileIds: ['1', '2', '3', '4', '5'],
          dismissed: false
        },
        {
          id: 'insight-2',
          type: 'storage_optimization',
          title: 'Storage Optimization',
          description: 'Large video files are taking up 60% of your storage. Consider archiving older videos.',
          priority: 'high',
          actionable: true,
          actions: [
            {
              id: 'archive-videos',
              label: 'Archive old videos',
              type: 'archive',
              parameters: { olderThan: '6months' }
            }
          ],
          createdAt: new Date().toISOString(),
          dismissed: false
        },
        {
          id: 'insight-3',
          type: 'collaboration_suggestion',
          title: 'Collaboration Opportunity',
          description: 'The "Marketing Campaign" folder has been accessed by multiple team members. Consider setting up a shared workspace.',
          priority: 'low',
          actionable: true,
          actions: [
            {
              id: 'create-workspace',
              label: 'Create workspace',
              type: 'share',
              parameters: { folderId: 'marketing-folder' }
            }
          ],
          createdAt: new Date().toISOString(),
          dismissed: false
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      userId: '1',
      userName: 'You'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response = await processAIQuery(userMessage.content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processAIQuery = async (query: string): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerQuery = query.toLowerCase();
    let response: ChatMessage;

    if (lowerQuery.includes('search') || lowerQuery.includes('find')) {
      const searchTerm = extractSearchTerm(query);
      const results = searchFiles(searchTerm);
      
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `I found ${results.length} files matching "${searchTerm}". ${results.length > 0 ? 'Here are the results:' : 'Try a different search term.'}`,
        timestamp: new Date().toISOString(),
        actions: results.length > 0 ? [
          {
            id: 'view-results',
            label: 'View search results',
            type: 'search',
            parameters: { query: searchTerm, results: results.length },
            executed: false
          }
        ] : []
      };
    } else if (lowerQuery.includes('upload') || lowerQuery.includes('add file')) {
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: "I can help you upload files. Would you like me to open the upload dialog?",
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'open-upload',
            label: 'Open upload dialog',
            type: 'upload',
            parameters: {},
            executed: false
          }
        ]
      };
    } else if (lowerQuery.includes('organize') || lowerQuery.includes('clean up')) {
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: "I can help organize your files. I've detected some optimization opportunities:",
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'remove-duplicates',
            label: 'Remove duplicate files',
            type: 'delete',
            parameters: { type: 'duplicates' },
            executed: false
          },
          {
            id: 'create-folders',
            label: 'Auto-organize by type',
            type: 'organize',
            parameters: { method: 'by_type' },
            executed: false
          }
        ]
      };
    } else if (lowerQuery.includes('storage') || lowerQuery.includes('space')) {
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `You have ${totalFiles} files using ${formatFileSize(totalSize)} of storage. I can help optimize your storage usage.`,
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'analyze-storage',
            label: 'Analyze storage usage',
            type: 'analyze',
            parameters: {},
            executed: false
          }
        ]
      };
    } else if (lowerQuery.includes('delete') || lowerQuery.includes('remove')) {
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: "I can help you delete files. Please specify which files you'd like to remove, or I can suggest files that might be safe to delete.",
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'suggest-deletions',
            label: 'Suggest files to delete',
            type: 'delete',
            parameters: { suggest: true },
            executed: false
          }
        ]
      };
    } else {
      response = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: "I can help you with file management tasks like searching, organizing, uploading, and analyzing your storage. What would you like to do?",
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'search-files',
            label: 'Search files',
            type: 'search',
            parameters: {},
            executed: false
          },
          {
            id: 'upload-files',
            label: 'Upload files',
            type: 'upload',
            parameters: {},
            executed: false
          },
          {
            id: 'organize-files',
            label: 'Organize files',
            type: 'organize',
            parameters: {},
            executed: false
          }
        ]
      };
    }

    return response;
  };

  const extractSearchTerm = (query: string): string => {
    const searchPatterns = [
      /search for (.+)/i,
      /find (.+)/i,
      /look for (.+)/i,
      /show me (.+)/i
    ];

    for (const pattern of searchPatterns) {
      const match = query.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return query;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleActionClick = async (action: ChatAction, messageId: string) => {
    try {
      let result;
      
      switch (action.type) {
        case 'search':
          if (action.parameters.query) {
            const results = searchFiles(action.parameters.query);
            result = `Found ${results.length} files`;
          } else {
            result = 'Search dialog opened';
          }
          break;
        case 'upload':
          result = 'Upload dialog opened';
          // In a real app, this would trigger the upload modal
          break;
        case 'organize':
          result = 'Files organized successfully';
          break;
        case 'analyze':
          result = 'Storage analysis completed';
          break;
        case 'delete':
          if (action.parameters.suggest) {
            result = 'Suggested 3 files for deletion';
          } else {
            result = 'Files deleted successfully';
          }
          break;
        default:
          result = 'Action completed';
      }

      // Update the message to mark action as executed
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            actions: msg.actions?.map(a => 
              a.id === action.id ? { ...a, executed: true, result } : a
            )
          };
        }
        return msg;
      }));

      toast.success(result);
    } catch (error) {
      toast.error('Failed to execute action');
    }
  };

  const handleDismissInsight = (insightId: string) => {
    setInsights(prev => prev.map(insight =>
      insight.id === insightId
        ? { ...insight, dismissed: true, dismissedAt: new Date().toISOString() }
        : insight
    ));
    toast.success('Insight dismissed');
  };

  const handleInsightAction = async (insight: AIInsight, action: any) => {
    try {
      // Execute the insight action
      switch (action.type) {
        case 'delete':
          toast.success('Duplicate files removed');
          break;
        case 'archive':
          toast.success('Files archived');
          break;
        case 'share':
          toast.success('Workspace created');
          break;
        default:
          toast.success('Action completed');
      }

      handleDismissInsight(insight.id);
    } catch (error) {
      toast.error('Failed to execute action');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'duplicate_files':
        return <Trash2 className="w-5 h-5 text-orange-600" />;
      case 'storage_optimization':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'collaboration_suggestion':
        return <Share2 className="w-5 h-5 text-green-600" />;
      case 'security_recommendation':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-600">Your intelligent file management helper</p>
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
          <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'insights'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Insights</span>
              {insights.filter(i => !i.dismissed).length > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {insights.filter(i => !i.dismissed).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-96 overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-xs ${
                      message.type === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {/* Actions */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleActionClick(action, message.id)}
                              disabled={action.executed}
                              className={`inline-flex items-center space-x-2 px-3 py-1 text-xs rounded-lg transition-colors duration-200 ${
                                action.executed
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {action.executed ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>{action.label}</span>
                              {action.executed && action.result && (
                                <span className="text-green-600">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {message.isProcessing && (
                        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                          <Loader className="w-3 h-3 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-gray-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about your files..."
                      rows={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isListening
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isProcessing}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Insights Tab */
            <div className="p-4 space-y-4 h-full overflow-y-auto">
              {insights.filter(i => !i.dismissed).length > 0 ? (
                insights.filter(i => !i.dismissed).map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          
                          {insight.actionable && insight.actions && (
                            <div className="mt-3 flex items-center space-x-2">
                              {insight.actions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => handleInsightAction(insight, action)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDismissInsight(insight.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available</h3>
                  <p className="text-gray-600">
                    I'll analyze your files and provide helpful insights as you use SecureCloud.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAssistant;