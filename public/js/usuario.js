const usuario = localStorage.getItem('usuario');

if (!usuario) {
    location.replace('/'); // Redirige si no hay usuario
}


window.onpageshow = function (event) {
    if (event.persisted) {
        location.reload(); // Si volvió desde caché, recarga para revalidar
    }
};

// Espera a que el componente se cargue antes de rellenar datos
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        window.location.href = '/';
    } else {
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;

        document.getElementById('nombres').textContent = usuario.nombre;
        document.getElementById('apellidos').textContent = usuario.apellido;
        document.getElementById('correo').textContent = usuario.correo;
        document.getElementById('telefono_celular').textContent = usuario.telefono_celular || 'No registrado';
    }
});

function cerrarSesion() {
    console.log('Cerrando sesión...');
    localStorage.clear();
    window.location.href = '/';
}