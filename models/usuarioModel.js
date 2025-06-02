import pool from './db.js';

export async function verificarCredenciales(correo, contraseña) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE correo = $1 AND contraseña = $2',
    [correo, contraseña]
  );

  return result.rows[0];
}
