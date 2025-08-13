const usuario = localStorage.getItem('usuario');
if (!usuario) {
  location.replace('/');
}

window.onpageshow = function (event) {
  if (event.persisted) {
    location.reload();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  cargarCalendario();
  iniciarStreamHLS();
});

// Cargar el componente calendario
async function cargarCalendario() {
  try {
    const response = await fetch('/componentes/calendario.html');
    const html = await response.text();
    const contenedor = document.getElementById('componente-calendario');
    if (contenedor) {
      contenedor.innerHTML = html;
      document.dispatchEvent(new Event('calendarioCargado'));
    }
  } catch (error) {
    console.error('Error cargando el calendario:', error);
  }
}

// Reproducir el video HLS del dron
function iniciarStreamHLS() {
  const video = document.getElementById('video');
  const videoSrc = 'http://localhost:8000/mystream/index.m3u8'; // URL de MediaMTX

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, function (event, data) {
      document.getElementById('camera-error').textContent =
        'Error al cargar el stream: ' + data.details;
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  } else {
    document.getElementById('camera-error').textContent =
      'Tu navegador no soporta video en vivo (HLS)';
  }
}