document.addEventListener('DOMContentLoaded', function () {
    // Verificar usuario
    const usuario = localStorage.getItem('usuario');
    if (!usuario) location.replace('/');

    window.onpageshow = function (event) {
        if (event.persisted) location.reload();
    };

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () { window.history.pushState(null, '', window.location.href); };

    // Panel de datos
    const bateriaElem = document.getElementById('bateria');
    const velocidadElem = document.getElementById('velocidad');
    const altitudElem = document.getElementById('altitud');
    const climbElem = document.getElementById('climb');
    const voltajeElem = document.getElementById('voltaje');
    const satsElem = document.getElementById('satelites');

    // Inicializar mapa Leaflet
    const map = L.map('map').setView([-2.115883, -79.938736], 15);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, etc.',
        maxZoom: 19
    }).addTo(map);

    // Marcador del dron
    let dronMarker = L.marker([-2.115883, -79.938736]).addTo(map);
    dronMarker.bindPopup('Lat: -2.115883<br>Lon: -79.938736').openPopup();

    // Conexión WebSocket
    const socket = new WebSocket("wss://localhost:3000");

    socket.onopen = () => console.log("Conectado al WebSocket");

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.tipo !== 'iridium') return;

            const payload = data.payload;

            // Actualizar panel de datos
            if (payload.porcentaje_bateria !== undefined) bateriaElem.textContent = `${payload.porcentaje_bateria}%`;
            if (payload.velocidad_airspeed_knots !== undefined) velocidadElem.textContent = `${payload.velocidad_airspeed_knots} kt`;
            if (payload.altura_ft !== undefined) altitudElem.textContent = `${payload.altura_ft} ft`;
            if (payload.climb_rate_ft_min !== undefined) climbElem.textContent = `${payload.climb_rate_ft_min} ft/min`;
            if (payload.voltaje_bateria_v !== undefined) voltajeElem.textContent = `${payload.voltaje_bateria_v} V`;
            if (payload.numero_satelites !== undefined) satsElem.textContent = payload.numero_satelites;

            // Actualizar marcador del dron
            if (payload.lat !== undefined && payload.lon !== undefined) {
                const newLatLng = [payload.lat, payload.lon];
                dronMarker.setLatLng(newLatLng);
                dronMarker.setPopupContent(`Lat: ${payload.lat.toFixed(6)}<br>Lon: ${payload.lon.toFixed(6)}`);
                dronMarker.openPopup();
                map.setView(newLatLng);
            }

        } catch (error) {
            console.error("Error procesando WebSocket:", error);
        }
    };

    socket.onerror = (error) => console.error("Error WebSocket:", error);
    socket.onclose = () => console.log("Conexión WebSocket cerrada");
});
