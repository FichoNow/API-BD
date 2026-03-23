import {
  CreateRefreshTokenRow,
  RefreshTokenRow,
} from "../../types/db/refresh-token-row-type.js";
import { pool } from "../pool.js";
import { ResultSetHeader } from "mysql2";

export async function createRefreshToken(
  data: CreateRefreshTokenRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      expires_at,
      created_at
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [data.user_id, data.token_hash, data.expires_at],
  );

  return result.insertId;
}

export async function findRefreshTokenByHash(
  tokenHash: string,
): Promise<RefreshTokenRow | null> {
  const [rows] = await pool.query<RefreshTokenRow[]>(
    `SELECT *
     FROM refresh_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );

  return rows.length ? rows[0] : null;
}

export async function deleteRefreshTokenByHash(
  tokenHash: string,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM refresh_tokens WHERE token_hash = ?`,
    [tokenHash],
  );

  return result.affectedRows > 0;
}
