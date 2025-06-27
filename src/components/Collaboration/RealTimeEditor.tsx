import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageCircle,
  AtSign,
  Send,
  Smile,
  Paperclip,
  Video,
  Phone,
  MoreHorizontal,
  Edit3,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Collaborator, Comment, CommentReply } from '../../types';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface RealTimeEditorProps {
  fileId: string;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
}

const RealTimeEditor: React.FC<RealTimeEditorProps> = ({
  fileId,
  fileName,
  isOpen,
  onClose
}) => {
  const { collaborators, updateCursor, addComment } = useWebSocket();
  const [activeCollaborators, setActiveCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadComments();
      loadCollaborators();
    }
  }, [isOpen, fileId]);

  useEffect(() => {
    const fileCollaborators = collaborators.get(fileId) || [];
    setActiveCollaborators(fileCollaborators);
  }, [collaborators, fileId]);

  const loadComments = async () => {
    try {
      // Mock comments data
      const mockComments: Comment[] = [
        {
          id: 'c1',
          fileId,
          userId: '2',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          content: 'Great work on this document! I have a few suggestions for the executive summary.',
          createdAt: '2024-01-15T10:30:00Z',
          isResolved: false,
          replies: [
            {
              id: 'r1',
              userId: '1',
              userName: 'John Doe',
              content: 'Thanks for the feedback! What specific changes would you recommend?',
              createdAt: '2024-01-15T11:00:00Z',
              mentions: ['2']
            }
          ],
          position: { x: 100, y: 200 },
          mentions: [],
          reactions: [
            {
              emoji: '👍',
              userId: '1',
              userName: 'John Doe',
              createdAt: '2024-01-15T10:35:00Z'
            }
          ]
        },
        {
          id: 'c2',
          fileId,
          userId: '3',
          userName: 'Mike Chen',
          content: 'The budget section needs more detail. Can we add quarterly breakdowns?',
          createdAt: '2024-01-15T14:20:00Z',
          isResolved: true,
          replies: [],
          position: { x: 300, y: 400 },
          mentions: ['1'],
          reactions: []
        }
      ];

      setComments(mockComments);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  const loadCollaborators = async () => {
    try {
      // Mock collaborators data
      const mockCollaborators: Collaborator[] = [
        {
          userId: '1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          permission: 'editor',
          isOnline: true,
          lastSeen: new Date().toISOString(),
          cursor: { x: 150, y: 250, color: '#3B82F6' }
        },
        {
          userId: '2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          permission: 'editor',
          isOnline: true,
          lastSeen: new Date().toISOString(),
          cursor: { x: 200, y: 300, color: '#10B981' },
          isTyping: false
        }
      ];

      setActiveCollaborators(mockCollaborators);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPosition({ x, y });
    updateCursor(fileId, { x, y });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment: Comment = {
        id: `c${Date.now()}`,
        fileId,
        userId: '1',
        userName: 'John Doe',
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        isResolved: false,
        replies: [],
        position: cursorPosition,
        mentions: extractMentions(newComment),
        reactions: []
      };

      setComments(prev => [...prev, comment]);
      addComment(fileId, comment);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleReplyToComment = async (commentId: string, replyContent: string) => {
    try {
      const reply: CommentReply = {
        id: `r${Date.now()}`,
        userId: '1',
        userName: 'John Doe',
        content: replyContent.trim(),
        createdAt: new Date().toISOString(),
        mentions: extractMentions(replyContent)
      };

      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));

      toast.success('Reply added');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleResolveComment = async (commentId: string) => {
    try {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isResolved: !comment.isResolved }
          : comment
      ));

      const comment = comments.find(c => c.id === commentId);
      toast.success(`Comment ${comment?.isResolved ? 'reopened' : 'resolved'}`);
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleAddReaction = async (commentId: string, emoji: string) => {
    try {
      setComments(prev => prev.map(comment => {
        if (comment.id !== commentId) return comment;

        const existingReaction = comment.reactions.find(r => r.emoji === emoji && r.userId === '1');
        if (existingReaction) {
          // Remove reaction
          return {
            ...comment,
            reactions: comment.reactions.filter(r => !(r.emoji === emoji && r.userId === '1'))
          };
        } else {
          // Add reaction
          return {
            ...comment,
            reactions: [...comment.reactions, {
              emoji,
              userId: '1',
              userName: 'John Doe',
              createdAt: new Date().toISOString()
            }]
          };
        }
      }));
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  };

  const handleTypingStart = () => {
    setIsTyping(true);
    // In a real app, this would emit a typing event via WebSocket
  };

  const handleTypingStop = () => {
    setIsTyping(false);
    // In a real app, this would emit a stop typing event via WebSocket
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex bg-gray-100"
    >
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{fileName}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Real-time collaboration</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Active Collaborators */}
              <div className="flex items-center space-x-2">
                {activeCollaborators.slice(0, 3).map((collaborator) => (
                  <div key={collaborator.userId} className="relative">
                    {collaborator.userAvatar ? (
                      <img
                        src={collaborator.userAvatar}
                        alt={collaborator.userName}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {collaborator.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {collaborator.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                ))}
                {activeCollaborators.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{activeCollaborators.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={editorRef}
            className="w-full h-full p-8 bg-white relative cursor-text"
            onMouseMove={handleMouseMove}
          >
            {/* Document Content */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Proposal</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2>Executive Summary</h2>
                <p>
                  This document outlines our comprehensive project proposal for the upcoming quarter.
                  The initiative aims to enhance our product offerings while maintaining operational efficiency.
                </p>

                <h2>Project Objectives</h2>
                <ul>
                  <li>Increase user engagement by 25%</li>
                  <li>Reduce operational costs by 15%</li>
                  <li>Launch three new features</li>
                  <li>Improve customer satisfaction scores</li>
                </ul>

                <h2>Budget Analysis</h2>
                <p>
                  The proposed budget for this project is $150,000, allocated across development,
                  marketing, and operational expenses. This represents a 10% increase from the previous quarter.
                </p>
              </div>
            </div>

            {/* Collaborator Cursors */}
            {activeCollaborators.map((collaborator) => (
              collaborator.cursor && collaborator.userId !== '1' && (
                <motion.div
                  key={collaborator.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: collaborator.cursor.x,
                    top: collaborator.cursor.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: collaborator.cursor.color }}
                  />
                  <div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: collaborator.cursor.color }}
                  >
                    {collaborator.userName}
                    {collaborator.isTyping && (
                      <span className="ml-1 animate-pulse">typing...</span>
                    )}
                  </div>
                </motion.div>
              )
            ))}

            {/* Comment Markers */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="absolute z-20"
                style={{
                  left: comment.position?.x || 0,
                  top: comment.position?.y || 0,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <button
                  onClick={() => setSelectedComment(comment)}
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                    comment.isResolved ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  {comment.replies.length + 1}
                </button>
              </div>
            ))}
          </div>

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Comments Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <span className="text-sm text-gray-600">{comments.length}</span>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`border rounded-lg p-3 ${
                comment.isResolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{comment.userName}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      {comment.isResolved && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>

                  {/* Reactions */}
                  {comment.reactions.length > 0 && (
                    <div className="flex items-center space-x-1 mb-2">
                      {comment.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddReaction(comment.id, reaction.emoji)}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200"
                        >
                          <span>{reaction.emoji}</span>
                          <span>1</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={() => handleAddReaction(comment.id, '👍')}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      👍 React
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      Reply
                    </button>
                    <button
                      onClick={() => handleResolveComment(comment.id)}
                      className="text-gray-500 hover:text-green-600"
                    >
                      {comment.isResolved ? 'Reopen' : 'Resolve'}
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-2 border-l-2 border-gray-200 pl-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="text-sm">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{reply.userName}</span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={handleTypingStart}
              onBlur={handleTypingStop}
              placeholder="Add a comment... Use @username to mention someone"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <AtSign className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Selected Comment Detail Modal */}
      <AnimatePresence>
        {selectedComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setSelectedComment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-3">
                {selectedComment.userAvatar ? (
                  <img
                    src={selectedComment.userAvatar}
                    alt={selectedComment.userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedComment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{selectedComment.userName}</span>
                    <span className="text-sm text-gray-500">{formatDate(selectedComment.createdAt)}</span>
                  </div>

                  <p className="text-gray-700 mb-4">{selectedComment.content}</p>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleResolveComment(selectedComment.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedComment.isResolved
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {selectedComment.isResolved ? 'Reopen' : 'Resolve'}
                    </button>
                    <button
                      onClick={() => setSelectedComment(null)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealTimeEditor;