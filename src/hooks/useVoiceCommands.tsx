import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { VoiceCommandService } from '../utils/voiceCommands';
import { VoiceCommand } from '../types';
import { useNavigate } from 'react-router-dom';
import { useFiles } from './useFiles';
import toast from 'react-hot-toast';

interface VoiceCommandsContextType {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => boolean;
  stopListening: () => void;
  addCustomCommand: (command: VoiceCommand) => void;
  removeCustomCommand: (commandId: string) => void;
  getAvailableCommands: () => VoiceCommand[];
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const VoiceCommandsContext = createContext<VoiceCommandsContextType | undefined>(undefined);

export const useVoiceCommands = () => {
  const context = useContext(VoiceCommandsContext);
  if (context === undefined) {
    throw new Error('useVoiceCommands must be used within a VoiceCommandsProvider');
  }
  return context;
};

export const VoiceCommandsProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { searchFiles, deleteFile, starFile, shareFile, renameFile } = useFiles();
  const [voiceService] = useState(() => new VoiceCommandService());
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabledState] = useState(
    localStorage.getItem('voice_commands_enabled') === 'true'
  );

  const isSupported = voiceService.isSupported();

  useEffect(() => {
    if (!isSupported) {
      console.warn('Voice commands not supported in this browser');
      return;
    }

    // Set up command handler
    voiceService.onCommand((command: VoiceCommand, parameters: any) => {
      handleVoiceCommand(command, parameters);
    });

    // Update listening state
    const checkListeningState = () => {
      setIsListening(voiceService.isCurrentlyListening());
    };

    const interval = setInterval(checkListeningState, 500);
    return () => clearInterval(interval);
  }, [voiceService, isSupported]);

  const handleVoiceCommand = useCallback(async (command: VoiceCommand, parameters: any) => {
    if (!isEnabled) return;

    try {
      switch (command.action) {
        case 'upload':
          // Trigger file upload modal
          const uploadEvent = new CustomEvent('voice-upload');
          window.dispatchEvent(uploadEvent);
          toast.success('Opening file upload');
          break;

        case 'create_folder':
          // Trigger create folder modal
          const folderEvent = new CustomEvent('voice-create-folder');
          window.dispatchEvent(folderEvent);
          toast.success('Opening create folder dialog');
          break;

        case 'search':
          if (parameters.query) {
            const results = searchFiles(parameters.query);
            toast.success(`Found ${results.length} files matching "${parameters.query}"`);
            // Trigger search UI
            const searchEvent = new CustomEvent('voice-search', { 
              detail: { query: parameters.query } 
            });
            window.dispatchEvent(searchEvent);
          }
          break;

        case 'navigate':
          if (parameters.route) {
            navigate(parameters.route);
            toast.success(`Navigating to ${parameters.route.replace('/', '')}`);
          }
          break;

        case 'delete':
          if (parameters.filename) {
            // Find file by name and delete
            const files = searchFiles(parameters.filename);
            if (files.length > 0) {
              await deleteFile(files[0].id);
              toast.success(`Deleted "${files[0].name}"`);
            } else {
              toast.error(`File "${parameters.filename}" not found`);
            }
          }
          break;

        case 'star':
          if (parameters.filename) {
            const files = searchFiles(parameters.filename);
            if (files.length > 0) {
              await starFile(files[0].id);
              toast.success(`Starred "${files[0].name}"`);
            } else {
              toast.error(`File "${parameters.filename}" not found`);
            }
          }
          break;

        case 'share':
          if (parameters.filename) {
            const files = searchFiles(parameters.filename);
            if (files.length > 0) {
              await shareFile(files[0].id, 'view');
              toast.success(`Shared "${files[0].name}"`);
            } else {
              toast.error(`File "${parameters.filename}" not found`);
            }
          }
          break;

        case 'rename':
          if (parameters.oldName && parameters.newName) {
            const files = searchFiles(parameters.oldName);
            if (files.length > 0) {
              await renameFile(files[0].id, parameters.newName);
              toast.success(`Renamed "${parameters.oldName}" to "${parameters.newName}"`);
            } else {
              toast.error(`File "${parameters.oldName}" not found`);
            }
          }
          break;

        case 'help':
          const commands = voiceService.getAvailableCommands();
          const commandList = commands
            .filter(cmd => !cmd.isCustom)
            .map(cmd => cmd.command)
            .join(', ');
          toast.info(`Available commands: ${commandList}`, { duration: 10000 });
          break;

        case 'stop_listening':
          stopListening();
          toast.info('Voice commands stopped');
          break;

        default:
          toast.info(`Command "${command.action}" executed`);
      }
    } catch (error) {
      console.error('Voice command execution failed:', error);
      toast.error('Failed to execute voice command');
    }
  }, [isEnabled, navigate, searchFiles, deleteFile, starFile, shareFile, renameFile, voiceService]);

  const startListening = useCallback(() => {
    if (!isEnabled) {
      toast.error('Voice commands are disabled');
      return false;
    }

    if (!isSupported) {
      toast.error('Voice commands not supported in this browser');
      return false;
    }

    const success = voiceService.startListening();
    if (success) {
      toast.success('Voice commands activated - say "help" for available commands');
    } else {
      toast.error('Failed to start voice recognition');
    }
    return success;
  }, [isEnabled, isSupported, voiceService]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    toast.info('Voice commands deactivated');
  }, [voiceService]);

  const addCustomCommand = useCallback((command: VoiceCommand) => {
    voiceService.addCustomCommand(command);
    toast.success(`Custom command "${command.command}" added`);
  }, [voiceService]);

  const removeCustomCommand = useCallback((commandId: string) => {
    voiceService.removeCustomCommand(commandId);
    toast.success('Custom command removed');
  }, [voiceService]);

  const getAvailableCommands = useCallback(() => {
    return voiceService.getAvailableCommands();
  }, [voiceService]);

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabledState(enabled);
    localStorage.setItem('voice_commands_enabled', enabled.toString());
    
    if (!enabled && isListening) {
      stopListening();
    }
    
    toast.success(`Voice commands ${enabled ? 'enabled' : 'disabled'}`);
  }, [isListening, stopListening]);

  const value = {
    isListening,
    isSupported,
    startListening,
    stopListening,
    addCustomCommand,
    removeCustomCommand,
    getAvailableCommands,
    isEnabled,
    setEnabled
  };

  return (
    <VoiceCommandsContext.Provider value={value}>
      {children}
    </VoiceCommandsContext.Provider>
  );
};