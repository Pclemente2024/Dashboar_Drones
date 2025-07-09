import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import usuarioRoutes from './routes/usuarioRoutes.js';
import communicationRoutes from './communication/index.js';
import { iniciarWebSocket } from './communication/websocketHandler.js';

const app = express();

// IP y puerto del servidor
const HOST = '192.168.1.146';
const PORT = 3000;

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


// Cargar certificados generados por mkcert
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', '192.168.1.146-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', '192.168.1.146.pem'))
};

const htmlPages = ['home', 'historial', 'trayectoria', 'usuario', 'video', 'admin'];

// Middleware para redireccionar .html a rutas limpias
app.use((req, res, next) => {
  const rutasNoProtegidas = ['/', '/index'];
  const usuario = req.headers['usuario'];

  if (rutasNoProtegidas.includes(req.path)) {
    return next();
  }

  if (usuario) {
    return res.status(401).send('No autorizado');
  }

  next();
});

// Middleware para proteger rutas HTML
app.use((req, res, next) => {
  const isHtmlPage = htmlPages.some(page => req.path === `/${page}`);
  if (
    isHtmlPage &&
    !req.headers.referer &&
    !req.headers['x-requested-with']
  ) {
    return res.redirect('/');
  }
  next();
});

// Configurar rutas para servir archivos HTML sin extensión
htmlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

// Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/communication', communicationRoutes);

// Ruta principal (login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Ruta explícita para /index.html
app.get('/index.html', (req, res) => {
  res.redirect('/');
});

// Iniciar servidor HTTPS
const httpsServer = https.createServer(httpsOptions, app);

iniciarWebSocket(httpsServer);
httpsServer.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en https://${HOST}:${PORT}`);
});