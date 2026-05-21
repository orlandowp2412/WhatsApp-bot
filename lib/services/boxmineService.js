import axios from 'axios';
import fs from 'fs-extra';

class BoxmineService {
  constructor() {
    this.baseURL = process.env.BOXMINE_URL || 'https://api.boxmine.io';
    this.apiKey = process.env.BOXMINE_API_KEY;
    this.token = process.env.BOXMINE_TOKEN;
    this.client = null;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000;
  }

  async initialize() {
    try {
      if (!this.apiKey && !this.token) {
        console.warn('⚠️ Boxmine: No API Key o Token configurados');
        return false;
      }

      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          'Authorization': `Bearer ${this.token || this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'WhatsApp-Bot/1.0'
        },
        timeout: 10000
      });

      console.log('✅ Boxmine conectado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error conectando con Boxmine:', error.message);
      return false;
    }
  }

  async getUser(userId) {
    try {
      if (!this.client) await this.initialize();
      const cached = this.getCached(`user_${userId}`);
      if (cached) return cached;
      const response = await this.client.get(`/users/${userId}`);
      this.setCached(`user_${userId}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo usuario ${userId}:`, error.message);
      return null;
    }
  }

  async createUser(userData) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.post('/users', {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        metadata: {
          whatsappId: userData.whatsappId,
          createdAt: new Date().toISOString()
        }
      });
      console.log(`✅ Usuario creado en Boxmine: ${userData.phone}`);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario en Boxmine:', error.message);
      return null;
    }
  }

  async updateUser(userId, updates) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.patch(`/users/${userId}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      this.clearCache(`user_${userId}`);
      console.log(`✅ Usuario actualizado en Boxmine: ${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando usuario ${userId}:`, error.message);
      return null;
    }
  }

  async syncMessage(message) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.post('/messages', {
        content: message.body,
        sender: message.key.fromMe ? 'bot' : 'user',
        userId: message.key.participant || message.key.remoteJid,
        chatId: message.key.remoteJid,
        timestamp: message.messageTimestamp,
        messageType: message.type,
        metadata: {
          messageId: message.key.id,
          status: message.status
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sincronizando mensaje con Boxmine:', error.message);
      return null;
    }
  }

  async getStats(filters = {}) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.get('/stats', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de Boxmine:', error.message);
      return null;
    }
  }

  async listUsers(page = 1, limit = 50) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.get('/users', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error listando usuarios de Boxmine:', error.message);
      return null;
    }
  }

  async createCampaign(campaignData) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.post('/campaigns', {
        name: campaignData.name,
        description: campaignData.description,
        targetUsers: campaignData.targetUsers,
        message: campaignData.message,
        scheduleTime: campaignData.scheduleTime,
        metadata: campaignData.metadata || {}
      });
      console.log(`✅ Campaña creada en Boxmine: ${campaignData.name}`);
      return response.data;
    } catch (error) {
      console.error('Error creando campaña en Boxmine:', error.message);
      return null;
    }
  }

  async getCampaigns(status = 'all') {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.get('/campaigns', { params: { status } });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo campañas de Boxmine:', error.message);
      return null;
    }
  }

  async registerWebhook(events = ['user.created', 'message.received']) {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.post('/webhooks', {
        url: `${process.env.APP_URL}/api/webhooks/boxmine`,
        events,
        active: true
      });
      console.log('✅ Webhook registrado en Boxmine');
      return response.data;
    } catch (error) {
      console.error('Error registrando webhook en Boxmine:', error.message);
      return null;
    }
  }

  getCached(key) {
    const item = this.cache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.cacheExpiry
    });
  }

  clearCache(key) {
    this.cache.delete(key);
  }

  async testConnection() {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.get('/health');
      return {
        success: true,
        message: 'Conexión exitosa con Boxmine',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response?.data
      };
    }
  }

  async exportData(dataType = 'all') {
    try {
      if (!this.client) await this.initialize();
      const response = await this.client.post('/export', {
        type: dataType,
        format: 'json'
      });
      console.log(`✅ Exportación de ${dataType} iniciada en Boxmine`);
      return response.data;
    } catch (error) {
      console.error('Error exportando datos a Boxmine:', error.message);
      return null;
    }
  }
}

export default new BoxmineService();