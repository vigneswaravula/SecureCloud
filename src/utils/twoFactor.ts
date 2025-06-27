import QRCode from 'qrcode';
import { TwoFactorSetup } from '../types';

export class TwoFactorService {
  /**
   * Generate 2FA secret and QR code using Web Crypto API
   */
  static async generateSecret(userEmail: string, serviceName: string = 'SecureCloud'): Promise<TwoFactorSetup> {
    // Generate a random 32-byte secret
    const secretBytes = new Uint8Array(32);
    crypto.getRandomValues(secretBytes);
    
    // Convert to base32 (simplified implementation)
    const secret = this.arrayToBase32(secretBytes);
    
    // Create TOTP URL
    const totpUrl = `otpauth://totp/${encodeURIComponent(serviceName)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(serviceName)}`;
    
    const qrCode = await QRCode.toDataURL(totpUrl);
    const backupCodes = this.generateBackupCodes();

    return {
      secret,
      qrCode,
      backupCodes
    };
  }

  /**
   * Verify 2FA token using Web Crypto API
   */
  static async verifyToken(token: string, secret: string, window: number = 1): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const currentTimeSlot = Math.floor(now / timeStep);

    // Check current time slot and adjacent slots within the window
    for (let i = -window; i <= window; i++) {
      const timeSlot = currentTimeSlot + i;
      const expectedToken = await this.generateTOTP(secret, timeSlot);
      
      if (expectedToken === token) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate TOTP using Web Crypto API
   */
  static async generateTOTP(secret: string, timeSlot?: number): Promise<string> {
    const time = timeSlot || Math.floor(Date.now() / 1000 / 30);
    
    // Convert secret from base32 to bytes
    const secretBytes = this.base32ToArray(secret);
    
    // Convert time to 8-byte array (big-endian)
    const timeBytes = new ArrayBuffer(8);
    const timeView = new DataView(timeBytes);
    timeView.setUint32(4, time, false); // big-endian
    
    // Import the secret as an HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    // Generate HMAC
    const signature = await crypto.subtle.sign('HMAC', key, timeBytes);
    const signatureArray = new Uint8Array(signature);
    
    // Dynamic truncation
    const offset = signatureArray[signatureArray.length - 1] & 0x0f;
    const truncated = (
      ((signatureArray[offset] & 0x7f) << 24) |
      ((signatureArray[offset + 1] & 0xff) << 16) |
      ((signatureArray[offset + 2] & 0xff) << 8) |
      (signatureArray[offset + 3] & 0xff)
    ) % 1000000;
    
    return truncated.toString().padStart(6, '0');
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      
      // Convert to alphanumeric string
      let code = '';
      for (const byte of bytes) {
        code += byte.toString(36).toUpperCase();
      }
      
      codes.push(code.substring(0, 8));
    }
    
    return codes;
  }

  /**
   * Verify backup code
   */
  static verifyBackupCode(code: string, validCodes: string[]): boolean {
    return validCodes.includes(code.toUpperCase());
  }

  /**
   * Generate recovery codes after backup code is used
   */
  static regenerateBackupCodes(usedCode: string, currentCodes: string[]): string[] {
    const remainingCodes = currentCodes.filter(code => code !== usedCode.toUpperCase());
    
    // If less than 3 codes remaining, generate new set
    if (remainingCodes.length < 3) {
      return this.generateBackupCodes();
    }
    
    return remainingCodes;
  }

  /**
   * Get current TOTP token (for testing)
   */
  static async getCurrentToken(secret: string): Promise<string> {
    return this.generateTOTP(secret);
  }

  /**
   * Validate 2FA setup
   */
  static async validateSetup(secret: string, token: string): Promise<boolean> {
    return this.verifyToken(token, secret);
  }

  /**
   * Get remaining time for current TOTP
   */
  static getRemainingTime(): number {
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 30; // TOTP time step in seconds
    return timeStep - (now % timeStep);
  }

  /**
   * Check if 2FA is required for action
   */
  static isRequired(action: string, userSettings: any): boolean {
    const requiresAuth = [
      'delete_file',
      'share_file',
      'change_password',
      'disable_2fa',
      'admin_action'
    ];

    return requiresAuth.includes(action) && userSettings.twoFactorEnabled;
  }

  /**
   * Format backup code for display
   */
  static formatBackupCode(code: string): string {
    // Format as XXXX-XXXX for better readability
    return code.replace(/(.{4})/g, '$1-').slice(0, -1);
  }

  /**
   * Validate backup code format
   */
  static isValidBackupCodeFormat(code: string): boolean {
    const cleanCode = code.replace(/-/g, '').toUpperCase();
    return /^[A-Z0-9]{8}$/.test(cleanCode);
  }

  /**
   * Convert byte array to base32 string
   */
  private static arrayToBase32(bytes: Uint8Array): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;

      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }

    return result;
  }

  /**
   * Convert base32 string to byte array
   */
  private static base32ToArray(base32: string): Uint8Array {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanInput = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
    
    let bits = 0;
    let value = 0;
    const result: number[] = [];

    for (const char of cleanInput) {
      const index = alphabet.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        result.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return new Uint8Array(result);
  }
}