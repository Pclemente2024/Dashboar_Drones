import fetch from 'node-fetch';

const SERVER_URL = 'https://9e0e4342f4d4.ngrok-free.app/communication/iridium-data';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const serialNumber = 'DRN001';

function generarTrama() {
  const geohash = '9q8yyh1k3de';
  const alt = Math.floor(10000 + Math.random() * 2000);
  const heading = Math.floor(Math.random() * 360);
  const airspeed = Math.floor(400 + Math.random() * 100);
  const groundspeed = Math.floor(400 + Math.random() * 100);
  const climb_rate = Math.floor(20 + Math.random() * 10);
  const sats = Math.floor(10 + Math.random() * 3);
  const voltage = Math.floor(9900 + Math.random() * 2500);

  return `$${geohash}%${alt}%${heading}%${airspeed}%${groundspeed}%${climb_rate}%${sats}%${voltage}&`;
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

setInterval(enviarTrama, 10000); // cada 10 segundos
