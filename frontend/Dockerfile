# Utiliser l'image Node pour construire l'application React
FROM node:18

WORKDIR /app

# Copier et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers du frontend
COPY . .

# Construire le projet en mode production
RUN npm run build

# Exposer le port du frontend
EXPOSE 3001

# Lancer le serveur
CMD ["npm", "run dev"]
