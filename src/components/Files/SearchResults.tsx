import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import FileGrid from './FileGrid';

interface SearchResultsProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onQueryChange, onClose }) => {
  const { searchFiles } = useFiles();
  const [results, setResults] = useState(searchFiles(query));
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    let filteredResults = searchFiles(query);
    
    // Apply type filter
    if (filterType !== 'all') {
      filteredResults = filteredResults.filter(file => file.type === filterType);
    }
    
    // Apply sorting
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });
    
    setResults(filteredResults);
  }, [query, sortBy, filterType, searchFiles]);

  const fileTypes = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
    >
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fileTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="date">Date Modified</option>
              <option value="size">File Size</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <FileGrid files={results} />
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;