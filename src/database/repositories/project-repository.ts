import { ResultSetHeader } from "mysql2/promise";
import {
  CreateProjectRow,
  UpdateProjectRow,
  ProjectRow,
} from "../../types/db/project-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca un proyecto por su ID.
 * @param projectId ID del proyecto a buscar.
 * @returns El proyecto encontrado o null si no existe.
 */
export async function findProjectById(
  projectId: number,
): Promise<ProjectRow | null> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE id = ? LIMIT 1",
    [projectId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Busca un proyecto por su nombre dentro de una empresa concreta.
 * Se usa para comprobar duplicados antes de crear uno nuevo.
 * @param name Nombre del proyecto a buscar.
 * @param companyId ID de la empresa en la que buscar.
 * @returns El proyecto encontrado o null si no existe.
 */
export async function findProjectByNameAndDepartment(
  name: string,
  departmentId: number,
): Promise<ProjectRow | null> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE name = ? AND department_id = ? LIMIT 1",
    [name, departmentId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Crea un nuevo proyecto en la base de datos.
 * @param data Datos del nuevo proyecto (company_id, group_id, name, is_active).
 * @returns ID del proyecto recién creado.
 */
export async function createProject(data: CreateProjectRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO projects (
      department_id,
      group_id,
      name,
      is_active,
      created_at
    )
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [data.department_id, data.group_id, data.name, data.is_active],
  );

  return result.insertId;
}

/**
 * Obtiene los proyectos accesibles para un grupo dentro de una empresa.
 * Devuelve los proyectos del grupo específico y también los globales (group_id IS NULL).
 * @param groupId ID del grupo del usuario (puede ser null si no tiene grupo).
 * @param companyId ID de la empresa.
 * @returns Lista de proyectos accesibles.
 */
export async function findProjectsByGroupId(
  groupId: number | null,
  departmentId: number,
): Promise<ProjectRow[]> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE (group_id = ? OR group_id IS NULL) AND department_id = ?",
    [groupId, departmentId],
  );

  return rows;
}

/**
 * Actualiza los campos de un proyecto de forma dinámica.
 * Solo actualiza los campos que se incluyan en el objeto data (ignora undefined).
 * @param projectId ID del proyecto a actualizar.
 * @param data Objeto con los campos a actualizar.
 * @returns true si se actualizó alguna fila, false si no se encontró el proyecto.
 */
export async function updateProjectById(
  projectId: number,
  data: UpdateProjectRow,
): Promise<boolean> {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = [...entries.map(([, v]) => v), projectId];

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE projects SET ${setClause} WHERE id = ? LIMIT 1`,
    values,
  );

  return result.affectedRows > 0;
}

/**
 * Busca todos los proyectos de un departamento.
 * 
 * Se usa desde el panel admin para listar proyectos del departamento seleccionado.
 * 
 * @param departmentId ID del departamento.
 * @returns Lista de proyectos ordenados por fecha de creación descendente.
 */
export async function findProjectsByDepartmentId(
  departmentId: number,
): Promise<ProjectRow[]> {
  const [rows] = await pool.query<ProjectRow[]>(
    `SELECT * FROM projects WHERE department_id = ? ORDER BY created_at DESC`,
    [departmentId],
  );

  return rows;
}
