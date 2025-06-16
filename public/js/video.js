const usuario = localStorage.getItem('usuario');
if (!usuario) {
    location.replace('/'); // Redirige si no hay usuario
}

window.onpageshow = function (event) {
    if (event.persisted) {
        location.reload();
    }
};

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
document.addEventListener('DOMContentLoaded', cargarCalendario);

// Acceso a la cámara
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
    } catch (err) {
        document.getElementById('camera-error').textContent =
            'No se pudo acceder a la cámara: ' + err.message;
    }
}
document.addEventListener('DOMContentLoaded', startCamera);