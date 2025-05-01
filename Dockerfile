# Usa la imagen de Node.js como base
FROM node:18-alpine AS build

# Crea un directorio de trabajo en la imagen Docker
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm ci

# Copia todo el contenido del proyecto al directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Usa la imagen Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos generados en la carpeta de build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Comando de inicio del contenedor
CMD ["nginx", "-g", "daemon off;"]
