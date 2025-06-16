document.addEventListener('DOMContentLoaded', function () {

    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
        location.replace('/'); // Redirige si no hay usuario
    }


    window.onpageshow = function (event) {
        if (event.persisted) {
            location.reload(); // Si volvió desde caché, recarga para revalidar
        }
    };


    // Si hay usuario, permite el acceso
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };

    function cerrarSesion() {
        console.log('Cerrando sesión...');
        localStorage.clear();
        window.location.href = '/';
    }
});