import express from 'express';
import { loginUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta POST para login
router.post('/login', loginUsuario);

export default router;
