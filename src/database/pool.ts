import "dotenv/config";
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
