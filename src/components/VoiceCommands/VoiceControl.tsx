import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { VoiceCommand } from '../../types';

const VoiceControl: React.FC = () => {
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    getAvailableCommands,
    isEnabled,
    setEnabled
  } = useVoiceCommands();

  const [showCommands, setShowCommands] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);

  useEffect(() => {
    setCommands(getAvailableCommands());
  }, [getAvailableCommands]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleToggleEnabled = () => {
    setEnabled(!isEnabled);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Control Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* Commands Help Button */}
          <AnimatePresence>
            {isEnabled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setShowCommands(true)}
                className="p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200"
                title="Voice Commands Help"
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Main Voice Control Button */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleToggleListening}
              disabled={!isEnabled}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : isEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              title={
                !isEnabled
                  ? 'Voice commands disabled'
                  : isListening
                  ? 'Stop listening'
                  : 'Start voice commands'
              }
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* Listening Indicator */}
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>

          {/* Enable/Disable Toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleToggleEnabled}
            className={`p-3 rounded-full shadow-lg transition-colors duration-200 ${
              isEnabled
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            title={isEnabled ? 'Disable voice commands' : 'Enable voice commands'}
          >
            {isEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Voice Commands Help Modal */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setShowCommands(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mic className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Voice Commands</h2>
                      <p className="text-sm text-gray-600">Available voice commands for hands-free control</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCommands(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Basic Commands */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Commands</h3>
                    <div className="grid gap-3">
                      {commands
                        .filter(cmd => !cmd.isCustom && ['upload', 'create_folder', 'help', 'stop_listening'].includes(cmd.action))
                        .map((command) => (
                          <div key={command.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">"{command.command}"</p>
                              <p className="text-sm text-gray-600 capitalize">{command.action.replace('_', ' ')}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Navigation Commands */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Navigation</h3>
                    <div className="grid gap-3">
                      {commands
                        .filter(cmd => cmd.action === 'navigate')
                        .map((command) => (
                          <div key={command.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">"{command.command}"</p>
                              <p className="text-sm text-gray-600">Navigate to {command.parameters?.route?.replace('/', '')}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* File Operations */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">File Operations</h3>
                    <div className="grid gap-3">
                      {commands
                        .filter(cmd => ['search', 'delete', 'star', 'share', 'rename'].includes(cmd.action))
                        .map((command) => (
                          <div key={command.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">"{command.command}"</p>
                              <p className="text-sm text-gray-600 capitalize">
                                {command.action} {command.command.includes('*') ? '(replace * with filename)' : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Tips for Better Recognition</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Speak clearly and at a normal pace</li>
                      <li>• Use exact command phrases</li>
                      <li>• Ensure your microphone is working properly</li>
                      <li>• Minimize background noise</li>
                      <li>• Say "help" to hear available commands</li>
                      <li>• Say "stop listening" to deactivate voice control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Status Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceControl;