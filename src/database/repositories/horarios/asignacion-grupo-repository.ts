import { pool } from "../../pool.js";
import { AsignacionGrupoRow } from "../../../types/db/horarios/asignacion-grupo-row-type.js";

export async function findAsignacionActivaByGrupoId(
  grupoId: number,
  fecha: string,
): Promise<AsignacionGrupoRow | null> {
  const [rows] = await pool.query<AsignacionGrupoRow[]>(
    `SELECT * FROM asignaciones_grupo
     WHERE group_id = ?
       AND start_date <= ?
       AND (end_date IS NULL OR end_date >= ?)
     ORDER BY start_date DESC
     LIMIT 1`,
    [grupoId, fecha, fecha],
  );

  return rows.length ? rows[0] : null;
}
