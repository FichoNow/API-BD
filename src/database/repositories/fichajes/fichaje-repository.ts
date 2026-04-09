import { ResultSetHeader } from "mysql2/promise";
import {
  FichajeRow,
  CreateFichajeRow,
  UpdateClockOutFichajeRow,
  UpdateClockInFichajeRow,
  UpdateClockOutModifiedFichajeRow,
} from "../../../types/db/fichajes/fichaje-row-type.js";
import { pool } from "../../pool.js";

export async function findFichajeById(
  fichajeId: number,
): Promise<FichajeRow | null> {
  const [rows] = await pool.query<FichajeRow[]>(
    "SELECT * FROM fichajes WHERE id = ? LIMIT 1",
    [fichajeId],
  );

  return rows.length ? rows[0] : null;
}

export async function createFichaje(data: CreateFichajeRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO fichajes (user_id, clock_in, created_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [data.user_id, data.clock_in],
  );

  return result.insertId;
}

export async function updateClockOutById(
  fichajeId: number,
  data: UpdateClockOutFichajeRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichajes SET clock_out = ? WHERE id = ? LIMIT 1",
    [data.clock_out, fichajeId],
  );

  return result.affectedRows > 0;
}

export async function updateClockInById(
  fichajeId: number,
  data: UpdateClockInFichajeRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichajes SET clock_in = ?, clock_in_modified = ? WHERE id = ? LIMIT 1",
    [data.clock_in, data.clock_in_modified, fichajeId],
  );

  return result.affectedRows > 0;
}

export async function updateClockOutModifiedById(
  fichajeId: number,
  data: UpdateClockOutModifiedFichajeRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichajes SET clock_out = ?, clock_out_modified = ? WHERE id = ? LIMIT 1",
    [data.clock_out, data.clock_out_modified, fichajeId],
  );

  return result.affectedRows > 0;
}

export async function findFichajesByUserId(
  userId: number,
  limit: number,
): Promise<FichajeRow[]> {
  const[rows] = await pool.query<FichajeRow[]>(
    `SELECT *
     FROM fichajes
     WHERE user_id = ?
     ORDER BY clock_in DESC
     LIMIT ?`,
     [userId, limit],
  );

  return rows;
}

export async function findFichajesByUserIdAndMonth(
  userId: number,
  year: number,
  month: number,
): Promise<FichajeRow[]> {
  const [rows] = await pool.query<FichajeRow[]>(
    `SELECT * FROM fichajes
     WHERE user_id = ?
       AND YEAR(clock_in) = ?
       AND MONTH(clock_in) = ?
     ORDER BY clock_in ASC`,
    [userId, year, month],
  );

  return rows;
}

export async function deleteFichajeById(fichajeId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM fichajes WHERE id = ? LIMIT 1",
    [fichajeId],
  );

  return result.affectedRows > 0;
}
