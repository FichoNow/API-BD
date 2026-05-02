import { Router } from "express";
import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../database/pool.js";

export const testRouter = Router();

testRouter.post("/cleanup", async (_req, res, next) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM companies WHERE email LIKE 'test-e2e-%'",
    );
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    next(err);
  }
});
