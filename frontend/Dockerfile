FROM node:22-alpine

WORKDIR /app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código
COPY . .

EXPOSE 3000

# Comando padrão (dev com hot-reload). Compose pode sobrescrever para prod.
CMD ["npm", "run", "dev"]
