import pool from '../db'

export interface User {
    id: number;
    name: string;
    emmail: string;
    password: string
}

// insertion des donnees 
export async function saveUser(name: string, email: string, hashedPassword: string): Promise<void> {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await pool.query(query, [name, email, hashedPassword])
}

// recuperation des donnes sur la base de donnee par email
export async function findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    const users = rows as User[]
    return users.length > 0 ? users[0] : null
}