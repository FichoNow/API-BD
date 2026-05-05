import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../pool.js";
import {
  AsignacionUsuarioRow,
  AsignacionUsuarioWithInfoRow,
  CreateAsignacionUsuarioRow,
} from "../../../types/db/horarios/asignacion-usuario-row-type.js";

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

/**
 * Busca una asignación de horario de usuario por su ID.
 */
export async function findAsignacionUsuarioById(
  assignmentId: number,
): Promise<AsignacionUsuarioRow | null> {
  const [rows] = await pool.query<AsignacionUsuarioRow[]>(
    "SELECT * FROM asignaciones_usuario WHERE id = ? LIMIT 1",
    [assignmentId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Devuelve todas las asignaciones de horario individuales de los usuarios
 * de un departamento, junto con el nombre del usuario y el nombre de la plantilla.
 *
 * Se ordenan por start_date descendente para que las más recientes queden arriba.
 */
export async function findAsignacionesUsuarioByDepartmentId(
  departmentId: number,
): Promise<AsignacionUsuarioWithInfoRow[]> {
  const [rows] = await pool.query<AsignacionUsuarioWithInfoRow[]>(
    `SELECT
        a.id,
        a.user_id,
        a.template_id,
        a.start_date,
        a.end_date,
        a.created_at,
        a.updated_at,
        u.name  AS user_name,
        u.email AS user_email,
        t.name  AS template_name
     FROM asignaciones_usuario a
     JOIN users u ON u.id = a.user_id
     JOIN plantillas_horario t ON t.id = a.template_id
     WHERE u.department_id = ?
     ORDER BY a.start_date DESC, a.id DESC`,
    [departmentId],
  );

  return rows;
}

/**
 * Busca una asignación abierta (sin end_date) anterior a una fecha concreta
 * para el mismo usuario. Se usa al crear una nueva asignación para auto-cerrar
 * la previa y evitar solapamientos infinitos.
 */
export async function findOpenAsignacionUsuarioBefore(
  userId: number,
  newStartDate: string,
): Promise<AsignacionUsuarioRow | null> {
  const [rows] = await pool.query<AsignacionUsuarioRow[]>(
    `SELECT * FROM asignaciones_usuario
     WHERE user_id = ?
       AND end_date IS NULL
       AND start_date < ?
     ORDER BY start_date DESC
     LIMIT 1`,
    [userId, newStartDate],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Cuenta cuántas asignaciones (vivas o futuras) usan una plantilla concreta.
 * "Viva o futura" = end_date IS NULL OR end_date >= hoy.
 */
export async function countAsignacionesUsuarioByTemplateId(
  templateId: number,
  today: string,
): Promise<number> {
  interface CountRow extends RowDataPacket {
    count: number;
  }
  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count
     FROM asignaciones_usuario
     WHERE template_id = ?
       AND (end_date IS NULL OR end_date >= ?)`,
    [templateId, today],
  );
  return Number(rows[0]?.count ?? 0);
}

/**
 * Crea una asignación de plantilla de horario a un usuario.
 *
 * Indica que un usuario usará una plantilla concreta desde start_date
 * hasta end_date. Si end_date es null, la asignación queda abierta.
 */
export async function createAsignacionUsuario(
  data: CreateAsignacionUsuarioRow,
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO asignaciones_usuario (
      user_id,
      template_id,
      start_date,
      end_date
    ) VALUES (?, ?, ?, ?)`,
    [
      data.user_id,
      data.template_id,
      data.start_date,
      data.end_date,
    ],
  );

  return result.insertId;
}

/**
 * Actualiza el end_date de una asignación de usuario. Se usa para cerrar
 * automáticamente asignaciones abiertas previas cuando se crea una nueva.
 */
export async function updateAsignacionUsuarioEndDate(
  assignmentId: number,
  endDate: string,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE asignaciones_usuario SET end_date = ? WHERE id = ? LIMIT 1",
    [endDate, assignmentId],
  );
  return result.affectedRows > 0;
}

/**
 * Borra una asignación de horario de usuario.
 */
export async function deleteAsignacionUsuarioById(
  assignmentId: number,
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM asignaciones_usuario WHERE id = ? LIMIT 1",
    [assignmentId],
  );
  return result.affectedRows > 0;
}
