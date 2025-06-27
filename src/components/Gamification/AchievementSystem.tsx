import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Crown,
  Flame,
  TrendingUp,
  Users,
  Shield,
  FileText,
  Share2,
  Upload,
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';
import { Achievement, User } from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface AchievementSystemProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ user, isOpen, onClose }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'storage' | 'collaboration' | 'security' | 'productivity' | 'social'>('all');
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAchievements();
    }
  }, [isOpen]);

  const loadAchievements = () => {
    // Mock user achievements
    const userAchievements: Achievement[] = [
      {
        id: 'first-upload',
        name: 'First Steps',
        description: 'Upload your first file',
        icon: '🎯',
        category: 'storage',
        points: 10,
        unlockedAt: '2024-01-01T00:00:00Z',
        rarity: 'common'
      },
      {
        id: 'file-organizer',
        name: 'File Organizer',
        description: 'Create 5 folders',
        icon: '📁',
        category: 'productivity',
        points: 25,
        unlockedAt: '2024-01-05T10:30:00Z',
        rarity: 'common'
      },
      {
        id: 'collaboration-starter',
        name: 'Team Player',
        description: 'Share your first file',
        icon: '🤝',
        category: 'collaboration',
        points: 15,
        unlockedAt: '2024-01-10T14:20:00Z',
        rarity: 'common'
      },
      {
        id: 'security-conscious',
        name: 'Security Expert',
        description: 'Enable two-factor authentication',
        icon: '🔐',
        category: 'security',
        points: 50,
        unlockedAt: '2024-01-12T09:15:00Z',
        rarity: 'rare'
      },
      {
        id: 'power-user',
        name: 'Power User',
        description: 'Upload 100 files',
        icon: '⚡',
        category: 'storage',
        points: 100,
        unlockedAt: '2024-01-15T16:45:00Z',
        rarity: 'epic'
      }
    ];

    // Mock available achievements (not yet unlocked)
    const availableAchievements: Achievement[] = [
      {
        id: 'storage-master',
        name: 'Storage Master',
        description: 'Upload 1000 files',
        icon: '👑',
        category: 'storage',
        points: 500,
        unlockedAt: '',
        rarity: 'legendary'
      },
      {
        id: 'collaboration-expert',
        name: 'Collaboration Expert',
        description: 'Collaborate on 50 files',
        icon: '🌟',
        category: 'collaboration',
        points: 200,
        unlockedAt: '',
        rarity: 'epic'
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Maintain a 30-day activity streak',
        icon: '🔥',
        category: 'productivity',
        points: 150,
        unlockedAt: '',
        rarity: 'rare'
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        description: 'Share files with 20 different people',
        icon: '🦋',
        category: 'social',
        points: 75,
        unlockedAt: '',
        rarity: 'rare'
      },
      {
        id: 'encryption-advocate',
        name: 'Encryption Advocate',
        description: 'Encrypt 100 files',
        icon: '🛡️',
        category: 'security',
        points: 300,
        unlockedAt: '',
        rarity: 'epic'
      }
    ];

    setAchievements(userAchievements);
    setAvailableAchievements(availableAchievements);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'rare':
        return 'text-blue-600 bg-blue-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'storage':
        return <Upload className="w-4 h-4" />;
      case 'collaboration':
        return <Users className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'productivity':
        return <Target className="w-4 h-4" />;
      case 'social':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getNextLevelXP = (level: number) => {
    return level * 100;
  };

  const getCurrentLevelProgress = () => {
    if (!user || user.xp === undefined || user.level === undefined) {
      return 0;
    }
    
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = getNextLevelXP(user.level);
    const progressXP = user.xp - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    return (progressXP / requiredXP) * 100;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const filteredAvailableAchievements = selectedCategory === 'all'
    ? availableAchievements
    : availableAchievements.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'storage', label: 'Storage', icon: Upload },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'productivity', label: 'Productivity', icon: Target },
    { id: 'social', label: 'Social', icon: Share2 }
  ];

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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Achievements</h2>
                <p className="text-blue-100">Track your progress and unlock rewards</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-blue-100">Level</span>
              </div>
              <p className="text-2xl font-bold">{user?.level || 0}</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-blue-100">XP</span>
              </div>
              <p className="text-2xl font-bold">{(user?.xp || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="text-sm text-blue-100">Streak</span>
              </div>
              <p className="text-2xl font-bold">{user?.streak || 0} days</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-blue-100">Achievements</span>
              </div>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
              <span>Level {user?.level || 0}</span>
              <span>Level {(user?.level || 0) + 1}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getCurrentLevelProgress()}%` }}
              />
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {(user?.xp || 0) - ((user?.level || 1) - 1) * 100} / {getNextLevelXP((user?.level || 1)) - ((user?.level || 1) - 1) * 100} XP
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="p-6 space-y-8">
            {/* Unlocked Achievements */}
            {filteredAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unlocked Achievements ({filteredAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-700">+{achievement.points} XP</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(achievement.unlockedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Achievements */}
            {filteredAvailableAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Achievements ({filteredAvailableAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAvailableAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-700">{achievement.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-500">+{achievement.points} XP</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(achievement.category)}
                              <span className="text-xs text-gray-500 capitalize">{achievement.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAchievements.length === 0 && filteredAvailableAchievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements in this category</h3>
                <p className="text-gray-600">
                  Try selecting a different category to see available achievements.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New Achievement Notification */}
        <AnimatePresence>
          {showNewAchievement && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-lg max-w-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{showNewAchievement.icon}</div>
                <div>
                  <h4 className="font-semibold">Achievement Unlocked!</h4>
                  <p className="text-sm opacity-90">{showNewAchievement.name}</p>
                  <p className="text-xs opacity-75">+{showNewAchievement.points} XP</p>
                </div>
                <button
                  onClick={() => setShowNewAchievement(null)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AchievementSystem;