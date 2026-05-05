import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../../pool.js";
import { 
  AsignacionGrupoRow, 
  CreateAsignacionGrupoRow,
} from "../../../types/db/horarios/asignacion-grupo-row-type.js";

/**
 * Busca la asignación de plantilla de horario activa para un grupo en una fecha concreta.
 * Si el grupo tiene varias asignaciones, devuelve la más reciente cuyo rango cubra la fecha.
 * @param grupoId ID del grupo de trabajo.
 * @param fecha Fecha en formato "yyyy-MM-dd" para la que se busca la asignación.
 * @returns La asignación activa o null si el grupo no tiene horario asignado para esa fecha.
 */
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

/**
 * Crea una asignación de plantilla de horario a un grupo.
 *
 * Indica que un grupo usará una plantilla concreta desde start_date
 * hasta end_date. Si end_date es null, la asignación queda abierta.
 */
export async function createAsignacionGrupo(
  data: CreateAsignacionGrupoRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO asignaciones_grupo (
      group_id,
      template_id,
      start_date,
      end_date
    ) VALUES (?, ?, ?, ?)`,
    [
      data.group_id,
      data.template_id,
      data.start_date,
      data.end_date,
    ],
  );

  return result.insertId;
}