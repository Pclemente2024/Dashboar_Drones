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
    const climbElem = document.getElementById('climb');
    const voltajeElem = document.getElementById('voltaje');
    const satsElem = document.getElementById('satelites');


    // Conectar al WebSocket
    const socket = new WebSocket("wss://192.168.1.146:3000");

    socket.onopen = () => {
        console.log("Conectado al WebSocket");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.tipo === 'alerta') {
                alert(data.mensaje); // Muestra alerta en dashboard
                return;
            }

            if (data.tipo === 'iridium') {
                const payload = data.payload;

                if (payload.porcentaje_bateria !== undefined) {
                    bateriaElem.textContent = `${payload.porcentaje_bateria}%`;
                }

                if (payload.velocidad_airspeed_knots !== undefined) {
                    velocidadElem.textContent = `${payload.velocidad_airspeed_knots} kt`;
                }

                if (payload.altura_ft !== undefined) {
                    altitudElem.textContent = `${payload.altura_ft} ft`;
                }

                if (payload.climb_rate_ft_min !== undefined) {
                    climbElem.textContent = `${payload.climb_rate_ft_min} ft/min`;
                }

                if (payload.voltaje_bateria_v !== undefined) {
                    voltajeElem.textContent = `${payload.voltaje_bateria_v} V`;
                }

                if (payload.numero_satelites !== undefined) {
                    satsElem.textContent = payload.numero_satelites;
                }
            }

        } catch (error) {
            console.error("Error procesando mensaje WebSocket:", error);
        }
    };

    socket.onerror = (error) => {
        console.error("Error WebSocket:", error);
    };

    socket.onclose = () => {
        console.log("Conexión WebSocket cerrada");
    };
});
