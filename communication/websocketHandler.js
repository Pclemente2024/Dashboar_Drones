import { WebSocketServer } from 'ws';
import { logger } from './logger.js';

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    logger.info('New WebSocket connection');
    
    ws.on('message', (message) => {
      logger.debug(`WebSocket message: ${message}`);
    });

    ws.on('close', () => {
      logger.info('WebSocket connection closed');
    });
  });

  // Hacer disponible globalmente para otros módulos
  global.wss = wss;
}

export function broadcast(data) {
  if (!wss) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}