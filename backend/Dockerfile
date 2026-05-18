FROM node:20-alpine

WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar el código fuente y el esquema de prisma
COPY prisma ./prisma/
COPY . .

# Generar cliente de Prisma y compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start"]
