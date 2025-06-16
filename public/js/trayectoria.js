// Validar si el usuario está autenticado
const usuario = localStorage.getItem('usuario');
if (!usuario) {
  location.replace('/'); // Redirige si no hay usuario
}

// Forzar recarga si se vuelve desde caché
window.onpageshow = function(event) {
  if (event.persisted) {
    location.reload();
  }
};

// Función para cargar el componente calendario
async function cargarCalendario() {
  try {
    const response = await fetch('/componentes/calendario.html');
    const html = await response.text();
    const contenedor = document.getElementById('componente-calendario');
    if (contenedor) {
      contenedor.innerHTML = html;
      console.log('Calendario cargado correctamente');
      document.dispatchEvent(new Event('calendarioCargado'));
    }
  } catch (error) {
    console.error('Error cargando el calendario:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarCalendario);
