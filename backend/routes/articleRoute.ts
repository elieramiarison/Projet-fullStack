import { IncomingMessage, ServerResponse } from 'http'

import { createArticle, getArticle, deleteArticle, updateArticle } from '../controlers/articleControllers'

export const articleRoutes = (req: IncomingMessage, res: ServerResponse) => {
    // Verification de l'url
    if (req.url === '/api/articles' && req.method === 'GET') {
        // Si la condition est vrai il appel au getArticle
        getArticle(req, res)
    } else if (req.url === '/api/articles' && req.method === 'POST') {
        // Si la condition est vrai il appel au createArticle
        createArticle(req, res)
    } else if (req.url?.startsWith('/api/articles/') && req.method === 'PUT') {
        // Si la condition est vrai il appel au updateArticle
        const id = req.url.split('/')[3]; // Extraction de l'ID de l'URL
        updateArticle(req, res, id);
    } else if (req.url?.startsWith('/api/articles/') && req.method === 'DELETE') {
        // Si la condition est vrai il appel au deleteArticle
        const id = req.url.split('/')[3]; // Récupère l'id de l'URL
        deleteArticle(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not found')
    }
}