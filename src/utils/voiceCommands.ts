import { VoiceCommand } from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class VoiceCommandService {
  private recognition: any = null;
  private isListening = false;
  private commands: Map<string, VoiceCommand> = new Map();
  private onCommandCallback: ((command: VoiceCommand, parameters: any) => void) | null = null;

  constructor() {
    this.initializeSpeechRecognition();
    this.setupDefaultCommands();
  }

  private initializeSpeechRecognition() {
    if (!this.isSupported()) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Voice command:', transcript);
      this.processCommand(transcript);
    };
  }

  private setupDefaultCommands() {
    const defaultCommands: VoiceCommand[] = [
      {
        id: 'upload_files',
        command: 'upload files',
        action: 'upload',
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'create_folder',
        command: 'create folder',
        action: 'create_folder',
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'search_files',
        command: 'search for *',
        action: 'search',
        parameters: { query: '*' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'go_to_starred',
        command: 'go to starred',
        action: 'navigate',
        parameters: { route: '/starred' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'go_to_recent',
        command: 'go to recent',
        action: 'navigate',
        parameters: { route: '/recent' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'go_to_trash',
        command: 'go to trash',
        action: 'navigate',
        parameters: { route: '/trash' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'go_to_dashboard',
        command: 'go to dashboard',
        action: 'navigate',
        parameters: { route: '/dashboard' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'delete_file',
        command: 'delete *',
        action: 'delete',
        parameters: { filename: '*' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'star_file',
        command: 'star *',
        action: 'star',
        parameters: { filename: '*' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'share_file',
        command: 'share *',
        action: 'share',
        parameters: { filename: '*' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'rename_file',
        command: 'rename * to *',
        action: 'rename',
        parameters: { oldName: '*', newName: '*' },
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'show_help',
        command: 'help',
        action: 'help',
        isCustom: false,
        userId: 'system'
      },
      {
        id: 'stop_listening',
        command: 'stop listening',
        action: 'stop_listening',
        isCustom: false,
        userId: 'system'
      }
    ];

    defaultCommands.forEach(cmd => {
      this.commands.set(cmd.command, cmd);
    });
  }

  private processCommand(transcript: string) {
    // Find matching command
    let matchedCommand: VoiceCommand | null = null;
    let extractedParams: any = {};

    for (const [pattern, command] of this.commands) {
      const match = this.matchPattern(pattern, transcript);
      if (match.isMatch) {
        matchedCommand = command;
        extractedParams = { ...command.parameters, ...match.parameters };
        break;
      }
    }

    if (matchedCommand) {
      console.log('Matched command:', matchedCommand.action, extractedParams);
      if (this.onCommandCallback) {
        this.onCommandCallback(matchedCommand, extractedParams);
      }
    } else {
      console.log('No matching command found for:', transcript);
      // Try fuzzy matching
      const fuzzyMatch = this.findFuzzyMatch(transcript);
      if (fuzzyMatch && this.onCommandCallback) {
        this.onCommandCallback(fuzzyMatch.command, fuzzyMatch.parameters);
      }
    }
  }

  private matchPattern(pattern: string, transcript: string): { isMatch: boolean; parameters: any } {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '(.+)')
      .replace(/\s+/g, '\\s+');
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    const match = transcript.match(regex);

    if (match) {
      const parameters: any = {};
      const wildcards = pattern.match(/\*/g);
      
      if (wildcards && match.length > 1) {
        wildcards.forEach((_, index) => {
          const paramValue = match[index + 1].trim();
          
          // Determine parameter name based on context
          if (pattern.includes('search for *')) {
            parameters.query = paramValue;
          } else if (pattern.includes('delete *')) {
            parameters.filename = paramValue;
          } else if (pattern.includes('star *')) {
            parameters.filename = paramValue;
          } else if (pattern.includes('share *')) {
            parameters.filename = paramValue;
          } else if (pattern.includes('rename * to *')) {
            if (index === 0) parameters.oldName = paramValue;
            if (index === 1) parameters.newName = paramValue;
          } else {
            parameters[`param${index}`] = paramValue;
          }
        });
      }

      return { isMatch: true, parameters };
    }

    return { isMatch: false, parameters: {} };
  }

  private findFuzzyMatch(transcript: string): { command: VoiceCommand; parameters: any } | null {
    let bestMatch: { command: VoiceCommand; parameters: any; score: number } | null = null;

    for (const [pattern, command] of this.commands) {
      const score = this.calculateSimilarity(pattern.replace(/\*/g, ''), transcript);
      if (score > 0.6 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { command, parameters: {}, score };
      }
    }

    return bestMatch;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Public methods
  startListening() {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening');
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  onCommand(callback: (command: VoiceCommand, parameters: any) => void) {
    this.onCommandCallback = callback;
  }

  addCustomCommand(command: VoiceCommand) {
    this.commands.set(command.command, command);
  }

  removeCustomCommand(commandId: string) {
    for (const [pattern, command] of this.commands) {
      if (command.id === commandId) {
        this.commands.delete(pattern);
        break;
      }
    }
  }

  getAvailableCommands(): VoiceCommand[] {
    return Array.from(this.commands.values());
  }

  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Voice authentication
  async authenticateVoice(expectedPhrase: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.recognition) {
        resolve(false);
        return;
      }

      const tempRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      tempRecognition.continuous = false;
      tempRecognition.interimResults = false;
      tempRecognition.lang = 'en-US';

      tempRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        const expected = expectedPhrase.toLowerCase();
        const similarity = this.calculateSimilarity(expected, transcript);
        resolve(similarity > 0.8);
      };

      tempRecognition.onerror = () => {
        resolve(false);
      };

      tempRecognition.start();
    });
  }
}