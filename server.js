import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import communicationModule from './communication/index.js'; // Importa el módulo completo
import usuarioRoutes from './routes/usuarioRoutes.js';
import { logger } from './communication/logger.js'; // Usa el logger unificado

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del servidor
const HOST = process.env.HOST || '192.168.1.146';
const PORT = process.env.PORT || 3000;

// Inicialización de Express
const app = express();

// Configuración de HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', '192.168.1.146-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', '192.168.1.146.pem'))
};

// Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

// Configuración de rutas
const htmlPages = ['home', 'historial', 'trayectoria', 'usuario', 'video', 'admin'];

// Middleware de seguridad para rutas HTML
app.use((req, res, next) => {
  const isHtmlPage = htmlPages.some(page => req.path === `/${page}`);
  if (isHtmlPage && !req.headers.referer && !req.headers['x-requested-with']) {
    return res.redirect('/');
  }
  next();
});

// Rutas HTML
htmlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// 5. Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/communication', communicationModule.router); // Usa el router del módulo

// 6. Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// 7. Inicialización del servidor
const httpsServer = https.createServer(httpsOptions, app);

// 8. Iniciar todos los sistemas
const startServer = async () => {
  try {
    // Iniciar módulo de comunicación (Iridium + WebSocket)
    await communicationModule.start(httpsServer);
    
    httpsServer.listen(PORT, HOST, () => {
      logger.info(`Servidor HTTPS iniciado en https://${HOST}:${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejo de cierre limpio
    process.on('SIGINT', async () => {
      logger.info('Recibido SIGINT. Cerrando servidor...');
      await communicationModule.stop();
      httpsServer.close(() => {
        logger.info('Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();