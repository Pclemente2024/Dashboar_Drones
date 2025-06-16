// Verifica si el usuario está autenticado
const usuario = localStorage.getItem('usuario');
if (!usuario) {
  location.replace('/'); // Redirige si no hay usuario
}

// Recarga la página si vuelve desde caché
window.onpageshow = function(event) {
  if (event.persisted) {
    location.reload();
  }
};

// Cargar historial desde API
async function cargarHistorial() {
  try {
    const response = await fetch('/api/historial');
    const data = await response.json();

    const tbody = document.getElementById('tabla-historial');
    tbody.innerHTML = '';

    data.forEach(evento => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${evento.nombre}</td>
        <td>${evento.descripcion}</td>
        <td>${evento.fecha}</td>
        <td>${evento.hora}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar historial:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarHistorial);
