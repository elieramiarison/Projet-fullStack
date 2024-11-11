import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Nom d'utilisateur de la base de données
    password: '',   // Mot de passe de la base de données
    database: 'entretien', // Nom de la base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise()

export default pool