import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';

interface ColorBlindModeProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (mode: string) => void;
}

const ColorBlindMode: React.FC<ColorBlindModeProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedMode, setSelectedMode] = useState<string>('normal');
  const [currentMode, setCurrentMode] = useState<string>('normal');

  useEffect(() => {
    // Get saved preference from localStorage
    const savedMode = localStorage.getItem('colorBlindMode') || 'normal';
    setSelectedMode(savedMode);
    setCurrentMode(savedMode);
    
    // Apply saved mode on component mount
    applyColorFilter(savedMode);
    
    return () => {
      // Cleanup - remove any applied filters when component unmounts
      if (document.documentElement.style.filter) {
        document.documentElement.style.filter = '';
      }
    };
  }, []);

  const colorBlindModes = [
    { id: 'normal', name: 'Normal Vision', filter: '' },
    { id: 'protanopia', name: 'Protanopia (Red-Blind)', filter: 'url(#protanopia-filter)' },
    { id: 'deuteranopia', name: 'Deuteranopia (Green-Blind)', filter: 'url(#deuteranopia-filter)' },
    { id: 'tritanopia', name: 'Tritanopia (Blue-Blind)', filter: 'url(#tritanopia-filter)' },
    { id: 'achromatopsia', name: 'Achromatopsia (No Color)', filter: 'grayscale(100%)' },
    { id: 'high-contrast', name: 'High Contrast', filter: 'contrast(150%)' }
  ];

  const applyColorFilter = (mode: string) => {
    const selectedFilter = colorBlindModes.find(m => m.id === mode);
    if (selectedFilter) {
      document.documentElement.style.filter = selectedFilter.filter;
    }
  };

  const handleApply = () => {
    localStorage.setItem('colorBlindMode', selectedMode);
    setCurrentMode(selectedMode);
    applyColorFilter(selectedMode);
    onApply(selectedMode);
    onClose();
  };

  const handleCancel = () => {
    setSelectedMode(currentMode);
    applyColorFilter(currentMode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Vision Settings</h2>
        <p className="text-gray-600 mb-6">
          Adjust the display to accommodate different types of color vision deficiencies.
        </p>

        <div className="space-y-3 mb-6">
          {colorBlindModes.map((mode) => (
            <label
              key={mode.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedMode === mode.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {mode.id === 'normal' ? (
                  <Eye className="w-5 h-5 text-gray-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-900">{mode.name}</span>
              </div>
              <input
                type="radio"
                name="colorBlindMode"
                value={mode.id}
                checked={selectedMode === mode.id}
                onChange={() => setSelectedMode(mode.id)}
                className="sr-only"
              />
              {selectedMode === mode.id && (
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <div className="grid grid-cols-6 gap-2">
              <div className="h-8 bg-red-500 rounded"></div>
              <div className="h-8 bg-orange-500 rounded"></div>
              <div className="h-8 bg-yellow-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-blue-500 rounded"></div>
              <div className="h-8 bg-purple-500 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Color sample preview</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Apply
          </button>
        </div>

        {/* SVG Filters for color blindness simulation */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="protanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.567, 0.433, 0, 0, 0
                        0.558, 0.442, 0, 0, 0
                        0, 0.242, 0.758, 0, 0
                        0, 0, 0, 1, 0"
              />
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.625, 0.375, 0, 0, 0
                        0.7, 0.3, 0, 0, 0
                        0, 0.3, 0.7, 0, 0
                        0, 0, 0, 1, 0"
              />
            </filter>
            <filter id="tritanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.95, 0.05, 0, 0, 0
                        0, 0.433, 0.567, 0, 0
                        0, 0.475, 0.525, 0, 0
                        0, 0, 0, 1, 0"
              />
            </filter>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ColorBlindMode;