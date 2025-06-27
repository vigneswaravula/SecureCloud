import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, Unlock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useEncryption } from '../../hooks/useEncryption';
import toast from 'react-hot-toast';

interface EncryptionSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EncryptionSetup: React.FC<EncryptionSetupProps> = ({ isOpen, onClose }) => {
  const { isUnlocked, unlockVault, lockVault, isEncryptionEnabled, setEncryptionEnabled } = useEncryption();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'unlock'>('setup');

  const handleSetupEncryption = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 12) {
      toast.error('Password must be at least 12 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const success = await unlockVault(password);
      if (success) {
        setEncryptionEnabled(true);
        toast.success('End-to-end encryption enabled successfully');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to setup encryption');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockVault = async () => {
    setIsLoading(true);
    try {
      const success = await unlockVault(password);
      if (success) {
        toast.success('Encryption vault unlocked');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to unlock vault');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableEncryption = () => {
    if (window.confirm('Are you sure you want to disable end-to-end encryption? This will make your files less secure.')) {
      setEncryptionEnabled(false);
      lockVault();
      onClose();
    }
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
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEncryptionEnabled ? 'Encryption Vault' : 'Setup Encryption'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEncryptionEnabled 
                ? (isUnlocked ? 'Vault is unlocked' : 'Enter password to unlock vault')
                : 'Secure your files with end-to-end encryption'
              }
            </p>
          </div>
        </div>

        {!isEncryptionEnabled ? (
          /* Setup Encryption */
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Key className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">End-to-End Encryption</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your files will be encrypted on your device before upload. Only you can decrypt them with your password.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Important</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    If you forget your encryption password, your files cannot be recovered. Store it safely.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password (min 12 characters)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    minLength={12}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSetupEncryption}
                disabled={!password || !confirmPassword || password !== confirmPassword || isLoading}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Enable Encryption</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Unlock/Manage Vault */
          <div className="space-y-6">
            <div className={`border rounded-lg p-4 ${
              isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                {isUnlocked ? (
                  <Unlock className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <h3 className={`font-medium ${isUnlocked ? 'text-green-900' : 'text-gray-900'}`}>
                    Vault Status: {isUnlocked ? 'Unlocked' : 'Locked'}
                  </h3>
                  <p className={`text-sm ${isUnlocked ? 'text-green-700' : 'text-gray-600'}`}>
                    {isUnlocked 
                      ? 'You can now upload and access encrypted files'
                      : 'Enter your password to access encrypted files'
                    }
                  </p>
                </div>
              </div>
            </div>

            {!isUnlocked && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your encryption password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleUnlockVault()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handleDisableEncryption}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Disable Encryption
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close
                </button>
                
                {isUnlocked ? (
                  <button
                    onClick={lockVault}
                    className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Lock Vault</span>
                  </button>
                ) : (
                  <button
                    onClick={handleUnlockVault}
                    disabled={!password || isLoading}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Unlocking...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Unlock Vault</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EncryptionSetup;