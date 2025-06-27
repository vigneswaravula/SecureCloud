import { FileVersion, VersionChange, VersionComparison } from '../types';

export class VersionAnalysisService {
  private static readonly AI_API_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT || 'http://localhost:3001/api/ai';

  /**
   * Generate AI summary for a file version
   */
  static async generateVersionSummary(
    file: File,
    previousVersion?: FileVersion,
    changelog?: string
  ): Promise<{ summary: string; changes: VersionChange[] }> {
    try {
      // In a real implementation, this would send the file to an AI service
      const response = await fetch(`${this.AI_API_ENDPOINT}/analyze-version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          changelog,
          previousVersion: previousVersion ? {
            size: previousVersion.size,
            changelog: previousVersion.changelog,
            changes: previousVersion.changes
          } : null
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('AI version analysis failed:', error);
      return this.generateFallbackSummary(file, previousVersion, changelog);
    }
  }

  /**
   * Compare two file versions using AI
   */
  static async compareVersions(
    fileId: string,
    version1: FileVersion,
    version2: FileVersion
  ): Promise<VersionComparison> {
    try {
      const response = await fetch(`${this.AI_API_ENDPOINT}/compare-versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          fileId,
          version1: {
            id: version1.id,
            version: version1.version,
            size: version1.size,
            changelog: version1.changelog,
            changes: version1.changes,
            createdAt: version1.createdAt
          },
          version2: {
            id: version2.id,
            version: version2.version,
            size: version2.size,
            changelog: version2.changelog,
            changes: version2.changes,
            createdAt: version2.createdAt
          }
        })
      });

      if (!response.ok) {
        throw new Error('Version comparison failed');
      }

      return await response.json();
    } catch (error) {
      console.error('AI version comparison failed:', error);
      return this.generateFallbackComparison(fileId, version1, version2);
    }
  }

  /**
   * Detect changes between file versions
   */
  static async detectChanges(
    currentFile: File,
    previousVersion?: FileVersion
  ): Promise<VersionChange[]> {
    const changes: VersionChange[] = [];

    // Size comparison
    if (previousVersion) {
      const sizeDiff = currentFile.size - previousVersion.size;
      const sizeChangePercent = Math.abs(sizeDiff) / previousVersion.size;

      if (sizeChangePercent > 0.1) { // More than 10% change
        changes.push({
          type: 'content',
          description: sizeDiff > 0 
            ? `File size increased by ${this.formatBytes(sizeDiff)}`
            : `File size decreased by ${this.formatBytes(Math.abs(sizeDiff))}`,
          confidence: 0.95,
          details: {
            previousSize: previousVersion.size,
            currentSize: currentFile.size,
            difference: sizeDiff
          }
        });
      }
    }

    // File type analysis
    if (currentFile.type.includes('document') || currentFile.type.includes('text')) {
      changes.push(...await this.analyzeDocumentChanges(currentFile, previousVersion));
    } else if (currentFile.type.startsWith('image/')) {
      changes.push(...await this.analyzeImageChanges(currentFile, previousVersion));
    }

    return changes;
  }

  /**
   * Generate version timeline data
   */
  static generateVersionTimeline(versions: FileVersion[]): Array<{
    version: FileVersion;
    position: { x: number; y: number };
    connections: string[];
  }> {
    const timeline = versions.map((version, index) => ({
      version,
      position: {
        x: index * 200,
        y: 100
      },
      connections: version.parentVersionId ? [version.parentVersionId] : []
    }));

    return timeline;
  }

  /**
   * Calculate version similarity score
   */
  static calculateSimilarity(version1: FileVersion, version2: FileVersion): number {
    let similarity = 1.0;

    // Size similarity
    const sizeDiff = Math.abs(version1.size - version2.size);
    const maxSize = Math.max(version1.size, version2.size);
    const sizeSimilarity = 1 - (sizeDiff / maxSize);
    similarity *= sizeSimilarity * 0.3;

    // Change type similarity
    const changes1 = version1.changes.map(c => c.type);
    const changes2 = version2.changes.map(c => c.type);
    const commonChanges = changes1.filter(c => changes2.includes(c));
    const changeSimilarity = commonChanges.length / Math.max(changes1.length, changes2.length, 1);
    similarity += changeSimilarity * 0.4;

    // Time proximity
    const timeDiff = Math.abs(
      new Date(version1.createdAt).getTime() - new Date(version2.createdAt).getTime()
    );
    const maxTimeDiff = 30 * 24 * 60 * 60 * 1000; // 30 days
    const timeSimilarity = Math.max(0, 1 - (timeDiff / maxTimeDiff));
    similarity += timeSimilarity * 0.3;

    return Math.min(1.0, Math.max(0.0, similarity));
  }

  /**
   * Fallback summary generation when AI is unavailable
   */
  private static generateFallbackSummary(
    file: File,
    previousVersion?: FileVersion,
    changelog?: string
  ): { summary: string; changes: VersionChange[] } {
    const changes: VersionChange[] = [];
    let summary = '';

    if (!previousVersion) {
      summary = `Initial version of ${file.name} created.`;
      changes.push({
        type: 'content',
        description: 'File created',
        confidence: 1.0
      });
    } else {
      const sizeDiff = file.size - previousVersion.size;
      
      if (sizeDiff > 0) {
        summary = `File updated with additional content. Size increased by ${this.formatBytes(sizeDiff)}.`;
        changes.push({
          type: 'content',
          description: `Content added (+${this.formatBytes(sizeDiff)})`,
          confidence: 0.8
        });
      } else if (sizeDiff < 0) {
        summary = `File updated with content removed. Size decreased by ${this.formatBytes(Math.abs(sizeDiff))}.`;
        changes.push({
          type: 'content',
          description: `Content removed (-${this.formatBytes(Math.abs(sizeDiff))})`,
          confidence: 0.8
        });
      } else {
        summary = 'File updated with minor changes.';
        changes.push({
          type: 'metadata',
          description: 'Minor updates',
          confidence: 0.6
        });
      }

      if (changelog) {
        summary += ` ${changelog}`;
      }
    }

    return { summary, changes };
  }

  /**
   * Fallback version comparison
   */
  private static generateFallbackComparison(
    fileId: string,
    version1: FileVersion,
    version2: FileVersion
  ): VersionComparison {
    const [olderVersion, newerVersion] = version1.version < version2.version 
      ? [version1, version2] 
      : [version2, version1];

    const sizeDiff = newerVersion.size - olderVersion.size;
    const similarity = this.calculateSimilarity(version1, version2);

    const changes: VersionChange[] = [];

    if (sizeDiff !== 0) {
      changes.push({
        type: 'content',
        description: sizeDiff > 0 
          ? `Content added (+${this.formatBytes(sizeDiff)})`
          : `Content removed (-${this.formatBytes(Math.abs(sizeDiff))})`,
        confidence: 0.8,
        details: { sizeDifference: sizeDiff }
      });
    }

    // Combine changes from both versions
    const allChanges = [...olderVersion.changes, ...newerVersion.changes];
    const uniqueChangeTypes = [...new Set(allChanges.map(c => c.type))];
    
    uniqueChangeTypes.forEach(type => {
      const typeChanges = allChanges.filter(c => c.type === type);
      if (typeChanges.length > 0) {
        changes.push({
          type: type as any,
          description: `${type} modifications detected`,
          confidence: 0.7,
          details: { changeCount: typeChanges.length }
        });
      }
    });

    let aiAnalysis = `Comparison between version ${olderVersion.version} and ${newerVersion.version}. `;
    
    if (similarity > 0.8) {
      aiAnalysis += 'The versions are very similar with minor changes.';
    } else if (similarity > 0.6) {
      aiAnalysis += 'The versions have moderate differences.';
    } else {
      aiAnalysis += 'The versions have significant differences.';
    }

    return {
      fileId,
      fromVersion: olderVersion.id,
      toVersion: newerVersion.id,
      similarity,
      aiAnalysis,
      changes
    };
  }

  /**
   * Analyze document-specific changes
   */
  private static async analyzeDocumentChanges(
    file: File,
    previousVersion?: FileVersion
  ): Promise<VersionChange[]> {
    const changes: VersionChange[] = [];

    // This would typically involve parsing the document content
    // For now, we'll use heuristics based on file properties

    if (file.type.includes('pdf')) {
      changes.push({
        type: 'content',
        description: 'PDF document updated',
        confidence: 0.7
      });
    } else if (file.type.includes('word') || file.type.includes('document')) {
      changes.push({
        type: 'content',
        description: 'Document content modified',
        confidence: 0.8
      });
    }

    return changes;
  }

  /**
   * Analyze image-specific changes
   */
  private static async analyzeImageChanges(
    file: File,
    previousVersion?: FileVersion
  ): Promise<VersionChange[]> {
    const changes: VersionChange[] = [];

    // Image analysis would typically involve computer vision
    // For now, we'll use basic heuristics

    if (previousVersion) {
      const sizeDiff = file.size - previousVersion.size;
      if (Math.abs(sizeDiff) > file.size * 0.1) {
        changes.push({
          type: 'content',
          description: 'Image content significantly modified',
          confidence: 0.75,
          details: { 
            compressionChange: sizeDiff < 0 ? 'increased' : 'decreased',
            qualityChange: sizeDiff > 0 ? 'improved' : 'reduced'
          }
        });
      }
    }

    return changes;
  }

  /**
   * Format bytes to human readable string
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Extract text content from file for analysis
   */
  private static async extractTextContent(file: File): Promise<string> {
    if (file.type.startsWith('text/')) {
      return await file.text();
    }
    
    // For other file types, we'd need specialized parsers
    // This is a simplified implementation
    return '';
  }

  /**
   * Generate change suggestions based on version history
   */
  static generateChangeSuggestions(versions: FileVersion[]): string[] {
    const suggestions: string[] = [];
    
    if (versions.length < 2) {
      return suggestions;
    }

    const recentVersions = versions.slice(0, 3);
    const hasFrequentChanges = recentVersions.every(v => 
      new Date().getTime() - new Date(v.createdAt).getTime() < 24 * 60 * 60 * 1000
    );

    if (hasFrequentChanges) {
      suggestions.push('Consider consolidating recent changes into a single version');
    }

    const hasLargeFiles = versions.some(v => v.size > 50 * 1024 * 1024);
    if (hasLargeFiles) {
      suggestions.push('Large file detected - consider compression or splitting');
    }

    const hasMultipleEditors = new Set(versions.map(v => v.createdBy)).size > 1;
    if (hasMultipleEditors) {
      suggestions.push('Multiple editors detected - ensure proper collaboration workflow');
    }

    return suggestions;
  }
}