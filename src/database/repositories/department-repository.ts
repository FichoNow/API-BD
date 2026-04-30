import { ResultSetHeader } from "mysql2/promise";
import { CreateDepartmentRow, DepartmentRow } from "../../types/db/department-row-type.js";
import { pool } from "../pool.js";

/**
 * Busca un departamento en la base de datos a partir de su ID.
 *
 * @param departmentId ID del departamento que se quiere buscar.
 * @returns El departamento encontrado o `null` si no existe.
 */
export async function findDepartmentById(
  departmentId: number,
): Promise<DepartmentRow | null> {
  const [rows] = await pool.query<DepartmentRow[]>(
    "SELECT * FROM departments WHERE id = ? LIMIT 1",
    [departmentId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Inserta un nuevo departamento en la base de datos con `is_active = true`.
 *
 * @param data Campos del departamento a crear (company_id y nombre).
 * @returns El `insertId` del departamento creado.
 */
export async function createDepartment(data: CreateDepartmentRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO departments (company_id, name, is_active, created_at, updated_at)
     VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [data.company_id, data.name],
  );

  return result.insertId;
}

export async function updateDepartmentName(
  departmentId: number,
  name: string,
): Promise<void> {
  await pool.query(
    "UPDATE departments SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, departmentId],
  )
}

export async function findDepartmentsByCompanyId(
  companyId: number,
): Promise<DepartmentRow[]> {
  const [rows] = await pool.query<DepartmentRow[]>(
    "SELECT * FROM departments WHERE company_id = ? ORDER BY name ASC",
    [companyId],
  );

  return rows;
}
