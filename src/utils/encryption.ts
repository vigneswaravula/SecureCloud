import CryptoJS from 'crypto-js';
import { EncryptionKey, EncryptionMetadata } from '../types';

export class EncryptionService {
  private static readonly ALGORITHM = 'AES';
  private static readonly KEY_SIZE = 256;
  private static readonly IV_SIZE = 16;
  private static readonly SALT_SIZE = 32;
  private static readonly ITERATIONS = 100000;

  /**
   * Generate a secure encryption key from password
   */
  static generateKey(password: string, salt?: string): EncryptionKey {
    const saltBytes = salt ? CryptoJS.enc.Hex.parse(salt) : CryptoJS.lib.WordArray.random(this.SALT_SIZE);
    const key = CryptoJS.PBKDF2(password, saltBytes, {
      keySize: this.KEY_SIZE / 32,
      iterations: this.ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });

    return {
      key: password,
      salt: saltBytes.toString(CryptoJS.enc.Hex),
      iterations: this.ITERATIONS,
      derivedKey: key.toString(CryptoJS.enc.Hex)
    };
  }

  /**
   * Encrypt file data
   */
  static async encryptFile(file: File, encryptionKey: EncryptionKey): Promise<{
    encryptedData: Blob;
    metadata: EncryptionMetadata;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          
          const iv = CryptoJS.lib.WordArray.random(this.IV_SIZE);
          const key = CryptoJS.enc.Hex.parse(encryptionKey.derivedKey);
          
          const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });

          const encryptedBytes = this.wordArrayToUint8Array(encrypted.ciphertext);
          const encryptedBlob = new Blob([encryptedBytes], { type: 'application/octet-stream' });

          const metadata: EncryptionMetadata = {
            algorithm: 'AES-256-CBC',
            keyDerivation: 'PBKDF2',
            iv: iv.toString(CryptoJS.enc.Hex),
            salt: encryptionKey.salt,
            iterations: encryptionKey.iterations
          };

          resolve({
            encryptedData: encryptedBlob,
            metadata
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Decrypt file data
   */
  static async decryptFile(
    encryptedBlob: Blob, 
    encryptionKey: EncryptionKey, 
    metadata: EncryptionMetadata
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const encryptedWordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          
          const key = CryptoJS.enc.Hex.parse(encryptionKey.derivedKey);
          const iv = CryptoJS.enc.Hex.parse(metadata.iv);
          
          const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encryptedWordArray } as any,
            key,
            {
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
            }
          );

          const decryptedBytes = this.wordArrayToUint8Array(decrypted);
          const decryptedBlob = new Blob([decryptedBytes]);

          resolve(decryptedBlob);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(encryptedBlob);
    });
  }

  /**
   * Generate secure share token
   */
  static generateShareToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  }

  /**
   * Hash password for storage
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const saltBytes = salt ? CryptoJS.enc.Hex.parse(salt) : CryptoJS.lib.WordArray.random(32);
    const hash = CryptoJS.PBKDF2(password, saltBytes, {
      keySize: 256 / 32,
      iterations: 10000,
      hasher: CryptoJS.algo.SHA256
    });

    return {
      hash: hash.toString(CryptoJS.enc.Hex),
      salt: saltBytes.toString(CryptoJS.enc.Hex)
    };
  }

  /**
   * Verify password against hash
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const computed = this.hashPassword(password, salt);
    return computed.hash === hash;
  }

  /**
   * Generate file checksum
   */
  static async generateChecksum(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray);
          resolve(hash.toString(CryptoJS.enc.Hex));
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Convert WordArray to Uint8Array
   */
  private static wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    
    return u8;
  }

  /**
   * Generate RSA key pair for secure key exchange
   */
  static async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      return {
        publicKey: this.arrayBufferToBase64(publicKey),
        privateKey: this.arrayBufferToBase64(privateKey)
      };
    } catch (error) {
      throw new Error('Failed to generate key pair: ' + error);
    }
  }

  /**
   * Encrypt data with RSA public key
   */
  static async encryptWithPublicKey(data: string, publicKeyBase64: string): Promise<string> {
    try {
      const publicKeyBuffer = this.base64ToArrayBuffer(publicKeyBase64);
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );

      const dataBuffer = new TextEncoder().encode(data);
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        'RSA-OAEP',
        publicKey,
        dataBuffer
      );

      return this.arrayBufferToBase64(encryptedBuffer);
    } catch (error) {
      throw new Error('Failed to encrypt with public key: ' + error);
    }
  }

  /**
   * Decrypt data with RSA private key
   */
  static async decryptWithPrivateKey(encryptedData: string, privateKeyBase64: string): Promise<string> {
    try {
      const privateKeyBuffer = this.base64ToArrayBuffer(privateKeyBase64);
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
      );

      const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        'RSA-OAEP',
        privateKey,
        encryptedBuffer
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      throw new Error('Failed to decrypt with private key: ' + error);
    }
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}