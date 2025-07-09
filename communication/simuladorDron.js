import fetch from 'node-fetch';

// Dirección del backend (ajústalo si cambia tu IP o puerto)
const SERVER_URL = 'https://40e4-157-100-111-185.ngrok-free.app/communication/iridium-data';


// Desactiva verificación de certificados si usas HTTPS local con self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const serialNumber = 'DRN001';

function generarDatosAleatorios() {
  return {
    serial_number: serialNumber,
    lat: -2.1900 + Math.random() * 0.002,
    lon: -79.8890 + Math.random() * 0.002,
    alt: 120 + Math.random() * 10,
    airspeed: 50 + Math.random() * 10,
    groundspeed: 50 + Math.random() * 10,
    climb_rate: 0.5 + Math.random() * 0.2,
    heading: Math.floor(Math.random() * 360),
    voltaje_bateria: 10 + Math.random(),
    porcentaje_bateria: Math.floor(30 + Math.random() * 40),
    numero_satelites: 10 + Math.floor(Math.random() * 3)
  };
}

async function enviarDatos() {
  const datos = generarDatosAleatorios();

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const res = await response.json();
    console.log('📡 Datos enviados:', datos);
    console.log('✅ Respuesta del servidor:', res);
  } catch (error) {
    console.error('❌ Error al enviar datos:', error.message);
  }
}

// Envía cada 10 segundos
setInterval(enviarDatos, 10000);
