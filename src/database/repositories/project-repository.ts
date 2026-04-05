import { ResultSetHeader } from "mysql2/promise";
import {
  CreateProjectRow,
  UpdateProjectRow,
  ProjectRow,
} from "../../types/db/project-row-type.js";
import { pool } from "../pool.js";

export async function findProjectById(
  projectId: number,
): Promise<ProjectRow | null> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE id = ? LIMIT 1",
    [projectId],
  );

  return rows.length ? rows[0] : null;
}

export async function findProjectByNameAndCompany(
  name: string,
  companyId: number,
): Promise<ProjectRow | null> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE name = ? AND company_id = ? LIMIT 1",
    [name, companyId],
  );

  return rows.length ? rows[0] : null;
}

export async function createProject(data: CreateProjectRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO projects (
      company_id,
      group_id,
      name,
      is_active,
      created_at
    )
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [data.company_id, data.group_id, data.name, data.is_active],
  );

  return result.insertId;
}

export async function findProjectsByGroupId(
  groupId: number | null,
  companyId: number,
): Promise<ProjectRow[]> {
  const [rows] = await pool.query<ProjectRow[]>(
    "SELECT * FROM projects WHERE (group_id = ? OR group_id IS NULL) AND company_id = ?",
    [groupId, companyId],
  );

  return rows;
}

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
