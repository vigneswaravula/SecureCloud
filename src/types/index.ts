export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'editor' | 'viewer';
  storageUsed: number;
  storageLimit: number;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  encryptionKeyHash?: string;
  publicKey?: string;
  preferences: UserPreferences;
  workspaces: string[];
  achievements: Achievement[];
  xp: number;
  level: number;
  streak: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  voiceCommands: boolean;
  autoSync: boolean;
  zeroKnowledgeEncryption: boolean;
  aiFeatures: boolean;
  gamification: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  shareInvites: boolean;
  fileChanges: boolean;
  securityAlerts: boolean;
  collaborationUpdates: boolean;
  aiInsights: boolean;
  workspaceUpdates: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  encryptedUrl: string;
  thumbnailUrl?: string;
  folderId?: string;
  workspaceId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  versions: FileVersion[];
  sharedLinks: SharedLink[];
  tags: string[];
  aiTags?: string[];
  isStarred: boolean;
  isTrashed: boolean;
  isEncrypted: boolean;
  encryptionMetadata: EncryptionMetadata;
  ocrText?: string;
  collaborators: Collaborator[];
  comments: Comment[];
  lastModifiedBy: string;
  checksum: string;
  accessExpiry?: string;
  downloadLimit?: number;
  downloadCount: number;
  viewCount: number;
  retentionPolicy?: RetentionPolicy;
  complianceFlags: ComplianceFlag[];
  extractedData?: ExtractedDocumentData;
  // Additional fields for shared files
  sharedBy?: string;
  sharedAt?: string;
  permission?: 'viewer' | 'editor' | 'commenter';
}

export interface EncryptionMetadata {
  algorithm: string;
  keyDerivation: string;
  iv: string;
  salt: string;
  iterations: number;
  isZeroKnowledge?: boolean;
}

export interface FileVersion {
  id: string;
  version: number;
  encryptedUrl: string;
  size: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  changelog: string;
  checksum: string;
  aiSummary?: string;
  changes: VersionChange[];
  isAutoSave: boolean;
  parentVersionId?: string;
  downloadCount: number;
  restoreCount: number;
}

export interface VersionChange {
  type: 'content' | 'metadata' | 'permissions' | 'structure';
  description: string;
  details?: Record<string, any>;
  confidence: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  workspaceId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  isTrashed: boolean;
  children: Folder[];
  permissions: FolderPermission[];
  isShared: boolean;
  shareSettings: ShareSettings;
  color?: string;
  icon?: string;
}

export interface FolderPermission {
  userId: string;
  userName: string;
  userEmail: string;
  permission: 'viewer' | 'editor' | 'commenter';
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
}

export interface ShareSettings {
  isPublic: boolean;
  requiresPassword: boolean;
  password?: string;
  expiresAt?: string;
  allowDownload: boolean;
  allowComments: boolean;
  downloadLimit?: number;
  viewLimit?: number;
}

export interface SharedLink {
  id: string;
  fileId: string;
  token: string;
  permissions: 'view' | 'download' | 'edit';
  expiresAt?: string;
  password?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  views: number;
  downloads: number;
  requiresAuth: boolean;
  twoFactorRequired: boolean;
  downloadLimit?: number;
  viewLimit?: number;
  isRevoked: boolean;
  revokedAt?: string;
  revokedBy?: string;
}

export interface Collaborator {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  permission: 'viewer' | 'editor' | 'commenter';
  isOnline: boolean;
  lastSeen: string;
  cursor?: CursorPosition;
  isTyping?: boolean;
  typingLocation?: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  color: string;
}

export interface Comment {
  id: string;
  fileId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isResolved: boolean;
  replies: CommentReply[];
  position?: CommentPosition;
  mentions: string[];
  reactions: CommentReaction[];
}

export interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  mentions: string[];
}

export interface CommentReaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface CommentPosition {
  page?: number;
  x: number;
  y: number;
}

export interface Activity {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete' | 'rename' | 'move' | 'comment' | 'permission_change' | 'version_create' | 'version_restore' | 'collaboration' | 'ai_analysis';
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  fileId?: string;
  fileName?: string;
  folderId?: string;
  folderName?: string;
  workspaceId?: string;
  versionId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'password_change' | 'two_factor_enabled' | 'suspicious_activity' | 'unauthorized_access' | 'data_export' | 'encryption_breach';
  userId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: string;
}

export interface StorageStats {
  totalUsed: number;
  totalLimit: number;
  fileTypes: {
    images: number;
    documents: number;
    videos: number;
    audio: number;
    others: number;
  };
  recentActivity: Activity[];
  encryptedFiles: number;
  sharedFiles: number;
  collaborativeFiles: number;
  aiProcessedFiles: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalStorage: number;
  securityEvents: SecurityEvent[];
  userGrowth: Array<{ date: string; users: number }>;
  storageGrowth: Array<{ date: string; storage: number }>;
  fileTypeDistribution: Array<{ type: string; count: number; size: number }>;
  workspaceCount: number;
  collaborationMetrics: CollaborationMetrics;
}

export interface CollaborationMetrics {
  activeCollaborations: number;
  commentsToday: number;
  sharesThisWeek: number;
  realTimeUsers: number;
}

export interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  parameters?: Record<string, any>;
  isCustom: boolean;
  userId: string;
  confidence?: number;
  context?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  blocks: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  language?: string;
  extractedData?: ExtractedDocumentData;
}

export interface AITagResult {
  tags: string[];
  confidence: number;
  categories: Array<{
    category: string;
    confidence: number;
  }>;
  suggestedFolders: string[];
  contentSummary?: string;
}

