/**
 * MagicMirror² Entegrasyonu - Güncellenmiş Versiyon
 * Jarvis'i MagicMirror ekranı ile bağla
 */

const EventEmitter = require('events');
const Logger = require('../utils/logger');
const config = require('../config/config');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

class MagicMirrorIntegration extends EventEmitter {
  constructor() {
    super();
    this.logger = new Logger('MagicMirror');
    this.isConnected = false;
    this.io = null;
    this.connectedClients = new Set();
  }

  /**
   * Initialize MagicMirror entegrasyonu
   */
  async initialize() {
    try {
      if (!config.magicMirror.enabled) {
        this.logger.info('⚠️ MagicMirror devre dışı bırakıldı');
        return;
      }

      // Express server oluştur
      const app = express();
      const server = http.createServer(app);
      this.io = socketIo(server, {
        cors: {
          origin: `http://${config.magicMirror.host}:${config.magicMirror.port}`,
          methods: ['GET', 'POST']
        }
      });

      // Socket.io bağlantıları dinle
      this.io.on('connection', (socket) => {
        this.logger.success('💂 MagicMirror istemcisi bağlandı');
        this.connectedClients.add(socket.id);
        this.isConnected = true;

        // Durum gönder
        socket.emit('jarvis-status', { connected: true });

        // Bağlantı kapanıldığında
        socket.on('disconnect', () => {
          this.logger.warn('💫 MagicMirror istemcisi bağlantısı kesildi');
          this.connectedClients.delete(socket.id);
          if (this.connectedClients.size === 0) {
            this.isConnected = false;
          }
        });
      });

      // Server'i başlat
      server.listen(config.port, () => {
        this.logger.success(`✅ MagicMirror WebSocket sunucusu başlatıldı: http://localhost:${config.port}`);
      });

      this.logger.success('✅ MagicMirror Entegrasyonu başlatıldı');
      this.emit('initialized');

    } catch (error) {
      this.logger.error('MagicMirror initialize hatası:', error);
      throw error;
    }
  }

  /**
   * Dinleme başladığını bildir
   */
  async notifyListening() {
    await this.broadcast('JARVIS_LISTENING', {});
  }

  /**
   * Dinleme durdurulduğunu bildir
   */
  async notifyStoppedListening() {
    await this.broadcast('JARVIS_STOPPED_LISTENING', {});
  }

  /**
   * Komutu bildir
   */
  async notifyCommand(command, type = 'ai') {
    await this.broadcast('JARVIS_COMMAND', {
      command: command,
      type: type,
      timestamp: new Date(),
    });
  }

  /**
   * Yanıtı bildir
   */
  async notifyResponse(response, duration = 3000) {
    await this.broadcast('JARVIS_RESPONSE', {
      response: response,
      duration: duration,
      timestamp: new Date(),
    });
  }

  /**
   * Hatayı bildir
   */
  async notifyError(error) {
    await this.broadcast('JARVIS_ERROR', {
      error: error.message || error,
      timestamp: new Date(),
    });
  }

  /**
   * Ekranı güncelle
   */
  async updateDisplay(displayData) {
    try {
      if (!this.isConnected) {
        this.logger.warn('⚠️ MagicMirror bağlı değil');
        return;
      }

      await this.broadcast('JARVIS_DISPLAY_UPDATE', displayData);
      this.logger.info(`📺 Display güncelleniyor`);

    } catch (error) {
      this.logger.error('Display update hatası:', error);
    }
  }

  /**
   * Bildirim gönder
   */
  async sendNotification(title, message) {
    try {
      await this.broadcast('JARVIS_NOTIFICATION', {
        title: title,
        message: message,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error('Notification hatası:', error);
    }
  }

  /**
   * Hava durumu gönder
   */
  async updateWeather(weather) {
    await this.broadcast('JARVIS_WEATHER', weather);
  }

  /**
   * Takvim gönder
   */
  async updateCalendar(events) {
    await this.broadcast('JARVIS_CALENDAR', { events });
  }

  /**
   * Saat gönder
   */
  async updateTime(time) {
    await this.broadcast('JARVIS_TIME', { time });
  }

  /**
   * Tüm istemcilere gönder
   */
  async broadcast(event, data) {
    try {
      if (this.io && this.connectedClients.size > 0) {
        this.io.emit(event, data);
        this.logger.debug(`📩 Event gönderildı: ${event}`);
      }
    } catch (error) {
      this.logger.error('Broadcast hatası:', error);
    }
  }

  /**
   * Bağlı istemci sayısı
   */
  getConnectedClients() {
    return this.connectedClients.size;
  }
}

module.exports = MagicMirrorIntegration;
