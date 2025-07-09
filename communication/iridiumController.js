import droneManager from './droneCommunicationManager.js';

export const recibirDatosIridium = async (req, res) => {
  try {
    const datos = req.body;
    const serial = datos.serial_number;

    if (!serial || !datos.lat || !datos.lon) {
      return res.status(400).json({ mensaje: "Faltan campos necesarios" });
    }

    console.log(`📡 Datos desde ${serial}:`, datos);

    // Guardar y gestionar datos
    await droneManager.registrarDato(serial, datos);

    // Adaptar payload al formato que espera el frontend
    const payloadAdaptado = {
      porcentaje_bateria: datos.porcentaje_bateria,
      velocidad_airspeed: datos.airspeed,
      altura: datos.alt
    };

    // Enviar al WebSocket (dashboard en tiempo real)
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

    res.status(200).json({ mensaje: "Datos procesados correctamente" });

  } catch (error) {
    console.error("❌ Error al procesar datos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
