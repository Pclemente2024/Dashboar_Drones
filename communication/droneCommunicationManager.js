import pool from '../models/db.js';
import { generarAlerta } from './alertUtils.js';

class DroneCommunicationManager {
    constructor() {
        this.dronesActivos = new Map(); // serial -> timestamp
        this.intervaloMonitor = 10000; // 10 segundos
        this.timeoutDesconexion = 30000; // 30 segundos
        this.iniciarMonitoreo();
    }

    async registrarDato(serial, data) {
        const ahora = new Date();
        this.dronesActivos.set(serial, ahora);

        try {
            // Buscar el ID del dron usando su serial_number
            const result = await pool.query(
                'SELECT id FROM drones WHERE serial_number = $1',
                [serial]
            );

            if (result.rows.length === 0) {
                console.warn(`⚠️ Dron con serial '${serial}' no registrado en la base de datos.`);
                return;
            }

            const dronId = result.rows[0].id;

            // Insertar datos en vuelos_bruto
            await pool.query(`
                INSERT INTO vuelos_bruto (
                    timestamp, latitud, longitud, altura, velocidad_airspeed, 
                    velocidad_groundspeed, climb_rate, heading, voltaje_bateria,
                    porcentaje_bateria, numero_satelites, dron_id
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
                )
            `, [
                ahora,
                data.lat,
                data.lon,
                data.alt,
                data.airspeed,
                data.groundspeed,
                data.climb_rate,
                data.heading,
                data.voltaje_bateria,
                data.porcentaje_bateria,
                data.numero_satelites,
                dronId
            ]);

            // Verificar alertas
            if (data.porcentaje_bateria < 20) {
                await generarAlerta(serial, 'bateria_baja', `Batería crítica: ${data.porcentaje_bateria}%`);
            }

        } catch (error) {
            console.error('❌ Error registrando datos del dron:', error);
        }
    }

    async marcarDesconectado(serial) {
        try {
            await generarAlerta(serial, 'desconexion', `Dron ${serial} se ha desconectado por inactividad.`);
        } catch (error) {
            console.error(`❌ Error al marcar desconexión del dron ${serial}:`, error);
        } finally {
            this.dronesActivos.delete(serial);
        }
    }

    iniciarMonitoreo() {
        setInterval(async () => {
            const ahora = new Date();
            for (const [serial, timestamp] of this.dronesActivos.entries()) {
                if (ahora - timestamp > this.timeoutDesconexion) {
                    console.warn(`⚠️ Dron ${serial} sin datos por más de 30 segundos`);
                    await this.marcarDesconectado(serial);
                }
            }
        }, this.intervaloMonitor);
    }
}

const instancia = new DroneCommunicationManager();
export default instancia;
