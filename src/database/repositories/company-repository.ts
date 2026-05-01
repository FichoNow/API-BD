import { ResultSetHeader } from "mysql2/promise";
import { CompanyRow, CreateCompanyRow } from "../../types/db/company-row-type.js";
import { pool } from "../pool.js";
import { PatchCompanyBody } from "../../types/dto/superadmin/company/patch-company-body.js";

export async function findCompanyById(
  companyId: number,
): Promise<CompanyRow | null> {
  const [rows] = await pool.query<CompanyRow[]>(
    "SELECT * FROM companies WHERE id = ? LIMIT 1",
    [companyId],
  );

  return rows.length ? rows[0] : null;
}

/**
 * Inserta una nueva empresa en la base de datos con `is_active = true`.
 *
 * @param data Campos de la empresa a crear (nombre, CIF/NIF, email, dirección, ciudad, código postal).
 * @returns El `insertId` de la empresa creada.
 */
export async function findCompanyByCifNif(
  cifNif: string,
): Promise<CompanyRow | null> {
  const [rows] = await pool.query<CompanyRow[]>(
    "SELECT * FROM companies WHERE cif_nif = ? LIMIT 1",
    [cifNif],
  );

  return rows.length ? rows[0] : null;
}

export async function createCompany(data: CreateCompanyRow): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO companies (name, cif_nif, email, address_line, city, postal_code, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [data.name, data.cif_nif, data.email, data.address_line, data.city, data.postal_code],
  );

  return result.insertId;
}

export async function updateCompany(
  companyId: number,
  data: PatchCompanyBody,
): Promise<void> {
  const fields = Object.keys(data) as (keyof PatchCompanyBody)[];
  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f]);

  await pool.query(
    `UPDATE companies SET ${setClauses} WHERE id = ?`,
    [...values, companyId],
  );
}
