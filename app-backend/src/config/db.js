import mysql from "mysql2/promise";

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

const db = {
  query: (...args) => getPool().query(...args),
  execute: (...args) => getPool().execute(...args),
  getConnection: () => getPool().getConnection(),
};

export default db;
