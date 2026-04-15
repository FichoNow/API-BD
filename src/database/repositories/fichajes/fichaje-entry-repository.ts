import { ResultSetHeader } from "mysql2/promise";
import {
    FichajeEntryRow,
    CreateFichajeEntryRow,
    UpdateFichajeEntryEndRow,
    UpdateFichajeEntryStartRow,
    UpdateFichajeEntryProjectRow,
 } from "../../../types/db/fichajes/fichaje-entry-row-type.js";
import { pool } from "../../pool.js";

/**
 * Busca una entry de proyecto por su ID.
 * @param entryId ID de la entry a buscar.
 * @returns La entry encontrada o null si no existe.
 */
export async function findFichajeEntryById(
    entryId: number,
): Promise<FichajeEntryRow | null> {
    const [rows] = await pool.query<FichajeEntryRow[]>(
        "SELECT * FROM fichaje_entries WHERE id = ? LIMIT 1", [entryId],
    );

    return rows.length ? rows[0] : null;
}

/**
 * Crea una nueva entry de proyecto dentro de un fichaje.
 * @param data Datos de la nueva entry (fichaje_id, project_id y started_at).
 * @returns ID de la entry recién creada.
 */
export async function createFichajeEntry(
    data: CreateFichajeEntryRow,
): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO fichaje_entries (fichaje_id, project_id, started_at) VALUES (?, ?, ?)",
        [data.fichaje_id, data.project_id, data.started_at],
    );

    return result.insertId;
}

/**
 * Actualiza la hora de fin (ended_at) de una entry de proyecto.
 * @param entryId ID de la entry a actualizar.
 * @param data Objeto con el nuevo ended_at.
 * @returns true si se actualizó alguna fila, false si no se encontró la entry.
 */
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

/**
 * Actualiza la hora de inicio (started_at) de una entry de proyecto.
 * @param entryId ID de la entry a actualizar.
 * @param data Objeto con el nuevo started_at.
 * @returns true si se actualizó alguna fila, false si no se encontró la entry.
 */
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

/**
 * Cambia el proyecto asignado a una entry de fichaje.
 * @param entryId ID de la entry a actualizar.
 * @param data Objeto con el nuevo project_id.
 * @returns true si se actualizó alguna fila, false si no se encontró la entry.
 */
export async function updateFichajeEntryProjectById(
  entryId: number,
  data: UpdateFichajeEntryProjectRow,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE fichaje_entries SET project_id = ? WHERE id = ? LIMIT 1",
    [data.project_id, entryId],
  );
  return result.affectedRows > 0;
}

/**
 * Obtiene todas las entries de un fichaje, ordenadas por hora de inicio.
 * @param fichajeId ID del fichaje cuyas entries se quieren consultar.
 * @returns Lista de entries ordenadas por started_at ascendente.
 */
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
