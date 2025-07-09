import { WebSocketServer } from 'ws';

export function iniciarWebSocket(httpsServer) {
  const wss = new WebSocketServer({ server: httpsServer });
  global.wss = wss;

  wss.on('connection', (ws) => {
    console.log("🟢 Cliente conectado al WebSocket");
    ws.on('close', () => {
      console.log("🔴 Cliente desconectado");
    });
  });
};
