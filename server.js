import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();

// IP y puerto del servidor
const HOST = '192.168.1.218';
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de páginas HTML protegidas
const htmlPages = ['home', 'historial', 'trayectoria', 'usuario', 'video', 'admin'];

// Middleware para redireccionar .html a rutas limpias
app.use((req, res, next) => {
  if (req.path.includes('.html')) {
    return res.redirect(301, req.path.replace('.html', ''));
  }
  next();
});

// Middleware para proteger rutas HTML (excepto index)
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

// Configuración de rutas para páginas HTML (sin extensión)
htmlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'], // Permite acceder a archivos sin especificar la extensión .html
}));

// Rutas API
app.use('/api/usuarios', usuarioRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Iniciar servidor accesible desde red local
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});