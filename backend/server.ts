import http, { IncomingMessage, ServerResponse } from 'http';
import { config } from './config';
import app from './app'

const server = http.createServer(app);

const PORT = config.port || 5000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
