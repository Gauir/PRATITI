require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.getConnection()
    .then(connection => {
        console.log("MySQL Connected successfully!");
        connection.release();
    })
    .catch(err => {
        console.error("MySQL Connection Error!");
        console.error("Code:", err.code);      
        console.error("Message:", err.message); 
    });

module.exports = pool;
