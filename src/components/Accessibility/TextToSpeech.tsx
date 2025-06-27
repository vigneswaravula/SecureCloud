import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Settings, X, ChevronDown, ChevronUp } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Try to find an English voice
        const englishVoice = voices.find(voice => voice.lang.includes('en-'));
        setVoice(englishVoice || voices[0]);
      }
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      handleStop();
    }
  }, [isOpen]);

  const createUtterance = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      
      // Start tracking progress
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      setDuration(text.length * (1 / rate) * 50); // Rough estimate
      setCurrentPosition(0);
      
      intervalRef.current = window.setInterval(() => {
        setCurrentPosition(prev => {
          if (prev < duration) {
            return prev + 100;
          }
          return prev;
        });
      }, 100);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPosition(duration);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    
    utteranceRef.current = utterance;
    return utterance;
  };

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    
    if (isPlaying) {
      return;
    }
    
    const utterance = createUtterance();
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = availableVoices.find(v => v.name === event.target.value) || null;
    setVoice(selectedVoice);
    
    if (isPlaying) {
      handleStop();
      setTimeout(() => {
        handlePlay();
      }, 100);
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Text to Speech</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
          <p className="text-gray-700">{text}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{formatTime(currentPosition)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${duration > 0 ? (currentPosition / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={handlePlay}
            disabled={!availableVoices.length}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Play className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isPlaying || isPaused}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Pause className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    value={voice?.name || ''}
                    onChange={handleVoiceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Speed: {rate.toFixed(1)}x
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setRate(Math.max(0.5, rate - 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRate(Math.min(2, rate + 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Pitch: {pitch.toFixed(1)}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPitch(Math.max(0.5, pitch - 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPitch(Math.min(2, pitch + 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setVolume(Math.max(0, volume - 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setVolume(Math.min(1, volume + 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VolumeX className="w-4 h-4 text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <Volume2 className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!availableVoices.length && (
          <div className="text-center text-sm text-red-600 mt-4">
            <p>Speech synthesis is not available in your browser.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TextToSpeech;