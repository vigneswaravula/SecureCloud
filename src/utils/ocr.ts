import Tesseract from 'tesseract.js';
import { OCRResult } from '../types';

export class OCRService {
  private static worker: Tesseract.Worker | null = null;

  /**
   * Initialize OCR worker
   */
  static async initialize(): Promise<void> {
    if (this.worker) return;

    try {
      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      throw error;
    }
  }

  /**
   * Extract text from image file
   */
  static async extractText(file: File): Promise<OCRResult> {
    await this.initialize();
    
    if (!this.worker) {
      throw new Error('OCR worker not initialized');
    }

    try {
      const { data } = await this.worker.recognize(file);
      
      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        })),
        blocks: data.blocks.map(block => ({
          text: block.text,
          confidence: block.confidence,
          bbox: block.bbox
        }))
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw error;
    }
  }

  /**
   * Extract text from PDF (convert to images first)
   */
  static async extractTextFromPDF(file: File): Promise<OCRResult[]> {
    // This would require PDF.js to convert PDF pages to images
    // For now, return empty result
    console.warn('PDF OCR not implemented yet');
    return [];
  }

  /**
   * Batch process multiple files
   */
  static async batchExtractText(files: File[]): Promise<Map<string, OCRResult>> {
    const results = new Map<string, OCRResult>();
    
    for (const file of files) {
      try {
        if (this.isImageFile(file)) {
          const result = await this.extractText(file);
          results.set(file.name, result);
        }
      } catch (error) {
        console.error(`OCR failed for ${file.name}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Check if file is an image
   */
  private static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Check if file is a PDF
   */
  private static isPDFFile(file: File): boolean {
    return file.type === 'application/pdf';
  }

  /**
   * Get supported file types
   */
  static getSupportedTypes(): string[] {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
  }

  /**
   * Check if file type is supported
   */
  static isSupported(file: File): boolean {
    return this.getSupportedTypes().includes(file.type);
  }

  /**
   * Cleanup worker
   */
  static async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  /**
   * Extract text with language detection
   */
  static async extractTextWithLanguage(file: File, languages: string[] = ['eng']): Promise<OCRResult> {
    if (this.worker) {
      await this.worker.terminate();
    }

    try {
      this.worker = await Tesseract.createWorker(languages, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const { data } = await this.worker.recognize(file);
      
      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        })),
        blocks: data.blocks.map(block => ({
          text: block.text,
          confidence: block.confidence,
          bbox: block.bbox
        }))
      };
    } catch (error) {
      console.error('OCR with language detection failed:', error);
      throw error;
    }
  }

  /**
   * Search text in OCR results
   */
  static searchInOCRResult(result: OCRResult, query: string): Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }> {
    const searchTerm = query.toLowerCase();
    const matches: Array<{
      text: string;
      confidence: number;
      bbox: { x0: number; y0: number; x1: number; y1: number };
    }> = [];

    result.words.forEach(word => {
      if (word.text.toLowerCase().includes(searchTerm)) {
        matches.push(word);
      }
    });

    return matches;
  }
}