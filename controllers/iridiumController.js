import droneManager from '../communication/droneCommunicationManager.js';
import { desencriptarGeohash } from '../communication/geohashCrypto.js';
import logger from '../logger.js';

function parseCampo(valor) {
  const limpio = valor.replace(/[^\d\-]/g, '');
  return parseInt(limpio || '0', 10);
}

function parsearTrama(trama) {
  if (!trama.startsWith('$') || !trama.endsWith('&')) {
    throw new Error('Trama inválida: falta $ o &');
  }

  const cuerpo = trama.slice(1, -1);
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
  return Math.round(Math.max(0, Math.min(100, porcentaje)));
}

// Conversiones
const toKnots = (cmps) => (cmps / 100) * 1.9438;
const toFeet = (cm) => (cm / 100) * 3.28084;
const toClimbFtMin = (cmps) => (cmps / 100) * 196.8504;
const toVolts = (mv) => (mv / 1000).toFixed(2);

export const recibirDatosIridium = async (req, res) => {
  try {
    const { serial_number, trama } = req.body;
    if (!serial_number || !trama) {
      logger.warn("Faltan campos: serial_number o trama");
      return res.status(400).json({ mensaje: "Faltan campos: serial_number o trama" });
    }

    logger.info(`Trama recibida: ${trama}`);

    const datosTrama = parsearTrama(trama);
    const { latitude, longitude } = desencriptarGeohash(datosTrama.geohash);

    // Log para verificar geohash
    console.log(`Latitud desencriptada: ${latitude}, Longitud desencriptada: ${longitude}`);

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

    // Payload con conversiones + lat/lon
    const payloadAdaptado = {
      lat: datos.lat,
      lon: datos.lon,
      porcentaje_bateria: datos.porcentaje_bateria,
      velocidad_airspeed_knots: toKnots(datos.airspeed).toFixed(1),
      velocidad_groundspeed_knots: toKnots(datos.groundspeed).toFixed(1),
      altura_ft: toFeet(datos.alt).toFixed(1),
      climb_rate_ft_min: toClimbFtMin(datos.climb_rate).toFixed(1),
      heading: datos.heading,
      voltaje_bateria_v: toVolts(datos.voltaje_bateria),
      numero_satelites: datos.numero_satelites
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
    }

    res.status(200).json({ mensaje: "Trama procesada correctamente" });

  } catch (error) {
    logger.error(`Error al procesar trama: ${error.message}`);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export { parsearTrama, calcularPorcentaje };