export interface SyncStatus {
  fileId: string;
  status: 'syncing' | 'synced' | 'conflict' | 'error' | 'paused';
  lastSync: string;
  conflictReason?: string;
  errorMessage?: string;
  provider?: 'google_drive' | 'onedrive' | 'dropbox';
  progress?: number;
}

export interface ConflictResolution {
  fileId: string;
  strategy: 'keep_local' | 'keep_remote' | 'merge' | 'create_copy';
  resolvedBy: string;
  resolvedAt: string;
  details?: Record<string, any>;
}

export interface WebSocketMessage {
  type: 'file_update' | 'user_presence' | 'permission_change' | 'comment_added' | 'sync_status' | 'typing_indicator' | 'cursor_move' | 'ai_analysis_complete';
  payload: any;
  timestamp: string;
  userId: string;
  fileId?: string;
  workspaceId?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface EncryptionKey {
  key: string;
  salt: string;
  iterations: number;
  derivedKey: string;
}

export interface ShareInvite {
  id: string;
  fileId?: string;
  folderId?: string;
  workspaceId?: string;
  invitedEmail: string;
  invitedBy: string;
  permission: 'viewer' | 'editor' | 'commenter';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt?: string;
  message?: string;
  token: string;
}

export interface VersionComparison {
  fileId: string;
  fromVersion: string;
  toVersion: string;
  changes: VersionChange[];
  similarity: number;
  aiAnalysis: string;
}

// New interfaces for advanced features

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  branding: WorkspaceBranding;
  storageUsed: number;
  storageLimit: number;
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface WorkspaceMember {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
  invitedBy: string;
  lastActive: string;
  permissions: WorkspacePermission[];
}

export interface WorkspacePermission {
  resource: 'files' | 'folders' | 'sharing' | 'members' | 'settings';
  actions: string[];
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowGuestAccess: boolean;
  requireApproval: boolean;
  defaultFilePermission: 'viewer' | 'editor';
  retentionPolicy: RetentionPolicy;
  encryptionRequired: boolean;
  aiAnalysisEnabled: boolean;
  collaborationFeatures: CollaborationFeatures;
}

export interface WorkspaceBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
}

export interface CollaborationFeatures {
  realTimeEditing: boolean;
  comments: boolean;
  mentions: boolean;
  videoChat: boolean;
  screenSharing: boolean;
  whiteboard: boolean;
}

export interface RetentionPolicy {
  enabled: boolean;
  deleteAfterDays: number;
  archiveAfterDays?: number;
  notifyBeforeDays: number;
  exemptStarred: boolean;
  exemptShared: boolean;
}

export interface ComplianceFlag {
  type: 'gdpr' | 'hipaa' | 'sox' | 'pci' | 'custom';
  reason: string;
  createdAt: string;
  createdBy: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface GDPRExport {
  id: string;
  userId: string;
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  fileCount: number;
  totalSize: number;
}

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  fileId?: string;
  fileName?: string;
  action: 'view' | 'download' | 'edit' | 'share' | 'delete';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  errorMessage?: string;
}

export interface SmartSearchQuery {
  id: string;
  query: string;
  type: 'semantic' | 'filter' | 'natural_language';
  userId: string;
  timestamp: string;
  results: number;
  processingTime: number;
  aiConfidence?: number;
}

export interface AIInsight {
  id: string;
  type: 'duplicate_files' | 'storage_optimization' | 'collaboration_suggestion' | 'security_recommendation' | 'workflow_improvement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actions?: AIInsightAction[];
  createdAt: string;
  userId?: string;
  fileIds?: string[];
  dismissed: boolean;
  dismissedAt?: string;
}

export interface AIInsightAction {
  id: string;
  label: string;
  type: 'delete' | 'merge' | 'move' | 'share' | 'encrypt' | 'archive';
  parameters: Record<string, any>;
}

export interface ExtractedDocumentData {
  type: 'invoice' | 'receipt' | 'contract' | 'id_document' | 'form' | 'other';
  fields: ExtractedField[];
  confidence: number;
  language?: string;
  currency?: string;
}

export interface ExtractedField {
  name: string;
  value: string;
  confidence: number;
  type: 'text' | 'number' | 'date' | 'currency' | 'email' | 'phone';
  position?: { x: number; y: number; width: number; height: number };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'storage' | 'collaboration' | 'security' | 'productivity' | 'social';
  points: number;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CloudSyncProvider {
  id: string;
  name: string;
  type: 'google_drive' | 'onedrive' | 'dropbox' | 'box' | 'aws_s3';
  isConnected: boolean;
  connectedAt?: string;
  lastSync?: string;
  syncStatus: 'idle' | 'syncing' | 'error' | 'paused';
  settings: CloudSyncSettings;
  quotaUsed?: number;
  quotaLimit?: number;
}

export interface CloudSyncSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncDirection: 'bidirectional' | 'upload_only' | 'download_only';
  conflictResolution: 'ask' | 'keep_local' | 'keep_remote' | 'keep_both';
  excludePatterns: string[];
  includeFolders: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  fileId?: string;
  fileName?: string;
  actions?: ChatAction[];
  isProcessing?: boolean;
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'search' | 'upload' | 'share' | 'delete' | 'organize' | 'analyze';
  parameters: Record<string, any>;
  executed: boolean;
  result?: any;
}

export interface CalendarEvent {
  id: string;
  date: string;
  type: 'upload' | 'edit' | 'share' | 'collaboration' | 'deadline' | 'backup';
  title: string;
  description?: string;
  fileIds: string[];
  userId: string;
  userName: string;
  count: number;
  metadata?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  type: 'share' | 'comment' | 'mention' | 'collaboration' | 'security' | 'system' | 'achievement' | 'ai_insight';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  category: string;
}