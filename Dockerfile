# Étape 1: Le "Builder" - Construit l'application
FROM node:22-alpine AS builder
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copier le reste du code et construire l'application
COPY . .
RUN npm run build

# Étape 2: Le "Runner" - Fait tourner l'application finale
FROM node:22-alpine
WORKDIR /app

# Copier uniquement ce qui est nécessaire depuis le builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Exposer le port sur lequel Next.js tourne
EXPOSE 3000

# Commande pour démarrer le serveur Next.js en production
CMD ["npm", "start"]