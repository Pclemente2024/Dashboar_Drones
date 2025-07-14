import droneManager from './droneCommunicationManager.js';
import geohash from 'ngeohash';
import logger from '../logger.js';
const { decode } = geohash;

function parseCampo(valor) {
  const limpio = valor.replace(/[^\d\-]/g, ''); // Elimina letras, 'AA', 'NULL', etc.
  return parseInt(limpio || '0', 10);
}

function parsearTrama(trama) {
  if (!trama.startsWith('$') || !trama.endsWith('&')) {
    throw new Error('Trama inválida: falta $ o &');
  }

  const cuerpo = trama.slice(1, -1); // Quitar $ y &
  const partes = cuerpo.split('%');

  if (partes.length !== 8) {
    throw new Error(`Trama inválida: se esperaban 8 campos, recibidos ${partes.length}`);
  }

  return {
    geohash: partes[0],
    alt: parseCampo(partes[1]),
    heading: parseCampo(partes[2]),
    airspeed: parseCampo(partes[3]),
    groundspeed: parseCampo(partes[4]),
    climb_rate: parseCampo(partes[5]),
    numero_satelites: parseCampo(partes[6]),
    voltaje_bateria: parseCampo(partes[7])
  };
}

function calcularPorcentaje(voltageMv) {
  const voltMin = 9900;
  const voltMax = 12600;

  let porcentaje = ((voltageMv - voltMin) / (voltMax - voltMin)) * 100;
  porcentaje = Math.max(0, Math.min(100, porcentaje));
  return Math.round(porcentaje);
}

export const recibirDatosIridium = async (req, res) => {
  try {
    const { serial_number, trama } = req.body;

    if (!serial_number || !trama) {
      logger.warn("Faltan campos en la trama recibida");
      return res.status(400).json({ mensaje: "Faltan campos: serial_number o trama" });
    }

    logger.info(`Trama recibida desde Rock7: ${trama}`);

    const datosTrama = parsearTrama(trama);
    const { latitude, longitude } = decode(datosTrama.geohash);

    const datos = {
      serial_number,
      lat: latitude,
      lon: longitude,
      alt: datosTrama.alt,
      airspeed: datosTrama.airspeed,
      groundspeed: datosTrama.groundspeed,
      climb_rate: datosTrama.climb_rate,
      heading: datosTrama.heading,
      voltaje_bateria: datosTrama.voltaje_bateria,
      porcentaje_bateria: calcularPorcentaje(datosTrama.voltaje_bateria),
      numero_satelites: datosTrama.numero_satelites
    };

    logger.info(`Datos parseados: ${JSON.stringify(datos)}`);
    await droneManager.registrarDato(serial_number, datos);

    // WebSocket al dashboard
    const payloadAdaptado = {
      porcentaje_bateria: datos.porcentaje_bateria,
      velocidad_airspeed: datos.airspeed,
      altura: datos.alt
    };

    if (global.wss) {
      global.wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            tipo: "iridium",
            payload: payloadAdaptado
          }));
        }
      });
    } else {
      logger.warn("WebSocket server no disponible (global.wss undefined)");
    }

    res.status(200).json({ mensaje: "Trama procesada correctamente" });

  } catch (error) {
    logger.error(`Error al procesar trama: ${error.message}`);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export { parsearTrama, calcularPorcentaje };
