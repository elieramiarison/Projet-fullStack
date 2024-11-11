# Utiliser l'image Node pour le backend
FROM node:18

WORKDIR /app

# Copier et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers du backend
COPY . .

# Exposer le port du backend
EXPOSE 3000

# Lancer le backend
CMD ["node", "server.ts"] # Remplacez "server.ts" par le point d'entrée de votre backend
