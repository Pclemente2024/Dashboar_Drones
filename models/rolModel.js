import pool from "./db";

//Obtener todos los roles
export async function obtenerRoles() {
    const result = await pool.query('SELECT * FROM roles');
    return result.rows;
}

//Obtener rol por id
export async function obtenerRolPorId(id) {
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return result.rows[0];
}