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

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };

    function cerrarSesion() {
        console.log('Cerrando sesión...');
        localStorage.clear();
        window.location.href = '/';
    }

    // Datos en tiempo real
    const bateriaElem = document.getElementById('bateria');
    const velocidadElem = document.getElementById('velocidad');
    const altitudElem = document.getElementById('altitud');

    // Conectar al WebSocket
    const socket = new WebSocket("wss://192.168.1.146:3000");

    socket.onopen = () => {
        console.log("✅ Conectado al WebSocket");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("Mensaje WebSocket recibido:", data);

            if (data.tipo === 'iridium') {
                const payload = data.payload;

                if (payload.porcentaje_bateria !== undefined) {
                    bateriaElem.textContent = `${payload.porcentaje_bateria}%`;
                }

                if (payload.velocidad_airspeed !== undefined) {
                    velocidadElem.textContent = `${payload.velocidad_airspeed} km/h`;
                }

                if (payload.altura !== undefined) {
                    altitudElem.textContent = `${payload.altura} m`;
                }
            }
        } catch (error) {
            console.error("Error procesando mensaje WebSocket:", error);
        }
    };


    socket.onerror = (error) => {
        console.error("❌ Error WebSocket:", error);
    };

    socket.onclose = () => {
        console.log("🔌 Conexión WebSocket cerrada");
    };
});
