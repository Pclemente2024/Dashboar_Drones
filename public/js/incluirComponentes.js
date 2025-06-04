document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('componente-header');
  const response = await fetch('/componentes/header.html');
  const html = await response.text();
  contenedor.innerHTML = html;

  // Mostrar nombre del usuario conectado
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario) {
    const nombreSpan = document.getElementById('nombre-usuario');
    if (nombreSpan) nombreSpan.textContent = usuario.nombre;
  } else {
    window.location.href = 'index.html';
  }
});
