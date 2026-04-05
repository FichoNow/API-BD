import { ResultSetHeader } from "mysql2/promise";
import {
    FichajeEntryRow,
    CreateFichajeEntryRow,
    UpdateFichajeEntryEndRow,
    UpdateFichajeEntryStartRow,
 } from "../../types/db/fichaje-entry-row-type.js";
import { pool } from "../pool.js";

export async function findFichajeEntryById(
    entryId: number,
): Promise<FichajeEntryRow | null> {
    const [rows] = await pool.query<FichajeEntryRow[]>(
        "SELECT * FROM fichaje_entries WHERE id = ? LIMIT 1", [entryId],
    );

    return rows.length ? rows[0] : null;
}

export async function createFichajeEntry(
    data: CreateFichajeEntryRow,
): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO fichaje_entries (fichaje_id, project_id, started_at) VALUES (?, ?, ?)",
        [data.fichaje_id, data.project_id, data.started_at],
    );

    return result.insertId;
}

export async function updateFichajeEntryEndById(
  entryId: number,
  data: UpdateFichajeEntryEndRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichaje_entries SET ended_at = ? WHERE id = ? LIMIT 1",
    [data.ended_at, entryId],
  );

  return result.affectedRows > 0;
}

export async function updateFichajeEntryStartById(
  entryId: number,
  data: UpdateFichajeEntryStartRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichaje_entries SET started_at = ? WHERE id = ? LIMIT 1",
    [data.started_at, entryId],
  );
  return result.affectedRows > 0;
}

export async function findFichajeEntriesByFichajeId(
   fichajeId: number,
): Promise<FichajeEntryRow[]> {
   const [rows] = await pool.query<FichajeEntryRow[]>(
      `SELECT *
     FROM fichaje_entries
     WHERE fichaje_id = ?
     ORDER BY started_at ASC`,
     [fichajeId],
   );

   return rows;
}