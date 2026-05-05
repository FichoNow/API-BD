import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../pool.js";
import {
  AsignacionGrupoRow,
  AsignacionGrupoWithInfoRow,
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
 * Busca una asignación de horario de grupo por su ID.
 */
export async function findAsignacionGrupoById(
  assignmentId: number,
): Promise<AsignacionGrupoRow | null> {
  const [rows] = await pool.query<AsignacionGrupoRow[]>(
    "SELECT * FROM asignaciones_grupo WHERE id = ? LIMIT 1",
    [assignmentId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Devuelve todas las asignaciones de horario de los grupos de un departamento,
 * junto con el nombre del grupo y el nombre de la plantilla.
 */
export async function findAsignacionesGrupoByDepartmentId(
  departmentId: number,
): Promise<AsignacionGrupoWithInfoRow[]> {
  const [rows] = await pool.query<AsignacionGrupoWithInfoRow[]>(
    `SELECT
        a.id,
        a.group_id,
        a.template_id,
        a.start_date,
        a.end_date,
        a.created_at,
        a.updated_at,
        g.name AS group_name,
        t.name AS template_name
     FROM asignaciones_grupo a
     JOIN work_groups g ON g.id = a.group_id
     JOIN plantillas_horario t ON t.id = a.template_id
     WHERE g.department_id = ?
     ORDER BY a.start_date DESC, a.id DESC`,
    [departmentId],
  );

  return rows;
}

/**
 * Busca la asignación abierta (sin end_date) anterior a una fecha concreta
 * para el mismo grupo. Se usa para auto-cerrarla al crear una nueva.
 */
export async function findOpenAsignacionGrupoBefore(
  groupId: number,
  newStartDate: string,
): Promise<AsignacionGrupoRow | null> {
  const [rows] = await pool.query<AsignacionGrupoRow[]>(
    `SELECT * FROM asignaciones_grupo
     WHERE group_id = ?
       AND end_date IS NULL
       AND start_date < ?
     ORDER BY start_date DESC
     LIMIT 1`,
    [groupId, newStartDate],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Cuenta cuántas asignaciones de grupo (vivas o futuras) usan una plantilla.
 */
export async function countAsignacionesGrupoByTemplateId(
  templateId: number,
  today: string,
): Promise<number> {
  interface CountRow extends RowDataPacket {
    count: number;
  }
  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count
     FROM asignaciones_grupo
     WHERE template_id = ?
       AND (end_date IS NULL OR end_date >= ?)`,
    [templateId, today],
  );
  return Number(rows[0]?.count ?? 0);
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

/**
 * Actualiza el end_date de una asignación de grupo.
 */
export async function updateAsignacionGrupoEndDate(
  assignmentId: number,
  endDate: string,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE asignaciones_grupo SET end_date = ? WHERE id = ? LIMIT 1",
    [endDate, assignmentId],
  );
  return result.affectedRows > 0;
}

/**
 * Borra una asignación de horario de grupo.
 */
export async function deleteAsignacionGrupoById(
  assignmentId: number,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM asignaciones_grupo WHERE id = ? LIMIT 1",
    [assignmentId],
  );
  return result.affectedRows > 0;
}
