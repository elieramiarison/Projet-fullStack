import { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { saveUser, findUserByEmail } from '../models/userModels';

interface RequestBody {
    name: string;
    email: string;
    password: string;
}
// fonction pour recupere les donnes envoyer par frontend 
function parseRequestBody(req: IncomingMessage): Promise<RequestBody> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}

export async function signup(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const { name, email, password }: RequestBody = await parseRequestBody(req);

        // Validation du nom
        if (typeof name !== 'string' || name.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Le nom est invalide' }));
            return;
        }

        // Validation de l'email
        if (!validator.isEmail(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email invalide' }));
            return;
        }

        // Vérification de l'existence de l'utilisateur
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Utilisateur déjà existant' }));
            return;
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.' }));
            return;
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Enregistrement de l'utilisateur
        await saveUser(name, email, hashedPassword);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Utilisateur créé avec succès !' }));

    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erreur lors de l\'inscription' }));
    }
}



export async function signin(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const { email, password }: RequestBody = await parseRequestBody(req);

        // Validation de l'email
        if (!validator.isEmail(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email invalide' }));
            return;
        }

        // Recherche de l'utilisateur par email
        const user = await findUserByEmail(email);
        if (!user) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email non trouvé' }));
            return;
        }

        console.log("Mot de passe en entrée:", password);
        console.log("Mot de passe stocké (hashé):", user.password);


        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Mot de passe incorrect' }));
            return;
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user.id, email: user.emmail }, 'Test', {
            expiresIn: '1h'
        })

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Connexion réussie', token }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erreur lors de la connexion' }));
    }
}
