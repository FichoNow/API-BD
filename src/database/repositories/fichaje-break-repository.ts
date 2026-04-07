import { ResultSetHeader } from "mysql2/promise";
import {
  FichajeBreakRow,
  CreateFichajeBreakRow,
  UpdateFichajeBreakEndRow,
} from "../../types/db/fichaje-break-row-type.js";
import { pool } from "../pool.js";

export async function findFichajeBreakById(
  breakId: number,
): Promise<FichajeBreakRow | null> {
  const [rows] = await pool.query<FichajeBreakRow[]>(
    "SELECT * FROM fichaje_breaks WHERE id = ? LIMIT 1",
    [breakId],
  );

  return rows.length ? rows[0] : null;
}

export async function findOpenBreakByFichajeId(
  fichajeId: number,
): Promise<FichajeBreakRow | null> {
  const [rows] = await pool.query<FichajeBreakRow[]>(
    "SELECT * FROM fichaje_breaks WHERE fichaje_id = ? AND ended_at IS NULL LIMIT 1",
    [fichajeId],
  );

  return rows.length ? rows[0] : null;
}

export async function createFichajeBreak(
  data: CreateFichajeBreakRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO fichaje_breaks (fichaje_id, started_at) VALUES (?, ?)",
    [data.fichaje_id, data.started_at],
  );

  return result.insertId;
}

export async function updateFichajeBreakEndById(
  breakId: number,
  data: UpdateFichajeBreakEndRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichaje_breaks SET ended_at = ? WHERE id = ? LIMIT 1",
    [data.ended_at, breakId],
  );

  return result.affectedRows > 0;
}
