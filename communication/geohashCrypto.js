import crypto from 'crypto';
import geohash from 'ngeohash';

const ALGORITMO = 'aes-256-cbc'; //'aes-256-cbc' es un algoritmo simétrico. Encriptar y desencriptar
const KEY = crypto.scryptSync('123789', 'salt', 32); //clave que se usará para cifrar y descifrar.
const IV = Buffer.alloc(16, 0); 

//Encripta un geohash generado a partir de latitud y longitud
export function encriptarGeohash(lat, lon) {
    const hash = geohash.encode(lat, lon, 11); // geohash de 11 caracteres
    const cipher = crypto.createCipheriv(ALGORITMO, KEY, IV);
    let encrypted = cipher.update(hash, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

 //Desencripta un geohash y devuelve latitud y longitud
export function desencriptarGeohash(encrypted) {
    const decipher = crypto.createDecipheriv(ALGORITMO, KEY, IV);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const { latitude, longitude } = geohash.decode(decrypted);
    return { latitude, longitude };
}
