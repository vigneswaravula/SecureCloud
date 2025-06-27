import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { FileItem, Folder, EncryptionMetadata, FileVersion } from '../types';
import { mockFiles, mockFolders } from '../utils/mockData';
import { EncryptionService } from '../utils/encryption';
import { OCRService } from '../utils/ocr';
import { AITaggerService } from '../utils/aiTagger';
import { VersionAnalysisService } from '../utils/versionAnalysis';
import { useEncryption } from './useEncryption';
import { useWebSocket } from './useWebSocket';
import toast from 'react-hot-toast';

interface FilesContextType {
  files: FileItem[];
  folders: Folder[];
  currentFolder: string | null;
  selectedFiles: string[];
  isLoading: boolean;
  uploadFile: (file: File, folderId?: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  restoreFile: (fileId: string) => Promise<void>;
  starFile: (fileId: string) => Promise<void>;
  shareFile: (fileId: string, permissions: 'view' | 'download' | 'edit', expiresAt?: string) => Promise<string>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  moveFile: (fileId: string, targetFolderId: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  navigateToFolder: (folderId: string | null) => void;
  selectFile: (fileId: string) => void;
  selectMultipleFiles: (fileIds: string[]) => void;
  clearSelection: () => void;
  searchFiles: (query: string) => FileItem[];
  getFilesByType: (type: string) => FileItem[];
  getRecentFiles: (limit?: number) => FileItem[];
  getStarredFiles: () => FileItem[];
  getTrashedFiles: () => FileItem[];
  downloadFile: (fileId: string) => Promise<void>;
  previewFile: (fileId: string) => Promise<Blob | null>;
  getFileVersions: (fileId: string) => Promise<FileVersion[]>;
  restoreFileVersion: (fileId: string, versionId: string) => Promise<void>;
  createFileVersion: (fileId: string, file: File, changelog?: string) => Promise<FileVersion>;
  addComment: (fileId: string, content: string, position?: any) => Promise<void>;
  getComments: (fileId: string) => Promise<any[]>;
  shareFolder: (folderId: string, permissions: any) => Promise<void>;
  processOCR: (fileId: string) => Promise<void>;
  generateAITags: (fileId: string) => Promise<void>;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const { isEncryptionEnabled, encryptFile, decryptFile, isUnlocked } = useEncryption();
  const { joinFile, leaveFile, requestSync } = useWebSocket();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file: File, folderId?: string) => {
    setIsLoading(true);
    try {
      let encryptedUrl = '';
      let encryptionMetadata: EncryptionMetadata | null = null;
      let checksum = '';

      // Generate checksum
      checksum = await EncryptionService.generateChecksum(file);

      if (isEncryptionEnabled && isUnlocked) {
        // Encrypt file before upload
        const { encryptedData, metadata } = await encryptFile(file);
        encryptionMetadata = metadata;
        
        // In a real app, upload encrypted data to server
        encryptedUrl = URL.createObjectURL(encryptedData);
        toast.success('File encrypted and uploaded securely');
      } else {
        // Upload file normally
        encryptedUrl = URL.createObjectURL(file);
      }

      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type.split('/')[0],
        mimeType: file.type,
        encryptedUrl,
        thumbnailUrl: file.type.startsWith('image/') ? encryptedUrl : undefined,
        folderId: folderId || currentFolder || undefined,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [],
        sharedLinks: [],
        tags: [],
        isStarred: false,
        isTrashed: false,
        isEncrypted: isEncryptionEnabled && isUnlocked,
        encryptionMetadata: encryptionMetadata || {
          algorithm: 'none',
          keyDerivation: 'none',
          iv: '',
          salt: '',
          iterations: 0
        },
        collaborators: [],
        comments: [],
        lastModifiedBy: '1',
        checksum
      };

      // Create initial version
      const initialVersion = await createFileVersion(newFile.id, file, 'Initial version');
      newFile.versions = [initialVersion];

      setFiles(prev => [...prev, newFile]);

      // Process OCR if supported
      if (OCRService.isSupported(file)) {
        processOCR(newFile.id);
      }

      // Generate AI tags
      generateAITags(newFile.id);

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createFileVersion = async (
    fileId: string, 
    file: File, 
    changelog?: string
  ): Promise<FileVersion> => {
    try {
      const existingFile = files.find(f => f.id === fileId);
      const previousVersion = existingFile?.versions[existingFile.versions.length - 1];

      // Generate AI summary and detect changes
      const { summary, changes } = await VersionAnalysisService.generateVersionSummary(
        file,
        previousVersion,
        changelog
      );

      const newVersion: FileVersion = {
        id: `${fileId}-v${Date.now()}`,
        version: previousVersion ? previousVersion.version + 1 : 1,
        encryptedUrl: URL.createObjectURL(file),
        size: file.size,
        createdAt: new Date().toISOString(),
        createdBy: '1',
        createdByName: 'Current User',
        changelog: changelog || 'Version update',
        checksum: await EncryptionService.generateChecksum(file),
        aiSummary: summary,
        changes,
        isAutoSave: !changelog, // Auto-save if no changelog provided
        parentVersionId: previousVersion?.id,
        downloadCount: 0,
        restoreCount: 0
      };

      // Update file with new version
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              versions: [...f.versions, newVersion],
              updatedAt: new Date().toISOString(),
              size: file.size,
              encryptedUrl: newVersion.encryptedUrl
            }
          : f
      ));

      return newVersion;
    } catch (error) {
      console.error('Failed to create file version:', error);
      throw error;
    }
  };

  const getFileVersions = async (fileId: string): Promise<FileVersion[]> => {
    const file = files.find(f => f.id === fileId);
    return file?.versions || [];
  };

  const restoreFileVersion = async (fileId: string, versionId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      const version = file?.versions.find(v => v.id === versionId);
      
      if (!file || !version) {
        throw new Error('File or version not found');
      }

      // Update file to use the restored version
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              encryptedUrl: version.encryptedUrl,
              size: version.size,
              updatedAt: new Date().toISOString(),
              versions: f.versions.map(v => 
                v.id === versionId 
                  ? { ...v, restoreCount: v.restoreCount + 1 }
                  : v
              )
            }
          : f
      ));

      toast.success(`File restored to version ${version.version}`);
    } catch (error) {
      console.error('Failed to restore file version:', error);
      toast.error('Failed to restore file version');
      throw error;
    }
  };

  const downloadFile = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }

      let downloadBlob: Blob;

      if (file.isEncrypted && isEncryptionEnabled) {
        if (!isUnlocked) {
          toast.error('Encryption vault is locked. Please unlock to download encrypted files.');
          return;
        }

        // Fetch encrypted file and decrypt
        const response = await fetch(file.encryptedUrl);
        const encryptedBlob = await response.blob();
        downloadBlob = await decryptFile(encryptedBlob, file.encryptionMetadata);
      } else {
        // Download file normally
        const response = await fetch(file.encryptedUrl);
        downloadBlob = await response.blob();
      }

      // Create download link
      const url = URL.createObjectURL(downloadBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${file.name}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
      throw error;
    }
  };

  const previewFile = async (fileId: string): Promise<Blob | null> => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return null;

      if (file.isEncrypted && isEncryptionEnabled) {
        if (!isUnlocked) {
          toast.error('Encryption vault is locked');
          return null;
        }

        const response = await fetch(file.encryptedUrl);
        const encryptedBlob = await response.blob();
        return await decryptFile(encryptedBlob, file.encryptionMetadata);
      } else {
        const response = await fetch(file.encryptedUrl);
        return await response.blob();
      }
    } catch (error) {
      console.error('Preview failed:', error);
      return null;
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, isTrashed: true, updatedAt: new Date().toISOString() }
          : file
      ));
      toast.success('File moved to trash');
    } catch (error) {
      toast.error('Failed to delete file');
      throw error;
    }
  };

  const restoreFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, isTrashed: false, updatedAt: new Date().toISOString() }
          : file
      ));
      toast.success('File restored');
    } catch (error) {
      toast.error('Failed to restore file');
      throw error;
    }
  };

  const starFile = async (fileId: string) => {
    try {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, isStarred: !file.isStarred, updatedAt: new Date().toISOString() }
          : file
      ));
      const file = files.find(f => f.id === fileId);
      toast.success(`${file?.name} ${file?.isStarred ? 'removed from' : 'added to'} starred`);
    } catch (error) {
      toast.error('Failed to update file');
      throw error;
    }
  };

  const shareFile = async (fileId: string, permissions: 'view' | 'download' | 'edit', expiresAt?: string) => {
    try {
      const shareToken = EncryptionService.generateShareToken();
      const shareLink = `${window.location.origin}/shared/${shareToken}`;
      
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              sharedLinks: [...file.sharedLinks, {
                id: Date.now().toString(),
                fileId,
                token: shareToken,
                permissions,
                expiresAt,
                createdAt: new Date().toISOString(),
                createdBy: '1',
                views: 0,
                downloads: 0,
                requiresAuth: false,
                twoFactorRequired: false
              }],
              updatedAt: new Date().toISOString()
            }
          : file
      ));

      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard');
      return shareLink;
    } catch (error) {
      toast.error('Failed to create share link');
      throw error;
    }
  };

  const renameFile = async (fileId: string, newName: string) => {
    try {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, name: newName, updatedAt: new Date().toISOString() }
          : file
      ));
      toast.success('File renamed successfully');
    } catch (error) {
      toast.error('Failed to rename file');
      throw error;
    }
  };

  const moveFile = async (fileId: string, targetFolderId: string) => {
    try {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, folderId: targetFolderId, updatedAt: new Date().toISOString() }
          : file
      ));
      toast.success('File moved successfully');
    } catch (error) {
      toast.error('Failed to move file');
      throw error;
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name,
        parentId: parentId || currentFolder || undefined,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isStarred: false,
        isTrashed: false,
        children: [],
        permissions: [],
        isShared: false,
        shareSettings: {
          isPublic: false,
          requiresPassword: false,
          allowDownload: true,
          allowComments: false
        }
      };

      setFolders(prev => [...prev, newFolder]);
      toast.success(`Folder "${name}" created`);
    } catch (error) {
      toast.error('Failed to create folder');
      throw error;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      setFolders(prev => prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, isTrashed: true, updatedAt: new Date().toISOString() }
          : folder
      ));
      toast.success('Folder moved to trash');
    } catch (error) {
      toast.error('Failed to delete folder');
      throw error;
    }
  };

  const shareFolder = async (folderId: string, permissions: any) => {
    try {
      setFolders(prev => prev.map(folder => 
        folder.id === folderId 
          ? { 
              ...folder, 
              isShared: true,
              permissions: [...folder.permissions, permissions],
              updatedAt: new Date().toISOString()
            }
          : folder
      ));
      toast.success('Folder shared successfully');
    } catch (error) {
      toast.error('Failed to share folder');
      throw error;
    }
  };

  const processOCR = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return;

      // Get file blob for OCR processing
      const blob = await previewFile(fileId);
      if (!blob) return;

      const fileObj = new File([blob], file.name, { type: file.mimeType });
      const ocrResult = await OCRService.extractText(fileObj);

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, ocrText: ocrResult.text, updatedAt: new Date().toISOString() }
          : f
      ));

      toast.success('OCR processing completed');
    } catch (error) {
      console.error('OCR processing failed:', error);
    }
  };

  const generateAITags = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return;

      const blob = await previewFile(fileId);
      if (!blob) return;

      const fileObj = new File([blob], file.name, { type: file.mimeType });
      const aiResult = await AITaggerService.generateTags(fileObj);

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              aiTags: aiResult.tags,
              tags: [...f.tags, ...aiResult.tags].filter((tag, index, arr) => arr.indexOf(tag) === index),
              updatedAt: new Date().toISOString()
            }
          : f
      ));

      if (aiResult.tags.length > 0) {
        toast.success(`Generated ${aiResult.tags.length} AI tags`);
      }
    } catch (error) {
      console.error('AI tagging failed:', error);
    }
  };

  const addComment = async (fileId: string, content: string, position?: any) => {
    try {
      const comment = {
        id: Date.now().toString(),
        fileId,
        userId: '1',
        userName: 'Current User',
        content,
        createdAt: new Date().toISOString(),
        isResolved: false,
        replies: [],
        position
      };

      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, comments: [...file.comments, comment] }
          : file
      ));

      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const getComments = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    return file?.comments || [];
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
    
    if (folderId) {
      joinFile(folderId); // Join folder for collaboration
    }
  };

  const selectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectMultipleFiles = (fileIds: string[]) => {
    setSelectedFiles(fileIds);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const searchFiles = (query: string) => {
    return files.filter(file => 
      !file.isTrashed && 
      (file.name.toLowerCase().includes(query.toLowerCase()) ||
       file.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
       (file.ocrText && file.ocrText.toLowerCase().includes(query.toLowerCase())) ||
       (file.aiTags && file.aiTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))))
    );
  };

  const getFilesByType = (type: string) => {
    return files.filter(file => !file.isTrashed && file.type === type);
  };

  const getRecentFiles = (limit = 10) => {
    return files
      .filter(file => !file.isTrashed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const getStarredFiles = () => {
    return files.filter(file => !file.isTrashed && file.isStarred);
  };

  const getTrashedFiles = () => {
    return files.filter(file => file.isTrashed);
  };

  const value = {
    files: files.filter(file => 
      !file.isTrashed && 
      (currentFolder ? file.folderId === currentFolder : !file.folderId)
    ),
    folders: folders.filter(folder => 
      !folder.isTrashed && 
      (currentFolder ? folder.parentId === currentFolder : !folder.parentId)
    ),
    currentFolder,
    selectedFiles,
    isLoading,
    uploadFile,
    deleteFile,
    restoreFile,
    starFile,
    shareFile,
    renameFile,
    moveFile,
    createFolder,
    deleteFolder,
    navigateToFolder,
    selectFile,
    selectMultipleFiles,
    clearSelection,
    searchFiles,
    getFilesByType,
    getRecentFiles,
    getStarredFiles,
    getTrashedFiles,
    downloadFile,
    previewFile,
    getFileVersions,
    restoreFileVersion,
    createFileVersion,
    addComment,
    getComments,
    shareFolder,
    processOCR,
    generateAITags
  };

  return (
    <FilesContext.Provider value={value}>
      {children}
    </FilesContext.Provider>
  );
};