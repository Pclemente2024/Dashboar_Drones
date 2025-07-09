import pool from '../models/db.js';

export async function generarAlerta(serial_number, tipo, mensaje) {
  try {
    const { rows } = await pool.query(`
      SELECT d.id AS dron_id, hv.id AS historial_id, ta.id AS termino_id
      FROM drones d
      JOIN historial_vuelos hv ON hv.dron_id = d.id
      JOIN terminologia_alertas ta ON ta.tipo = $1
      WHERE d.serial_number = $2 AND hv.estado = 'en_progreso'
      LIMIT 1
    `, [tipo, serial_number]);

    if (rows.length === 0) {
      console.warn(`No se encontró vuelo en progreso o tipo de alerta para ${serial_number}`);
      return;
    }

    const { historial_id, termino_id } = rows[0];

    await pool.query(`
      INSERT INTO alertas (historial_vuelo_id, termino_alerta_id, mensaje)
      VALUES ($1, $2, $3)
    `, [historial_id, termino_id, mensaje]);

  } catch (error) {
    console.error('Error generando alerta:', error);
  }
}