# Etapa 1: Construcción
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install react-router-dom
COPY . .
RUN npm run build

# Etapa 2: Servidor
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
