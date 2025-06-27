import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Star,
  Clock,
  Users,
  Trash2,
  Settings,
  HardDrive,
  Shield,
  LogOut,
  Lock,
  Wifi,
  WifiOff,
  MessageCircle,
  Calendar,
  Cloud,
  Sparkles,
  Trophy,
  Folder,
  FolderPlus,
  Globe,
  Webhook,
  Key,
  BarChart3,
  Palette
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEncryption } from '../../hooks/useEncryption';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatFileSize } from '../../utils/formatters';
import WorkspaceManager from '../Workspaces/WorkspaceManager';
import AIAssistant from '../AI/AIAssistant';
import ComplianceCenter from '../Compliance/ComplianceCenter';
import AchievementSystem from '../Gamification/AchievementSystem';
import ActivityCalendar from '../Calendar/ActivityCalendar';
import CloudSyncManager from '../CloudSync/CloudSyncManager';
import ApiKeyManager from '../Integrations/ApiKeyManager';
import WebhookManager from '../Integrations/WebhookManager';
import OAuthIntegrations from '../Integrations/OAuthIntegrations';
import ColorBlindMode from '../Accessibility/ColorBlindMode';
import LanguageSwitcher from '../Internationalization/LanguageSwitcher';

interface SidebarProps {
  onEncryptionSetup: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onEncryptionSetup }) => {
  const { user, logout } = useAuth();
  const { isEncryptionEnabled, isUnlocked } = useEncryption();
  const { isConnected } = useWebSocket();
  const [showWorkspaceManager, setShowWorkspaceManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showComplianceCenter, setShowComplianceCenter] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [showWebhookManager, setShowWebhookManager] = useState(false);
  const [showOAuthIntegrations, setShowOAuthIntegrations] = useState(false);
  const [showColorBlindMode, setShowColorBlindMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'My Files' },
    { to: '/starred', icon: Star, label: 'Starred' },
    { to: '/recent', icon: Clock, label: 'Recent' },
    { to: '/shared', icon: Users, label: 'Shared with me' },
    { to: '/trash', icon: Trash2, label: 'Trash' },
  ];

  const adminItems = [
    { to: '/admin', icon: Shield, label: 'Admin Panel' },
  ];

  const bottomItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // In a real app, this would update the app's language context
    console.log(`Language changed to: ${language}`);
  };

  const handleApplyColorMode = (mode: string) => {
    // In a real app, this would update the app's theme context
    console.log(`Color mode changed to: ${mode}`);
  };

  return (
    <>
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-screen w-70 bg-white border-r border-gray-200 flex flex-col z-30"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SecureCloud</h1>
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Encryption Status */}
        {isEncryptionEnabled && (
          <div className="px-6 py-3 border-b border-gray-200">
            <button
              onClick={onEncryptionSetup}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                isUnlocked
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Vault {isUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </button>
          </div>
        )}

        {/* Language Switcher */}
        <div className="px-6 py-3 border-b border-gray-200">
          <LanguageSwitcher 
            onLanguageChange={handleLanguageChange}
            currentLanguage={currentLanguage}
          />
        </div>

        {/* Workspaces */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Workspaces</h2>
            <button
              onClick={() => setShowWorkspaceManager(true)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setShowWorkspaceManager(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Folder className="w-5 h-5 text-blue-600" />
              <span>Marketing Team</span>
            </button>
            <button
              onClick={() => setShowWorkspaceManager(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Folder className="w-5 h-5 text-green-600" />
              <span>Development Team</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* AI Assistant */}
          <button
            onClick={() => setShowAIAssistant(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI Assistant</span>
          </button>

          {/* Activity Calendar */}
          <button
            onClick={() => setShowActivityCalendar(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Activity Calendar</span>
          </button>

          {/* Cloud Sync */}
          <button
            onClick={() => setShowCloudSync(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Cloud Sync</span>
          </button>

          {/* Achievements */}
          {user && (
            <button
              onClick={() => setShowAchievements(true)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Achievements</span>
              <div className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                {user.level}
              </div>
            </button>
          )}

          {/* API Keys */}
          <button
            onClick={() => setShowApiKeyManager(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Key className="w-5 h-5 text-blue-600" />
            <span>API Keys</span>
          </button>

          {/* Webhooks */}
          <button
            onClick={() => setShowWebhookManager(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Webhook className="w-5 h-5 text-purple-600" />
            <span>Webhooks</span>
          </button>

          {/* OAuth Integrations */}
          <button
            onClick={() => setShowOAuthIntegrations(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Integrations</span>
          </button>

          {/* Analytics */}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span>Analytics</span>
          </NavLink>

          {/* Accessibility */}
          <button
            onClick={() => setShowColorBlindMode(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Palette className="w-5 h-5 text-orange-600" />
            <span>Accessibility</span>
          </button>

          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">
                  Admin
                </p>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {/* Compliance Center */}
              <button
                onClick={() => setShowComplianceCenter(true)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Shield className="w-5 h-5 text-red-600" />
                <span>Compliance Center</span>
              </button>
            </>
          )}
        </nav>

        {/* Storage Usage */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Storage</span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(user.storageUsed)} of {formatFileSize(user.storageLimit)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((user.storageUsed / user.storageLimit) * 100, 100)}%`
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {Math.round((user.storageUsed / user.storageLimit) * 100)}% used
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          {!isEncryptionEnabled && (
            <button
              onClick={onEncryptionSetup}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Shield className="w-5 h-5" />
              <span>Enable Encryption</span>
            </button>
          )}
          
          {bottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </motion.div>

      {/* Workspace Manager */}
      <WorkspaceManager
        isOpen={showWorkspaceManager}
        onClose={() => setShowWorkspaceManager(false)}
        onSelectWorkspace={() => setShowWorkspaceManager(false)}
      />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      {/* Compliance Center */}
      <ComplianceCenter
        isOpen={showComplianceCenter}
        onClose={() => setShowComplianceCenter(false)}
      />

      {/* Achievement System */}
      {user && (
        <AchievementSystem
          user={user}
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Activity Calendar */}
      <ActivityCalendar
        isOpen={showActivityCalendar}
        onClose={() => setShowActivityCalendar(false)}
      />

      {/* Cloud Sync Manager */}
      <CloudSyncManager
        isOpen={showCloudSync}
        onClose={() => setShowCloudSync(false)}
      />

      {/* API Key Manager */}
      <ApiKeyManager
        isOpen={showApiKeyManager}
        onClose={() => setShowApiKeyManager(false)}
      />

      {/* Webhook Manager */}
      <WebhookManager
        isOpen={showWebhookManager}
        onClose={() => setShowWebhookManager(false)}
      />

      {/* OAuth Integrations */}
      <OAuthIntegrations
        isOpen={showOAuthIntegrations}
        onClose={() => setShowOAuthIntegrations(false)}
      />

      {/* Color Blind Mode */}
      <ColorBlindMode
        isOpen={showColorBlindMode}
        onClose={() => setShowColorBlindMode(false)}
        onApply={handleApplyColorMode}
      />
    </>
  );
};

export default Sidebar;