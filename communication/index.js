import express from 'express';
import { recibirDatosIridium } from '../controllers/iridiumController.js';

const router = express.Router();

//Ruta para recibir los datos desde Rock7 o simulación
router.post('/iridium-data', recibirDatosIridium);

export default router;
