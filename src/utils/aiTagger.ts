import { AITagResult } from '../types';

export class AITaggerService {
  private static readonly API_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT || 'http://localhost:3001/api/ai';

  /**
   * Generate tags for file using AI
   */
  static async generateTags(file: File): Promise<AITagResult> {
    try {
      // For images, analyze visual content
      if (file.type.startsWith('image/')) {
        return await this.analyzeImage(file);
      }
      
      // For text files, analyze content
      if (file.type.startsWith('text/') || file.type.includes('document')) {
        return await this.analyzeDocument(file);
      }

      // For other files, use filename and metadata
      return await this.analyzeMetadata(file);
    } catch (error) {
      console.error('AI tagging failed:', error);
      return {
        tags: [],
        confidence: 0,
        categories: []
      };
    }
  }

  /**
   * Analyze image content
   */
  private static async analyzeImage(file: File): Promise<AITagResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const response = await fetch(`${this.API_ENDPOINT}/analyze-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Image analysis failed');
      }

      return await response.json();
    } catch (error) {
      // Fallback to basic image analysis
      return this.basicImageAnalysis(file);
    }
  }

  /**
   * Analyze document content
   */
  private static async analyzeDocument(file: File): Promise<AITagResult> {
    const text = await this.extractTextFromFile(file);
    
    try {
      const response = await fetch(`${this.API_ENDPOINT}/analyze-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Document analysis failed');
      }

      return await response.json();
    } catch (error) {
      // Fallback to basic text analysis
      return this.basicTextAnalysis(text);
    }
  }

  /**
   * Analyze file metadata
   */
  private static async analyzeMetadata(file: File): Promise<AITagResult> {
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };

    try {
      const response = await fetch(`${this.API_ENDPOINT}/analyze-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ metadata })
      });

      if (!response.ok) {
        throw new Error('Metadata analysis failed');
      }

      return await response.json();
    } catch (error) {
      // Fallback to basic metadata analysis
      return this.basicMetadataAnalysis(file);
    }
  }

  /**
   * Basic image analysis fallback
   */
  private static basicImageAnalysis(file: File): AITagResult {
    const tags: string[] = ['image'];
    const categories: Array<{ category: string; confidence: number }> = [
      { category: 'media', confidence: 1.0 }
    ];

    // Add tags based on file type
    if (file.type.includes('jpeg') || file.type.includes('jpg')) {
      tags.push('photo', 'jpeg');
    } else if (file.type.includes('png')) {
      tags.push('png', 'graphics');
    } else if (file.type.includes('gif')) {
      tags.push('gif', 'animation');
    }

    // Add tags based on file size
    if (file.size > 5 * 1024 * 1024) {
      tags.push('high-resolution');
    }

    return {
      tags,
      confidence: 0.7,
      categories
    };
  }

  /**
   * Basic text analysis fallback
   */
  private static basicTextAnalysis(text: string): AITagResult {
    const tags: string[] = ['document', 'text'];
    const categories: Array<{ category: string; confidence: number }> = [
      { category: 'document', confidence: 1.0 }
    ];

    // Simple keyword extraction
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = new Map<string, number>();

    words.forEach(word => {
      if (word.length > 3) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    // Get most frequent words as tags
    const sortedWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    tags.push(...sortedWords);

    return {
      tags,
      confidence: 0.6,
      categories
    };
  }

  /**
   * Basic metadata analysis fallback
   */
  private static basicMetadataAnalysis(file: File): AITagResult {
    const tags: string[] = [];
    const categories: Array<{ category: string; confidence: number }> = [];

    // Extract tags from filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const nameParts = nameWithoutExt.split(/[-_\s]+/);
    tags.push(...nameParts.filter(part => part.length > 2));

    // Add category based on file type
    if (file.type.startsWith('image/')) {
      categories.push({ category: 'media', confidence: 1.0 });
      tags.push('image');
    } else if (file.type.startsWith('video/')) {
      categories.push({ category: 'media', confidence: 1.0 });
      tags.push('video');
    } else if (file.type.startsWith('audio/')) {
      categories.push({ category: 'media', confidence: 1.0 });
      tags.push('audio');
    } else if (file.type.includes('document') || file.type.includes('pdf')) {
      categories.push({ category: 'document', confidence: 1.0 });
      tags.push('document');
    } else {
      categories.push({ category: 'file', confidence: 1.0 });
    }

    return {
      tags: [...new Set(tags)], // Remove duplicates
      confidence: 0.5,
      categories
    };
  }

  /**
   * Extract text from file
   */
  private static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(reader.error);
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Batch generate tags for multiple files
   */
  static async batchGenerateTags(files: File[]): Promise<Map<string, AITagResult>> {
    const results = new Map<string, AITagResult>();
    
    // Process files in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(async (file) => {
        try {
          const result = await this.generateTags(file);
          results.set(file.name, result);
        } catch (error) {
          console.error(`AI tagging failed for ${file.name}:`, error);
        }
      });
      
      await Promise.all(batchPromises);
    }
    
    return results;
  }

  /**
   * Search files by AI-generated tags
   */
  static searchByTags(files: Array<{ name: string; aiTags?: string[] }>, query: string): Array<{ name: string; aiTags?: string[] }> {
    const searchTerm = query.toLowerCase();
    
    return files.filter(file => {
      if (!file.aiTags) return false;
      
      return file.aiTags.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Get tag suggestions based on existing tags
   */
  static async getTagSuggestions(existingTags: string[]): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_ENDPOINT}/tag-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ tags: existingTags })
      });

      if (!response.ok) {
        throw new Error('Tag suggestions failed');
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Tag suggestions failed:', error);
      return [];
    }
  }
}