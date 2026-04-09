import { pool } from "../../pool.js";
import { AsignacionUsuarioRow } from "../../../types/db/horarios/asignacion-usuario-row-type.js";

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
