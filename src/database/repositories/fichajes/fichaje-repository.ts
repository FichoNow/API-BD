import { ResultSetHeader } from "mysql2/promise";
import {
  FichajeRow,
  CreateFichajeRow,
  UpdateClockOutFichajeRow,
  UpdateClockInFichajeRow,
  UpdateClockOutModifiedFichajeRow,
} from "../../../types/db/fichajes/fichaje-row-type.js";
import { pool } from "../../pool.js";

/**
 * Busca un fichaje por su ID.
 * @param fichajeId ID del fichaje a buscar.
 * @returns El fichaje encontrado o null si no existe.
 */
export async function findFichajeById(
  fichajeId: number,
): Promise<FichajeRow | null> {
  const [rows] = await pool.query<FichajeRow[]>(
    "SELECT * FROM fichajes WHERE id = ? LIMIT 1",
    [fichajeId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Crea un nuevo fichaje en la base de datos.
 * @param data Datos del nuevo fichaje (user_id y clock_in).
 * @returns ID del fichaje recién creado.
 */
export async function createFichaje(data: CreateFichajeRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO fichajes (user_id, clock_in, created_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [data.user_id, data.clock_in],
  );

  return result.insertId;
}

/**
 * Actualiza la hora de salida (clock_out) de un fichaje.
 * @param fichajeId ID del fichaje a actualizar.
 * @param data Objeto con el nuevo clock_out.
 * @returns true si se actualizó alguna fila, false si no se encontró el fichaje.
 */
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

/**
 * Actualiza la hora de entrada (clock_in) de un fichaje y la marca como modificada.
 * @param fichajeId ID del fichaje a actualizar.
 * @param data Objeto con el nuevo clock_in y el flag clock_in_modified.
 * @returns true si se actualizó alguna fila, false si no se encontró el fichaje.
 */
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

/**
 * Actualiza la hora de salida modificada (clock_out) de un fichaje y la marca como modificada.
 * @param fichajeId ID del fichaje a actualizar.
 * @param data Objeto con el nuevo clock_out y el flag clock_out_modified.
 * @returns true si se actualizó alguna fila, false si no se encontró el fichaje.
 */
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

/**
 * Obtiene los fichajes más recientes de un usuario, limitando el resultado.
 * @param userId ID del usuario.
 * @param limit Número máximo de fichajes a devolver.
 * @returns Lista de fichajes ordenados del más reciente al más antiguo.
 */
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

/**
 * Obtiene todos los fichajes de un usuario en un mes y año concretos.
 * Se usa para construir el calendario mensual.
 * @param userId ID del usuario.
 * @param year Año a consultar.
 * @param month Mes a consultar (1-12).
 * @returns Lista de fichajes del mes ordenados por clock_in ascendente.
 */
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

/**
 * Elimina un fichaje de la base de datos por su ID.
 * @param fichajeId ID del fichaje a eliminar.
 * @returns true si se eliminó el fichaje, false si no existía.
 */
export async function deleteFichajeById(fichajeId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM fichajes WHERE id = ? LIMIT 1",
    [fichajeId],
  );

  return result.affectedRows > 0;
}
