import { pool } from "../../pool.js";
import { AsignacionUsuarioRow } from "../../../types/db/horarios/asignacion-usuario-row-type.js";

/**
 * Busca la asignación de plantilla de horario activa para un usuario en una fecha concreta.
 * La asignación individual tiene prioridad sobre la del grupo.
 * Si el usuario tiene varias asignaciones, devuelve la más reciente cuyo rango cubra la fecha.
 * @param userId ID del usuario.
 * @param fecha Fecha en formato "yyyy-MM-dd" para la que se busca la asignación.
 * @returns La asignación activa o null si el usuario no tiene horario individual asignado.
 */
export async function findAsignacionActivaByUserId(
  userId: number,
  fecha: string,
): Promise<AsignacionUsuarioRow | null> {
  const [rows] = await pool.query<AsignacionUsuarioRow[]>(
    `SELECT * FROM asignaciones_usuario
     WHERE user_id = ?
       AND start_date <= ?
       AND (end_date IS NULL OR end_date >= ?)
     ORDER BY start_date DESC
     LIMIT 1`,
    [userId, fecha, fecha],
  );

  return rows.length ? rows[0] : null;
}
