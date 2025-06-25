import { WebSocketServer } from 'ws';

export const iniciarWebSocket = (httpsServer) => {
  const wss = new WebSocketServer({ server: httpsServer });
  global.wss = wss;

  wss.on('connection', (ws) => {
    console.log("🟢 Cliente conectado al WebSocket");

    ws.on('message', (msg) => {
      console.log("Mensaje recibido del cliente:", msg);
    });

    ws.on('close', () => {
      console.log("🔴 Cliente desconectado");
    });
  });
};
