// importamos el módulo http de Node.js
const http = require('http');

// puerto donde va a correr el servidor
const PORT = 3000;

// se crea el servidor
const server = http.createServer((requesr, response) => {
    // se configura la respuesta HTTP
    response.statusCode = 200; //Salió todo bien

    // tipo de contenido que se envía
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // se envpia el mensaje
    response.end('¡Servidor funcionando correctamente!');
});

// ponemos el servidor a escuchar en el puerto definido
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});