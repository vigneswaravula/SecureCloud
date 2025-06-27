import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Key, Copy, Check, AlertTriangle } from 'lucide-react';
import { TwoFactorService } from '../../utils/twoFactor';
import { TwoFactorSetup as TwoFactorSetupType } from '../../types';
import toast from 'react-hot-toast';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isOpen, onClose, userEmail }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [setupData, setSetupData] = useState<TwoFactorSetupType | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && step === 'setup') {
      generateSecret();
    }
  }, [isOpen, step]);

  const generateSecret = async () => {
    setIsLoading(true);
    try {
      const data = await TwoFactorService.generateSecret(userEmail);
      setSetupData(data);
    } catch (error) {
      toast.error('Failed to generate 2FA secret');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!setupData || !verificationCode) return;

    setIsLoading(true);
    try {
      const isValid = await TwoFactorService.validateSetup(setupData.secret, verificationCode);
      if (isValid) {
        setStep('backup');
        toast.success('2FA setup successful!');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCodes(prev => new Set(prev).add(codeId));
      toast.success('Copied to clipboard');
      
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(codeId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleComplete = () => {
    // In a real app, save 2FA settings to user profile
    toast.success('Two-factor authentication enabled successfully');
    onClose();
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
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
        </div>

        {step === 'setup' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Step 1: Install Authenticator App</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Download Google Authenticator, Authy, or any compatible TOTP app on your phone.
                  </p>
                </div>
              </div>
            </div>

            {setupData && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-3">Step 2: Scan QR Code</h3>
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={setupData.qrCode} 
                      alt="2FA QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Or enter this code manually:</h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono">
                      {setupData.secret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(setupData.secret, 'secret')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {copiedCodes.has('secret') ? (
                        <Check className="w-4 h-4  text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('verify')}
                disabled={!setupData}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Key className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Step 3: Verify Setup</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Enter the 6-digit code from your authenticator app to verify the setup.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                maxLength={6}
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setStep('setup')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || isLoading}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify</span>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'backup' && setupData && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Important: Save Backup Codes</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Backup Codes</h3>
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <code className="flex-1 text-sm font-mono">{TwoFactorService.formatBackupCode(code)}</code>
                    <button
                      onClick={() => copyToClipboard(code, `backup-${index}`)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                    >
                      {copiedCodes.has(`backup-${index}`) ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> Each backup code can only be used once. Generate new codes after using them.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => copyToClipboard(setupData.backupCodes.join('\n'), 'all-codes')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy All</span>
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Complete Setup</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TwoFactorSetup;