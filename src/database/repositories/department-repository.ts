import { DepartmentRow } from "../../types/db/department-row-type.js";
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

export async function findDepartmentsByCompanyId(
  companyId: number,
): Promise<DepartmentRow[]> {
  const [rows] = await pool.query<DepartmentRow[]>(
    "SELECT * FROM departments WHERE company_id = ? ORDER BY name ASC",
    [companyId],
  );

  return rows;
}
