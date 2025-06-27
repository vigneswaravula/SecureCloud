import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, Shield, Info } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: number) => void;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  onStrengthChange 
}) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const result = calculatePasswordStrength(password);
    setStrength(result.score);
    setFeedback(result.feedback);
    
    if (onStrengthChange) {
      onStrengthChange(result.score);
    }
  }, [password, onStrengthChange]);

  const calculatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
    if (!password) {
      return { score: 0, feedback: ['Password is required'] };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters long');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Complexity checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (!hasUppercase) {
      feedback.push('Add uppercase letters');
    } else {
      score += 1;
    }

    if (!hasLowercase) {
      feedback.push('Add lowercase letters');
    } else {
      score += 1;
    }

    if (!hasNumbers) {
      feedback.push('Add numbers');
    } else {
      score += 1;
    }

    if (!hasSpecialChars) {
      feedback.push('Add special characters');
    } else {
      score += 1;
    }

    // Check for common patterns
    if (/^123/.test(password) || /^abc/i.test(password) || /password/i.test(password)) {
      feedback.push('Avoid common patterns');
      score = Math.max(0, score - 2);
    }

    // Repeated characters
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeated characters');
      score = Math.max(0, score - 1);
    }

    // Normalize score to 0-4 range
    score = Math.min(4, Math.max(0, score));

    return { score, feedback };
  };

  const getStrengthLabel = (score: number): string => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthTextColor = (score: number): string => {
    switch (score) {
      case 0: return 'text-red-700';
      case 1: return 'text-orange-700';
      case 2: return 'text-yellow-700';
      case 3: return 'text-blue-700';
      case 4: return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  const getStrengthIcon = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return <X className="w-4 h-4 text-red-600" />;
      case 2:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 3:
        return <Info className="w-4 h-4 text-blue-600" />;
      case 4:
        return <Check className="w-4 h-4 text-green-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Password Strength:</span>
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${getStrengthTextColor(strength)}`}>
          {getStrengthIcon(strength)}
          <span>{getStrengthLabel(strength)}</span>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getStrengthColor(strength)}`}
          initial={{ width: '0%' }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {feedback.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1 mt-2">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center space-x-1">
              <span>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;