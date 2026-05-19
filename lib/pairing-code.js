/**
 * Sistema de Vinculación por Código de Dígitos
 * Genera y valida PINs para emparejar dispositivos con WhatsApp Bot
 */

import fs from 'fs-extra';
import path from 'path';

const PAIRING_DIR = './data/pairing';
const PAIRING_TIMEOUT = 5 * 60 * 1000; // 5 minutos

class PairingCodeManager {
  constructor() {
    this.activePairingCodes = new Map();
    this.ensureDirectory();
  }

  /**
   * Asegura que existe el directorio de datos de vinculación
   */
  ensureDirectory() {
    if (!fs.existsSync(PAIRING_DIR)) {
      fs.mkdirSync(PAIRING_DIR, { recursive: true });
    }
  }

  /**
   * Genera un código de vinculación de 6 dígitos
   * @returns {string} Código PIN de 6 dígitos
   */
  generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Crea una solicitud de vinculación con PIN
   * @param {string} phoneNumber - Número de teléfono (opcional)
   * @returns {Object} Objeto con PIN y metadata
   */
  createPairingRequest(phoneNumber = null) {
    const pin = this.generatePin();
    const pairingCode = {
      pin,
      phoneNumber,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + PAIRING_TIMEOUT),
      verified: false,
      attempts: 0,
      maxAttempts: 3
    };

    this.activePairingCodes.set(pin, pairingCode);

    // Guardar en archivo
    this.savePairingCode(pin, pairingCode);

    // Auto-expirar después del timeout
    setTimeout(() => {
      this.expirePairingCode(pin);
    }, PAIRING_TIMEOUT);

    return pairingCode;
  }

  /**
   * Verifica un código de vinculación
   * @param {string} pin - El PIN ingresado por el usuario
   * @returns {Object} Resultado de la verificación
   */
  verifyPin(pin) {
    const pairingCode = this.activePairingCodes.get(pin);

    if (!pairingCode) {
      return {
        success: false,
        message: '❌ Código inválido',
        error: 'PIN_NOT_FOUND'
      };
    }

    if (new Date() > pairingCode.expiresAt) {
      this.expirePairingCode(pin);
      return {
        success: false,
        message: '⏱️ Código expirado. Solicita uno nuevo.',
        error: 'PIN_EXPIRED'
      };
    }

    if (pairingCode.attempts >= pairingCode.maxAttempts) {
      this.expirePairingCode(pin);
      return {
        success: false,
        message: '🔒 Demasiados intentos. Código bloqueado.',
        error: 'MAX_ATTEMPTS_EXCEEDED'
      };
    }

    pairingCode.verified = true;
    pairingCode.verifiedAt = new Date();

    return {
      success: true,
      message: '✅ Vinculación exitosa',
      pairingCode,
      expiresAt: pairingCode.expiresAt
    };
  }

  /**
   * Registra un intento fallido de verificación
   * @param {string} pin - El PIN ingresado
   */
  recordFailedAttempt(pin) {
    const pairingCode = this.activePairingCodes.get(pin);
    if (pairingCode) {
      pairingCode.attempts++;
      this.savePairingCode(pin, pairingCode);
    }
  }

  /**
   * Expira un código de vinculación
   * @param {string} pin - El PIN a expirar
   */
  expirePairingCode(pin) {
    this.activePairingCodes.delete(pin);
    const filePath = path.join(PAIRING_DIR, `${pin}.json`);
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
    }
  }

  /**
   * Guarda el código de vinculación en archivo
   * @param {string} pin - El PIN
   * @param {Object} pairingCode - Los datos del código
   */
  savePairingCode(pin, pairingCode) {
    const filePath = path.join(PAIRING_DIR, `${pin}.json`);
    fs.writeJsonSync(filePath, pairingCode, { spaces: 2 });
  }

  /**
   * Obtiene todos los códigos activos
   * @returns {Array} Array de códigos de vinculación activos
   */
  getActivePairingCodes() {
    return Array.from(this.activePairingCodes.values()).map(code => ({
      pin: code.pin,
      createdAt: code.createdAt,
      expiresAt: code.expiresAt,
      verified: code.verified,
      attempts: code.attempts
    }));
  }

  /**
   * Revoca un código de vinculación
   * @param {string} pin - El PIN a revocar
   */
  revokePairingCode(pin) {
    this.expirePairingCode(pin);
    return {
      success: true,
      message: '🗑️ Código de vinculación revocado'
    };
  }

  /**
   * Carga códigos de vinculación desde archivos (al reiniciar)
   */
  loadPairingCodes() {
    if (!fs.existsSync(PAIRING_DIR)) return;

    const files = fs.readdirSync(PAIRING_DIR);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const pin = file.replace('.json', '');
        try {
          const pairingCode = fs.readJsonSync(path.join(PAIRING_DIR, file));
          if (new Date() < pairingCode.expiresAt) {
            this.activePairingCodes.set(pin, pairingCode);
          } else {
            fs.removeSync(path.join(PAIRING_DIR, file));
          }
        } catch (error) {
          console.error(`Error loading pairing code ${pin}:`, error);
        }
      }
    });
  }
}

export default new PairingCodeManager();
