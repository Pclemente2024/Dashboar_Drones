import { Router } from 'express';
import { IridiumModem } from './IridiumModem.js';
import droneManager from './droneManager.js';
import { initWebSocket } from './websocketHandler.js';
import { HealthMonitor } from './healthMonitor.js';
import { logger } from './logger.js';

class CommunicationModule {
  constructor() {
    this.router = Router();
    this.iridiumModem = new IridiumModem(process.env.IRIDIUM_PORT || '/dev/ttyUSB0');
    this.healthMonitor = new HealthMonitor();
    this.setupRoutes();
  }

  setupRoutes() {
    // Ruta de estado del sistema
    this.router.get('/status', (req, res) => {
      res.json({
        status: 'operational',
        iridiumConnected: this.iridiumModem.isConnected,
        activeDrones: droneManager.activeDrones.size,
        uptime: process.uptime(),
        lastUpdate: new Date().toISOString()
      });
    });

    // Ruta para recepción de datos (compatible con tu API existente)
    this.router.post('/data', async (req, res) => {
      try {
        const { serial_number, ...data } = req.body;
        
        if (!serial_number) {
          return res.status(400).json({ error: 'serial_number is required' });
        }

        await droneManager.registerData(serial_number, data);
        res.json({ success: true, message: 'Data registered' });
        
      } catch (error) {
        logger.error(`API data error: ${error.message}`);
        res.status(500).json({ error: error.message });
      }
    });

    // Ruta para forzar reinicio de conexión Iridium
    this.router.post('/reset-connection', async (req, res) => {
      try {
        await this.iridiumModem.close();
        await this.iridiumModem.connect();
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  async start(httpServer) {
    try {
      // 1. Iniciar WebSocket
      initWebSocket(httpServer);
      logger.info('WebSocket server initialized');

      // 2. Conectar módem Iridium
      await this.iridiumModem.connect();
      logger.info('Iridium modem connection established');

      // 3. Iniciar monitor de salud
      this.healthMonitor.start();
      logger.info('Health monitor started');

      // 4. Iniciar limpieza periódica de drones inactivos
      setInterval(() => {
        droneManager.cleanInactiveDrones();
      }, 60000); // Cada minuto

    } catch (error) {
      logger.error(`Communication module startup failed: ${error.message}`);
      throw error;
    }
  }

  async stop() {
    try {
      await this.iridiumModem.close();
      this.healthMonitor.stop();
      logger.info('Communication module stopped gracefully');
    } catch (error) {
      logger.error(`Error stopping communication module: ${error.message}`);
    }
  }
}

export default new CommunicationModule();
