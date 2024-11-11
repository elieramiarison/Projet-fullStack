import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || '5000',
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'gestion_articles',
    jwtSecret: process.env.JWT_SECRET || 'secret'
};
