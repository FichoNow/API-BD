import { ResultSetHeader } from "mysql2/promise";
import {
  FichajeBreakRow,
  CreateFichajeBreakRow,
  UpdateFichajeBreakEndRow,
} from "../../../types/db/fichajes/fichaje-break-row-type.js";
import { pool } from "../../pool.js";

/**
 * Busca un descanso por su ID.
 * @param breakId ID del descanso a buscar.
 * @returns El descanso encontrado o null si no existe.
 */
export async function findFichajeBreakById(
  breakId: number,
): Promise<FichajeBreakRow | null> {
  const [rows] = await pool.query<FichajeBreakRow[]>(
    "SELECT * FROM fichaje_breaks WHERE id = ? LIMIT 1",
    [breakId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Obtiene todos los descansos de un fichaje, ordenados por hora de inicio.
 * @param fichajeId ID del fichaje cuyos descansos se quieren consultar.
 * @returns Lista de descansos ordenados por started_at ascendente.
 */
export async function findFichajeBreaksByFichajeId(
  fichajeId: number,
): Promise<FichajeBreakRow[]> {
  const [rows] = await pool.query<FichajeBreakRow[]>(
    "SELECT * FROM fichaje_breaks WHERE fichaje_id = ? ORDER BY started_at ASC",
    [fichajeId],
  );

  return rows;
}

/**
 * Busca el descanso activo (sin ended_at) de un fichaje.
 * Solo puede haber uno abierto a la vez.
 * @param fichajeId ID del fichaje a consultar.
 * @returns El descanso abierto o null si no hay ninguno activo.
 */
export async function findOpenBreakByFichajeId(
  fichajeId: number,
): Promise<FichajeBreakRow | null> {
  const [rows] = await pool.query<FichajeBreakRow[]>(
    "SELECT * FROM fichaje_breaks WHERE fichaje_id = ? AND ended_at IS NULL LIMIT 1",
    [fichajeId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Crea un nuevo descanso en la base de datos.
 * @param data Datos del nuevo descanso (fichaje_id y started_at).
 * @returns ID del descanso recién creado.
 */
export async function createFichajeBreak(
  data: CreateFichajeBreakRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO fichaje_breaks (fichaje_id, started_at) VALUES (?, ?)",
    [data.fichaje_id, data.started_at],
  );

  return result.insertId;
}

/**
 * Actualiza la hora de fin (ended_at) de un descanso.
 * @param breakId ID del descanso a cerrar.
 * @param data Objeto con el nuevo ended_at.
 * @returns true si se actualizó alguna fila, false si no se encontró el descanso.
 */
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
