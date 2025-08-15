import fetch from 'node-fetch';
import { encriptarGeohash } from '../communication/geohashCrypto.js';

const SERVER_URL = 'https://5acfea60d9d4.ngrok-free.app/communication/iridium-data';

// Evita problemas con certificados en desarrollo
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const serialNumber = 'DRN001';

// Punto inicial del dron
const baseLat = -2.115459518863087;
const baseLon = -79.93870748899742;

function generarTrama() {
  // Coordinadas aleatorias alrededor del punto base
  const lat = baseLat + (Math.random() - 0.5) * 0.0005;
  const lon = baseLon + (Math.random() - 0.5) * 0.0005;

  // Encriptar geohash
  const geohashEncrypted = encriptarGeohash(lat, lon);

  // Datos adicionales simulados
  const alt = Math.floor(10000 + Math.random() * 2000);       // cm
  const heading = Math.floor(Math.random() * 360);            // grados
  const airspeed = Math.floor(400 + Math.random() * 100);     // cm/s
  const groundspeed = Math.floor(400 + Math.random() * 100);  // cm/s
  const climb_rate = Math.floor(-50 + Math.random() * 100);   // cm/s
  const sats = Math.floor(10 + Math.random() * 3);            // número de satélites
  const voltage = Math.floor(9900 + Math.random() * 2500);    // mV

  // Estructura de la trama
  return `$${geohashEncrypted}%${alt}%${heading}%${airspeed}%${groundspeed}%${climb_rate}%${sats}%${voltage}&`;
}

async function enviarTrama() {
  const trama = generarTrama();

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial_number: serialNumber, trama })
    });

    const res = await response.json();
    console.log('Trama enviada:', trama);
    console.log('Respuesta del servidor:', res);
  } catch (error) {
    console.error('Error al enviar trama:', error.message);
  }
}

// Enviar una trama cada 10 segundos
setInterval(enviarTrama, 10000);