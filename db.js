// db.js (Exemple avec le module 'mysql2/promise')
require('dotenv').config();
const mysql = require('mysql2/promise');

// Utilise les variables définies dans votre fichier .env local
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;