import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  port: Number(3306),
  user: "root",
  password: "linux123",
  database: "BD_Jan_Fran",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
