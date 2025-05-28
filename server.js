//Importamos los módulos necesarios
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; //Función para convertir URL a rutas del sistema de archivos

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url); //Convertimos la URL del módulo a ruta del sistema
const __dirname = path.dirname(__filename); //Obtiene el directorio del archivo actual

//Middleware para servir archivos estáticos desde la carpeta 'view'
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.urlencoded({ extended: true }));

//Se envía el arcchivo html 
app.get('/', (req, res) => {
  response.sendFile(path.join(__dirname, 'view', 'index.html'));
});

//Se inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})