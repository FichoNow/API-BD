import { pool } from "../../pool.js";
import { TipoExcepcionRow } from "../../../types/db/horarios/tipo-excepcion-row-type.js";

/**
 * Obtiene todos los tipos de excepción de calendario disponibles en el sistema.
 * Ejemplos: HOLIDAY, VACATION, SICK_LEAVE, PERMISSION, etc.
 * @returns Lista de tipos de excepción ordenados por ID.
 */
export async function findAllTiposExcepcion(): Promise<TipoExcepcionRow[]> {
  const [rows] = await pool.query<TipoExcepcionRow[]>(
    "SELECT * FROM tipos_excepcion ORDER BY id ASC",
  );

  return rows;
}

/**
 * Busca un tipo de excepción de calendario por su ID.
 * @param tipoId ID del tipo de excepción a buscar.
 * @returns El tipo de excepción encontrado o null si no existe.
 */
export async function findTipoExcepcionById(
  tipoId: number,
): Promise<TipoExcepcionRow | null> {
  const [rows] = await pool.query<TipoExcepcionRow[]>(
    "SELECT * FROM tipos_excepcion WHERE id = ? LIMIT 1",
    [tipoId],
  );

  return rows.length ? rows[0] : null;
}
