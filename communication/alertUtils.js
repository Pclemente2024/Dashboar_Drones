import pool from '../models/db.js';
import { logger } from './logger.js';

export async function generateAlert(serial, type, message) {
  try {
    const droneQuery = await pool.query(
      'SELECT id FROM drones WHERE serial_number = $1',
      [serial]
    );

    if (droneQuery.rows.length === 0) {
      throw new Error(`Drone ${serial} not found`);
    }

    const alertTypeQuery = await pool.query(
      'SELECT id FROM alert_types WHERE code = $1',
      [type]
    );

    const alertTypeId = alertTypeQuery.rows[0]?.id || 1; // Default to generic alert

    await pool.query(
      'INSERT INTO alerts (drone_id, alert_type_id, message) VALUES ($1, $2, $3)',
      [droneQuery.rows[0].id, alertTypeId, message]
    );

    logger.info(`Alert generated for ${serial}: ${type} - ${message}`);
  } catch (error) {
    logger.error(`Failed to generate alert: ${error.message}`);
  }
}