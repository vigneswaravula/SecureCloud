import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { EncryptionService } from '../utils/encryption';
import { EncryptionKey, EncryptionMetadata } from '../types';
import toast from 'react-hot-toast';

interface EncryptionContextType {
  isUnlocked: boolean;
  encryptionKey: EncryptionKey | null;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  encryptFile: (file: File) => Promise<{ encryptedData: Blob; metadata: EncryptionMetadata }>;
  decryptFile: (encryptedBlob: Blob, metadata: EncryptionMetadata) => Promise<Blob>;
  generateShareToken: () => string;
  isEncryptionEnabled: boolean;
  setEncryptionEnabled: (enabled: boolean) => void;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

export const EncryptionProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<EncryptionKey | null>(null);
  const [isEncryptionEnabled, setIsEncryptionEnabledState] = useState(
    localStorage.getItem('encryption_enabled') === 'true'
  );

  const unlockVault = useCallback(async (password: string): Promise<boolean> => {
    try {
      // Check if user has existing encryption key
      const storedSalt = localStorage.getItem('encryption_salt');
      
      let key: EncryptionKey;
      if (storedSalt) {
        // Use existing salt to derive key
        key = EncryptionService.generateKey(password, storedSalt);
        
        // Verify password by checking stored hash
        const storedHash = localStorage.getItem('encryption_key_hash');
        if (storedHash) {
          const testHash = EncryptionService.hashPassword(password, storedSalt);
          if (testHash.hash !== storedHash) {
            toast.error('Invalid encryption password');
            return false;
          }
        }
      } else {
        // Generate new key for first-time setup
        key = EncryptionService.generateKey(password);
        
        // Store salt and hash for future verification
        localStorage.setItem('encryption_salt', key.salt);
        const hash = EncryptionService.hashPassword(password, key.salt);
        localStorage.setItem('encryption_key_hash', hash.hash);
        
        toast.success('Encryption vault created successfully');
      }

      setEncryptionKey(key);
      setIsUnlocked(true);
      
      // Auto-lock after 30 minutes of inactivity
      setTimeout(() => {
        lockVault();
      }, 30 * 60 * 1000);

      return true;
    } catch (error) {
      console.error('Failed to unlock vault:', error);
      toast.error('Failed to unlock encryption vault');
      return false;
    }
  }, []);

  const lockVault = useCallback(() => {
    setEncryptionKey(null);
    setIsUnlocked(false);
    toast.info('Encryption vault locked');
  }, []);

  const encryptFile = useCallback(async (file: File) => {
    if (!encryptionKey) {
      throw new Error('Encryption vault is locked');
    }

    try {
      return await EncryptionService.encryptFile(file, encryptionKey);
    } catch (error) {
      console.error('File encryption failed:', error);
      throw new Error('Failed to encrypt file');
    }
  }, [encryptionKey]);

  const decryptFile = useCallback(async (encryptedBlob: Blob, metadata: EncryptionMetadata) => {
    if (!encryptionKey) {
      throw new Error('Encryption vault is locked');
    }

    try {
      return await EncryptionService.decryptFile(encryptedBlob, encryptionKey, metadata);
    } catch (error) {
      console.error('File decryption failed:', error);
      throw new Error('Failed to decrypt file');
    }
  }, [encryptionKey]);

  const generateShareToken = useCallback(() => {
    return EncryptionService.generateShareToken();
  }, []);

  const setEncryptionEnabled = useCallback((enabled: boolean) => {
    setIsEncryptionEnabledState(enabled);
    localStorage.setItem('encryption_enabled', enabled.toString());
    
    if (enabled) {
      toast.success('End-to-end encryption enabled');
    } else {
      toast.info('End-to-end encryption disabled');
      lockVault();
    }
  }, [lockVault]);

  const value = {
    isUnlocked,
    encryptionKey,
    unlockVault,
    lockVault,
    encryptFile,
    decryptFile,
    generateShareToken,
    isEncryptionEnabled,
    setEncryptionEnabled
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
};