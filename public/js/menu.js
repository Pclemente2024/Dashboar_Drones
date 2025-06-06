function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.querySelector('.menu-icon');
  
  // Toggle del sidebar
  sidebar.classList.toggle('active');
  
  // Toggle de la animación del icono
  menuIcon.classList.toggle('active');
}

// Cerrar menú cuando se hace clic fuera
document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.querySelector('.menu-icon');
  
  // Si el menú está abierto y el clic no es en el menú ni en el icono
  if (sidebar.classList.contains('active') && 
      !sidebar.contains(event.target) && 
      !menuIcon.contains(event.target)) {
    sidebar.classList.remove('active');
    menuIcon.classList.remove('active');
  }
});

// Cerrar menú con tecla Escape
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      menuIcon.classList.remove('active');
    }
  }
});