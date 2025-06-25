export const recibirDatosIridium = async (req, res) => {
  try {
    const datos = req.body;

    console.log("Datos recibidos desde Iridium/Rock7:", datos);

    // Reenvío al frontend en tiempo real
    if (global.wss) {
      global.wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            tipo: "iridium",
            payload: datos
          }));
        }
      });
    }

    res.status(200).json({ mensaje: "Datos recibidos correctamente" });

  } catch (error) {
    console.error("❌ Error al procesar datos:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
