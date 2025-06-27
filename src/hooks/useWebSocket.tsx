import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { WebSocketService } from '../utils/websocket';
import { WebSocketMessage, Collaborator, SyncStatus } from '../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: string;
  collaborators: Map<string, Collaborator[]>;
  syncStatuses: Map<string, SyncStatus>;
  joinFile: (fileId: string) => void;
  leaveFile: (fileId: string) => void;
  joinFolder: (folderId: string) => void;
  leaveFolder: (folderId: string) => void;
  updateCursor: (fileId: string, position: { x: number; y: number }) => void;
  addComment: (fileId: string, comment: any) => void;
  sendNotification: (targetUserId: string, notification: any) => void;
  requestSync: (fileId: string) => void;
  reportConflict: (fileId: string, conflictData: any) => void;
  resolveConflict: (fileId: string, resolution: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wsService, setWsService] = useState<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [collaborators, setCollaborators] = useState<Map<string, Collaborator[]>>(new Map());
  const [syncStatuses, setSyncStatuses] = useState<Map<string, SyncStatus>>(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const service = new WebSocketService(user.id, token);
        setWsService(service);

        // Set up event listeners
        service.on('connect', () => {
          setIsConnected(true);
          setConnectionState('connected');
          toast.success('Connected to real-time sync');
        });

        service.on('disconnect', () => {
          setIsConnected(false);
          setConnectionState('disconnected');
          toast.error('Disconnected from real-time sync');
        });

        service.on('connection_failed', () => {
          setIsConnected(false);
          setConnectionState('failed');
          toast.error('Failed to connect to real-time sync');
        });

        // File collaboration events
        service.on('user_joined', (data: { fileId: string; user: Collaborator }) => {
          setCollaborators(prev => {
            const newMap = new Map(prev);
            const fileCollaborators = newMap.get(data.fileId) || [];
            const existingIndex = fileCollaborators.findIndex(c => c.userId === data.user.userId);
            
            if (existingIndex >= 0) {
              fileCollaborators[existingIndex] = data.user;
            } else {
              fileCollaborators.push(data.user);
            }
            
            newMap.set(data.fileId, fileCollaborators);
            return newMap;
          });
          
          toast.info(`${data.user.userName} joined the file`);
        });

        service.on('user_left', (data: { fileId: string; userId: string; userName: string }) => {
          setCollaborators(prev => {
            const newMap = new Map(prev);
            const fileCollaborators = newMap.get(data.fileId) || [];
            const filteredCollaborators = fileCollaborators.filter(c => c.userId !== data.userId);
            newMap.set(data.fileId, filteredCollaborators);
            return newMap;
          });
          
          toast.info(`${data.userName} left the file`);
        });

        service.on('cursor_moved', (data: { fileId: string; userId: string; position: { x: number; y: number } }) => {
          setCollaborators(prev => {
            const newMap = new Map(prev);
            const fileCollaborators = newMap.get(data.fileId) || [];
            const collaboratorIndex = fileCollaborators.findIndex(c => c.userId === data.userId);
            
            if (collaboratorIndex >= 0) {
              fileCollaborators[collaboratorIndex].cursor = {
                ...data.position,
                color: `hsl(${Math.abs(data.userId.hashCode()) % 360}, 70%, 50%)`
              };
              newMap.set(data.fileId, fileCollaborators);
            }
            
            return newMap;
          });
        });

        service.on('comment_added', (data: any) => {
          toast.info(`New comment from ${data.userName}`);
        });

        service.on('permission_changed', (data: any) => {
          toast.info(`Permissions updated for ${data.fileName || data.folderName}`);
        });

        // Sync events
        service.on('sync_status', (data: SyncStatus) => {
          setSyncStatuses(prev => {
            const newMap = new Map(prev);
            newMap.set(data.fileId, data);
            return newMap;
          });

          if (data.status === 'conflict') {
            toast.error(`Sync conflict detected for file: ${data.conflictReason}`);
          } else if (data.status === 'error') {
            toast.error(`Sync error: ${data.errorMessage}`);
          }
        });

        service.on('conflict_detected', (data: any) => {
          toast.error(`File conflict detected: ${data.fileName}`);
        });

        service.on('file_updated', (data: any) => {
          toast.info(`File "${data.fileName}" was updated by ${data.userName}`);
        });

        service.on('file_shared', (data: any) => {
          toast.info(`File "${data.fileName}" was shared with you`);
        });

        service.on('security_alert', (data: any) => {
          toast.error(`Security Alert: ${data.message}`, { duration: 10000 });
        });

        return () => {
          service.disconnect();
        };
      }
    }
  }, [user]);

  // Update connection state
  useEffect(() => {
    if (wsService) {
      const interval = setInterval(() => {
        setIsConnected(wsService.isConnected());
        setConnectionState(wsService.getConnectionState());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [wsService]);

  const joinFile = useCallback((fileId: string) => {
    wsService?.joinFile(fileId);
  }, [wsService]);

  const leaveFile = useCallback((fileId: string) => {
    wsService?.leaveFile(fileId);
  }, [wsService]);

  const joinFolder = useCallback((folderId: string) => {
    wsService?.joinFolder(folderId);
  }, [wsService]);

  const leaveFolder = useCallback((folderId: string) => {
    wsService?.leaveFolder(folderId);
  }, [wsService]);

  const updateCursor = useCallback((fileId: string, position: { x: number; y: number }) => {
    wsService?.updateCursor(fileId, position);
  }, [wsService]);

  const addComment = useCallback((fileId: string, comment: any) => {
    wsService?.addComment(fileId, comment);
  }, [wsService]);

  const sendNotification = useCallback((targetUserId: string, notification: any) => {
    wsService?.sendNotification(targetUserId, notification);
  }, [wsService]);

  const requestSync = useCallback((fileId: string) => {
    wsService?.requestSync(fileId);
  }, [wsService]);

  const reportConflict = useCallback((fileId: string, conflictData: any) => {
    wsService?.reportConflict(fileId, conflictData);
  }, [wsService]);

  const resolveConflict = useCallback((fileId: string, resolution: any) => {
    wsService?.resolveConflict(fileId, resolution);
  }, [wsService]);

  const value = {
    isConnected,
    connectionState,
    collaborators,
    syncStatuses,
    joinFile,
    leaveFile,
    joinFolder,
    leaveFolder,
    updateCursor,
    addComment,
    sendNotification,
    requestSync,
    reportConflict,
    resolveConflict
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Extend String prototype for hashCode
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};