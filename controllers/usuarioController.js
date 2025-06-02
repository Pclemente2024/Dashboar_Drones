import { verificarCredenciales } from '../models/usuarioModel.js';

export async function loginUsuario(req, res) {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await verificarCredenciales(correo, contraseña);

    if (usuario) {
      res.json({
        mensaje: 'Login exitoso',
        usuario,
      });
    } else {
      res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}
