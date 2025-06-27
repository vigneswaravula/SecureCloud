import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Calendar,
  Tag,
  User,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Loader,
  X,
  Clock,
  Star
} from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import { FileItem } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchSuggestion {
  id: string;
  type: 'semantic' | 'filter' | 'recent';
  query: string;
  description: string;
  icon: React.ComponentType<any>;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ isOpen, onClose }) => {
  const { files, searchFiles } = useFiles();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      generateSuggestions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const generateSuggestions = () => {
    const mockSuggestions: SearchSuggestion[] = [
      {
        id: '1',
        type: 'semantic',
        query: 'Find my presentation files from last month',
        description: 'AI-powered semantic search',
        icon: Sparkles
      },
      {
        id: '2',
        type: 'semantic',
        query: 'Show me documents about budget or finance',
        description: 'Search by content meaning',
        icon: Sparkles
      },
      {
        id: '3',
        type: 'filter',
        query: 'type:image size:>10MB',
        description: 'Large image files',
        icon: Image
      },
      {
        id: '4',
        type: 'filter',
        query: 'modified:today starred:true',
        description: 'Today\'s starred files',
        icon: Star
      },
      {
        id: '5',
        type: 'recent',
        query: 'project proposal',
        description: 'Recent search',
        icon: Clock
      },
      {
        id: '6',
        type: 'semantic',
        query: 'Find files I shared with Sarah',
        description: 'Collaboration search',
        icon: User
      }
    ];

    setSuggestions(mockSuggestions);
  };

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if it's a semantic search (natural language)
      const isSemanticQuery = /^(find|show|get|search).+/i.test(searchQuery) || 
                             searchQuery.includes('last month') ||
                             searchQuery.includes('about') ||
                             searchQuery.includes('shared with');

      let searchResults: FileItem[] = [];

      if (isSemanticQuery) {
        // Simulate AI semantic search
        searchResults = performSemanticSearch(searchQuery);
      } else {
        // Use regular search
        searchResults = searchFiles(searchQuery);
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const performSemanticSearch = (query: string): FileItem[] => {
    // Mock AI semantic search logic
    const allFiles = files;
    
    if (query.toLowerCase().includes('presentation')) {
      return allFiles.filter(file => 
        file.name.toLowerCase().includes('presentation') ||
        file.mimeType.includes('presentation') ||
        file.name.toLowerCase().includes('pptx') ||
        file.name.toLowerCase().includes('slides')
      );
    }
    
    if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('finance')) {
      return allFiles.filter(file => 
        file.name.toLowerCase().includes('budget') ||
        file.name.toLowerCase().includes('finance') ||
        file.name.toLowerCase().includes('spreadsheet') ||
        file.tags.some(tag => ['budget', 'finance', 'money'].includes(tag.toLowerCase()))
      );
    }
    
    if (query.toLowerCase().includes('shared with')) {
      const userName = query.match(/shared with (\w+)/i)?.[1];
      return allFiles.filter(file => 
        file.sharedLinks.length > 0 ||
        file.collaborators.some(collab => 
          collab.userName.toLowerCase().includes(userName?.toLowerCase() || '')
        )
      );
    }
    
    if (query.toLowerCase().includes('last month')) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return allFiles.filter(file => 
        new Date(file.updatedAt) >= lastMonth
      );
    }
    
    // Fallback to regular search
    return searchFiles(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.query);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestion]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    return FileText;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search files or ask AI: 'Find my presentations from last month'"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              {isSearching && (
                <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 animate-spin" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Badge */}
          <div className="flex items-center space-x-2 mt-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">AI-Powered Search</span>
            </div>
            <span className="text-xs text-gray-500">
              Try natural language queries like "Find documents about budget"
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {query.length === 0 ? (
            /* Search Suggestions */
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Search Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                      selectedSuggestion === index
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      suggestion.type === 'semantic' ? 'bg-purple-100' :
                      suggestion.type === 'filter' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <suggestion.icon className={`w-4 h-4 ${
                        suggestion.type === 'semantic' ? 'text-purple-600' :
                        suggestion.type === 'filter' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{suggestion.query}</p>
                      <p className="text-xs text-gray-500">{suggestion.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="p-4">
              {isSearching ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Searching with AI...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Found {results.length} result{results.length !== 1 ? 's' : ''}
                    </h3>
                    {query.toLowerCase().includes('find') || query.toLowerCase().includes('show') && (
                      <div className="flex items-center space-x-1 text-xs text-purple-600">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Search</span>
                      </div>
                    )}
                  </div>
                  
                  {results.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.updatedAt)}</span>
                            {file.isStarred && (
                              <>
                                <span>•</span>
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try a different search term or use natural language
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartSearch;