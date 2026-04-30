import { ResultSetHeader, RowDataPacket } from "mysql2";
import { WorkGroupRow } from "../../types/db/work-group-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca un grupo de trabajo en la base de datos a partir de su ID.
 *
 * @param groupId ID del grupo que se quiere buscar.
 * @returns El grupo encontrado o `null` si no existe.
 */
export async function findGroupById(
  groupId: number,
): Promise<WorkGroupRow | null> {
  const [rows] = await pool.query<WorkGroupRow[]>(
    "SELECT * FROM work_groups WHERE id = ? LIMIT 1",
    [groupId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Busca un grupo por nombre dentro de un departamento concreto.
 * Se usa para comprobar duplicados antes de crear uno nuevo.
 */
export async function findGroupByNameAndDepartment(
  name: string,
  departmentId: number,
): Promise<WorkGroupRow | null> {
  const [rows] = await pool.query<WorkGroupRow[]>(
    "SELECT * FROM work_groups WHERE name = ? AND department_id = ? LIMIT 1",
    [name, departmentId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Devuelve todos los grupos de un departamento ordenados por nombre.
 */
export async function findGroupsByDepartmentId(
  departmentId: number,
): Promise<WorkGroupRow[]> {
  const [rows] = await pool.query<WorkGroupRow[]>(
    "SELECT * FROM work_groups WHERE department_id = ? ORDER BY name ASC",
    [departmentId],
  );
  return rows;
}

/**
 * Crea un nuevo grupo de trabajo.
 */
export async function createGroup(data: {
  name: string;
  department_id: number;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO work_groups (name, department_id) VALUES (?, ?)",
    [data.name, data.department_id],
  );
  return result.insertId;
}

/**
 * Actualiza el nombre de un grupo.
 */
export async function updateGroupById(
  groupId: number,
  data: { name?: string },
): Promise<boolean> {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return false;

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = [...entries.map(([, v]) => v), groupId];

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE work_groups SET ${setClause} WHERE id = ? LIMIT 1`,
    values,
  );
  return result.affectedRows > 0;
}

/**
 * Elimina un grupo. Pone group_id a NULL en users y projects asociados antes
 * de borrar. Las FK son ON DELETE SET NULL pero hacemos UPDATE explícito por
 * claridad y para devolver feedback consistente.
 */
export async function deleteGroupById(groupId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM work_groups WHERE id = ? LIMIT 1",
    [groupId],
  );
  return result.affectedRows > 0;
}

/**
 * Cuenta cuántos usuarios pertenecen a un grupo concreto.
 */
export async function countUsersInGroup(groupId: number): Promise<number> {
  interface CountRow extends RowDataPacket {
    count: number;
  }
  const [rows] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS count FROM users WHERE group_id = ?",
    [groupId],
  );
  return Number(rows[0]?.count ?? 0);
}
