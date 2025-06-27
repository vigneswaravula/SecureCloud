import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { EncryptionProvider } from './hooks/useEncryption';
import { WebSocketProvider } from './hooks/useWebSocket';
import { VoiceCommandsProvider } from './hooks/useVoiceCommands';
import { FilesProvider } from './hooks/useFiles';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import StarredPage from './pages/StarredPage';
import RecentPage from './pages/RecentPage';
import TrashPage from './pages/TrashPage';
import AdminPage from './pages/AdminPage';
import SharedPage from './pages/SharedPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import VoiceControl from './components/VoiceCommands/VoiceControl';
import { useState, useEffect } from 'react';
import UploadModal from './components/Files/UploadModal';
import CreateFolderModal from './components/Files/CreateFolderModal';
import EncryptionSetup from './components/Security/EncryptionSetup';
import PublicSharePage from './components/Files/PublicSharePage';
import { useFiles } from './hooks/useFiles';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isEncryptionSetupOpen, setIsEncryptionSetupOpen] = useState(false);

  // Listen for voice command events
  useEffect(() => {
    const handleVoiceUpload = () => setIsUploadModalOpen(true);
    const handleVoiceCreateFolder = () => setIsCreateFolderModalOpen(true);
    const handleVoiceSearch = (event: CustomEvent) => {
      // Handle voice search
      console.log('Voice search:', event.detail.query);
    };

    window.addEventListener('voice-upload', handleVoiceUpload);
    window.addEventListener('voice-create-folder', handleVoiceCreateFolder);
    window.addEventListener('voice-search', handleVoiceSearch as EventListener);

    return () => {
      window.removeEventListener('voice-upload', handleVoiceUpload);
      window.removeEventListener('voice-create-folder', handleVoiceCreateFolder);
      window.removeEventListener('voice-search', handleVoiceSearch as EventListener);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SecureCloud...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <EncryptionProvider>
      <WebSocketProvider>
        <FilesProvider>
          <VoiceCommandsProvider>
            <AppWithProviders 
              isUploadModalOpen={isUploadModalOpen}
              setIsUploadModalOpen={setIsUploadModalOpen}
              isCreateFolderModalOpen={isCreateFolderModalOpen}
              setIsCreateFolderModalOpen={setIsCreateFolderModalOpen}
              isEncryptionSetupOpen={isEncryptionSetupOpen}
              setIsEncryptionSetupOpen={setIsEncryptionSetupOpen}
            />
          </VoiceCommandsProvider>
        </FilesProvider>
      </WebSocketProvider>
    </EncryptionProvider>
  );
};

const AppWithProviders = ({ 
  isUploadModalOpen, 
  setIsUploadModalOpen, 
  isCreateFolderModalOpen, 
  setIsCreateFolderModalOpen,
  isEncryptionSetupOpen,
  setIsEncryptionSetupOpen
}: {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isCreateFolderModalOpen: boolean;
  setIsCreateFolderModalOpen: (open: boolean) => void;
  isEncryptionSetupOpen: boolean;
  setIsEncryptionSetupOpen: (open: boolean) => void;
}) => {
  const { user } = useAuth();
  const { uploadFile } = useFiles();

  const handleUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        await uploadFile(file);
      }
      setIsUploadModalOpen(false);
    } catch (error) {
      // Error handled in useFiles hook
    }
  };

  const handleCreateFolder = () => {
    setIsCreateFolderModalOpen(true);
  };

  const handleEncryptionSetup = () => {
    setIsEncryptionSetupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onEncryptionSetup={handleEncryptionSetup} />
      <div className="ml-70">
        <Header 
          onUpload={() => setIsUploadModalOpen(true)} 
          onCreateFolder={handleCreateFolder} 
        />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/starred" element={<StarredPage />} />
            <Route path="/recent" element={<RecentPage />} />
            <Route path="/shared" element={<SharedPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/share/:shareId" element={<PublicSharePage />} />
            {user?.role === 'admin' && (
              <Route path="/admin" element={<AdminPage />} />
            )}
          </Routes>
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />

      <EncryptionSetup
        isOpen={isEncryptionSetupOpen}
        onClose={() => setIsEncryptionSetupOpen(false)}
      />

      {/* Voice Control */}
      <VoiceControl />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;