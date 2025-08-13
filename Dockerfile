# Imagen base oficial de Node.js
FROM node:20

#Establece el directorio de trabajo en el ccontenedor
WORKDIR /app

#Copia los aechivos de definición de dependencias
COPY package*.json ./

#Instala dependencias (incluye nodemon)
RUN npm install

#Instala nodemon de forma global
RUN npm install -g nodemon

#Copia todo el cófigo del proyecto al contenedor
COPY . .

#Expone el puerto
EXPOSE 3000

#Comando por defecto
CMD ["npm", "run", "dev"]