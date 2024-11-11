import { IncomingMessage, ServerResponse } from 'http'
import pool from '../db'

export const getArticle = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articles')
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows))
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Erreur lors de la recuperation' }))
    }
}

export const createArticle = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', async () => {
            const { name, quantity } = JSON.parse(body);
            await pool.query('INSERT INTO articles (name, quantity) VALUES (?, ?)', [name, quantity]);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Article ajouté avec succès' }));
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: "Erreur lors de l'ajout des articles" }))
    }
}

export const deleteArticle = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Article supprimé avec succès' }));
}

export const updateArticle = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { name, quantity } = JSON.parse(body);
        await pool.query('UPDATE articles SET name = ?, quantity = ? WHERE id = ?', [name, quantity, id]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Article mis à jour avec succès' }));
    });
}