import { authRoutes } from './routes/authRoutes';
import { IncomingMessage, ServerResponse } from 'http'
import { articleRoutes } from './routes/articleRoute';

const app = (req: IncomingMessage, res: ServerResponse): void => {

    // CORS sur Node JS natif
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Verification d'autorisation des requetes comme POST, GET, PUT, DELETE
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Verification de l'url
    if (req.url?.startsWith('/api/articles')) {
        articleRoutes(req, res)
    } else if (req.url?.startsWith('/api/signup') || req.url?.startsWith('/api/signin')) {
        authRoutes(req, res)
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
    }
}

export default app;