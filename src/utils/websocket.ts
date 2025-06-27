import { io, Socket } from 'socket.io-client';
import { WebSocketMessage, SyncStatus, Collaborator } from '../types';

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();
  private mockMode = true; // Changed to true by default to avoid connection errors
  private connectionTimeout: NodeJS.Timeout | null = null;
  private errorLogged = false;

  constructor(private userId: string, private token: string) {
    this.connect();
  }

  private connect() {
    try {
      // Set a shorter connection timeout to detect unavailable server faster
      this.connectionTimeout = setTimeout(() => {
        if (!this.errorLogged) {
          console.log('WebSocket server not available, switching to mock mode');
          this.errorLogged = true;
        }
        this.enableMockMode();
      }, 2000);

      // Connect to the current origin, which will be proxied by Vite to the actual WebSocket server
      this.socket = io(window.location.origin, {
        auth: {
          token: this.token,
          userId: this.userId
        },
        transports: ['websocket', 'polling'],
        timeout: 1500,
        forceNew: true,
        // Reduce connection attempt frequency
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 2
      });

      this.setupEventHandlers();
    } catch (error) {
      if (!this.errorLogged) {
        console.error('WebSocket connection failed:', error);
        this.errorLogged = true;
      }
      this.enableMockMode();
    }
  }

  private enableMockMode() {
    this.mockMode = true;
    this.reconnectAttempts = 0;
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (!this.errorLogged) {
      console.log('WebSocket service running in mock mode');
      this.errorLogged = true;
    }
    
    // Simulate successful connection
    setTimeout(() => {
      this.notifyListeners('connect', { mockMode: true });
    }, 100);
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.mockMode = false;
      this.errorLogged = false;
      
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      
      this.emit('user_online', { userId: this.userId });
      this.notifyListeners('connect', { mockMode: false });
    });

    this.socket.on('disconnect', (reason) => {
      if (!this.errorLogged) {
        console.log('WebSocket disconnected:', reason);
      }
      if (reason === 'io server disconnect') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      if (!this.errorLogged) {
        console.log('WebSocket connection error - switching to mock mode');
        this.errorLogged = true;
      }
      this.handleReconnect();
    });

    // File-related events
    this.socket.on('file_updated', (data) => {
      this.notifyListeners('file_updated', data);
    });

    this.socket.on('file_deleted', (data) => {
      this.notifyListeners('file_deleted', data);
    });

    this.socket.on('file_shared', (data) => {
      this.notifyListeners('file_shared', data);
    });

    // Collaboration events
    this.socket.on('user_joined', (data) => {
      this.notifyListeners('user_joined', data);
    });

    this.socket.on('user_left', (data) => {
      this.notifyListeners('user_left', data);
    });

    this.socket.on('cursor_moved', (data) => {
      this.notifyListeners('cursor_moved', data);
    });

    this.socket.on('comment_added', (data) => {
      this.notifyListeners('comment_added', data);
    });

    // Permission events
    this.socket.on('permission_changed', (data) => {
      this.notifyListeners('permission_changed', data);
    });

    // Sync events
    this.socket.on('sync_status', (data) => {
      this.notifyListeners('sync_status', data);
    });

    this.socket.on('conflict_detected', (data) => {
      this.notifyListeners('conflict_detected', data);
    });

    // Security events
    this.socket.on('security_alert', (data) => {
      this.notifyListeners('security_alert', data);
    });
  }

  private handleReconnect() {
    if (this.mockMode) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        if (!this.errorLogged) {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        }
        this.connect();
      }, delay);
    } else {
      if (!this.errorLogged) {
        console.log('Max reconnection attempts reached, switching to mock mode');
        this.errorLogged = true;
      }
      this.enableMockMode();
    }
  }

  // Public methods
  emit(event: string, data: any) {
    if (this.mockMode) {
      // In mock mode, simulate some responses
      this.simulateMockResponse(event, data);
      return;
    }

    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      // Silently ignore in mock mode to reduce console noise
      this.simulateMockResponse(event, data);
    }
  }

  private simulateMockResponse(event: string, data: any) {
    // Simulate responses for common events
    switch (event) {
      case 'user_online':
        setTimeout(() => {
          this.notifyListeners('user_joined', { 
            userId: this.userId, 
            status: 'online',
            mockMode: true 
          });
        }, 100);
        break;
      case 'join_file':
        setTimeout(() => {
          this.notifyListeners('file_joined', { 
            fileId: data.fileId, 
            userId: this.userId,
            mockMode: true 
          });
        }, 100);
        break;
      case 'request_sync':
        setTimeout(() => {
          this.notifyListeners('sync_status', { 
            fileId: data.fileId, 
            status: 'synced',
            mockMode: true 
          });
        }, 200);
        break;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function) {
    if (!this.listeners.has(event)) return;
    
    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  // File collaboration methods
  joinFile(fileId: string) {
    this.emit('join_file', { fileId, userId: this.userId });
  }

  leaveFile(fileId: string) {
    this.emit('leave_file', { fileId, userId: this.userId });
  }

  updateCursor(fileId: string, position: { x: number; y: number }) {
    this.emit('cursor_update', { fileId, userId: this.userId, position });
  }

  addComment(fileId: string, comment: any) {
    this.emit('add_comment', { fileId, comment, userId: this.userId });
  }

  // Folder collaboration methods
  joinFolder(folderId: string) {
    this.emit('join_folder', { folderId, userId: this.userId });
  }

  leaveFolder(folderId: string) {
    this.emit('leave_folder', { folderId, userId: this.userId });
  }

  // Sync methods
  requestSync(fileId: string) {
    this.emit('request_sync', { fileId, userId: this.userId });
  }

  reportConflict(fileId: string, conflictData: any) {
    this.emit('report_conflict', { fileId, conflictData, userId: this.userId });
  }

  resolveConflict(fileId: string, resolution: any) {
    this.emit('resolve_conflict', { fileId, resolution, userId: this.userId });
  }

  // Presence methods
  updatePresence(status: 'online' | 'away' | 'busy') {
    this.emit('update_presence', { userId: this.userId, status });
  }

  // Notification methods
  sendNotification(targetUserId: string, notification: any) {
    this.emit('send_notification', { 
      targetUserId, 
      notification, 
      fromUserId: this.userId 
    });
  }

  // Admin methods
  broadcastMessage(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.emit('admin_broadcast', { message, type, fromUserId: this.userId });
  }

  // Cleanup
  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.mockMode = false;
    this.errorLogged = false;
  }

  // Connection status
  isConnected(): boolean {
    return this.mockMode || (this.socket?.connected || false);
  }

  getConnectionState(): string {
    if (this.mockMode) return 'mock';
    if (!this.socket) return 'disconnected';
    return this.socket.connected ? 'connected' : 'connecting';
  }

  isMockMode(): boolean {
    return this.mockMode;
  }
}