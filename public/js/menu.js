function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Cerrar menú al hacer clic en cualquier enlace
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('active');
    });
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (!sidebar.contains(e.target) && e.target !== menuIcon) {
        sidebar.classList.remove('active');
    }
});