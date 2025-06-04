import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();

//IP y puerto del servidor
const HOST = '192.168.1.220';
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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