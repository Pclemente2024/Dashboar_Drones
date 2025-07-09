import droneManager from './droneCommunicationManager.js';
import geohash from 'ngeohash';
const { decode } = geohash;

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
    alt: parseInt(partes[1], 10),
    heading: parseInt(partes[2], 10),
    airspeed: parseInt(partes[3], 10),
    groundspeed: parseInt(partes[4], 10),
    climb_rate: parseInt(partes[5], 10),
    numero_satelites: parseInt(partes[6], 10),
    voltaje_bateria: parseInt(partes[7], 10)
  };
}

function calcularPorcentaje(voltageMv) {
  // Ejemplo para una batería de 3 celdas LiPo (3S), 12.6V totalmente cargada (4200 mV por celda)
  const voltMin = 9900;  // 3.3V * 3
  const voltMax = 12600; // 4.2V * 3

  let porcentaje = ((voltageMv - voltMin) / (voltMax - voltMin)) * 100;
  porcentaje = Math.max(0, Math.min(100, porcentaje)); // limitar a 0-100
  return Math.round(porcentaje);
}

export const recibirDatosIridium = async (req, res) => {
  try {
    const { serial_number, trama } = req.body;

    if (!serial_number || !trama) {
      return res.status(400).json({ mensaje: "Faltan campos: serial_number o trama" });
    }

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

    console.log(`📡 Datos parseados desde trama:`, datos);
    await droneManager.registrarDato(serial_number, datos);

    // Enviar al dashboard vía WebSocket
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
      console.warn("⚠️ WebSocket server no disponible (global.wss undefined)");
    }

    res.status(200).json({ mensaje: "Trama procesada correctamente" });

  } catch (error) {
    console.error("❌ Error al procesar trama:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
