import { logger } from './logger.js';
import droneManager from './droneManager.js';

export async function processIridiumMessage(rawData) {
  try {
    // Intentar parsear como JSON
    let data;
    try {
      data = JSON.parse(rawData);
    } catch {
      // Si no es JSON, procesar como texto plano
      data = parsePlainTextMessage(rawData);
    }

    // Validaciones básicas
    if (!data.serial_number) throw new Error('Missing serial number');
    if (!data.lat || !data.lon) throw new Error('Missing coordinates');

    // Registrar datos en el sistema
    await droneManager.registerData(data.serial_number, data);
    
    return data;
  } catch (error) {
    logger.error(`Message processing failed: ${error.message}`);
    throw error;
  }
}

function parsePlainTextMessage(text) {
  const parts = text.split(',');
  if (parts.length < 5) throw new Error('Invalid message format');

  return {
    serial_number: parts[0],
    lat: parseFloat(parts[1]),
    lon: parseFloat(parts[2]),
    alt: parseFloat(parts[3]),
    timestamp: new Date()
  };
}
