const CryptoJS = require('crypto-js');

class EncryptionService {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY;
    
    if (!this.encryptionKey || this.encryptionKey.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
    }
  }

  /**
   * Encrypt text using AES-256
   * @param {string} text
   * @returns {string}
   */
  encrypt(text) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Text must be a non-empty string');
      }

      const encrypted = CryptoJS.AES.encrypt(text, this.encryptionKey, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt text using AES-256
   * @param {string} encryptedText
   * @returns {string}
   */
  decrypt(encryptedText) {
    try {
      if (!encryptedText || typeof encryptedText !== 'string') {
        throw new Error('Encrypted text must be a non-empty string');
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Failed to decrypt data - invalid encrypted text or key');
      }

      return decryptedText;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypt note data (title and content)
   * @param {Object} noteData
   * @returns {Object}
   */
  encryptNote(noteData) {
    try {
      return {
        title: this.encrypt(noteData.title),
        content: this.encrypt(noteData.content)
      };
    } catch (error) {
      console.error('Note encryption error:', error);
      throw new Error('Failed to encrypt note data');
    }
  }

  /**
   * Decrypt note data (title and content)
   * @param {Object} encryptedNoteData
   * @returns {Object}
   */
  decryptNote(encryptedNoteData) {
    try {
      return {
        title: this.decrypt(encryptedNoteData.title),
        content: this.decrypt(encryptedNoteData.content)
      };
    } catch (error) {
      console.error('Note decryption error:', error);
      throw new Error('Failed to decrypt note data');
    }
  }
}

module.exports = new EncryptionService();