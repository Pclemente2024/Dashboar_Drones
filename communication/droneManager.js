import pool from '../models/db.js';
import { generateAlert } from './alertUtils.js';
import { logger } from './logger.js';

class DroneManager {
  constructor() {
    this.activeDrones = new Map(); // serial -> { lastSeen, data }
    this.checkInterval = setInterval(() => this.checkDrones(), 10000);
    logger.info('DroneManager initialized');
  }

  async registerData(serial, data) {
    try {
      this.activeDrones.set(serial, {
        lastSeen: new Date(),
        data
      });

      // Guardar en base de datos
      await this.saveToDatabase(serial, data);
      
      // Verificar alertas
      await this.checkForAlerts(serial, data);

      logger.debug(`Data registered for drone ${serial}`);
    } catch (error) {
      logger.error(`Failed to register data for ${serial}: ${error.message}`);
    }
  }

  async saveToDatabase(serial, data) {
    const result = await pool.query(
      'SELECT id FROM drones WHERE serial_number = $1',
      [serial]
    );

    if (result.rows.length === 0) {
      throw new Error(`Drone ${serial} not registered in database`);
    }

    await pool.query(
      `INSERT INTO flight_data (
        drone_id, timestamp, latitude, longitude, altitude, 
        battery_level, speed, heading, satellites
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        result.rows[0].id,
        new Date(),
        data.lat,
        data.lon,
        data.alt,
        data.battery,
        data.speed,
        data.heading,
        data.satellites
      ]
    );
  }

  async checkForAlerts(serial, data) {
    // Batería baja
    if (data.battery < 20) {
      await generateAlert(
        serial,
        'low_battery',
        `Low battery: ${data.battery}% remaining`
      );
    }

    // Pérdida de señal
    if (data.satellites < 4) {
      await generateAlert(
        serial,
        'low_satellites',
        `Only ${data.satellites} satellites visible`
      );
    }
  }

  async checkDrones() {
    const now = new Date();
    const timeout = 30000; // 30 segundos

    for (const [serial, { lastSeen }] of this.activeDrones.entries()) {
      if (now - lastSeen > timeout) {
        logger.warn(`Drone ${serial} connection timeout`);
        await this.handleDisconnection(serial);
      }
    }
  }

  async handleDisconnection(serial) {
    try {
      await generateAlert(serial, 'disconnection', 'Drone disconnected');
      this.activeDrones.delete(serial);
      logger.info(`Drone ${serial} marked as disconnected`);
    } catch (error) {
      logger.error(`Failed to handle disconnection for ${serial}: ${error.message}`);
    }
  }

  async shutdown() {
    clearInterval(this.checkInterval);
    logger.info('DroneManager stopped');
  }
}

export default new DroneManager();