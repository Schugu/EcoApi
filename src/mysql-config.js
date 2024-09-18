import dotenv from "dotenv";

dotenv.config();

import mysql from "mysql2/promise";

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'ecoapi',
  charset: 'utf8mb4'
};

const connection = await mysql.createConnection(config);
console.log('Connected to the MySQL database.');

export default connection;